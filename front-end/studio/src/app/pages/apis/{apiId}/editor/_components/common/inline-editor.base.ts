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

import {AfterViewInit, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren} from "@angular/core";
import {SelectionService} from "../../_services/selection.service";
import {OasNode} from "oai-ts-core";
import {ModelUtils} from "../../_util/model.util";
import {KeypressUtils} from "../../_util/keypress.util";


/**
 * Base class for all inline editors.
 */
export abstract class AbstractInlineEditor {


    static s_activeEditor: any = null; // TODO move
}

/**
 * Base class for any inline editor that edits a single value of an arbitrary type.
 *
 * @template T type of the internal value being edited
 *             (derived from the "evalue")
 * @template EV type of the value for visual representation in the active editor,
 *              (user actally edits this)
 */
export abstract class AbstractInlineValueEditor<T, EV> extends AbstractInlineEditor {

    @Input() value: T;
    @Input() noValueMessage: string;


    @Input() enabled = true;
    @Input() labelClass = "";
    @Input() inputClass = "";
    @Input() formClass = "";

    @Input() baseNode: OasNode;
    @Input() nodePath: string;

    @Output() onChange: EventEmitter<T> = new EventEmitter<T>();

    public editing: boolean = false;

    public inputFocus: boolean = false;

    /**
     * Current value in the edit area
     */
    public evalue: EV;

    protected constructor(protected selectionService: SelectionService) {
        super()
    }

    private fireSelectionEvent(): void {
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
    }

    private ensureSingleActiveEditor(): void {
        if (AbstractInlineEditor.s_activeEditor != null && AbstractInlineEditor.s_activeEditor !== this) {
            AbstractInlineEditor.s_activeEditor.onCancel();
        }
        AbstractInlineEditor.s_activeEditor = this;
    }

    public onStartEditing(): void {
        if (!this.enabled) { // TODO support overriding
            return;
        }

        // If the baseNode and/or nodePath are set, then we want to fire a selection event
        // whenever the user starts editing.
        this.fireSelectionEvent()

        this.evalue = this.valueToEditorValue(this.value);
        this.inputFocus = true;
        this.editing = true;

        this.ensureSingleActiveEditor()
    }


    public onSave(): void {
        this.value = this.editorValueToValue(this.evalue)
        this.onChange.emit(this.value);
        this.editing = false;
        AbstractInlineEditor.s_activeEditor = null;
    }

    /**
     * Transform the internal value to something user can edit,
     * usually a string.
     */
    protected abstract valueToEditorValue(value: T): EV;

    /**
     * Transform edited value into the internal representation.
     */
    protected abstract editorValueToValue(editorValue: EV): T;

    public onCancel(): void {
        this.editing = false;
        AbstractInlineEditor.s_activeEditor = null;
    }

    public onInputKeypress(event: KeyboardEvent): void {
        if (this.isEscapeKey(event)) {
            this.onCancel();
        }
    }

    public onInputFocus(isFocus: boolean): void {
        this.inputFocus = isFocus;
    }

    protected isEscapeKey(event: KeyboardEvent): boolean {
        return KeypressUtils.isEscapeKey(event);
    }

    protected isEnterKey(event: KeyboardEvent): boolean {
        return KeypressUtils.isEnterKey(event);
    }

    protected isEmpty(): boolean {
        return this.value === undefined || this.value === null;
    }
}

/**
 * Base class for any inline editor that is built on a single text input element.  The template
 * must include an 'input' element named #newvalue.
 */
export abstract class TextInputEditorComponent extends AbstractInlineValueEditor<string, string> implements AfterViewInit {

    @ViewChildren("newvalue") input: QueryList<ElementRef>;

    protected constructor(selectionService: SelectionService) {
        super(selectionService);
    }

    ngAfterViewInit(): void {
        this.input.changes.subscribe(changes => {
            if (changes.last) {
                changes.last.nativeElement.focus();
                changes.last.nativeElement.select();
            }
        });
    }

    protected isEmpty(): boolean {
        return super.isEmpty() || this.value.length === 0;
    }

    protected displayValue(): string {
        if (this.isEmpty()) {
            return this.noValueMessage;
        }
        return this.formatValue(this.value);
    }

    protected formatValue(value: string): string {
        return value;
    }

    // override
    protected editorValueToValue(editorValue: string): string {
        let val: string = this.evalue;
        if (val) {
            val = val.trim();
        }
        if (!val || val.length === 0) {
            val = null;
        }
        return val;
    }

    // overide
    protected valueToEditorValue(value: string): string {
        return value;
    }

}


/**
 * Base class for any inline editor that is built on a single textarea element.  The template
 * must include a 'textarea' element named #newvalue.
 */
export abstract class TextAreaEditorComponent extends TextInputEditorComponent {

    constructor(selectionService: SelectionService) {
        super(selectionService);
    }

    public onInputKeypress(event: KeyboardEvent): void {
        super.onInputKeypress(event);

        if (KeypressUtils.isCtrlEnterKey(event) && this.isValid()) {
            this.onSave();
        }
    }

    /**
     * Subclasses can override this to provide validation status of the current value.
     * @return
     */
    protected isValid(): boolean {
        return true;
    }

}
