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

import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap/modal";
import {Node} from "@apicurio/data-models";


export interface RenameEntityEvent {

    entity: Node;
    newName: string;

}


@Component({
    selector: "rename-entity-dialog",
    templateUrl: "rename-entity.component.html",
    styleUrls: [ "rename-entity.component.css" ]
})
export class RenameEntityDialogComponent {

    @Input() type: string;
    @Input() title: string;
    @Input() message: string;
    @Input() warning: string;
    @Input() validationPattern: string;
    @Input() validationError: string;
    @Output() onRename: EventEmitter<RenameEntityEvent> = new EventEmitter<RenameEntityEvent>();

    @ViewChildren("renameEntityModal") renameEntityModal: QueryList<ModalDirective>;

    private _isOpen: boolean = false;

    private entity: Node;
    originalName: string;
    newName: string;
    private checkExistence: (name: string) => boolean;
    _alreadyExists: boolean;

    /**
     * Called to open the dialog.
     * @param entity
     * @param name
     * @param checkExistence
     */
    public open(entity: Node, name: string, checkExistence: (name: string) => boolean): void {
        this._isOpen = true;
        this.entity = entity;
        this.originalName = name;
        this.newName = name;
        this._alreadyExists = true;
        this.checkExistence = checkExistence;

        this.renameEntityModal.changes.subscribe( () => {
            if (this.renameEntityModal.first) {
                this.renameEntityModal.first.show();
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
     * Called when the user clicks "rename".
     */
    rename(): void {
        let event: RenameEntityEvent = {
            entity: this.entity,
            newName: this.newName
        };
        this.onRename.emit(event);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.renameEntityModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Called to validate the new (potential) name.
     * @param name
     */
    validateName(name: string): void {
        this._alreadyExists = this.checkExistence(name);
    }

    /**
     * Returns true if the warning message should be displayed.
     */
    shouldShowWarning(): boolean {
        return this.warning !== null && this.warning !== undefined;
    }

    /**
     * Returns true if the message should be displayed.
     */
    shouldShowMessage(): boolean {
        return this.message !== null && this.message !== undefined;
    }

}
