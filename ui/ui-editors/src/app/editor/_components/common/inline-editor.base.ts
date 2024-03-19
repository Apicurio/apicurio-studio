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

import { AfterViewInit, ElementRef, EventEmitter, Input, OnChanges, Output, QueryList, SimpleChanges, ViewChildren, Directive } from "@angular/core";
import {SelectionService} from "../../_services/selection.service";
import {Node} from "@apicurio/data-models";
import {ModelUtils} from "../../_util/model.util";
import {KeypressUtils} from "../../_util/keypress.util";


/**
 * Base class for all inline editors.
 */
@Directive()
export abstract class AbstractInlineEditor<T> {

    static s_activeEditor: any = null;

    @Input() enabled = true;
    @Input() labelClass = "";
    @Input() inputClass = "";
    @Input() formClass = "";

    @Input() baseNode: Node;
    @Input() nodePath: string;

    @Output() onChange: EventEmitter<T> = new EventEmitter<T>();

    public editing: boolean = false;

    public inputFocus: boolean = false;

    /**
     * Current value in the edit area
     */
    public evalue: T;

    protected constructor(protected selectionService: SelectionService) {}

    public onStartEditing(): void {
        if (!this.enabled) {
            return;
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
            this.selectionService.simpleSelect(path);
        }

        this.evalue = this.initialValueForEditing();
        this.inputFocus = true;
        this.editing = true;

        if (AbstractInlineEditor.s_activeEditor != null && AbstractInlineEditor.s_activeEditor !== this) {
            AbstractInlineEditor.s_activeEditor.onCancel();
        }
        AbstractInlineEditor.s_activeEditor = this;
    }

    protected abstract initialValueForEditing(): T;

    public onSave(): void {
        let value: T = this.getValueForSave();
        this.onChange.emit(value);
        this.editing = false;
        AbstractInlineEditor.s_activeEditor = null;
    }

    protected getValueForSave(): T {
        return this.evalue;
    }

    public onCancel(): void {
        this.editing = false;
        AbstractInlineEditor.s_activeEditor = null;
        this.evalue = this.initialValueForEditing();
    }

    isEditedValueEmpty(): boolean {
        return this.evalue === undefined || this.evalue === null;
    }

    public onInputKeypress(event: KeyboardEvent): void {
        if (this.isEscapeKey(event)) {
            this.onCancel();
        }
    }

    public onInputFocus(isFocus: boolean): void {
        if (this.inputFocus !== isFocus) {
            this.inputFocus = isFocus;
        }
    }

    protected isEscapeKey(event: KeyboardEvent): boolean {
        return KeypressUtils.isEscapeKey(event);
    }

    protected isEnterKey(event: KeyboardEvent): boolean {
        return KeypressUtils.isEnterKey(event);
    }

}



/**
 * Base class for any inline editor that edits a single value of an arbitrary type.
 */
@Directive()
export abstract class AbstractInlineValueEditor<T> extends AbstractInlineEditor<T> implements OnChanges {

    @Input() value: T;
    @Input() noValueMessage: string;

    protected constructor(selectionService: SelectionService) {
        super(selectionService);
    }

    ngOnChanges(changes: SimpleChanges): void {
        // If the @Input "value" changes, stop editing and throw away any changes!
        if (changes["value"]) {
            this.onCancel();
        }
    }

    displayValue(): string {
        if (this.isEmpty()) {
            return this.noValueMessage;
        }
        return this.formatValue(this.value);
    }

    protected abstract formatValue(value: T): string;

    isEmpty(): boolean {
        return this.value === undefined || this.value === null;
    }

    protected initialValueForEditing(): T {
        return this.value;
    }

}

/**
 * Base class for any inline editor that is built on a single text input element.  The template
 * must include an 'input' element named #newvalue.
 */
@Directive()
export abstract class TextInputEditorComponent extends AbstractInlineValueEditor<string> implements AfterViewInit {

    @ViewChildren("newvalue") input: QueryList<ElementRef>;

    /**
     * C'tor.
     * @param selectionService
     */
    protected constructor(selectionService: SelectionService) {
        super(selectionService);
    }

    ngAfterViewInit(): void {
        this.input.changes.subscribe(changes => {
            if (changes.last) {
                changes.last.nativeElement.focus();
            }
        });
    }

    isEmpty(): boolean {
        return super.isEmpty() || this.value.length === 0;
    }

    isEditedValueEmpty(): boolean {
        return super.isEditedValueEmpty() || this.evalue.length === 0;
    }

    protected formatValue(value: string): string {
        return value;
    }

    protected getValueForSave(): string {
        let val: string = this.evalue;
        if (val) {
            val = val.trim();
        }
        if (!val || val.length === 0) {
            val = null;
        }
        return val;
    }

}


/**
 * Base class for any inline editor that is built on a single textarea element.  The template
 * must include a 'textarea' element named #newvalue.
 */
@Directive()
export abstract class TextAreaEditorComponent extends TextInputEditorComponent {

    /**
     * C'tor.
     * @param selectionService
     */
    protected constructor(selectionService: SelectionService) {
        super(selectionService);
    }

    /**
     * Called when a keypress happens.
     * @param event
     */
    public onInputKeypress(event: KeyboardEvent): void {
        super.onInputKeypress(event);

        if (KeypressUtils.isCtrlEnterKey(event) && this.isValid()) {
            this.onSave();
        }
    }

    /**
     * Subclasses can override this to provide validation status of the current value.
     */
    protected isValid(): boolean {
        return true;
    }

}
