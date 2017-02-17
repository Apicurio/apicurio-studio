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
    EventEmitter, Output, Input, AfterViewInit, ViewChildren, QueryList, ElementRef,
    ViewChild, HostListener
} from "@angular/core";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Subscription} from "rxjs";


/**
 * Base class for all inline editors.
 */
export abstract class AbstractInlineEditor<T> {

    static s_activeEditor: any = null;

    @Input() enabled = true;
    @Output() onChange: EventEmitter<T> = new EventEmitter<T>();

    @ViewChildren("clickcontainer") clickcontainer: QueryList<ElementRef>;

    private _mousein: boolean = false;
    private _hoverSub: Subscription;
    private _hoverElem: any;

    public hovering: boolean = false;
    public editing: boolean = false;
    public canClose: boolean = false;
    public hoverDims: any = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
    };

    public inputHover: boolean = false;
    public inputFocus: boolean = false;

    public evalue: T;

    @HostListener("document:click", ["$event"])
    public onDocumentClick(event: MouseEvent): void {
        if (this.clickcontainer && this.clickcontainer.first && this.clickcontainer.first.nativeElement) {
            if (!this.clickcontainer.first.nativeElement.contains(event.target) && this.canClose) {
                this.onCancel();
            } else {
            }
        }
    }

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

    public hoverTop(): string {
        return this.hoverDims.top + "px";
    }

    public hoverLeft(): string {
        return this.hoverDims.left + "px";
    }

    public hoverWidth(): string {
        return this.hoverDims.width + "px";
    }

    public hoverHeight(): string {
        return this.hoverDims.height + "px";
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
        this.canClose = false;
        this.evalue = this.initialValueForEditing();
        this.hovering = false;
        this._mousein = false;
        this.inputFocus = true;
        this.inputHover = true;
        this.editing = true;

        if (AbstractInlineEditor.s_activeEditor != null && AbstractInlineEditor.s_activeEditor !== this) {
            AbstractInlineEditor.s_activeEditor.onCancel();
        }
        AbstractInlineEditor.s_activeEditor = this;

        TimerObservable.create(250).subscribe(() => {
            this.canClose = true;
        });
    }

    protected abstract initialValueForEditing(): T;

    public onSave(): void {
        this.onChange.emit(this.evalue);
        this.editing = false;
        AbstractInlineEditor.s_activeEditor = this;
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

    protected formatValue(value: string): string {
        return value;
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
     * @return {boolean}
     */
    protected isValid(): boolean {
        return true;
    }

    protected calcHoverDimensions(targetRect: any): any {
        let dims: any = super.calcHoverDimensions(targetRect);
        dims.top = dims.top - 2;
        dims.height += 2;
        return dims;
    }

}
