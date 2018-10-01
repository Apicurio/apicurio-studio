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
import {Subject} from "rxjs";
import {Oas20Operation, Oas30Operation} from "oai-ts-core";


@Component({
    moduleId: module.id,
    selector: "add-response-dialog",
    templateUrl: "add-response.component.html"
})
export class AddResponseDialogComponent {

    @Output() onAdd: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("addResponseModal") addResponseModal: QueryList<ModalDirective>;

    protected _isOpen: boolean = false;

    public _statusCode: string = "";
    get statusCode() {
        return this._statusCode;
    }
    set statusCode(code: string) {
        this._statusCode = code;
        this.codeChanged.next(code);
    }

    protected codeChanged: Subject<string> = new Subject<string>();
    protected codes: string[] = [];
    protected codeExists: boolean = false;

    /**
     * Called to open the dialog.
     * @param parent
     * @param statusCode
     */
    public open(parent: Oas20Operation | Oas30Operation, statusCode?: string): void {
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
            this.codes = parent.responses.responseStatusCodes();
            this.codeChanged
                .debounceTime(50)
                .distinctUntilChanged()
                .subscribe( name => {
                    this.codeExists = this.codes.indexOf(name) != -1;
                });
        }
    }

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
        this.statusCode = "";
    }

    /**
     * Called when the user clicks "add".
     */
    protected add(): void {
        if (this.isValid()) {
            this.onAdd.emit(this.statusCode);
            this.cancel();
        }
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.addResponseModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Returns true if today is the first of April.  (teapot related)
     */
    public isAprilFirst(): boolean {
        let d: Date = new Date();
        return d.getMonth() === 3 && d.getDate() === 1;
    }

    /**
     * Check to see if the form is valid.
     */
    public isValid(): boolean {
        return this.statusCode && !this.codeExists;
    }

}
