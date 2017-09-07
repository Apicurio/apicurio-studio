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


@Component({
    moduleId: module.id,
    selector: "add-query-param-dialog",
    templateUrl: "add-query-param.component.html"
})
export class AddQueryParamDialogComponent {

    @Output() onAdd: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("addQueryParamModal") addQueryParamModal: QueryList<ModalDirective>;

    protected _isOpen: boolean = false;

    protected name: string = "";

    /**
     * Called to open the dialog.
     */
    public open(name?: string): void {
        this.name = name;
        if (!name) {
            this.name = "";
        }
        this._isOpen = true;
        this.addQueryParamModal.changes.subscribe( thing => {
            if (this.addQueryParamModal.first) {
                this.addQueryParamModal.first.show();
            }
        });
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
        this.onAdd.emit(this.name);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.addQueryParamModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return {boolean}
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

}
