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

import {AfterViewInit, Component, Input, QueryList, ViewChildren, ViewEncapsulation} from "@angular/core";
import {TextAreaEditorComponent} from "./inline-editor.base";
import {OasSchema} from "@apicurio/data-models";
import {ModelUtils} from "../../_util/model.util";
import {SelectionService} from "../../_services/selection.service";
import {StringUtils} from "apicurio-ts-core";
import {CodeEditorComponent, CodeEditorMode} from "./code-editor.component";

@Component({
    selector: "inline-example-editor",
    templateUrl: "inline-example-editor.component.html",
    styleUrls: [ "inline-example-editor.component.css" ],
    encapsulation: ViewEncapsulation.None
})
export class InlineExampleEditorComponent extends TextAreaEditorComponent implements AfterViewInit {

    @Input() schema: OasSchema;

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


    public codeEditorMode(): CodeEditorMode {
        return this._mode;
    }

    public canGenerateExample(): boolean {
        return this.schema !== null && this.schema !== undefined;
    }

    public generate(): void {
        let example: any = ModelUtils.generateExampleFromSchema(this.schema);
        let exampleStr: string = JSON.stringify(example, null, 4);
        this.codeEditor.first.setText(exampleStr);
    }

    public updateModeFromContent(text: string): void {
        if (StringUtils.isJSON(text)) {
            this._mode = CodeEditorMode.JSON;
        } else if (StringUtils.isXml(text)) {
            this._mode = CodeEditorMode.XML;
        } else {
            this._mode = CodeEditorMode.YAML;
        }
    }

}
