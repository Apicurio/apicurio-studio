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

import {Component, EventEmitter, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap/modal";
import {
    Oas20ResponseDefinition,
    Oas30ResponseDefinition,
    OasDocument,
    TraverserDirection,
    VisitorUtil
} from "@apicurio/data-models";
import {FindResponseDefinitionsVisitor} from "../../_visitors/response-definitions.visitor";


@Component({
    selector: "clone-response-definition-dialog",
    templateUrl: "clone-response-definition.component.html"
})
export class CloneResponseDefinitionDialogComponent {

    @Output() onClone: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("cloneResponseDefinitionModal") cloneResponseDefinitionModal: QueryList<ModalDirective>;

    private _isOpen: boolean = false;

    name: string = "";
    private definition: Oas20ResponseDefinition | Oas30ResponseDefinition;

    defs: string[] = [];
    defExists: boolean = false;

    /**
     * Called to open the dialog.
     * @param definition
     */
    public open(document: OasDocument, definition: Oas20ResponseDefinition | Oas30ResponseDefinition): void {
        this._isOpen = true;
        this.definition = definition;
        this.name = "CloneOf" + definition.getName();

        this.cloneResponseDefinitionModal.changes.subscribe( () => {
            if (this.cloneResponseDefinitionModal.first) {
                this.cloneResponseDefinitionModal.first.show();
            }
        });

        this.defs = [];
        this.defExists = false;
        let definitions: (Oas20ResponseDefinition | Oas30ResponseDefinition)[] = this.getDefinitions(document);
        definitions.forEach( definition => {
            this.defs.push(FindResponseDefinitionsVisitor.definitionName(definition));
        });
    }

    private getDefinitions(document: OasDocument): (Oas20ResponseDefinition | Oas30ResponseDefinition)[] {
        let vizzy: FindResponseDefinitionsVisitor = new FindResponseDefinitionsVisitor(null);
        VisitorUtil.visitTree(document, vizzy, TraverserDirection.down);
        return vizzy.getSortedResponseDefinitions()
    }

    /**
     * Called to close the dialog.
     */
    close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "clone".
     */
    clone(): void {
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
    cancel(): void {
        this.cloneResponseDefinitionModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    isOpen(): boolean {
        return this._isOpen;
    }

}
