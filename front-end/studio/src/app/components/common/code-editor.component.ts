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

import {Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";
import {AceEditorComponent} from "./ace-editor.component";


export enum CodeEditorTheme {
    Light, Dark
}

export enum CodeEditorMode {
    Text, JSON, YAML, Markdown, XML
}


@Component({
    moduleId: module.id,
    selector: "code-editor",
    templateUrl: "code-editor.component.html",
    encapsulation: ViewEncapsulation.None
})
export class CodeEditorComponent {

    private static DEFAULT_DEBOUNCE_TIME: number = 200;

    @ViewChild("editor") public editor: AceEditorComponent;

    public _textValue: string;
    public _textValueDebouncer: Subject<string> = new Subject<string>();
    public _debounceTime: number;
    public _debouncerSubscription: Subscription;

    @Input() theme: CodeEditorTheme = CodeEditorTheme.Light;
    @Input() mode: CodeEditorMode = CodeEditorMode.Text;
    @Input() editorStyle: any;

    @Input()
    get text() {
        return this._textValue;
    }

    @Output() public textChange = new EventEmitter<string>();
    set text(value: string) {
        this._textValue = value;
        this._textValueDebouncer.next(this._textValue);
    }

    @Input()
    get debounceTime() {
        return this._debounceTime;
    }
    set debounceTime(time: number) {
        this._debounceTime = time;
        let bounce: number = this._debounceTime;
        if (!bounce) {
            bounce = CodeEditorComponent.DEFAULT_DEBOUNCE_TIME;
        }
        if (this._debouncerSubscription) {
            this._debouncerSubscription.unsubscribe();
        }
        this._debouncerSubscription = this._textValueDebouncer.debounceTime(bounce).subscribe( value => {
            this.textChange.emit(value);
        })
    }

    constructor() {
        this._debouncerSubscription = this._textValueDebouncer.debounceTime(CodeEditorComponent.DEFAULT_DEBOUNCE_TIME).subscribe( value => {
            this.textChange.emit(value);
        });
    }

    public aceMode(): string {
        switch (this.mode) {
            case CodeEditorMode.YAML:
                return 'yaml';
            case CodeEditorMode.JSON:
                return 'json';
            case CodeEditorMode.Text:
                return 'text';
            case CodeEditorMode.XML:
                return 'xml';
            case CodeEditorMode.Markdown:
                return 'markdown';
            default:
                return 'text';
        }
    }

    public aceTheme(): string {
        if (this.theme === CodeEditorTheme.Dark) {
            return "twilight";
        } else {
            return "eclipse";
        }
    }
}
