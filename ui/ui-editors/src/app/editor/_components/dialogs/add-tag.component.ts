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
    selector: "add-tag-dialog",
    templateUrl: "add-tag.component.html",
    styleUrls: ["add-tag.component.css"]
})
export class AddTagDialogComponent {

    @Output() onAdd: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("addTagModal") addTagModal: QueryList<ModalDirective>;
    @ViewChildren("addTagInput") addTagInput: QueryList<ElementRef>;

    private _isOpen: boolean = false;

    tag: string = "";
    description: string = "";

    tags: string[] = [];
    tagExists: boolean = false;

    /**
     * Called to open the dialog.
     */
    public open(document: OasDocument, tag?: string): void {
        this.tag = tag;
        if (!tag) {
            this.tag = "";
        }
        this._isOpen = true;
        this.addTagModal.changes.subscribe( () => {
            if (this.addTagModal.first) {
                this.addTagModal.first.show();
            }
        });

        this.tags = [];
        this.tagExists = false;
        if (document.tags) {
            document.tags.forEach( tag => {
                this.tags.push(tag.name);
            });
        }
    }

    /**
     * Called to close the dialog.
     */
    close(): void {
        this._isOpen = false;
        this.tag = "";
        this.description = "";
    }

    /**
     * Called when the user clicks "add".
     */
    add(): void {
        let tagInfo: any = {
            name: this.tag,
            description: this.description
        };
        this.onAdd.emit(tagInfo);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.addTagModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Called to initialize the selection/focus to the addTagInput field.
     */
    doSelect(): void {
        this.addTagInput.first.nativeElement.focus();
    }

}
