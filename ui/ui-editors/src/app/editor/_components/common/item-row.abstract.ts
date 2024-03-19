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

import {AbstractBaseComponent} from "./base-component";
import { ChangeDetectorRef, Input, SimpleChanges, Directive } from "@angular/core";
import {OasDocument, Node} from "@apicurio/data-models";
import {DocumentService} from "../../_services/document.service";
import {SelectionService} from "../../_services/selection.service";
import {ModelUtils} from "../../_util/model.util";

@Directive()
export abstract class AbstractRowComponent<T extends Node, M> extends AbstractBaseComponent {

    @Input() item: T;

    protected _editing: boolean = false;
    protected _tab: string = "";
    protected _model: M = null;

    protected constructor(changeDetectorRef: ChangeDetectorRef, documentService: DocumentService,
                selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected onDocumentChange(): void {
        this.updateModel();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (changes["item"]) {
            this.updateModel();
        }
    }

    protected abstract updateModel(): void;

    public model(): M {
        return this._model;
    }

    public document(): OasDocument {
        return <OasDocument> this.item.ownerDocument();
    }

    public isEditing(): boolean {
        return this._editing;
    }

    public isEditingTab(tab: string): boolean {
        return this.isEditing() && this._tab === tab;
    }

    public toggleTab(tab: string): void {
        if (this.isEditing() && this._tab === tab) {
            this._editing = false;
        } else {
            this._editing = true;
            this._tab = tab;
        }
        // Either way, let's fire off a selection event, since we're clearly at least
        // looking at this element.
        let selectedPath: string = ModelUtils.nodeToPath(this.item);
        this.__selectionService.simpleSelect(selectedPath);
    }

}
