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

import {Component, EventEmitter, Output, QueryList, ViewChildren, Input} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";
import {DropDownOption} from "../../../../../../components/common/drop-down.component";
import {Oas20Operation, Oas30Operation, Oas30RequestBody} from "oai-ts-core";


const STANDARD_TYPES = [ "application/json", "text/xml", "multipart/form-data" ];


@Component({
    moduleId: module.id,
    selector: "add-media-type-dialog",
    templateUrl: "add-media-type.component.html"
})
export class AddMediaTypeDialogComponent {

    private static CUSTOM_TYPES_STORAGE_KEY = "apicurio.add-media-type.custom-types";

    @Output() onAdd: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("addMediaTypeModal") addMediaTypeModal: QueryList<ModalDirective>;

    private addedMediaTypeNames: string[] = []

    protected _isOpen: boolean = false;
    protected _typeOptions: DropDownOption[];

    protected mediaType: string = "";
    protected customType: string = "";

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
            return { name: stype, value: stype };
        });
        // Add "remembered" custom types (if any)
        let ctypes: string[] = this.getCustomTypes();
        if (ctypes && ctypes.length > 0) {
            this._typeOptions.push({
                divider: true
            });
            ctypes.forEach( ctype => {
                this._typeOptions.push({
                    name: ctype,
                    value: ctype
                });
            });
        }
        // Add the "Custom Type" option.
        this._typeOptions.push({ divider: true });
        this._typeOptions.push({
            name: "Custom Type",
            value: "custom"
        })

        this.addedMediaTypeNames = addedMediaTypeNames
    }

    public mediaTypeOptions(): DropDownOption[] {
        return this._typeOptions;
    }

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
        this.mediaType = "";
    }

    /**
     * Called when the user clicks "add".
     */
    protected add(): void {
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
    protected cancel(): void {
        this.addMediaTypeModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    public isOpen(): boolean {
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
