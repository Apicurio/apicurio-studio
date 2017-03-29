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

import {Component, Output, EventEmitter, ViewChildren, QueryList} from "@angular/core";
import {ModalDirective} from "ng2-bootstrap";
import {AceEditorDirective} from "ng2-ace-editor";


@Component({
    moduleId: module.id,
    selector: "add-definition-dialog",
    templateUrl: "add-definition.component.html",
    styleUrls: ["add-definition.component.css"]
})
export class AddDefinitionDialogComponent {

    @Output() onAdd: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("addDefinitionModal") addDefinitionModal: QueryList<ModalDirective>;
    @ViewChildren("exampleEditor") exampleEditor: QueryList<AceEditorDirective>;

    protected _isOpen: boolean = false;

    protected name: string = "";

    protected example: string = "";
    protected exampleValid: boolean = true;
    protected exampleFormattable: boolean = false;

    /**
     * Called to open the dialog.
     */
    public open(): void {
        this._isOpen = true;
        this.name = "";
        this.example = "";
        this.exampleValid = true;
        this.exampleFormattable = false;

        this.addDefinitionModal.changes.subscribe( thing => {
            if (this.addDefinitionModal.first) {
                this.addDefinitionModal.first.show();
            }
        });
    }

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "add".
     */
    protected add(): void {
        let data: any = {
            name: this.name,
            example: this.example
        };
        this.onAdd.emit(data);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.addDefinitionModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return {boolean}
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Called when the user changes the example definition in the Add Definition modal dialog.
     * @param definition
     */
    public setExampleDefinition(definition: string): void {
        this.example = definition;
        if (this.example === "") {
            this.exampleValid = true;
            this.exampleFormattable = false;
        } else {
            try {
                JSON.parse(this.example);
                this.exampleValid = true;
                this.exampleFormattable = true;
            } catch (e) {
                this.exampleValid = false;
                this.exampleFormattable = false;
            }
        }
    }

    /**
     * Returns true if it's possible to format the example definition (it must be non-null and
     * syntactically valid).
     * @return {boolean}
     */
    public isExampleDefinitionFormattable(): boolean {
        return this.exampleFormattable;
    }

    /**
     * Returns true if the example definition added by the user in the Add Definition modal
     * dialog is valid (syntactically).
     * @return {boolean}
     */
    public isExampleDefinitionValid(): boolean {
        return this.exampleValid;
    }

    /**
     * Called to format the example definition.
     */
    public formatExampleDefinition(): void {
        if (this.exampleEditor.first) {
            let jsObj: any = JSON.parse(this.example);
            let nsrcStr: string = JSON.stringify(jsObj, null, 4);
            this.exampleEditor.first.setText(nsrcStr);
        }
    }

}
