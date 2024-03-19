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
import {AceEditorComponent} from "./ace-editor.component";
import {Debouncer} from "apicurio-ts-core";


export enum CodeEditorTheme {
    Light, Dark
}

export enum CodeEditorMode {
    Text, JSON, YAML, Markdown, XML, GRAPHQL
}

@Component({
    selector: "code-editor",
    templateUrl: "code-editor.component.html",
    encapsulation: ViewEncapsulation.None
})
export class CodeEditorComponent {

    private static DEFAULT_DEBOUNCE_TIME: number = 200;

    @ViewChild("editor", { static: true }) public editor: AceEditorComponent;

    private _textValueDebouncer: Debouncer<string> = new Debouncer<string>({ period: 200 }, value => {
        this.textChange.emit(value);
    });

    @Input() theme: CodeEditorTheme = CodeEditorTheme.Light;
    @Input() mode: CodeEditorMode = CodeEditorMode.Text;
    @Input() editorStyle: any;
    @Input() wordWrap: boolean = false;

    @Input()
    get text() {
        return this._textValueDebouncer.getValue();
    }

    @Output() public textChange = new EventEmitter<string>();
    set text(value: string) {
        this._textValueDebouncer.emit(value);
    }

    @Input()
    get debounceTime() {
        return this._textValueDebouncer["options"].period;
    }
    set debounceTime(time: number) {
        let bounce: number = time;
        if (!bounce) {
            bounce = CodeEditorComponent.DEFAULT_DEBOUNCE_TIME;
        }
        this._textValueDebouncer["options"].period = bounce;
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
            case CodeEditorMode.GRAPHQL:
                return 'graphqlschema';
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

    public focus(): void {
        this.editor.focus();
    }

    public setText(text: string): void {
        this.editor.setText(text);
    }
}
