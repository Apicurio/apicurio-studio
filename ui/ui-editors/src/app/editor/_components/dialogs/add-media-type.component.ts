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


const STANDARD_TYPES = [ "application/json", "text/xml", "multipart/form-data" ];


@Component({
    selector: "add-media-type-dialog",
    templateUrl: "add-media-type.component.html"
})
export class AddMediaTypeDialogComponent {

    private static CUSTOM_TYPES_STORAGE_KEY = "apicurio.add-media-type.custom-types";

    @Output() onAdd: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("addMediaTypeModal") addMediaTypeModal: QueryList<ModalDirective>;

    private addedMediaTypeNames: string[] = []

    private _isOpen: boolean = false;
    private _typeOptions: DropDownOption[];

    mediaType: string = "";
    customType: string = "";

    protected mediaTypeExists: boolean = false;

    /**
     * Called to open the dialog.
     * @param addedMediaTypeNames Array of the already added media types, to prevent adding them again
     * @param mediaType Media type to select by default
     */
    public open(addedMediaTypeNames: string[] = [], mediaType?: string): void {
        if (!mediaType) {
            this.mediaType = "application/json";
            this.customType = "";
        } else if (this.isStandardType(this.mediaType)) {
            this.mediaType = mediaType;
            this.customType = "";
        } else {
            this.mediaType = "custom";
            this.customType = mediaType;
        }
        this._isOpen = true;

        this.addMediaTypeModal.changes.subscribe( thing => {
            if (this.addMediaTypeModal.first) {
                this.addMediaTypeModal.first.show();
            }
        });

        // Add the standard types.
        this._typeOptions = STANDARD_TYPES.map( stype => {
            return new DropDownOptionValue(stype, stype);
        });
        // Add "remembered" custom types (if any)
        let ctypes: string[] = this.getCustomTypes();
        if (ctypes && ctypes.length > 0) {
            this._typeOptions.push(DIVIDER);
            ctypes.forEach( ctype => {
                this._typeOptions.push(new DropDownOptionValue(ctype, ctype));
            });
        }
        // Add the "Custom Type" option.
        this._typeOptions.push(DIVIDER);
        this._typeOptions.push(new DropDownOptionValue("Custom Type", "custom"))

        this.addedMediaTypeNames = addedMediaTypeNames
    }

    mediaTypeOptions(): DropDownOption[] {
        return this._typeOptions;
    }

    /**
     * Called to close the dialog.
     */
    close(): void {
        this._isOpen = false;
        this.mediaType = "";
    }

    /**
     * Called when the user clicks "add".
     */
    add(): void {
        let mt: string = this.mediaType;
        if (mt === 'custom') {
            mt = this.customType;
            this.rememberCustomType(mt);
        }
        this.onAdd.emit(mt);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.addMediaTypeModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Stores the custom type in browser local storage.
     * @param type
     */
    private rememberCustomType(type: string): void {
        if (!this.isStandardType(type)) {
            let ctypes: string[] = this.getCustomTypes();
            if (ctypes.indexOf(type) === -1) {
                ctypes.push(type);
                let storage: Storage = window.localStorage;
                storage.setItem(AddMediaTypeDialogComponent.CUSTOM_TYPES_STORAGE_KEY, JSON.stringify(ctypes));
            }
        }
    }

    private getCustomTypes(): string[] {
        let storage: Storage = window.localStorage;
        let ctypesRaw: string = storage.getItem(AddMediaTypeDialogComponent.CUSTOM_TYPES_STORAGE_KEY);
        if (ctypesRaw && ctypesRaw.indexOf('[') === 0) {
            return JSON.parse(ctypesRaw);
        }
        return [];
    }

    private isStandardType(type: string): boolean {
        return STANDARD_TYPES.indexOf(type) !== -1;
    }

    public isMediaTypeAlreadyAdded(): boolean {
        let mt: string = this.mediaType
        if (mt === 'custom') {
            mt = this.customType;
        }
        return this.addedMediaTypeNames.includes(mt)
    }

    public isValid(): boolean {
        return !this.isMediaTypeAlreadyAdded();
    }
}
