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

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    QueryList, SimpleChanges,
    ViewChildren,
    ViewEncapsulation
} from "@angular/core";
import {AbstractInlineEditor} from "./inline-editor.base";
import {AbstractBaseComponent} from "./base-component";
import {DocumentService} from "../../_services/document.service";
import {SelectionService} from "../../_services/selection.service";
import {Node} from "@apicurio/data-models";
import {ModelUtils} from "../../_util/model.util";
import {KeypressUtils} from "../../_util/keypress.util";

@Component({
    selector: "inline-array-editor",
    templateUrl: "inline-array-editor.component.html",
    styleUrls: ["inline-array-editor.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineArrayEditorComponent extends AbstractBaseComponent implements AfterViewInit {

    @Input() value: string[];
    @Input() noValueMessage: string;
    @Input() items: string[] | (()=>string[]);
    @Input() baseNode: Node;
    @Input() nodePath: string;

    @Output() onChange: EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

    @ViewChildren("newvalue") input: QueryList<ElementRef>;

    public editing: boolean = false;
    public evalue: string;
    public evalues: {};

    public firstEnter: boolean;
    public firstInputValue: boolean = true;

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param selectionService
     */
    constructor(changeDetectorRef: ChangeDetectorRef, documentService: DocumentService,
                selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (changes["value"]) {
            if (!this.firstInputValue) {
                this.onCancel();
            }
            this.firstInputValue = false;
        }
    }

    ngAfterViewInit(): void {
        this.input.changes.subscribe(changes => {
            if (changes.last && this.firstEnter) {
                changes.last.nativeElement.focus();
                changes.last.nativeElement.select();
                this.firstEnter = false;
            }
        });
    }

    public placeholderText(): string {
        if (this.hasItems()) {
            return "Enter a comma-separated list of values and/or select from known options below.";
        }
        return "Enter a comma-separated list of values.";
    }

    public onInputKeypress(event: KeyboardEvent): void {
        if (KeypressUtils.isEscapeKey(event)) {
            this.onCancel();
        }
        if (KeypressUtils.isEnterKey(event)) {
            this.onSave();
        }
    }

    isEmpty(): boolean {
        return this.value === undefined || this.value === null || this.value.length === 0;
    }

    public onStartEditing(): void {
        this.firstEnter = true;
        if (AbstractInlineEditor.s_activeEditor !== null && AbstractInlineEditor.s_activeEditor !== this) {
            AbstractInlineEditor.s_activeEditor.onCancel();
        }
        AbstractInlineEditor.s_activeEditor = this;

        this.editing = true;
        if (this.isEmpty()) {
            this.evalue = "";
            this.evalues = [];
        } else {
            this.evalue = this.adHocValues().join(", ");
            this.evalues = this.aprioriValues();
        }

        // If the baseNode and/or nodePath are set, then we want to fire a selection event
        // whenever the user starts editing.
        if (this.nodePath || this.baseNode) {
            let path: string = "";
            if (this.baseNode) {
                path = ModelUtils.nodeToPath(this.baseNode);
            }
            if (this.nodePath) {
                if (!this.nodePath.startsWith("/")) {
                    path += "/";
                }
                path += this.nodePath;
            }
            this.__selectionService.simpleSelect(path);
        }
        this.__changeDetectorRef.markForCheck();
    }

    private adHocValues(): string[] {
        if (this.value && this.value.length > 0) {
            let rval: string[] = [];
            this.value.forEach( value => {
                if ( (this.items === null || this.items === undefined) ||
                     (this.items && this.getItems().indexOf(value) === -1)) {
                    rval.push(value);
                }
            });
            return rval;
        } else {
            return [];
        }
    }

    private aprioriValues(): any {
        if (this.value && this.value.length > 0) {
            let rval: any = {};
            this.value.forEach( value => {
                if (this.items && this.getItems().indexOf(value) !== -1) {
                    rval[value] = true;
                }
            });
            return rval;
        } else {
            return {};
        }
    }

    public onSave(): void {
        let result: any = {};
        if (this.evalue && this.evalue.length > 0) {
            this.evalue.split(/[ ,]+/).forEach( val => result[val] = true);
        }
        if (this.evalues) {
            Object.keys(this.evalues).forEach( key => {
                if (this.evalues[key]) {
                    result[key] = true;
                }
            });
        }

        let newValue: string[] = Object.keys(result);
        this.editing = false;
        AbstractInlineEditor.s_activeEditor = null;
        this.onChange.emit(newValue);
    }

    public removeItem(item: string): void {
        let newValue: string[] = this.value.slice();
        let idx: number = newValue.indexOf(item);
        newValue.splice(idx, 1);
        this.onChange.emit(newValue);
    }

    public onCancel(): void {
        this.editing = false;
        AbstractInlineEditor.s_activeEditor = null;
        this.onClose.emit();
    }

    public clearValue(): void {
        this.evalue = "";
        this.evalues = {};
        this.input.last.nativeElement.focus();
        this.input.last.nativeElement.select();
    }

    public hasItems(): boolean {
        return this.items && this.getItems().length > 0;
    }

    public hasItem(item: string): boolean {
        return this.evalues && this.evalues[item];
    }

    public toggleItem(item: string): void {
        if (this.hasItem(item)) {
            this.evalues[item] = false;
        } else {
            this.evalues[item] = true;
        }
    }

    public getItems(): string[] {
        let t: string = typeof this.items;
        if (t === "function") {
            return (this.items as (()=>string[]))();
        } else {
            return this.items as string[];
        }
    }

}
