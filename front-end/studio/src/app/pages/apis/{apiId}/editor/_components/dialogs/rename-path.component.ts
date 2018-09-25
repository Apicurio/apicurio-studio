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
import {ModalDirective} from "ngx-bootstrap";
import {Subject} from "rxjs/Subject";
import {Oas20PathItem, Oas30PathItem, OasDocument, OasVisitorUtil} from "oai-ts-core";
import {FindPathItemsVisitor} from "../../_visitors/path-items.visitor";


@Component({
    moduleId: module.id,
    selector: "rename-path-dialog",
    templateUrl: "rename-path.component.html",
    styleUrls: [ "rename-path.component.css" ]
})
export class RenamePathDialogComponent {

    @Output() onRename: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("renamePathModal") renamePathModal: QueryList<ModalDirective>;

    protected _isOpen: boolean = false;

    protected name: string = "";
    protected path: Oas20PathItem | Oas30PathItem;

    protected pathChanged: Subject<string> = new Subject<string>();
    protected paths: string[] = [];
    protected pathExists: boolean = false;

    /**
     * Called to open the dialog.
     * @param path
     */
    public open(document: OasDocument, path: Oas20PathItem | Oas30PathItem): void {
        this._isOpen = true;
        this.path = path;
        this.name = path.path();

        this.renamePathModal.changes.subscribe( () => {
            if (this.renamePathModal.first) {
                this.renamePathModal.first.show();
            }
        });

        this.paths = [];
        this.pathExists = false;
        let paths: (Oas20PathItem | Oas30PathItem)[] = this.getPaths(document);
        paths.forEach( path => {
            this.paths.push(path.path());
        });
        this.pathChanged
            .debounceTime(200)
            .distinctUntilChanged()
            .subscribe( def => {
                this.pathExists = this.paths.indexOf(def) != -1;
            });
    }

    private getPaths(document: OasDocument): (Oas20PathItem | Oas30PathItem)[] {
        let vizzy: FindPathItemsVisitor = new FindPathItemsVisitor(null);
        OasVisitorUtil.visitTree(document, vizzy);
        return vizzy.getSortedPathItems() as (Oas20PathItem | Oas30PathItem)[];
    }

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "rename".
     */
    protected rename(): void {
        let data: any = {
            name: this.name,
            path: this.path
        };
        this.onRename.emit(data);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.renamePathModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

}
