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
import {Library, Document, TraverserDirection, OasDocument} from "@apicurio/data-models";
import {FindSchemaDefinitionsVisitor} from "../../_visitors/schema-definitions.visitor";
import {DropDownOption, DropDownOptionValue} from "../common/drop-down.component";

export class AddSchemaDialogData {
    public ref: string;
}


@Component({
    selector: "add-schema-dialog",
    templateUrl: "add-schema.component.html"
})
export class AddSchemaDialogComponent {

    @Output() onAdd: EventEmitter<AddSchemaDialogData> = new EventEmitter<AddSchemaDialogData>();

    @ViewChildren("addSchemaModal") addSchemaModal: QueryList<ModalDirective>;

    private _isOpen: boolean = false;

    doc: OasDocument;
    refName: string;
    references: string[] = [];

    /**
     * Called to open the dialog.
     * @param parent
     */
    public open(doc: Document): void {
        console.info("[AddSchemaDialogComponent] Opening dialog.");
        this.doc = doc as OasDocument;
        this._isOpen = true;
        this.addSchemaModal.changes.subscribe( thing => {
            if (this.addSchemaModal.first) {
                this.addSchemaModal.first.show();
            }
        });

        this.references = this.getSchemaDefinitionNames();
        this.refName = null;
    }

    /**
     * Gets a list of all the response definition names in the document.
     */
    private getSchemaDefinitionNames(): string[] {
        let viz: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(null);
        Library.visitTree(this.doc, viz, TraverserDirection.down);
        return viz.getSortedSchemaDefinitions().map( response => {
            return response.getName();
        });
    }

    hasReferences(): boolean {
        return this.references && this.references.length > 0;
    }

    /**
     * Called to close the dialog.
     */
    close(): void {
        this._isOpen = false;
        this.refName = null
    }

    /**
     * Called when the user clicks "add".
     */
    add(): void {
        if (this.isValid()) {
            let refPrefix: string = "#/components/schemas/";
            if (this.doc.is2xDocument()) {
                refPrefix = "#/definitions/";
            }

            let data: AddSchemaDialogData = {
                ref : refPrefix + this.refName
            };
            if (!this.refName) {
                data.ref = null;
            }
            this.onAdd.emit(data);
            this.cancel();
        }
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.addSchemaModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     */
    isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Check to see if the form is valid.
     */
    isValid(): boolean {
        return this.refName && true;
    }

    public getReferenceDropDownOptions(): DropDownOption[] {
        return this.references.map(name => {
            return new DropDownOptionValue(name, name);
        });
    }

    getReference(): string {
        return this.refName;
    }

    setReference(newRefName: string): void {
        this.refName = newRefName;
    }
}
