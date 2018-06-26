/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {
    Oas20Document,
    Oas20SecurityDefinitions,
    Oas20SecurityScheme,
    Oas30Document,
    Oas30SecurityScheme,
    OasContact,
    OasDocument,
    OasLibraryUtils,
    OasSecurityRequirement,
    OasSecurityScheme,
    OasTag
} from "oai-ts-core";
import {
    createAddSecurityRequirementCommand,
    createChangeContactCommand,
    createChangeLicenseCommand,
    createChangePropertyCommand,
    createChangeSecuritySchemeCommand,
    createDeleteContactCommand,
    createDeleteLicenseCommand,
    createDeleteSecurityRequirementCommand,
    createDeleteSecuritySchemeCommand,
    createDeleteTagCommand,
    createNewSecuritySchemeCommand,
    createNewTagCommand,
    createReplaceSecurityRequirementCommand,
    ICommand
} from "oai-ts-commands";
import {ILicense, LicenseService} from "../../_services/license.service";
import {
    Scope,
    SecurityScheme20DialogComponent,
    SecurityScheme20EventData
} from "../dialogs/security-scheme-20.component";
import {ObjectUtils} from "../../_util/object.util";
import {ContactInfo} from "../dialogs/set-contact.component";
import {SecurityScheme30DialogComponent, SecurityScheme30EventData} from "../dialogs/security-scheme-30.component";
import {
    ChangeSecurityRequirementEvent,
    SecurityRequirementDialogComponent,
    SecurityRequirementEventData
} from "../dialogs/security-requirement.component";
import {CommandService} from "../../_services/command.service";


export abstract class MainFormComponent {

    @Input() document: OasDocument;

    @ViewChild("securityRequirementDialog") securityRequirementDialog: SecurityRequirementDialogComponent;

    constructor(public licenseService: LicenseService, public commandService: CommandService) {}

    /**
     * returns the terms of service.
     */
    public tos(): string {
        if (this.document.info) {
            return this.document.info.termsOfService;
        } else {
            return "";
        }
    }

    /**
     * Returns the current contact object.
     * @return
     */
    public contact(): OasContact {
        if (this.hasContact()) {
            return this.document.info.contact;
        } else {
            return new OasContact();
        }
    }

    /**
     * returns the contact name.
     */
    public contactName(): string {
        if (this.document.info && this.document.info.contact && this.document.info.contact.name) {
            return this.document.info.contact.name;
        } else {
            return this.contactEmail();
        }
    }

    /**
     * returns the contact email.
     */
    public contactEmail(): string {
        if (this.document.info && this.document.info.contact && this.document.info.contact.email) {
            return this.document.info.contact.email;
        } else {
            return "";
        }
    }

    /**
     * returns the contact url.
     */
    public contactUrl(): string {
        if (this.document.info && this.document.info.contact) {
            return this.document.info.contact.url;
        } else {
            return "";
        }
    }

    /**
     * Returns the list of tags defined in the document.
     * @return
     */
    public tags(): OasTag[] {
        let tags: OasTag[] = this.document.tags;
        if (ObjectUtils.isNullOrUndefined(tags)) {
            tags = [];
        }
        // Clone the array
        tags = tags.slice(0);
        // Sort it
        tags.sort( (obj1, obj2) => {
            return obj1.name.toLowerCase().localeCompare(obj2.name.toLowerCase());
        });
        return tags;
    }

    /**
     * Called when the user changes the description of a tag.
     * @param tag
     * @param description
     */
    public changeTagDescription(tag: OasTag, description: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.document, tag, "description", description);
        this.commandService.emit(command);
    }

    /**
     * Called when the user chooses to delete a tag.
     * @param tag
     */
    public deleteTag(tag: OasTag): void {
        let command: ICommand = createDeleteTagCommand(this.document, tag.name);
        this.commandService.emit(command);
    }

    /**
     * Called when the user clicks 'Add' on the Add Tag modal dialog.
     * @param tag
     */
    public addTag(tag: any): void {
        let command: ICommand = createNewTagCommand(this.document, tag.name, tag.description);
        this.commandService.emit(command);
    }

    /**
     * Returns true if a license has been configured for this API.
     */
    public hasLicense(): boolean {
        if (this.document.info && this.document.info.license) {
            return true;
        }
        return false;
    }

    /**
     * Returns the resolved license or null if not found.
     */
    public license(): ILicense {
        return this.licenseService.findLicense(this.licenseUrl());
    }

    /**
     * returns the license name.
     */
    public licenseName(): string {
        if (this.document.info && this.document.info.license) {
            return this.document.info.license.name;
        } else {
            return "";
        }
    }

    /**
     * returns the license url.
     */
    public licenseUrl(): string {
        if (this.document.info && this.document.info.license) {
            return this.document.info.license.url;
        } else {
            return "";
        }
    }

    /**
     * Called when the user chooses a new license in the Choose License dialog.
     * @param licenseInfo
     */
    public setLicense(licenseInfo: any): void {
        let command: ICommand = createChangeLicenseCommand(this.document, licenseInfo.name, licenseInfo.url);
        this.commandService.emit(command);
    }

    /**
     * Returns true if the API has Contact Info defined.
     * @return
     */
    public hasContact(): boolean {
        if (this.document.info && this.document.info.contact) {
            if (this.document.info.contact.email || this.document.info.contact.url) {
                return true;
            }
        }
        return false;
    }

    /**
     * Called to change the document's contact information.
     * @param contactInfo
     */
    public setContactInfo(contactInfo: ContactInfo): void {
        let command: ICommand = createChangeContactCommand(this.document, contactInfo.name, contactInfo.email, contactInfo.url);
        this.commandService.emit(command);
    }

    /**
     * Called when the user chooses to remove the contact info.
     */
    public deleteContact(): void {
        let command: ICommand = createDeleteContactCommand(this.document);
        this.commandService.emit(command);
    }

    /**
     * Called when the user chooses to remove the license.
     */
    public deleteLicense(): void {
        let command: ICommand = createDeleteLicenseCommand(this.document);
        this.commandService.emit(command);
    }

    /**
     * Returns true if there is at least one security requirement defined.
     * @return
     */
    public hasSecurityRequirements(): boolean {
        return this.securityRequirements().length > 0;
    }

    /**
     * Returns true if there is at least one security scheme defined.
     * @return
     */
    public hasSecuritySchemes(): boolean {
        return this.securitySchemes().length > 0;
    }

    /**
     * Returns all defined security schemes.
     * @return
     */
    public abstract securitySchemes(): OasSecurityScheme[];

    /**
     * Returns all defined security requirements.
     * @return
     */
    public securityRequirements(): OasSecurityRequirement[] {
        return this.document.security ? this.document.security : [];
    }

    /**
     * Called when the user changes the description of a security scheme in the table of schemes.
     * @param scheme
     * @param description
     */
    public changeSecuritySchemeDescription(scheme: OasSecurityScheme, description: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.document, scheme, "description", description);
        this.commandService.emit(command);
    }

    /**
     * Called when the user adds a new security scheme.
     * @param event
     */
    public abstract addSecurityScheme(event: SecurityScheme20EventData | SecurityScheme30EventData): void;

    /**
     * Called when the user adds a new security requirement.
     * @param event
     */
    public addSecurityRequirement(event: SecurityRequirementEventData): void {
        let requirement: OasSecurityRequirement = this.document.createSecurityRequirement();
        let library: OasLibraryUtils = new OasLibraryUtils();
        library.readNode(event, requirement);
        let command: ICommand = createAddSecurityRequirementCommand(this.document, this.document, requirement);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes an existing security scheme.
     * @param event
     */
    public abstract changeSecurityScheme(event: SecurityScheme20EventData | SecurityScheme30EventData): void;

    /**
     * Called when the user changes an existing Security Requirement.
     * @param event
     */
    public changeSecurityRequirement(event: ChangeSecurityRequirementEvent): void {
        let newRequirement: OasSecurityRequirement = this.document.createSecurityRequirement();
        let library: OasLibraryUtils = new OasLibraryUtils();
        library.readNode(event.data, newRequirement);
        let command: ICommand = createReplaceSecurityRequirementCommand(this.document, event.requirement, newRequirement);
        this.commandService.emit(command);
    }

    /**
     * Deletes a security scheme.
     * @param scheme
     */
    public deleteSecurityScheme(scheme: OasSecurityScheme): void {
        let command: ICommand = createDeleteSecuritySchemeCommand(this.document, scheme.schemeName());
        this.commandService.emit(command);
    }

    /**
     * Deletes a security requirement.
     * @param requirement
     */
    public deleteSecurityRequirement(requirement: OasSecurityRequirement): void {
        let command: ICommand = createDeleteSecurityRequirementCommand(this.document, this.document, requirement);
        this.commandService.emit(command);
    }

    /**
     * Returns a summary of the requirement.
     * @param requirement
     * @return
     */
    public securityRequirementSummary(requirement: OasSecurityRequirement): string {
        return requirement.securityRequirementNames().join(", ");
    }

    /**
     * Opens the security scheme dialog for adding or editing a security scheme.
     * @param scheme
     */
    public abstract openSecuritySchemeDialog(scheme?: OasSecurityScheme): void;

    /**
     * Opens the security requirement dialog for adding or editing a security requirement.
     * @param requirement
     */
    public openSecurityRequirementDialog(requirement?: OasSecurityRequirement): void {
        this.securityRequirementDialog.open(this.document, requirement);
    }

    /**
     * Returns true if the form is for an OpenAPI 3.x document.
     * @return
     */
    public is3xForm(): boolean {
        return false;
    }
}


/**
 * The OAI 2.0 version of the main form.
 */
@Component({
    moduleId: module.id,
    selector: "main-20-form",
    templateUrl: "main-form.component.html",
    encapsulation: ViewEncapsulation.None
})
export class Main20FormComponent extends MainFormComponent {

    @ViewChild("securityScheme20Dialog") securitySchemeDialog: SecurityScheme20DialogComponent;

    constructor(licenseService: LicenseService, commandService: CommandService) {
        super(licenseService, commandService);
    }

    /**
     * Opens the security scheme dialog.
     * @param scheme
     */
    public openSecuritySchemeDialog(scheme?: Oas20SecurityScheme): void {
        this.securitySchemeDialog.open(scheme);
    }

    /**
     * Returns all defined security schemes.
     * @return
     */
    public securitySchemes(): OasSecurityScheme[] {
        let secdefs: Oas20SecurityDefinitions = (this.document as Oas20Document).securityDefinitions;
        if (secdefs) {
            return secdefs.securitySchemes().sort( (scheme1, scheme2) => {
                return scheme1.schemeName().localeCompare(scheme2.schemeName());
            });
        }
        return [];
    }

    /**
     * Called when the user adds a new security scheme.
     * @param event
     */
    public addSecurityScheme(event: SecurityScheme20EventData): void {
        console.info("[MainFormComponent] Adding a security scheme: %s", event.schemeName);
        let scheme: Oas20SecurityScheme = (this.document as Oas20Document).createSecurityDefinitions().createSecurityScheme(event.schemeName);
        scheme.description = event.description;
        scheme.type = event.type;
        // TODO set values in the Oas20SecurityScheme only if necessary based on the type - avoid potential of leaking info from the dialog into the data model
        scheme.name = event.name;
        scheme.in = event.in;
        scheme.flow = event.flow;
        scheme.authorizationUrl = event.authorizationUrl;
        scheme.tokenUrl = event.tokenUrl;
        if (scheme.type === "oauth2") {
            scheme.scopes = scheme.createScopes();
            if (event.scopes) {
                for (let s of event.scopes) {
                    scheme.scopes.addScope(s.name, s.description);
                }
            }
        }


        let command: ICommand = createNewSecuritySchemeCommand(this.document, scheme);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes an existing security scheme.
     * @param event
     */
    public changeSecurityScheme(event: SecurityScheme20EventData): void {
        console.info("[MainFormComponent] Changing a security scheme: %s", event.schemeName);
        let scheme: Oas20SecurityScheme = (this.document as Oas20Document).createSecurityDefinitions().createSecurityScheme(event.schemeName);
        scheme.description = event.description;
        scheme.type = event.type;
        scheme.name = event.name;
        scheme.in = event.in;
        scheme.flow = event.flow;
        scheme.authorizationUrl = event.authorizationUrl;
        scheme.tokenUrl = event.tokenUrl;
        if (scheme.type === "oauth2") {
            if (event.scopes) {
                scheme.scopes = scheme.createScopes();
                for (let s of event.scopes) {
                    scheme.scopes.addScope(s.name, s.description);
                }
            }
        }

        let command: ICommand = createChangeSecuritySchemeCommand(this.document, scheme);
        this.commandService.emit(command);
    }

}


/**
 * The OAI 3.0.x version of the main form.
 */
@Component({
    moduleId: module.id,
    selector: "main-30-form",
    templateUrl: "main-form.component.html",
    encapsulation: ViewEncapsulation.None
})
export class Main30FormComponent extends MainFormComponent {

    @ViewChild("securityScheme30Dialog") securitySchemeDialog: SecurityScheme30DialogComponent;

    constructor(licenseService: LicenseService, commandService: CommandService) {
        super(licenseService, commandService);
    }

    /**
     * Opens the security scheme dialog.
     * @param scheme
     */
    public openSecuritySchemeDialog(scheme?: Oas30SecurityScheme): void {
        this.securitySchemeDialog.open(scheme);
    }

    /**
     * Returns all defined security schemes.
     * @return
     */
    public securitySchemes(): OasSecurityScheme[] {
        let doc: Oas30Document = this.document as Oas30Document;
        if (doc.components) {
            let schemes: Oas30SecurityScheme[] = doc.components.getSecuritySchemes();
            return schemes.sort( (scheme1, scheme2) => {
                return scheme1.schemeName().localeCompare(scheme2.schemeName());
            });
        }
        return [];
    }

    /**
     * Called when the user adds a new security scheme.
     * @param event
     */
    public addSecurityScheme(event: SecurityScheme30EventData): void {
        console.info("[MainFormComponent] Adding a security scheme: %s", event.schemeName);

        let scheme: Oas30SecurityScheme = (this.document as Oas30Document).createComponents().createSecurityScheme(event.schemeName);
        this.copySchemeToModel(event, scheme);

        let command: ICommand = createNewSecuritySchemeCommand(this.document, scheme);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes an existing security scheme.
     * @param event
     */
    public changeSecurityScheme(event: SecurityScheme30EventData): void {
        console.info("[MainFormComponent] Changing a security scheme: %s", event.schemeName);

        let scheme: Oas30SecurityScheme = (this.document as Oas30Document).createComponents().createSecurityScheme(event.schemeName);
        this.copySchemeToModel(event, scheme);

        let command: ICommand = createChangeSecuritySchemeCommand(this.document, scheme);
        this.commandService.emit(command);
    }

    /**
     * Converts from array of scopes to scopes object for data model.
     * @param scopes
     */
    private toScopes(scopes: Scope[]): any {
        let rval: any = {};
        scopes.forEach( scope => {
            rval[scope.name] = scope.description;
        });
        return rval;
    }

    /**
     * Copy the event data to the data model.
     * @param event
     * @param scheme
     */
    private copySchemeToModel(event: SecurityScheme30EventData, scheme: Oas30SecurityScheme) {
        scheme.description = event.description;
        scheme.type = event.type;
        if (scheme.type === "http") {
            scheme.scheme = event.scheme;
            if (scheme.scheme === "Bearer") {
                scheme.bearerFormat = event.bearerFormat;
            }
        }
        if (scheme.type === "apiKey") {
            scheme.in = event.in;
            scheme.name = event.name;
        }
        if (scheme.type === "oauth2") {
            scheme.flows = scheme.createOAuthFlows();
            if (event.flows.implicit.enabled) {
                scheme.flows.implicit = scheme.flows.createImplicitOAuthFlow();
                scheme.flows.implicit.authorizationUrl = event.flows.implicit.authorizationUrl;
                scheme.flows.implicit.tokenUrl = event.flows.implicit.tokenUrl;
                scheme.flows.implicit.refreshUrl = event.flows.implicit.refreshUrl;
                scheme.flows.implicit.scopes = this.toScopes(event.flows.implicit.scopes);
            }
            if (event.flows.password.enabled) {
                scheme.flows.password = scheme.flows.createPasswordOAuthFlow();
                scheme.flows.password.authorizationUrl = event.flows.password.authorizationUrl;
                scheme.flows.password.tokenUrl = event.flows.password.tokenUrl;
                scheme.flows.password.refreshUrl = event.flows.password.refreshUrl;
                scheme.flows.password.scopes = this.toScopes(event.flows.password.scopes);
            }
            if (event.flows.clientCredentials.enabled) {
                scheme.flows.clientCredentials = scheme.flows.createClientCredentialsOAuthFlow();
                scheme.flows.clientCredentials.authorizationUrl = event.flows.clientCredentials.authorizationUrl;
                scheme.flows.clientCredentials.tokenUrl = event.flows.clientCredentials.tokenUrl;
                scheme.flows.clientCredentials.refreshUrl = event.flows.clientCredentials.refreshUrl;
                scheme.flows.clientCredentials.scopes = this.toScopes(event.flows.clientCredentials.scopes);
            }
            if (event.flows.authorizationCode.enabled) {
                scheme.flows.authorizationCode = scheme.flows.createAuthorizationCodeOAuthFlow();
                scheme.flows.authorizationCode.authorizationUrl = event.flows.authorizationCode.authorizationUrl;
                scheme.flows.authorizationCode.tokenUrl = event.flows.authorizationCode.tokenUrl;
                scheme.flows.authorizationCode.refreshUrl = event.flows.authorizationCode.refreshUrl;
                scheme.flows.authorizationCode.scopes = this.toScopes(event.flows.authorizationCode.scopes);
            }
        }
        if (scheme.type === "openIdConnect") {
            scheme.openIdConnectUrl = event.openIdConnectUrl;
        }
    }

    /**
     * Returns true if the form is for an OpenAPI 3.x document.
     * @return
     */
    public is3xForm(): boolean {
        return true;
    }
}
