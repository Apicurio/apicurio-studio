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
import {JsonSchemaType, Oas20Document, Oas20Items, Oas20ItemsSchema, Oas20Schema} from "oai-ts-core";
import {AbstractInlineValueEditor} from "../../common/inline-editor.base";
import {ObjectUtils} from "../../../_util/object.util";
import {DropDownOption} from "../../common/drop-down.component";
import {SimplifiedType} from "../../../_models/simplified-type.model";

@Component({
    moduleId: module.id,
    selector: "type-editor-of",
    templateUrl: "type-editor.component.html",
    encapsulation: ViewEncapsulation.None
})
export class TypeEditorOFComponent extends AbstractInlineValueEditor<SimplifiedType> {

    @Input() document: Oas20Document;
    @Input() paramIn: string;

    protected isOpen: boolean = false;

    public onStartEditing(): void {
        this.isOpen = true;
        super.onStartEditing();
    }

    public toggled(value: boolean): void {
        this.isOpen = value;
    }

    protected formatValue(value: SimplifiedType): string {
        // if (value.simpleType) {
        //     return value.simpleType;
        // }
        // if (value.complexType) {
        //     return value.complexType;
        // }
        // if (value.arrayOf) {
        //     return "List of " + this.formatValue(value.arrayOf);
        // }

        return this.noValueMessage;
    }

    protected initialValueForEditing(): SimplifiedType {
        let initialValue: SimplifiedType = new SimplifiedType();
        initialValue.type = this.value.type;
        initialValue.of = this.value.of;
        initialValue.as = this.value.as;
        return this.value;
    }

    protected displayType(): string {
        if (!ObjectUtils.isNullOrUndefined(this.evalue)) {
            return this.formatValue(this.evalue);
        } else {
            return this.noValueMessage;
        }
    }

    protected isTypeEmpty(): boolean {
        return (
            ObjectUtils.isNullOrUndefined(this.evalue.type)
        );
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

    public setType(value: string, simpleType: boolean): void {
        console.info("TYPE: " + value);
    }

    public setTypeListCardinality(isList: boolean): void {
        console.info("IS LIST: " + isList);
    }

}
