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

import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewChildren,
    ViewEncapsulation
} from "@angular/core";
import {AbstractInlineEditor, AbstractInlineValueEditor} from "./inline-editor.base";
import {AbstractBaseComponent} from "./base-component";
import {DocumentService} from "../../_services/document.service";
import {SelectionService} from "../../_services/selection.service";
import {OasNode} from "oai-ts-core";
import {ModelUtils} from "../../_util/model.util";
import {KeypressUtils} from "../../_util/keypress.util";

@Component({
    moduleId: module.id,
    selector: "inline-array-editor",
    templateUrl: "inline-array-editor.component.html",
    styleUrls: ["inline-array-editor.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineArrayEditorComponent extends AbstractInlineValueEditor<string[], string> implements AfterViewInit {

    /**
     * Source of predefined items
     */
    @Input() items: string[] | (()=>string[]);

    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

    @ViewChildren("newvalue") input: QueryList<ElementRef>;


     /**
      * A map from predefined items to booleans,
      * the value is true if the predefined item has been selected,
      * so it can be excluded from the evalue.
      */
    public evalues: object = {};


    public firstEnter: boolean;

    constructor(changeDetectorRef: ChangeDetectorRef, documentService: DocumentService,
                selectionService: SelectionService) {
        super(/*changeDetectorRef, documentService, */selectionService);
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
        super.onInputKeypress(event)
        if (KeypressUtils.isEnterKey(event)) {
            this.onSave();
        }
    }

    protected isEmpty(): boolean {
        return super.isEmpty() || this.value.length === 0;
    }

    public onStartEditing(): void {
        super.onStartEditing()
        this.firstEnter = true;
    }


    // override
    protected editorValueToValue(editorValue: string): string[] {
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
        return Object.keys(result);
    }

    // override
    protected valueToEditorValue(value: string[]): string {
        if (this.value && this.value.length > 0) {
            let rval: any = {};
            this.value.forEach( value => {
                if (this.items && this.getItems().indexOf(value) !== -1) { // if the itemin values is also in apriori
                    rval[value] = true;
                }
            });
            this.evalues = rval;
        } else {
            this.evalues = {};
        }
        if (this.value && this.value.length > 0) {
            let rval: string[] = [];
            this.value.forEach( value => {
                if ((this.items && this.getItems().indexOf(value) === -1)) {
                    rval.push(value);
                }
            });
            return rval.join(", ");
        } else {
            return "";
        }
    }

    public removeItem(item: string): void {
        let newValue: string[] = this.value.slice();
        let idx: number = newValue.indexOf(item);
        newValue.splice(idx, 1);
        this.onChange.emit(newValue);
    }

    public onCancel(): void {
        super.onCancel()
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

    /**
     * Is the argument a selected predefined item?
     */
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
