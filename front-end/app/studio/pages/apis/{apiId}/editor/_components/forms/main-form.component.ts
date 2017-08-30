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

import {Component, Input, ViewEncapsulation, Output, EventEmitter} from "@angular/core";
import {
    OasDocument, Oas20Document, Oas20Tag, Oas20Contact, Oas20SecurityScheme,
    Oas20SecurityDefinitions, OasSecurityScheme, Oas30Document, Oas30SecurityScheme, OasContact, OasTag
} from "oai-ts-core";
import {
    createChangePropertyCommand,
    createChangeTitleCommand,
    createChangeVersionCommand,
    createChangeDescriptionCommand,
    createDeleteTagCommand,
    createNewTagCommand,
    createChangeLicenseCommand,
    createChangeContactCommand,
    createDeleteNodeCommand,
    createNewSecuritySchemeCommand,
    createChangeSecuritySchemeCommand,
    createDeleteSecuritySchemeCommand
} from "oai-ts-commands";
import {ICommand} from "../../_services/commands.manager";
import {ILicense, LicenseService} from "../../_services/license.service";
import {SecuritySchemeEventData} from "../dialogs/security-scheme.component";
import {ObjectUtils} from "../../_util/object.util";


export abstract class MainFormComponent {

    // TODO should be injected rather than instantiated?
    private static licenseService: LicenseService = new LicenseService();

    @Input() document: OasDocument;
    @Output() onCommand: EventEmitter<ICommand> = new EventEmitter<ICommand>();

    /**
     * returns the title.
     */
    public title(): string {
        if (this.document.info) {
            return this.document.info.title;
        } else {
            return null;
        }
    }

    /**
     * returns the version.
     */
    public version(): string {
        if (this.document.info) {
            return this.document.info.version;
        } else {
            return null;
        }
    }

    /**
     * returns the description.
     */
    public description(): string {
        if (this.document.info) {
            return this.document.info.description;
        } else {
            return null;
        }
    }

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
     * @return {OasContact}
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
     * Called when the user changes the title.
     * @param newTitle
     */
    public onTitleChange(newTitle: string): void {
        console.info("[MainFormComponent] User changed the title to: " + newTitle);
        let command: ICommand = createChangeTitleCommand(this.document, newTitle);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user changes the title.
     * @param newVersion
     */
    public onVersionChange(newVersion: string): void {
        console.info("[MainFormComponent] User changed the version to: " + newVersion);
        let command: ICommand = createChangeVersionCommand(this.document, newVersion);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user changes the description.
     * @param newDescription
     */
    public onDescriptionChange(newDescription: string): void {
        console.info("[MainFormComponent] User changed the description.");
        let command: ICommand = createChangeDescriptionCommand(this.document, newDescription);
        this.onCommand.emit(command);
    }

    /**
     * Returns the list of tags defined in the document.
     * @return {OasTag[]}
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
        this.onCommand.emit(command);
    }

    /**
     * Called when the user chooses to delete a tag.
     * @param tag
     */
    public deleteTag(tag: OasTag): void {
        let command: ICommand = createDeleteTagCommand(this.document, tag.name);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user clicks 'Add' on the Add Tag modal dialog.
     * @param tag
     */
    public addTag(tag: any): void {
        let command: ICommand = createNewTagCommand(this.document, tag.name, tag.description);
        this.onCommand.emit(command);
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
        return MainFormComponent.licenseService.findLicense(this.licenseUrl());
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
     * Returns the license service.
     * @return {LicenseService}
     */
    public licenseService(): LicenseService {
        return MainFormComponent.licenseService;
    }

    /**
     * Called when the user chooses a new license in the Choose License dialog.
     * @param licenseInfo
     */
    public setLicense(licenseInfo: any): void {
        let command: ICommand = createChangeLicenseCommand(this.document, licenseInfo.name, licenseInfo.url);
        this.onCommand.emit(command);
    }

    /**
     * Returns true if the API has Contact Info defined.
     * @return {boolean}
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
    public setContactInfo(contactInfo: OasContact): void {
        let command: ICommand = createChangeContactCommand(this.document, contactInfo.name, contactInfo.email, contactInfo.url);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user chooses to remove the contact info.
     */
    public deleteContact(): void {
        let command: ICommand = createDeleteNodeCommand(this.document, "contact", this.document.info);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user chooses to remove the license.
     */
    public deleteLicense(): void {
        let command: ICommand = createDeleteNodeCommand(this.document, "license", this.document.info);
        this.onCommand.emit(command);
    }

    /**
     * Returns true if there is at least one security scheme defined.
     * @return {boolean}
     */
    public hasSecurity(): boolean {
        return this.securitySchemes().length > 0;
    }

    /**
     * Returns all defined security schemes.
     * @return {OasSecurityScheme[]}
     */
    public abstract securitySchemes(): OasSecurityScheme[];

    /**
     * Called when the user changes the description of a security scheme in the table of schemes.
     * @param scheme
     * @param description
     */
    public changeSecuritySchemeDescription(scheme: OasSecurityScheme, description: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.document, scheme, "description", description);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user adds a new security scheme.
     * @param event
     */
    public addSecurityScheme(event: SecuritySchemeEventData): void {
        console.info("[MainFormComponent] Adding a security scheme: %s", event.schemeName);
        let scheme: Oas20SecurityScheme = new Oas20SecurityScheme(event.schemeName);
        scheme.description = event.description;
        scheme.type = event.type;
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
        this.onCommand.emit(command);
    }

    /**
     * Called when the user changes an existing security scheme.
     * @param event
     */
    public changeSecurityScheme(event: SecuritySchemeEventData): void {
        console.info("[MainFormComponent] Changing a security scheme: %s", event.schemeName);
        let scheme: Oas20SecurityScheme = new Oas20SecurityScheme(event.schemeName);
        scheme.description = event.description;
        scheme.type = event.type;
        scheme.name = event.name;
        scheme.in = event.in;
        scheme.flow = event.flow;
        scheme.authorizationUrl = event.authorizationUrl;
        scheme.tokenUrl = event.tokenUrl;
        if (event.scopes) {
            scheme.scopes = scheme.createScopes();
            for (let s of event.scopes) {
                scheme.scopes.addScope(s.name, s.description);
            }
        }

        let command: ICommand = createChangeSecuritySchemeCommand(this.document, scheme);
        this.onCommand.emit(command);
    }

    /**
     * Deletes a security scheme.
     * @param scheme
     */
    public deleteSecurityScheme(scheme: Oas20SecurityScheme): void {
        let command: ICommand = createDeleteSecuritySchemeCommand(this.document, scheme.schemeName());
        this.onCommand.emit(command);
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

    /**
     * Returns all defined security schemes.
     * @return {OasSecurityScheme[]}
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

    /**
     * Returns all defined security schemes.
     * @return {OasSecurityScheme[]}
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

}
