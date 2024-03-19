/**
 * @license
 * Copyright 2021 Red Hat
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

import {AfterViewInit, Component, QueryList, ViewChildren, ViewEncapsulation} from "@angular/core";
import {TextAreaEditorComponent} from "./inline-editor.base";
import {SelectionService} from "../../_services/selection.service";
import {CodeEditorComponent, CodeEditorMode} from "./code-editor.component";

@Component({
    selector: "inline-json-editor",
    templateUrl: "inline-json-editor.component.html",
    styleUrls: [ "inline-json-editor.component.css" ],
    encapsulation: ViewEncapsulation.None
})
export class InlineJsonEditorComponent extends TextAreaEditorComponent implements AfterViewInit {

    @ViewChildren("codeEditor") codeEditor: QueryList<CodeEditorComponent>;

    _mode: CodeEditorMode = CodeEditorMode.JSON;

    constructor(selectionService: SelectionService) {
        super(selectionService);
    }

    ngAfterViewInit(): void {
        this.codeEditor.changes.subscribe(changes => {
            if (changes.last) {
                changes.last.focus();
            }
        });
    }

    displayValue(): string {
        if (this.isEmpty()) {
            return this.noValueMessage;
        }
        return this.formatValue(this.value);
    }

    protected formatValue(value: string): string {
        return value;
    }

    public codeEditorMode(): CodeEditorMode {
        return this._mode;
    }

}
