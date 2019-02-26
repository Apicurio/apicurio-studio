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

import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";
import {
    CodeEditorComponent,
    CodeEditorMode,
    CodeEditorTheme
} from "../../../../../../components/common/code-editor.component";
import {ObjectUtils} from "../../../../../../util/common";
import * as YAML from "yamljs";
import {Oas30Schema} from "oai-ts-core";
import {ModelUtils} from "../../_util/model.util";
import {StringUtils} from "apicurio-ts-core";


@Component({
    moduleId: module.id,
    selector: "add-example-dialog",
    templateUrl: "add-example.component.html",
    styleUrls: [ "add-example.component.css" ]
})
export class AddExampleDialogComponent {

    @Input() schema: Oas30Schema;
    @Output() onAdd: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("addExampleModal") addExampleModal: QueryList<ModalDirective>;
    @ViewChildren("codeEditor") codeEditor: QueryList<CodeEditorComponent>;

    protected _isOpen: boolean = false;

    protected model: any = {
        name: null,
        value: null,
        format: CodeEditorMode.JSON,
        valid: true
    };

    get value() {
        return this.model.value;
    }

    set value(value: string) {
        if (StringUtils.isJSON(value)) {
            this.model.format = CodeEditorMode.JSON;
            try {
                JSON.parse(value);
                this.model.valid = true;
            } catch (e) {
            }
        } else if (StringUtils.isXml(value)) {
            this.model.format = CodeEditorMode.XML;
        } else {
            this.model.format = CodeEditorMode.YAML;
            try {
                YAML.parse(value);
                this.model.valid = true;
            } catch (e) {
            }
        }
        this.model.value = value;
    }

    /**
     * Called to open the dialog.
     */
    public open(): void {
        this._isOpen = true;
        this.model = {
            name: null,
            value: null,
            format: CodeEditorMode.JSON,
            valid: true
        };

        this.addExampleModal.changes.subscribe(() => {
            if (this.addExampleModal.first) {
                this.addExampleModal.first.show();
            }
        });
    }

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "add".
     */
    protected add(): void {
        let event: any = {
            name: this.model.name,
            value: this.model.value
        };
        // TODO investigate whether to restore this functionality (treat JSON data differently)
        // if (this.model.valid && this.model.format === CodeEditorMode.JSON) {
        //     try {
        //         event.value = JSON.parse(this.model.value)
        //     } catch (e) {
        //         console.error("[AddExampleDialogComponent] Failed to parse example.");
        //     }
        // }
        this.onAdd.emit(event);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.addExampleModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    public valueEditorTheme(): CodeEditorTheme {
        return CodeEditorTheme.Light;
    }

    public valueEditorMode(): CodeEditorMode {
        return this.model.format;
    }

    public hasValue(): boolean {
        return !ObjectUtils.isNullOrUndefined(this.model.value);
    }

    public canGenerateExample(): boolean {
        return this.schema !== null && this.schema !== undefined;
    }

    public generate(): void {
        let example: any = ModelUtils.generateExampleFromSchema(this.schema);
        let exampleStr: string = JSON.stringify(example, null, 4);
        this.codeEditor.first.setText(exampleStr);
    }

}
