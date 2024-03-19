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
import {Library, Oas20Operation, Oas30Operation, OasDocument, TraverserDirection} from "@apicurio/data-models";
import {HttpCodeService} from "../../_services/httpcode.service";
import {FindResponseDefinitionsVisitor} from "../../_visitors/response-definitions.visitor";
import {DropDownOption, DropDownOptionValue} from "../common/drop-down.component";

export class AddResponseDialogData {
    public code: string;
    public ref: string;
}


@Component({
    selector: "add-response-dialog",
    templateUrl: "add-response.component.html"
})
export class AddResponseDialogComponent {

    @Output() onAdd: EventEmitter<AddResponseDialogData> = new EventEmitter<AddResponseDialogData>();

    @ViewChildren("addResponseModal") addResponseModal: QueryList<ModalDirective>;

    private _isOpen: boolean = false;

    private _statusCode: string = "";
    get statusCode() {
        return this._statusCode;
    }
    set statusCode(code: string) {
        this._statusCode = code;
        if (this.codes.indexOf(code) !== -1) {
            this.codeExists = true;
        } else {
            this.codeExists = false;
        }
    }

    doc: OasDocument;
    codes: string[] = [];
    codeExists: boolean = false;
    refName: string;
    references: string[] = [];

    /**
     * Called to open the dialog.
     * @param parent
     * @param statusCode
     */
    public open(parent: Oas20Operation | Oas30Operation, statusCode?: string): void {
        this.doc = <OasDocument>parent.ownerDocument();
        this.statusCode = statusCode;
        if (!statusCode) {
            this.statusCode = "";
        }
        this._isOpen = true;
        this.addResponseModal.changes.subscribe( thing => {
            if (this.addResponseModal.first) {
                this.addResponseModal.first.show();
            }
        });

        this.codes = [];
        this.codeExists = false;
        if (parent.responses) {
            this.codes = parent.responses.getResponseStatusCodes();
        }

        this.references = this.getResponseDefinitionNames();
        this.refName = null;
    }

    /**
     * Gets a list of all the response definition names in the document.
     */
    private getResponseDefinitionNames(): string[] {
        let viz: FindResponseDefinitionsVisitor = new FindResponseDefinitionsVisitor(null);
        Library.visitTree(this.doc, viz, TraverserDirection.down);
        return viz.getSortedResponseDefinitions().map( response => {
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
        this.statusCode = "";
    }

    /**
     * Called when the user clicks "add".
     */
    add(): void {
        if (this.isValid()) {
            let refPrefix: string = "#/components/responses/";
            if (this.doc.is2xDocument()) {
                refPrefix = "#/responses/";
            }

            let data: AddResponseDialogData = {
                code : this.statusCode,
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
        this.addResponseModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     */
    isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Returns true if today is the first of April.  (teapot related)
     */
    isAprilFirst(): boolean {
        let d: Date = new Date();
        return d.getMonth() === 3 && d.getDate() === 1;
    }

    /**
     * Check to see if the form is valid.
     */
    isValid(): boolean {
        return this.statusCode && !this.codeExists;
    }

    public getStatusCodeDropDownOptions(): DropDownOption[] {
        return HttpCodeService.generateDropDownOptions();
    }

    public getReferenceDropDownOptions(): DropDownOption[] {
        return this.references.map(name => {
            return new DropDownOptionValue(name, name);
        });
    }

    public getStatusCode(): string {
        return this.statusCode;
    }

    public setStatusCode(statusCode: string) {
        this.statusCode = statusCode;
    }

    getReference(): string {
        return this.refName;
    }

    setReference(newRefName: string): void {
        this.refName = newRefName;
    }
}
