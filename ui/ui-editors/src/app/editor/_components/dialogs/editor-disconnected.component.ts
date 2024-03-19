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

import {Component, ViewChildren, QueryList, Output, EventEmitter} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap/modal";


@Component({
    selector: "editor-disconnected-dialog",
    templateUrl: "editor-disconnected.component.html",
    styleUrls: [ "editor-disconnected-dialog.css" ]
})
export class EditorDisconnectedDialogComponent {

    @ViewChildren("editorDisconnectedModal") editorDisconnectedModal: QueryList<ModalDirective>;

    @Output() onWorkOffline: EventEmitter<void> = new EventEmitter<void>();

    private _isOpen: boolean = false;

    /**
     * Called to open the dialog.
     */
    public open(): void {
        this._isOpen = true;
        this.editorDisconnectedModal.changes.subscribe( thing => {
            if (this.editorDisconnectedModal.first) {
                this.editorDisconnectedModal.first.show();
            }
        });
    }

    /**
     * Called to close the dialog.
     */
    close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "Reload Page".
     */
    workOffline(): void {
        this.onWorkOffline.emit();
    }

    /**
     * Returns true if the dialog is open.
     *
     */
    isOpen(): boolean {
        return this._isOpen;
    }

}
