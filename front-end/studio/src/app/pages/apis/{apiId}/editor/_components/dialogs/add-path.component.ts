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
import {OasDocument, OasLibraryUtils} from "oai-ts-core";
import {FormControl} from "@angular/forms";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
    moduleId: module.id,
    selector: "add-path-dialog",
    templateUrl: "add-path.component.html"
})
export class AddPathDialogComponent {

    @Output() onAdd: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("addPathModal") addPathModal: QueryList<ModalDirective>;
    @ViewChildren("addPathInput") addPathInput: QueryList<ElementRef>;

    protected _isOpen: boolean = false;

    protected path: string = "";

    protected pathChanged: Subject<string> = new Subject<string>();
    protected paths: string[] = [];
    protected pathExists: boolean = false;

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
     * Called when the user clicks "add".
     */
    protected add(): void {
        this.onAdd.emit(this.path);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.addPathModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Called to initialize the selection/focus to the addPathInput field.
     */
    public doSelect(): void {
        this.addPathInput.first.nativeElement.focus();
        this.addPathInput.first.nativeElement.selectionStart = this.addPathInput.first.nativeElement.selectionEnd = this.path.length
    }

}
