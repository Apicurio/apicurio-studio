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
import {createChangeContactCommand, createDeleteContactCommand, ICommand} from "oai-ts-commands";
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
     * Returns the current contact object.
     * @return
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
     * Called to change the document's contact information.
     * @param contactInfo
     */
    public setContactInfo(contactInfo: ContactInfo): void {
        let command: ICommand = createChangeContactCommand(this.document, contactInfo.name, contactInfo.email, contactInfo.url);
        this.commandService.emit(command);
    }

}
