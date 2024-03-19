/**
 * @license
 * Copyright 2022 Red Hat
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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from "@angular/core";
import {CommandFactory, ICommand, AaiContact, AaiDocument} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";


@Component({
    selector: "aaicontact-section",
    templateUrl: "aaicontact-section.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsyncApiContactSectionComponent extends AbstractBaseComponent {

    @Input() document: AaiDocument;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    /**
     * Returns true if the API has Contact Info defined.
     */
    public hasContact(): boolean {
        if (this.document.info && this.document.info.contact) {
            return true;
        }
        return false;
    }

    /**
     * Returns the current contact object.
     */
    public contact(): AaiContact {
        if (this.hasContact()) {
            return this.document.info.contact;
        } else {
            return null;
        }
    }

    /**
     * Called to add empty contact info to the API definition.
     */
    public createEmptyContact(): void {
        let command: ICommand = CommandFactory.createChangeContactCommand(null, null, null);
        this.commandService.emit(command);
    }

    /**
     * Called when the user chooses to remove the contact info.
     */
    public deleteContact(): void {
        let command: ICommand = CommandFactory.createDeleteContactCommand(this.document.info);
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
     * Called when the user changes the contact name.
     * @param newValue
     */
    public changeContactName(newValue: string): void {
        if (!newValue) { newValue = null; }
        let command: ICommand = CommandFactory.createChangePropertyCommand(this.contact(), "name", newValue);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the contact email.
     * @param newValue
     */
    public changeContactEmail(newValue: string): void {
        if (!newValue) { newValue = null; }
        let command: ICommand = CommandFactory.createChangePropertyCommand(this.contact(), "email", newValue);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the contact url.
     * @param newValue
     */
    public changeContactURL(newValue: string): void {
        if (!newValue) { newValue = null; }
        let command: ICommand = CommandFactory.createChangePropertyCommand(this.contact(), "url", newValue);
        this.commandService.emit(command);
    }

}
