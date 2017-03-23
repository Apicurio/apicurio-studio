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
import {OasDocument, Oas20Document, Oas20Tag, Oas20License, Oas20Contact} from "oai-ts-core";
import {ICommand} from "../commands.manager";
import {ChangeVersionCommand} from "../commands/change-version.command";
import {ChangeTitleCommand} from "../commands/change-title.command";
import {ChangeDescriptionCommand} from "../commands/change-description.command";
import {ObjectUtils} from "../../../../../util/common";
import {ChangePropertyCommand} from "../commands/change-property.command";
import {DeleteTagCommand, DeleteNodeCommand} from "../commands/delete.command";
import {NewTagCommand} from "../commands/new-tag.command";
import {ILicense, LicenseService} from "../services/license.service";
import {ChangeLicenseCommand} from "../commands/change-license.command";
import {ChangeContactCommand} from "../commands/change-contact-info.command";


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

}
