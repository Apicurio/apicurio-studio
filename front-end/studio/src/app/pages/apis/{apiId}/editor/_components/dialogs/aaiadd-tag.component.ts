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
import {ModalDirective} from "ngx-bootstrap/modal";
import {AaiMessageBase, AaiOperation, AaiOperationBase, Node, OasDocument} from "@apicurio/data-models";


@Component({
    selector: "aaiadd-tag-dialog",
    templateUrl: "aaiadd-tag.component.html",
    styleUrls: ["aaiadd-tag.component.css"]
})
export class AaiAddTagDialogComponent {

    @Output() onAdd: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("addTagModal") addTagModal: QueryList<ModalDirective>;
    @ViewChildren("addTagInput") addTagInput: QueryList<ElementRef>;

    private _isOpen: boolean = false;
    private _node: Node;

    tag: string = "";
    description: string = "";

    tags: string[] = [];
    tagExists: boolean = false;

    /**
     * Called to open the dialog.
     */
    public open(node: AaiOperationBase | AaiMessageBase, tag?: string): void {
        this._node = node;
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
        
        
        if (node.tags) {
            node.tags.forEach(tag => {
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

    public getItems(): string[] {
        if (this._node.ownerDocument().tags && this._node.ownerDocument().tags.length > 0) {
            let items: string[] = this._node.ownerDocument().tags.map(tagDef => tagDef.name).filter(tagName => !this.tags.includes(tagName));
            items.sort();
            return items;
        } else {
            return [];
        }
    }
    
    public hasItems(): boolean {
        return this.getItems().length > 0;
    }

    public hasItem(item: string): boolean {
        return this.tag && this.tag === item;
    }
    
    public toggleItem(item: string) {
        if (this.hasItem(item)) {
            this.tag = null;
        } else {
            this.tag = item;
        }
    }

}
