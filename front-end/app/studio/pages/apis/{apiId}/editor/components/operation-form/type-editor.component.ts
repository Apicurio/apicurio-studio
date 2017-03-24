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

import {Component, ViewEncapsulation, Input} from "@angular/core";
import {AbstractInlineValueEditor} from "../../../../../../components/inline-editor.base";
import {Oas20Schema, JsonSchemaType, Oas20Document} from "oai-ts-core";
import {ObjectUtils} from "../../../../../../util/common";


@Component({
    moduleId: module.id,
    selector: "type-editor-of",
    templateUrl: "type-editor.component.html",
    encapsulation: ViewEncapsulation.None
})
export class TypeEditorOFComponent extends AbstractInlineValueEditor<Oas20Schema> {

    @Input() document: Oas20Document;
    @Input() paramIn: string;

    protected formatValue(value: Oas20Schema): string {
        if (value.$ref && value.$ref.indexOf("#/definitions/") === 0) {
            return value.$ref.substr(14);
        } else if (value.type) {
            return JsonSchemaType[value.type];
        } else {
            return this.noValueMessage;
        }
    }

    protected initialValueForEditing(): Oas20Schema {
        let schema: Oas20Schema = new Oas20Schema();
        if (!this.isEmpty()) {
            schema.type = this.value.type;
            schema.$ref = this.value.$ref;
        }
        return schema;
    }

    protected displayType(): string {
        if (this.evalue !== undefined && this.evalue !== null) {
            return this.formatValue(this.evalue);
        } else {
            return this.noValueMessage;
        }
    }

    protected isTypeEmpty(): boolean {
        return (
            (this.evalue.$ref === undefined || this.evalue.$ref === null) &&
            (this.evalue.type === undefined || this.evalue.type === null) );
    }

    protected setType(type: string, isSimple: boolean): void {
        if (isSimple) {
            this.evalue.type = JsonSchemaType[type];
            this.evalue.$ref = null;
        } else {
            this.evalue.type = null;
            this.evalue.$ref = "#/definitions/" + type;
        }
    }

    protected calcHoverDimensions(targetRect: any): any {
        let rval: any = super.calcHoverDimensions(targetRect);
        rval.top -= 2;
        rval.height += 2;
        return rval;
    }

    public hasDefinitions(): boolean {
        if (this.definitionNames().length > 0) {
            return true;
        } else {
            return false;
        }
    }

    public definitionNames(): string[] {
        if (this.paramIn !== "body" || ObjectUtils.isNullOrUndefined(this.document.definitions)) {
            return [];
        }
        return this.document.definitions.getItemNames().sort();
    }

}
