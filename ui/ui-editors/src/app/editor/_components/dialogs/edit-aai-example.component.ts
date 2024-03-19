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
import {ObjectUtils, StringUtils} from "apicurio-ts-core";
import {CodeEditorComponent, CodeEditorMode, CodeEditorTheme} from "../common/code-editor.component";
import * as YAML from 'js-yaml';
import {Aai20Schema} from "@apicurio/data-models";
import {ModelUtils} from "../../_util/model.util";


export interface EditExampleEvent {
    example: any;
    payloadValue: any;
    headersValue: any;
}

@Component({
    selector: "edit-aai-example-dialog",
    templateUrl: "edit-aai-example.component.html",
    styleUrls: [ "edit-aai-example.component.css" ]
})
export class EditAsyncApiExampleDialogComponent {

    @Input() payloadSchema: Aai20Schema;
    @Input() headersSchema: Aai20Schema;
    @Output() onEdit: EventEmitter<EditExampleEvent> = new EventEmitter<EditExampleEvent>();

    @ViewChildren("editExampleModal") editExampleModal: QueryList<ModalDirective>;
    @ViewChildren("payloadCodeEditor") payloadCodeEditor: QueryList<CodeEditorComponent>;
    @ViewChildren("headersCodeEditor") headersCodeEditor: QueryList<CodeEditorComponent>;

    private example: any;
    private _isOpen: boolean = false;

    model: any = {
        payloadValue: null,
        headersValue: null,
        format: CodeEditorMode.JSON,
        valid: true
    };

    get payloadValue() {
        return this.model.payloadValue;
    }
    get headersValue() {
        return this.model.headersValue;
    }

    set payloadValue(value: string) {
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
        this.model.payloadValue = value;
    }
    set headersValue(value: string) {
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
        this.model.headersValue = value;
    }

    /**
     * Called to open the dialog.
     * @param example
     */
    public open(example: any): void {
        this._isOpen = true;
        this.example = example;
        this.model = {
            payloadValue: null,
            headersValue: null,
            format: CodeEditorMode.JSON,
            valid: true
        };

        // Try to detect if it's an example created with Apicurio (name is
        // the only first key) or generic example.
        if (Object.keys(example).length == 1) {
            let name: string = Object.keys(example)[0];
            let pvalue: any = example[name].payload;
            if (typeof pvalue === "object" || Array.isArray(pvalue)) {
                pvalue = JSON.stringify(pvalue);
            }
            this.model.payloadValue = pvalue;
            this.setValueFormatFromValue(pvalue);

            let hvalue: any = example[name].headers;
            if (typeof hvalue === "object" || Array.isArray(hvalue)) {
                hvalue = JSON.stringify(hvalue);
            }
            this.model.headersValue = hvalue;
        } else {
            let val: any = example;
            if (typeof val === "object" || Array.isArray(val)) {
                val = JSON.stringify(val, null, 4);
            }
            this.model.value = val;
            this.setValueFormatFromValue(val);
        }

        this.editExampleModal.changes.subscribe( () => {
            if (this.editExampleModal.first) {
                this.editExampleModal.first.show();
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
     * Called when the user clicks "edit".
     */
    edit(): void {
        let event: EditExampleEvent = {
            example: this.example,
            payloadValue: this.model.payloadValue,
            headersValue: this.model.headersValue,
        };

        // Convert to jsobject if the data is JSON and is valid
        if (this.model.valid && this.model.format === CodeEditorMode.JSON) {
            try {
                event.payloadValue = JSON.parse(this.model.payloadValue);
                event.headersValue = JSON.parse(this.model.headersValue);
            } catch (e) {
                console.error("[EditAsyncApiExampleDialogComponent] Failed to parse example.");
            }
        }
        this.onEdit.emit(event);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.editExampleModal.first.hide();
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
        return !ObjectUtils.isNullOrUndefined(this.model.payloadValue);
    }

    /**
     * @param value
     */
    private setValueFormatFromValue(value: string): void {
        if (StringUtils.isJSON(value)) {
            this.model.format = CodeEditorMode.JSON;
            try {
                JSON.parse(value);
                this.model.valid = true;
            } catch (e) {}
        } else if (StringUtils.isXml(value)) {
            this.model.format = CodeEditorMode.XML;
        } else {
            this.model.format = CodeEditorMode.YAML;
            try {
                YAML.safeLoad(value);
                this.model.valid = true;
            } catch (e) {}
        }
    }

    canGeneratePayloadExample(): boolean {
        return this.payloadSchema !== null && this.payloadSchema !== undefined;
    }
    canGenerateHeadersExample(): boolean {
        return this.headersSchema !== null && this.headersSchema !== undefined;
    }

    generatePayload(): void {
        let example: any = ModelUtils.generateExampleFromSchema(this.payloadSchema);
        let exampleStr: string = JSON.stringify(example, null, 4);
        this.payloadCodeEditor.first.setText(exampleStr);
    }
    generateHeaders(): void {
        let example: any = ModelUtils.generateExampleFromSchema(this.headersSchema);
        let exampleStr: string = JSON.stringify(example, null, 4);
        this.headersCodeEditor.first.setText(exampleStr);
    }

}
