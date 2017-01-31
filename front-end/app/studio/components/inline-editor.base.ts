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

import {EventEmitter, Output, Input, AfterViewInit, ViewChildren, QueryList, ElementRef} from '@angular/core';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Subscription} from "rxjs";


/**
 * Base class for all inline editors.
 */
export abstract class AbstractInlineEditor<T> {

    @Input() enabled = true;
    @Output() onChange: EventEmitter<T> = new EventEmitter<T>();

    private _mousein: boolean = false;
    private _hoverSub: Subscription;
    private _hoverElem: any;

    public hovering: boolean = false;
    public editing: boolean = false;
    public hoverDims: any = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
    };

    public inputHover: boolean = false;
    public inputFocus: boolean = false;

    public evalue: T;

    public onMouseIn(event: MouseEvent): void {
        if (this.editing || !this.enabled) {
            return;
        }
        this._mousein = true;
        this._hoverElem = event.currentTarget;
        this._hoverSub = TimerObservable.create(100).subscribe(() => {
            if (this._mousein) {
                let target: any = this._hoverElem;
                let targetRect: any = target.getBoundingClientRect();
                this.hoverDims = this.calcHoverDimensions(targetRect);
                this.hovering = true;
            }
        });
    }

    public onMouseOut(): void {
        if (this.editing) {
            return;
        }
        if (this._mousein && !this.hovering) {
            this.hovering = false;
        }
        if (this._hoverSub) {
            this._hoverSub.unsubscribe();
            this._hoverSub = null;
        }
        this._mousein = false;
    }

    public onOverlayOut(): void {
        if (this.hovering) {
            this.hovering = false;
            this._mousein = false;
        }
    }

    public onStartEditing(): void {
        this.evalue = this.initialValueForEditing();
        this.hovering = false;
        this._mousein = false;
        this.inputFocus = true;
        this.inputHover = true;
        this.editing = true;
    }

    protected abstract initialValueForEditing(): T;

    public onSave(): void {
        this.onChange.emit(this.evalue);
        this.editing = false;
    }

    public onCancel(): void {
        this.editing = false;
        this.evalue = this.initialValueForEditing();
    }

    public onInputKeypress(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.onCancel();
        }
    }

    public onInputFocus(isFocus: boolean): void {
        if (this.inputFocus !== isFocus) {
            this.inputFocus = isFocus;
        }
    }

    public onInputIn(isIn: boolean): void {
        if (this.inputHover !== isIn) {
            this.inputHover = isIn;
        }
    }

    protected calcHoverDimensions(targetRect: any): any {
        return {
            left: targetRect.left - 5,
            top: targetRect.top,
            width: targetRect.right - targetRect.left + 10 + 20,
            height: targetRect.bottom - targetRect.top + 3
        }
    }

}


/**
 * Base class for any inline editor that is built on a single text input element.  The template
 * must include an 'input' element named #newvalue.
 */
export abstract class TextInputEditorComponent extends AbstractInlineEditor<string> implements AfterViewInit {

    @Input() value: string;
    @Input() noValueMessage: string;

    @ViewChildren("newvalue") input: QueryList<ElementRef>;

    ngAfterViewInit(): void {
        this.input.changes.subscribe(changes => {
            if (changes.last) {
                changes.last.nativeElement.focus();
                changes.last.nativeElement.select();
            }
        });
    }

    protected displayValue(): string {
        if (!this.value) {
            return this.noValueMessage;
        }
        return this.value;
    }

    protected initialValueForEditing(): string {
        return this.value;
    }

}


/**
 * Base class for any inline editor that is built on a single textarea element.  The template
 * must include a 'textarea' element named #newvalue.
 */
export abstract class TextAreaEditorComponent extends AbstractInlineEditor<string> implements AfterViewInit {

    @Input() value: string;
    @Input() noValueMessage: string;

    @ViewChildren("newvalue") textarea: QueryList<ElementRef>;

    ngAfterViewInit(): void {
        this.textarea.changes.subscribe(changes => {
            if (changes.last) {
                changes.last.nativeElement.focus();
                changes.last.nativeElement.select();
            }
        });
    }

    protected displayValue(): string {
        if (!this.value) {
            return this.noValueMessage;
        }
        return this.value;
    }

    public onInputKeypress(event: KeyboardEvent): void {
        super.onInputKeypress(event);

        if (event.ctrlKey && event.key === "Enter" && this.isValid()) {
            this.onSave();
        }
    }

    /**
     * Subclasses can override this to provide validation status of the current value.
     * @return {boolean}
     */
    protected isValid(): boolean {
        return true;
    }

    protected initialValueForEditing(): string {
        return this.value;
    }

    protected calcHoverDimensions(targetRect: any): any {
        let dims: any = super.calcHoverDimensions(targetRect);
        dims.top = dims.top - 2;
        dims.height += 2;
        return dims;
    }

}
