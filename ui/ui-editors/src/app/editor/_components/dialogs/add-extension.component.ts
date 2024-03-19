/**
 * @license
 * Copyright 2021 Red Hat
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

import {Component, ElementRef, EventEmitter, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap/modal";
import {ExtensibleNode} from "@apicurio/data-models";
import {CodeEditorMode} from "../common/code-editor.component";


@Component({
    selector: "add-extension-dialog",
    templateUrl: "add-extension.component.html",
    styleUrls: ["add-extension.component.css"]
})
export class AddExtensionDialogComponent {

    @Output() onAdd: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("addExtensionModal") addExtensionModal: QueryList<ModalDirective>;
    @ViewChildren("addExtensionInput") addExtensionInput: QueryList<ElementRef>;

    private _isOpen: boolean = false;
    private _parent: ExtensibleNode;

    name: string = "";
    _value: string = "";
    set value(value: string) {
        this._value = value;
        this.validateValue();
    }
    get value(): string {
        return this._value;
    }

    extensionExists: boolean = false;
    nameValid: boolean = false;
    valueValid: boolean = false;

    /**
     * Called to open the dialog.
     */
    public open(parent: ExtensibleNode): void {
        this._parent = parent;
        this.name = "x-";
        this.nameValid = true;
        this.extensionExists = false;
        this.value = "";
        this.valueValid = false;
        this._isOpen = true;
        this.addExtensionModal.changes.subscribe( () => {
            if (this.addExtensionModal.first) {
                this.addExtensionModal.first.show();
            }
        });

        this.extensionExists = false;
    }

    /**
     * Called to close the dialog.
     */
    close(): void {
        this._isOpen = false;
        this.name = "";
        this.value = "";
    }

    /**
     * Called when the user clicks "add".
     */
    add(): void {
        let extensionInfo: any = {
            name: this.name,
            value: JSON.parse(this._value)
        };
        this.onAdd.emit(extensionInfo);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.addExtensionModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Called to initialize the selection/focus to the addExtensionInput field.
     */
    doSelect(): void {
        this.addExtensionInput.first.nativeElement.focus();
    }

    validateName(name: string): void {
        this.extensionExists = this._parent.getExtension(name) != null;
        this.nameValid = name && name.startsWith("x-");
    }

    valueEditorMode() {
        return CodeEditorMode.JSON;
    }

    validateValue(): void {
        try {
            console.debug("Validating: ", this._value);
            JSON.parse(this._value);
            this.valueValid = true;
        } catch (e) {
            this.valueValid = false;
        }
        console.debug("valueValid is now: ", this.valueValid);
    }
}
