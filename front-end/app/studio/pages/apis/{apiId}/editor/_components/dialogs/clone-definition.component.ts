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

import {Component, EventEmitter, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ng2-bootstrap";
import {Oas20SchemaDefinition, Oas30SchemaDefinition} from "oai-ts-core";


@Component({
    moduleId: module.id,
    selector: "clone-definition-dialog",
    templateUrl: "clone-definition.component.html"
})
export class CloneDefinitionDialogComponent {

    @Output() onClone: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("cloneDefinitionModal") cloneDefinitionModal: QueryList<ModalDirective>;

    protected _isOpen: boolean = false;

    protected name: string = "";
    protected definition: Oas20SchemaDefinition | Oas30SchemaDefinition;

    /**
     * Called to open the dialog.
     * @param {Oas20SchemaDefinition | Oas30SchemaDefinition} definition
     */
    public open(definition: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
        this._isOpen = true;
        this.definition = definition;
        this.name = "CloneOf";
        if (this.definition.ownerDocument().getSpecVersion() === "2.0") {
            this.name += (definition as Oas20SchemaDefinition).definitionName();
        } else {
            this.name += (definition as Oas30SchemaDefinition).name();
        }

        this.cloneDefinitionModal.changes.subscribe( () => {
            if (this.cloneDefinitionModal.first) {
                this.cloneDefinitionModal.first.show();
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
     * Called when the user clicks "clone".
     */
    protected clone(): void {
        let data: any = {
            name: this.name,
            definition: this.definition
        };
        this.onClone.emit(data);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.cloneDefinitionModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return {boolean}
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

}
