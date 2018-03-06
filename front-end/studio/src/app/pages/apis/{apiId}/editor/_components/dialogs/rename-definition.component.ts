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
import {ModalDirective} from "ngx-bootstrap";
import {Oas20SchemaDefinition, Oas30SchemaDefinition, OasDocument, OasVisitorUtil} from "oai-ts-core";
import {Subject} from "rxjs/Subject";
import {FindSchemaDefinitionsVisitor} from "../../_visitors/schema-definitions.visitor";


@Component({
    moduleId: module.id,
    selector: "rename-definition-dialog",
    templateUrl: "rename-definition.component.html"
})
export class RenameDefinitionDialogComponent {

    @Output() onRename: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("renameDefinitionModal") renameDefinitionModal: QueryList<ModalDirective>;

    protected _isOpen: boolean = false;

    protected name: string = "";
    protected definition: Oas20SchemaDefinition | Oas30SchemaDefinition;

    protected defChanged: Subject<string> = new Subject<string>();
    protected defs: string[] = [];
    protected defExists: boolean = false;

    /**
     * Called to open the dialog.
     * @param {Oas20SchemaDefinition | Oas30SchemaDefinition} definition
     */
    public open(document: OasDocument, definition: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
        this._isOpen = true;
        this.definition = definition;
        this.name;
        if (this.definition.ownerDocument().getSpecVersion() === "2.0") {
            this.name = (definition as Oas20SchemaDefinition).definitionName();
        } else {
            this.name = (definition as Oas30SchemaDefinition).name();
        }

        this.renameDefinitionModal.changes.subscribe( () => {
            if (this.renameDefinitionModal.first) {
                this.renameDefinitionModal.first.show();
            }
        });

        this.defs = [];
        this.defExists = false;
        let definitions: (Oas20SchemaDefinition | Oas30SchemaDefinition)[] = this.getDefinitions(document);
        definitions.forEach( definition => {
            this.defs.push(FindSchemaDefinitionsVisitor.definitionName(definition));
        });
        this.defChanged
            .debounceTime(200)
            .distinctUntilChanged()
            .subscribe( def => {
                this.defExists = this.defs.indexOf(def) != -1;
            });
    }

    private getDefinitions(document: OasDocument): (Oas20SchemaDefinition | Oas30SchemaDefinition)[] {
        let vizzy: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(null);
        OasVisitorUtil.visitTree(document, vizzy);
        return vizzy.getSortedSchemaDefinitions()
    }

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "rename".
     */
    protected rename(): void {
        let data: any = {
            name: this.name,
            definition: this.definition
        };
        this.onRename.emit(data);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.renameDefinitionModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return {boolean}
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

}
