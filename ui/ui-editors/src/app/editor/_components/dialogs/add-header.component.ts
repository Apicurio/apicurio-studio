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

import {Component, EventEmitter, Output, QueryList, ViewChildren, Input} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap/modal";
import {DIVIDER, DropDownOption, DropDownOptionValue} from "../common/drop-down.component";

const STANDARD_HEADERS = ["string", "integer"];

@Component({
    selector: "add-header-dialog",
    templateUrl: "add-header.component.html"
})
export class AddHeaderDialogComponent {

    private static CUSTOM_HEADERS_STORAGE_KEY = "apicurio.add-header.custom-headers";

    @Output() onAdd: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("addHeaderModal") addHeaderModal: QueryList<ModalDirective>;

    private addedHeaderNames: string[] = []

    private _isOpen: boolean = false;
    private _headerOptions: DropDownOption[];

    header: string = "";
    customHeader: string = "";

    protected headerExists: boolean = false;


    /**
     * Called to open the dialog.
     * @param addedHeaderNames Array of the already added header, to prevent adding them again
     * @param header header to select by default
     */
    public open(addedHeaderNames: string[] = [], header?: string): void {
        if (!header) {
            this.customHeader = "";
        } else {
            this.header = this.customHeader;
        }
        this._isOpen = true;

        this.addHeaderModal.changes.subscribe( thing => {
            if (this.addHeaderModal.first) {
                this.addHeaderModal.first.show();
            }
        });

        // Add the standard types.
        this._headerOptions = STANDARD_HEADERS.map( sheader => {
            return new DropDownOptionValue(sheader, sheader);
        });
        // Add "remembered" custom headers (if any)
        let cheaders: string[] = this.getCustomHeaders();
        if (cheaders && cheaders.length > 0) {
            this._headerOptions.push(DIVIDER);
            cheaders.forEach( cheader => {
                this._headerOptions.push(new DropDownOptionValue(cheader, cheader));
            });
        }
        // Add the "Custom Header" option.
        this._headerOptions.push(DIVIDER);
        this._headerOptions.push(new DropDownOptionValue("Custom Header", "custom"))

        this.addedHeaderNames = addedHeaderNames
    }

    headerOptions(): DropDownOption[] {
        return this._headerOptions;
    }

    /**
     * Called to close the dialog.
     */
    close(): void {
        this._isOpen = false;
        this.header = "";
    }

    /**
     * Called when the user clicks "add".
     */
    add(): void {
        let h: string = this.customHeader;

        this.rememberCustomHeader(h);
        this.onAdd.emit(h);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.addHeaderModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Stores the custom header in browser local storage.
     * @param header
     */
    private rememberCustomHeader(header: string): void {

            let cheaders: string[] = this.getCustomHeaders();
            if (cheaders.indexOf(header) === -1) {
                cheaders.push(header);
                let storage: Storage = window.localStorage;
                storage.setItem(AddHeaderDialogComponent.CUSTOM_HEADERS_STORAGE_KEY, JSON.stringify(cheaders));
            }

    }

    private getCustomHeaders(): string[] {
        let storage: Storage = window.localStorage;
        let cheadersRaw: string = storage.getItem(AddHeaderDialogComponent.CUSTOM_HEADERS_STORAGE_KEY);
        if (cheadersRaw && cheadersRaw.indexOf('[') === 0) {
            return JSON.parse(cheadersRaw);
        }
        return [];
    }


    public isHeaderAlreadyAdded(): boolean {
        let h: string = this.customHeader
        return this.addedHeaderNames.includes(h)
    }

    public isValid(): boolean {
        return !this.isHeaderAlreadyAdded();
    }
}
