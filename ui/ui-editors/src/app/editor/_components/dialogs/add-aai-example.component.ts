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
import {Aai20Schema} from "@apicurio/data-models";
import {ModelUtils} from "../../_util/model.util";
import {ObjectUtils, StringUtils} from "apicurio-ts-core";
import {CodeEditorComponent, CodeEditorMode, CodeEditorTheme} from "../common/code-editor.component";


@Component({
    selector: "add-aai-example-dialog",
    templateUrl: "add-aai-example.component.html",
    styleUrls: [ "add-aai-example.component.css" ]
})
export class AddAsyncApiExampleDialogComponent {

    @Input() payloadSchema: Aai20Schema;
    @Input() headersSchema: Aai20Schema;
    @Output() onAdd: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("addExampleModal") addExampleModal: QueryList<ModalDirective>;
    @ViewChildren("payloadCodeEditor") payloadCodeEditor: QueryList<CodeEditorComponent>;
    @ViewChildren("headersCodeEditor") headersCodeEditor: QueryList<CodeEditorComponent>;

    private _isOpen: boolean = false;

    model: any = {
        name: null,
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
     */
    public open(): void {
        this._isOpen = true;
        this.model = {
            name: null,
            payloadValue: null,
            headersValue: null,
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
            payloadValue: this.model.payloadValue,
            headersValue: this.model.headersValue
        };

        // Convert to jsobject if the data is JSON and is valid
        if (this.model.valid && this.model.format === CodeEditorMode.JSON) {
            try {
                event.payloadValue = JSON.parse(this.model.payloadValue)
                event.headersValue = JSON.parse(this.model.headersValue)
            } catch (e) { // should never happen!
                console.error("[AddAsyncApiExampleDialogComponent] Failed to parse example.");
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
        return !ObjectUtils.isNullOrUndefined(this.model.payloadValue);
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
