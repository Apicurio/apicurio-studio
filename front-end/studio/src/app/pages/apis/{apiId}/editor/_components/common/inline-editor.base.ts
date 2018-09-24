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
import {TimerObservable} from "rxjs/observable/TimerObservable";


/**
 * Base class for all inline editors.
 */
export abstract class AbstractInlineEditor<T> {

    static s_activeEditor: any = null;

    @Input() enabled = true;
    @Input() labelClass = "";
    @Input() inputClass = "";
    @Input() formClass = "";

    @Output() onChange: EventEmitter<T> = new EventEmitter<T>();

    public editing: boolean = false;
    public canClose: boolean = false;

    public inputFocus: boolean = false;

    public evalue: T;

    public onStartEditing(): void {
        if (!this.enabled) {
            return;
        }
        this.canClose = false;
        this.evalue = this.initialValueForEditing();
        this.inputFocus = true;
        this.editing = true;

        if (AbstractInlineEditor.s_activeEditor != null && AbstractInlineEditor.s_activeEditor !== this) {
            AbstractInlineEditor.s_activeEditor.onCancel();
        }
        AbstractInlineEditor.s_activeEditor = this;

        // TODO watch for changes to children rather than simply wait 250ms??
        TimerObservable.create(250).subscribe(() => {
            this.canClose = true;
        });
    }

    protected abstract initialValueForEditing(): T;

    public onSave(): void {
        let value: T = this.getValueForSave();
        this.onChange.emit(value);
        this.editing = false;
        AbstractInlineEditor.s_activeEditor = this;
    }

    protected getValueForSave(): T {
        return this.evalue;
    }

    public onCancel(): void {
        this.editing = false;
        AbstractInlineEditor.s_activeEditor = this;
        this.evalue = this.initialValueForEditing();
    }

    public onInputKeypress(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            this.onCancel();
        }
    }

    public onInputFocus(isFocus: boolean): void {
        if (this.inputFocus !== isFocus) {
            this.inputFocus = isFocus;
        }
    }

}



/**
 * Base class for any inline editor that edits a single value of an arbitrary type.
 */
export abstract class AbstractInlineValueEditor<T> extends AbstractInlineEditor<T> {

    @Input() value: T;
    @Input() noValueMessage: string;

    protected displayValue(): string {
        if (this.isEmpty()) {
            return this.noValueMessage;
        }
        return this.formatValue(this.value);
    }

    protected abstract formatValue(value: T): string;

    protected isEmpty(): boolean {
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
export abstract class TextInputEditorComponent extends AbstractInlineValueEditor<string> implements AfterViewInit {

    @ViewChildren("newvalue") input: QueryList<ElementRef>;

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
export abstract class TextAreaEditorComponent extends TextInputEditorComponent {

    public onInputKeypress(event: KeyboardEvent): void {
        super.onInputKeypress(event);

        if (event.ctrlKey && event.key === "Enter" && this.isValid()) {
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
