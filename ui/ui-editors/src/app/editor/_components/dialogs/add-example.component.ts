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

import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap/modal";
import * as YAML from 'js-yaml';
import {Oas30Schema} from "@apicurio/data-models";
import {ModelUtils} from "../../_util/model.util";
import {ObjectUtils, StringUtils} from "apicurio-ts-core";
import {CodeEditorComponent, CodeEditorMode, CodeEditorTheme} from "../common/code-editor.component";


@Component({
    selector: "add-example-dialog",
    templateUrl: "add-example.component.html",
    styleUrls: [ "add-example.component.css" ]
})
export class AddExampleDialogComponent {

    @Input() schema: Oas30Schema;
    @Output() onAdd: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("addExampleModal") addExampleModal: QueryList<ModalDirective>;
    @ViewChildren("codeEditor") codeEditor: QueryList<CodeEditorComponent>;

    private _isOpen: boolean = false;

    model: any = {
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
                YAML.safeLoad(value);
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
    close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "add".
     */
    add(): void {
        let event: any = {
            name: this.model.name,
            value: this.model.value
        };

        // Convert to jsobject if the data is JSON and is valid
        if (this.model.valid && this.model.format === CodeEditorMode.JSON) {
            try {
                event.value = JSON.parse(this.model.value)
            } catch (e) { // should never happen!
                console.error("[AddExampleDialogComponent] Failed to parse example.");
            }
        }

        this.onAdd.emit(event);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.addExampleModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    isOpen(): boolean {
        return this._isOpen;
    }

    valueEditorTheme(): CodeEditorTheme {
        return CodeEditorTheme.Light;
    }

    valueEditorMode(): CodeEditorMode {
        return this.model.format;
    }

    hasValue(): boolean {
        return !ObjectUtils.isNullOrUndefined(this.model.value);
    }

    canGenerateExample(): boolean {
        return this.schema !== null && this.schema !== undefined;
    }

    generate(): void {
        let example: any = ModelUtils.generateExampleFromSchema(this.schema);
        let exampleStr: string = JSON.stringify(example, null, 4);
        this.codeEditor.first.setText(exampleStr);
    }

}
