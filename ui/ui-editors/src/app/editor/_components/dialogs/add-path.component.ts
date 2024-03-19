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

import {Component, ElementRef, EventEmitter, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap/modal";
import {OasDocument} from "@apicurio/data-models";

@Component({
    selector: "add-path-dialog",
    templateUrl: "add-path.component.html"
})
export class AddPathDialogComponent {

    @Output() onAdd: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("addPathModal") addPathModal: QueryList<ModalDirective>;
    @ViewChildren("addPathInput") addPathInput: QueryList<ElementRef>;

    private _isOpen: boolean = false;

    path: string = "";

    paths: string[] = [];
    pathExists: boolean = false;

    /**
     * Called to open the dialog.
     * @param document
     * @param path
     */
    public open(document: OasDocument, path?: string): void {
        this.path = path;
        if (!path) {
            this.path = "";
        }
        if (!this.path.endsWith("/")) {
            this.path = this.path + "/";
        }
        this._isOpen = true;
        this.addPathModal.changes.subscribe( thing => {
            if (this.addPathModal.first) {
                this.addPathModal.first.show();
            }
        });

        this.paths = [];
        this.pathExists = false;
        if (document.paths) {
            document.paths.getPathItems().forEach( pathItem => {
                this.paths.push(pathItem.getPath());
            });
        }
    }

    /**
     * Called to close the dialog.
     */
    close(): void {
        this._isOpen = false;
        this.path = "";
    }

    /**
     * Called when the user clicks "add".
     */
    add(): void {
        this.onAdd.emit(this.path);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.addPathModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Called to initialize the selection/focus to the addPathInput field.
     */
    doSelect(): void {
        this.addPathInput.first.nativeElement.focus();
        this.addPathInput.first.nativeElement.selectionStart = this.addPathInput.first.nativeElement.selectionEnd = this.path.length
    }

    /**
     * Called whenever the user types anything in the path field - this validates that the path entered
     * is OK.
     * @param newPath
     */
    validatePath(newPath: string) {
        this.pathExists = this.paths.indexOf(newPath) != -1;
    }
}
