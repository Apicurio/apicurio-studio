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
import {OasDocument, OasPathItem} from "@apicurio/data-models";


@Component({
    selector: "clone-path-dialog",
    templateUrl: "clone-path.component.html"
})
export class ClonePathDialogComponent {

    @Output() onClone: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("clonePathModal") clonePathModal: QueryList<ModalDirective>;
    @ViewChildren("clonePathInput") clonePathInput: QueryList<ElementRef>;

    private _isOpen: boolean = false;

    path: string = "";
    object: OasPathItem;

    paths: string[] = [];
    pathExists: boolean = false;

    /**
     * Called to open the dialog.
     * @param document
     * @param path
     */
    public open(document: OasDocument, path: OasPathItem): void {
        this.object = path;
        this.path = path.getPath();
        if (!this.path.endsWith("/")) {
            this.path = this.path + "/";
        }
        this._isOpen = true;
        this.clonePathModal.changes.subscribe( () => {
            if (this.clonePathModal.first) {
                this.clonePathModal.first.show();
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
     * Called when the user clicks "clone".
     */
    clone(): void {
        let modalData: any = {
            path: this.path,
            object: this.object
        };
        this.onClone.emit(modalData);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.clonePathModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Called to initialize the selection/focus to the clonePathInput field.
     */
    doSelect(): void {
        this.clonePathInput.first.nativeElement.focus();
        this.clonePathInput.first.nativeElement.selectionStart = this.clonePathInput.first.nativeElement.selectionEnd = this.path.length
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
