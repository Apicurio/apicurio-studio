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

import {Component, ElementRef, EventEmitter, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";


@Component({
    moduleId: module.id,
    selector: "add-media-type-dialog",
    templateUrl: "add-media-type.component.html"
})
export class AddMediaTypeDialogComponent {

    @Output() onAdd: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("addMediaTypeModal") addMediaTypeModal: QueryList<ModalDirective>;
    @ViewChildren("addMediaTypeInput") addMediaTypeInput: QueryList<ElementRef>;

    protected _isOpen: boolean = false;

    protected mediaType: string = "";

    /**
     * Called to open the dialog.
     */
    public open(mediaType?: string): void {
        this.mediaType = mediaType;
        if (!mediaType) {
            this.mediaType = "application/json";
        }
        this._isOpen = true;
        this.addMediaTypeModal.changes.subscribe( thing => {
            if (this.addMediaTypeModal.first) {
                this.addMediaTypeModal.first.show();
            }
        });
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
        this.onAdd.emit(this.mediaType);
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
     * @return {boolean}
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Called to initialize the selection/focus to the addMediaTypeInput field.
     */
    public doSelect(): void {
        this.addMediaTypeInput.first.nativeElement.focus();
        this.addMediaTypeInput.first.nativeElement.selectionStart = this.addMediaTypeInput.first.nativeElement.selectionEnd = this.mediaType.length
    }

}
