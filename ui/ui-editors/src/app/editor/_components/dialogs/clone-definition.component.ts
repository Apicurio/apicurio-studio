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
    Oas20SchemaDefinition,
    Oas30SchemaDefinition,
    Aai20SchemaDefinition,
    OasDocument,
    AaiDocument,
    DocumentType,
    TraverserDirection,
    VisitorUtil
} from "@apicurio/data-models";
import {FindSchemaDefinitionsVisitor, FindAaiSchemaDefinitionsVisitor} from "../../_visitors/schema-definitions.visitor";


@Component({
    selector: "clone-definition-dialog",
    templateUrl: "clone-definition.component.html"
})
export class CloneDefinitionDialogComponent {

    @Output() onClone: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("cloneDefinitionModal") cloneDefinitionModal: QueryList<ModalDirective>;

    private _isOpen: boolean = false;

    name: string = "";
    private definition: Oas20SchemaDefinition | Oas30SchemaDefinition | Aai20SchemaDefinition;

    defs: string[] = [];
    defExists: boolean = false;

    /**
     * Called to open the dialog.
     * @param definition
     */
    public open(document: OasDocument | AaiDocument, definition: Oas20SchemaDefinition | Oas30SchemaDefinition |  Aai20SchemaDefinition): void {
        this._isOpen = true;
        this.definition = definition;
        this.name = "CloneOf" + definition.getName();

        this.cloneDefinitionModal.changes.subscribe( () => {
            if (this.cloneDefinitionModal.first) {
                this.cloneDefinitionModal.first.show();
            }
        });

        this.defs = [];
        this.defExists = false;

        if (document.getDocumentType() == DocumentType.asyncapi2) {
            let definitions: Aai20SchemaDefinition[] = this.getAaiDefinitions(<AaiDocument> document);
            definitions.forEach( definition => {
                this.defs.push(FindAaiSchemaDefinitionsVisitor.definitionName(definition));
            });
        } else {
            let definitions: (Oas20SchemaDefinition | Oas30SchemaDefinition)[] = this.getDefinitions(<OasDocument> document);
            definitions.forEach( definition => {
                this.defs.push(FindSchemaDefinitionsVisitor.definitionName(definition));
            });
        }
    }

    private getDefinitions(document: OasDocument): (Oas20SchemaDefinition | Oas30SchemaDefinition)[] {
        let vizzy: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(null);
        VisitorUtil.visitTree(document, vizzy, TraverserDirection.down);
        return vizzy.getSortedSchemaDefinitions()
    }

    private getAaiDefinitions(document: AaiDocument): (Aai20SchemaDefinition)[] {
        let vizzy: FindAaiSchemaDefinitionsVisitor = new FindAaiSchemaDefinitionsVisitor(null);
        VisitorUtil.visitTree(document, vizzy, TraverserDirection.down);
        return vizzy.getSortedSchemaDefinitions();
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
        this.cloneDefinitionModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    isOpen(): boolean {
        return this._isOpen;
    }

}
