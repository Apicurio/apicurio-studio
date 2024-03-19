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

import {AfterViewInit, Component, QueryList, ViewChildren, ViewEncapsulation} from "@angular/core";
import {TextAreaEditorComponent} from "./inline-editor.base";
import {SelectionService} from "../../_services/selection.service";
import {CodeEditorComponent, CodeEditorMode} from "./code-editor.component";

@Component({
    selector: "inline-markdown-editor",
    templateUrl: "inline-markdown-editor.component.html",
    styleUrls: [ "inline-markdown-editor.component.css" ],
    encapsulation: ViewEncapsulation.None
})
export class InlineMarkdownEditorComponent extends TextAreaEditorComponent implements AfterViewInit {

    @ViewChildren("codeEditor") codeEditor: QueryList<CodeEditorComponent>;

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

    public codeEditorMode(): CodeEditorMode {
        return CodeEditorMode.Markdown;
    }

    protected getValueForSave(): string {
        return this.codeEditor.first.text;
    }

}
