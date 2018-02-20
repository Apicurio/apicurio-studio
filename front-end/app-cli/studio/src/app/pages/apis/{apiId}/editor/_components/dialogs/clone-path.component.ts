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
import {OasDocument, OasPathItem} from "oai-ts-core";
import {Subject} from "rxjs/Subject";


@Component({
    moduleId: module.id,
    selector: "clone-path-dialog",
    templateUrl: "clone-path.component.html"
})
export class ClonePathDialogComponent {

    @Output() onClone: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("clonePathModal") clonePathModal: QueryList<ModalDirective>;
    @ViewChildren("clonePathInput") clonePathInput: QueryList<ElementRef>;

    protected _isOpen: boolean = false;

    protected path: string = "";
    protected object: OasPathItem;

    protected pathChanged: Subject<string> = new Subject<string>();
    protected paths: string[] = [];
    protected pathExists: boolean = false;

    /**
     * Called to open the dialog.
     * @param {OasDocument} document
     * @param {OasPathItem} path
     */
    public open(document: OasDocument, path: OasPathItem): void {
        this.object = path;
        this.path = path.path();
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
            document.paths.pathItems().forEach( pathItem => {
                this.paths.push(pathItem.path());
            });
            this.pathChanged
                .debounceTime(300)
                .distinctUntilChanged()
                .subscribe( path => {
                    this.pathExists = this.paths.indexOf(path) != -1;
                });
        }
    }

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
        this.path = "";
    }

    /**
     * Called when the user clicks "clone".
     */
    protected clone(): void {
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
    protected cancel(): void {
        this.clonePathModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return {boolean}
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Called to initialize the selection/focus to the clonePathInput field.
     */
    public doSelect(): void {
        this.clonePathInput.first.nativeElement.focus();
        this.clonePathInput.first.nativeElement.selectionStart = this.clonePathInput.first.nativeElement.selectionEnd = this.path.length
    }

}
