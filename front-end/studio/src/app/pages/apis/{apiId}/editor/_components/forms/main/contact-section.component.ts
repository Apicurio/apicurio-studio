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

import {Component, Input, ViewEncapsulation} from "@angular/core";
import {OasContact, OasDocument} from "oai-ts-core";
import {CommandService} from "../../../_services/command.service";
import {
    createChangeContactCommand,
    createChangePropertyCommand,
    createDeleteContactCommand, createDeletePropertyCommand,
    ICommand
} from "oai-ts-commands";
import {ContactInfo} from "../../dialogs/set-contact.component";


@Component({
    moduleId: module.id,
    selector: "contact-section",
    templateUrl: "contact-section.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ContactSectionComponent {

    @Input() document: OasDocument;

    constructor(private commandService: CommandService) {}

    /**
     * Returns true if the API has Contact Info defined.
     */
    public hasContact(): boolean {
        if (this.document.info && this.document.info.contact) {
            if (this.document.info.contact.email || this.document.info.contact.url || this.document.info.contact.name) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns the current contact object.
     */
    public contact(): OasContact {
        if (this.hasContact()) {
            return this.document.info.contact;
        } else {
            return null;
        }
    }

    /**
     * Called when the user chooses to remove the contact info.
     */
    public deleteContact(): void {
        let command: ICommand = createDeleteContactCommand(this.document);
        this.commandService.emit(command);
    }

    /**
     * Returns the contact name.
     */
    public contactName(): string {
        if (this.document.info && this.document.info.contact && this.document.info.contact.name) {
            return this.document.info.contact.name;
        } else {
            return null;
        }
    }

    /**
     * Returns the contact email.
     */
    public contactEmail(): string {
        if (this.document.info && this.document.info.contact && this.document.info.contact.email) {
            return this.document.info.contact.email;
        } else {
            return null;
        }
    }

    /**
     * Returns the contact url.
     */
    public contactUrl(): string {
        if (this.document.info && this.document.info.contact && this.document.info.contact.url) {
            return this.document.info.contact.url;
        } else {
            return null;
        }
    }

    /**
     * Called to change the document's contact information.
     * @param contactInfo
     */
    public setContactInfo(contactInfo: ContactInfo): void {
        if (!contactInfo.name) {
            contactInfo.name = null;
        }
        if (!contactInfo.email) {
            contactInfo.email = null;
        }
        if (!contactInfo.url) {
            contactInfo.url = null;
        }
        let command: ICommand = createChangeContactCommand(this.document, contactInfo.name, contactInfo.email, contactInfo.url);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the contact name.
     * @param newValue
     */
    public changeContactName(newValue: string): void {
        if (!newValue) { newValue = null; }
        let command: ICommand = createChangePropertyCommand(this.document, this.contact(), "name", newValue);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the contact email.
     * @param newValue
     */
    public changeContactEmail(newValue: string): void {
        if (!newValue) { newValue = null; }
        let command: ICommand = createChangePropertyCommand(this.document, this.contact(), "email", newValue);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the contact url.
     * @param newValue
     */
    public changeContactURL(newValue: string): void {
        if (!newValue) { newValue = null; }
        let command: ICommand = createChangePropertyCommand(this.document, this.contact(), "url", newValue);
        this.commandService.emit(command);
    }

}
