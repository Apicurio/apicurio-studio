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

import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap/modal";
import {Aai20Schema} from "@apicurio/data-models";
import {ObjectUtils} from "apicurio-ts-core";
import {DropDownOption, DropDownOptionValue} from "../common/drop-down.component";


@Component({
    selector: "add-oneof-in-message-dialog",
    templateUrl: "add-message-reference.component.html"
})
export class AddOneOfInMessageDialogComponent {

    @Input() messages: Aai20Schema[];
    @Output() onAdd: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("addReferenceModal") addReferenceModal: QueryList<ModalDirective>;

    private _isOpen: boolean = false;

    refSelected: string;
    messagesFromDocument: string[] = [];
    alreadyUsedReferences: string[] = [];
    messagesFromDocExists: boolean = false;
    private _referenceOptions: DropDownOption[] = [];

    constructor(){
    }

    /**
     * Called to open the dialog.
     * @param messages
     */
    public open(messages: string[], referencesAlreadyAdded: string[]): void{
        this.messagesFromDocument = messages;
        this.alreadyUsedReferences = referencesAlreadyAdded;
        this.messagesFromDocExists = ObjectUtils.isNullOrUndefined(this.messagesFromDocument) || this.messagesFromDocument.length <= 0;
        this._referenceOptions = messages.filter( f => !this.alreadyUsedReferences.includes(f) ).map(m => new DropDownOptionValue(m,m));
        this._isOpen = true;
        this.addReferenceModal.changes.subscribe(thing => {
            if (this.addReferenceModal.first) {
                this.addReferenceModal.first.show();
            }
        });
    }

    referenceOptions(): DropDownOption[]{
        return this._referenceOptions;
    }

    /**
     * Called to close the dialog.
     */
    close(): void{
        this._isOpen = false;
        this.refSelected = null;
    }

    /**
     * Called when the user clicks "add".
     */
        add(): void{
        this.onAdd.emit(this.refSelected);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void{
        this.addReferenceModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    isOpen(): boolean{
        return this._isOpen;
    }

}
