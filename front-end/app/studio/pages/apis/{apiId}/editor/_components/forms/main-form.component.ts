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
    Oas20SecurityDefinitions
} from "oai-ts-core";
import {ICommand} from "../../_services/commands.manager";
import {ChangeVersionCommand} from "../../_commands/change-version.command";
import {ChangeTitleCommand} from "../../_commands/change-title.command";
import {ChangeDescriptionCommand} from "../../_commands/change-description.command";
import {ChangePropertyCommand} from "../../_commands/change-property.command";
import {DeleteTagCommand, DeleteNodeCommand, DeleteSecuritySchemeCommand} from "../../_commands/delete.command";
import {NewTagCommand} from "../../_commands/new-tag.command";
import {ILicense, LicenseService} from "../../_services/license.service";
import {ChangeLicenseCommand} from "../../_commands/change-license.command";
import {ChangeContactCommand} from "../../_commands/change-contact-info.command";
import {SecuritySchemeEventData} from "../dialogs/security-scheme.component";
import {NewSecuritySchemeCommand} from "../../_commands/new-security-scheme.command";
import {ChangeSecuritySchemeCommand} from "../../_commands/change-security-scheme.command";
import {ObjectUtils} from "../../_util/object.util";


@Component({
    moduleId: module.id,
    selector: "main-form",
    templateUrl: "main-form.component.html",
    encapsulation: ViewEncapsulation.None
})
export class MainFormComponent {

    private static licenseService: LicenseService = new LicenseService();

    @Input() document: OasDocument;
    @Output() onCommand: EventEmitter<ICommand> = new EventEmitter<ICommand>();

    public doc(): Oas20Document {
        return <Oas20Document> this.document;
    }

    /**
     * returns the title.
     */
    public title(): string {
        if (this.doc().info) {
            return this.doc().info.title;
        } else {
            return null;
        }
    }

    /**
     * returns the version.
     */
    public version(): string {
        if (this.doc().info) {
            return this.doc().info.version;
        } else {
            return null;
        }
    }

    /**
     * returns the description.
     */
    public description(): string {
        if (this.doc().info) {
            return this.doc().info.description;
        } else {
            return null;
        }
    }

    /**
     * returns the terms of service.
     */
    public tos(): string {
        if (this.doc().info) {
            return this.doc().info.termsOfService;
        } else {
            return "";
        }
    }

    /**
     * Returns the current contact object.
     * @return {Oas20Contact}
     */
    public contact(): Oas20Contact {
        if (this.hasContact()) {
            return this.doc().info.contact;
        } else {
            return new Oas20Contact();
        }
    }

    /**
     * returns the contact name.
     */
    public contactName(): string {
        if (this.doc().info && this.doc().info.contact && this.doc().info.contact.name) {
            return this.doc().info.contact.name;
        } else {
            return this.contactEmail();
        }
    }

    /**
     * returns the contact email.
     */
    public contactEmail(): string {
        if (this.doc().info && this.doc().info.contact && this.doc().info.contact.email) {
            return this.doc().info.contact.email;
        } else {
            return "";
        }
    }

    /**
     * returns the contact url.
     */
    public contactUrl(): string {
        if (this.doc().info && this.doc().info.contact) {
            return this.doc().info.contact.url;
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
        let command: ICommand = new ChangeTitleCommand(newTitle);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user changes the title.
     * @param newVersion
     */
    public onVersionChange(newVersion: string): void {
        console.info("[MainFormComponent] User changed the version to: " + newVersion);
        let command: ICommand = new ChangeVersionCommand(newVersion);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user changes the description.
     * @param newDescription
     */
    public onDescriptionChange(newDescription: string): void {
        console.info("[MainFormComponent] User changed the description.");
        let command: ICommand = new ChangeDescriptionCommand(newDescription);
        this.onCommand.emit(command);
    }

    /**
     * Returns the list of tags defined in the document.
     * @return {Oas20Tag[]}
     */
    public tags(): Oas20Tag[] {
        let tags: Oas20Tag[] = this.doc().tags;
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
    public changeTagDescription(tag: Oas20Tag, description: string): void {
        let command: ICommand = new ChangePropertyCommand<string>("description", description, tag);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user chooses to delete a tag.
     * @param tag
     */
    public deleteTag(tag: Oas20Tag): void {
        let command: ICommand = new DeleteTagCommand(tag);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user clicks 'Add' on the Add Tag modal dialog.
     * @param tag
     */
    public addTag(tag: any): void {
        let command: ICommand = new NewTagCommand(tag.name, tag.description);
        this.onCommand.emit(command);
    }

    /**
     * Returns true if a license has been configured for this API.
     */
    public hasLicense(): boolean {
        if (this.doc().info && this.doc().info.license) {
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
        if (this.doc().info && this.doc().info.license) {
            return this.doc().info.license.name;
        } else {
            return "";
        }
    }

    /**
     * returns the license url.
     */
    public licenseUrl(): string {
        if (this.doc().info && this.doc().info.license) {
            return this.doc().info.license.url;
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
        let command: ICommand = new ChangeLicenseCommand(licenseInfo.name, licenseInfo.url);
        this.onCommand.emit(command);
    }

    /**
     * Returns true if the API has Contact Info defined.
     * @return {boolean}
     */
    public hasContact(): boolean {
        if (this.doc().info && this.doc().info.contact) {
            if (this.doc().info.contact.email || this.doc().info.contact.url) {
                return true;
            }
        }
        return false;
    }

    /**
     * Called to change the document's contact information.
     * @param contactInfo
     */
    public setContactInfo(contactInfo: Oas20Contact): void {
        let command: ICommand = new ChangeContactCommand(contactInfo);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user chooses to remove the contact info.
     */
    public deleteContact(): void {
        let command: ICommand = new DeleteNodeCommand("contact", this.doc().info);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user chooses to remove the license.
     */
    public deleteLicense(): void {
        let command: ICommand = new DeleteNodeCommand("license", this.doc().info);
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
     * @return {any}
     */
    public securitySchemes(): Oas20SecurityScheme[] {
        let secdefs: Oas20SecurityDefinitions = this.doc().securityDefinitions;
        if (secdefs) {
            return secdefs.securitySchemes().sort( (scheme1, scheme2) => {
                return scheme1.schemeName().localeCompare(scheme2.schemeName());
            });
        }
        return [];
    }

    /**
     * Called when the user changes the description of a security scheme in the table of schemes.
     * @param scheme
     * @param description
     */
    public changeSecuritySchemeDescription(scheme: Oas20SecurityScheme, description: string): void {
        let command: ICommand = new ChangePropertyCommand<string>("description", description, scheme);
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
        if (event.scopes) {
            scheme.scopes = scheme.createScopes();
            for (let s of event.scopes) {
                scheme.scopes.addScope(s.name, s.description);
            }
        }


        let command: ICommand = new NewSecuritySchemeCommand(scheme);
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

        let command: ICommand = new ChangeSecuritySchemeCommand(scheme);
        this.onCommand.emit(command);
    }

    /**
     * Deletes a security scheme.
     * @param scheme
     */
    public deleteSecurityScheme(scheme: Oas20SecurityScheme): void {
        let command: ICommand = new DeleteSecuritySchemeCommand(scheme.schemeName());
        this.onCommand.emit(command);
    }

}
