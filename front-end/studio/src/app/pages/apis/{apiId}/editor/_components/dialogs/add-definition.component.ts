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
import {Subject} from "rxjs/Subject";
import {Oas20SchemaDefinition, Oas30SchemaDefinition, OasDocument, OasVisitorUtil} from "oai-ts-core";
import {FindSchemaDefinitionsVisitor} from "../../_visitors/schema-definitions.visitor";
import {
    CodeEditorComponent, CodeEditorMode,
    CodeEditorTheme
} from "../../../../../../components/common/code-editor.component";


@Component({
    moduleId: module.id,
    selector: "add-definition-dialog",
    templateUrl: "add-definition.component.html",
    styleUrls: ["add-definition.component.css"]
})
export class AddDefinitionDialogComponent {

    @Output() onAdd: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("addDefinitionModal") addDefinitionModal: QueryList<ModalDirective>;
    @ViewChildren("exampleEditor") exampleEditor: QueryList<CodeEditorComponent>;

    protected _isOpen: boolean = false;

    protected name: string = "";

    protected _example: string;
    protected exampleValid: boolean = true;
    protected exampleFormattable: boolean = false;

    protected defChanged: Subject<string> = new Subject<string>();
    protected defs: string[] = [];
    protected defExists: boolean = false;

    /**
     * Called to open the dialog.
     */
    public open(document: OasDocument): void {
        this._isOpen = true;
        this.name = "";
        this.example = "";
        this.exampleValid = true;
        this.exampleFormattable = false;

        this.addDefinitionModal.changes.subscribe( () => {
            if (this.addDefinitionModal.first) {
                this.addDefinitionModal.first.show();
            }
        });

        this.defs = [];
        this.defExists = false;
        let definitions: (Oas20SchemaDefinition | Oas30SchemaDefinition)[] = this.getDefinitions(document);
        definitions.forEach( definition => {
            this.defs.push(FindSchemaDefinitionsVisitor.definitionName(definition));
        });
        this.defChanged
            .debounceTime(300)
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
     * @return
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    get example() {
        return this._example;
    }

    set example(definition: string) {
        this._example = definition;
        if (this._example === "") {
            this.exampleValid = true;
            this.exampleFormattable = false;
        } else {
            try {
                JSON.parse(this._example);
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
     * @return
     */
    public isExampleDefinitionFormattable(): boolean {
        return this.exampleFormattable;
    }

    /**
     * Returns true if the example definition added by the user in the Add Definition modal
     * dialog is valid (syntactically).
     * @return
     */
    public isExampleDefinitionValid(): boolean {
        return this.exampleValid;
    }

    /**
     * Called to format the example definition.
     */
    public formatExampleDefinition(): void {
        let jsObj: any = JSON.parse(this.example);
        let nsrcStr: string = JSON.stringify(jsObj, null, 4);
        this.example = nsrcStr;
    }

    public exampleEditorTheme(): CodeEditorTheme {
        return CodeEditorTheme.Light;
    }

    public exampleEditorMode(): CodeEditorMode {
        return CodeEditorMode.JSON;
    }

}
