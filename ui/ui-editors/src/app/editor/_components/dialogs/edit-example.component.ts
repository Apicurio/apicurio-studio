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
import {Oas30Example, Oas30Schema} from "@apicurio/data-models";
import {ModelUtils} from "../../_util/model.util";
import {ObjectUtils, StringUtils} from "apicurio-ts-core";
import {CodeEditorComponent, CodeEditorMode, CodeEditorTheme} from "../common/code-editor.component";


export interface EditExampleEvent {
    example: Oas30Example;
    value: any;
}

@Component({
    selector: "edit-example-dialog",
    templateUrl: "edit-example.component.html",
    styleUrls: [ "edit-example.component.css" ]
})
export class EditExampleDialogComponent {

    @Input() schema: Oas30Schema;
    @Output() onEdit: EventEmitter<EditExampleEvent> = new EventEmitter<EditExampleEvent>();

    @ViewChildren("editExampleModal") editExampleModal: QueryList<ModalDirective>;
    @ViewChildren("codeEditor") codeEditor: QueryList<CodeEditorComponent>;

    private example: Oas30Example;
    private _isOpen: boolean = false;

    model: any = {
        value: null,
        format: CodeEditorMode.JSON,
        valid: true
    };

    get value() {
        return this.model.value;
    }
    set value(value: string) {
        this.setValueFormatFromValue(value);
        this.model.value = value;
    }

    /**
     * Called to open the dialog.
     * @param example
     */
    public open(example: Oas30Example): void {
        this._isOpen = true;
        this.example = example;
        this.model = {
            value: null,
            format: CodeEditorMode.JSON,
            valid: true
        };

        let val: any = example.value;
        if (typeof val === "object" || Array.isArray(val)) {
            val = JSON.stringify(val, null, 4);
        }

        this.model.value = val;
        this.setValueFormatFromValue(val);

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
            value: this.model.value
        };

        // Convert to jsobject if the data is JSON and is valid
        if (this.model.valid && this.model.format === CodeEditorMode.JSON) {
            try {
                event.value = JSON.parse(this.model.value);
            } catch (e) {
                console.error("[EditExampleDialogComponent] Failed to parse example.");
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
        return !ObjectUtils.isNullOrUndefined(this.model.value);
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

    canGenerateExample(): boolean {
        return this.schema !== null && this.schema !== undefined;
    }

    generate(): void {
        let example: any = ModelUtils.generateExampleFromSchema(this.schema);
        let exampleStr: string = JSON.stringify(example, null, 4);
        this.codeEditor.first.setText(exampleStr);
    }

}
