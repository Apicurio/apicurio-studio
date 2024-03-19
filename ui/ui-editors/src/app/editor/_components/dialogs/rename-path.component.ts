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

import {Component, EventEmitter, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap/modal";
import {Oas20PathItem, Oas30PathItem, OasDocument, TraverserDirection, VisitorUtil} from "@apicurio/data-models";
import {FindPathItemsVisitor} from "../../_visitors/path-items.visitor";


@Component({
    selector: "rename-path-dialog",
    templateUrl: "rename-path.component.html",
    styleUrls: [ "rename-path.component.css" ]
})
export class RenamePathDialogComponent {

    @Output() onRename: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("renamePathModal") renamePathModal: QueryList<ModalDirective>;

    private _isOpen: boolean = false;

    name: string = "";
    path: Oas20PathItem | Oas30PathItem;
    alsoSubpaths: boolean;

    paths: string[] = [];
    pathExists: boolean = false;
    numSubpaths: number = 0;

    /**
     * Called to open the dialog.
     * @param path
     */
    public open(document: OasDocument, path: Oas20PathItem | Oas30PathItem): void {
        this._isOpen = true;
        this.path = path;
        this.name = path.getPath();
        this.alsoSubpaths = true;

        this.renamePathModal.changes.subscribe( () => {
            if (this.renamePathModal.first) {
                this.renamePathModal.first.show();
            }
        });

        this.paths = [];
        this.pathExists = false;
        let paths: (Oas20PathItem | Oas30PathItem)[] = this.getPaths(document);
        paths.forEach( path => {
            this.paths.push(path.getPath());
        });
        this.numSubpaths = this.calculateNumberOfSubpaths(path.getPath());
    }

    private getPaths(document: OasDocument): (Oas20PathItem | Oas30PathItem)[] {
        let vizzy: FindPathItemsVisitor = new FindPathItemsVisitor(null);
        VisitorUtil.visitTree(document, vizzy, TraverserDirection.down);
        return vizzy.getSortedPathItems() as (Oas20PathItem | Oas30PathItem)[];
    }

    private calculateNumberOfSubpaths(path: string): number {
        let rval: number = 0;
        this.paths.forEach( aPath => {
            if (aPath.startsWith(path) && aPath !== path) {
                rval++;
            }
        });
        return rval;
    }

    /**
     * Called to close the dialog.
     */
    close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "rename".
     */
    rename(): void {
        let data: any = {
            name: this.name,
            path: this.path,
            renameSubpaths: this.alsoSubpaths
        };
        this.onRename.emit(data);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.renamePathModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     */
    isOpen(): boolean {
        return this._isOpen;
    }

}
