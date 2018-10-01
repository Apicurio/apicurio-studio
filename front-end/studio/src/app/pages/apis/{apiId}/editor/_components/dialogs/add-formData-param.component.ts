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
    selector: "add-formData-param-dialog",
    templateUrl: "add-formData-param.component.html"
})
export class AddFormDataParamDialogComponent {

    @Output() onAdd: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("addFormDataParamModal") addFormDataParamModal: QueryList<ModalDirective>;

    protected _isOpen: boolean = false;

    protected name: string = "";

    protected nameChanged: Subject<string> = new Subject<string>();
    protected names: string[] = [];
    protected nameExists: boolean = false;

    /**
     * Called to open the dialog.
     */
    public open(parent: Oas30Operation | Oas20Operation, name?: string): void {
        this.name = name;
        if (!name) {
            this.name = "";
        }
        this._isOpen = true;
        this.addFormDataParamModal.changes.subscribe( thing => {
            if (this.addFormDataParamModal.first) {
                this.addFormDataParamModal.first.show();
            }
        });

        this.names = [];
        this.nameExists = false;
        if (parent.parameters) {
            parent.parameters.forEach( param => {
                if (param.in === "formData") {
                    this.names.push(param.name);
                }
            });
            this.nameChanged
                .debounceTime(50)
                .distinctUntilChanged()
                .subscribe( name => {
                    this.nameExists = this.names.indexOf(name) != -1;
                });
        }
    }

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
        this.name = "";
    }

    /**
     * Called when the user clicks "add".
     */
    protected add(): void {
        console.info("Trying to ADD");
        if (this.isValid()) {
            this.onAdd.emit(this.name);
            this.cancel();
        }
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.addFormDataParamModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Check to see if the form is valid.
     */
    public isValid(): boolean {
        return this.name && !this.nameExists;
    }

}
