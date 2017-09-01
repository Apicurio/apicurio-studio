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

import {Output, EventEmitter} from "@angular/core";
import {DropDownOption} from "../../common/drop-down.component";
import {SimplifiedType} from "oai-ts-commands";
import {ObjectUtils} from "../../../_util/object.util";


export abstract class AbstractTypedItemComponent {

    @Output() onDescriptionChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() onTypeChange: EventEmitter<SimplifiedType> = new EventEmitter<SimplifiedType>();
    @Output() onDelete: EventEmitter<boolean> = new EventEmitter<boolean>();

    protected _editing: boolean = false;

    protected model: SimplifiedType;

    public type(): string {
        if (!ObjectUtils.isNullOrUndefined(this.model)) {
            return this.model.type;
        }
        return null;
    }

    public typeOptions(): DropDownOption[] {
        let options: DropDownOption[] = [
            { value: "array", name: "Array" },
            { divider: true },
            { value: "string", name: "String" },
            { value: "integer", name: "Integer" },
            { value: "boolean", name: "Boolean" },
            { value: "number", name: "Number" }
        ];
        return options;
    }

    public typeOf(): string {
        if (this.model && this.model.of) {
            return this.model.of.type;
        }
        return null;
    }

    public typeAs(): string {
        if (ObjectUtils.isNullOrUndefined(this.model)) {
            return null;
        }
        if (this.model.isArray() && this.model.of && this.model.of.isSimpleType()) {
            return this.model.of.as;
        }
        if (this.model.isSimpleType()) {
            return this.model.as;
        }
        return null;
    }

    public typeOfOptions(): DropDownOption[] {
        let options: DropDownOption[] = [
            { value: "string", name: "String" },
            { value: "integer", name: "Integer" },
            { value: "boolean", name: "Boolean" },
            { value: "number", name: "Number" }
        ];

        return options;
    }

    public typeAsOptions(): DropDownOption[] {
        let options: DropDownOption[];
        let st: SimplifiedType = this.model;
        if (this.model && this.model.isArray() && this.model.of && this.model.of.isSimpleType()) {
            st = this.model.of;
        }
        if (st.type === "string") {
            options = [
                { value: null, name: "String" },
                { value: "byte", name: "Byte" },
                { value: "binary", name: "Binary" },
                { value: "date", name: "Date" },
                { value: "date-time", name: "DateTime" },
                { value: "password", name: "Password" }
            ];
        } else if (st.type === "integer") {
            options = [
                { value: null, name: "Integer" },
                { value: "int32", name: "32-Bit Integer" },
                { value: "int64", name: "64-Bit Integer" }
            ];
        } else if (st.type === "number") {
            options = [
                { value: null, name: "Number" },
                { value: "float", name: "Float" },
                { value: "double", name: "Double" }
            ];
        }
        return options;
    }

    public changeType(type: string): void {
        this.model.type = type;
        this.model.of = null;
        this.model.as = null;
    }

    public changeTypeOf(typeOf: string): void {
        this.model.of = new SimplifiedType();
        this.model.of.type = typeOf;
        this.model.as = null;
    }

    public changeTypeAs(typeAs: string): void {
        if (ObjectUtils.isNullOrUndefined(this.model)) {
            this.model = new SimplifiedType();
        }
        if (this.model.isArray() && this.model.of && this.model.of.isSimpleType()) {
            this.model.of.as = typeAs;
        }
        if (this.model.isSimpleType()) {
            this.model.as = typeAs;
        }
    }

    public setDescription(description: string): void {
        this.onDescriptionChange.emit(description);
    }

    public isEditing(): boolean {
        return this._editing;
    }

    protected abstract modelForEditing(): SimplifiedType;

    public edit(): void {
        this.model = this.modelForEditing();
        this._editing = true;
    }

    protected abstract modelForViewing(): SimplifiedType;

    public displayType(): SimplifiedType {
        return this.modelForViewing();
    }

    public cancel(): void {
        this._editing = false;
    }

    public shouldShowFormattedAs(): boolean {
        let st: SimplifiedType = this.model;
        if (this.model && this.model.isArray() && this.model.of && this.model.of.isSimpleType()) {
            st = this.model.of;
        }
        return st && st.isSimpleType() && (st.type !== "boolean");
    }

    public isValid(): boolean {
        if (ObjectUtils.isNullOrUndefined(this.model)) {
            return false;
        }
        if (this.model.isArray() && !ObjectUtils.isNullOrUndefined(this.model.of)) {
            return this.model.of.isSimpleType() || this.model.of.isRef();
        }
        return this.model.isSimpleType() || this.model.isRef();
    }

    public onGlobalKeyDown(event: KeyboardEvent): void {
        if (event.key === "Escape"  && !event.metaKey && !event.altKey && !event.ctrlKey) {
            this.cancel();
        }
    }

    public ok(): void {
        this.onTypeChange.emit(this.model);
        this._editing = false;
    }

    public delete(): void {
        this.onDelete.emit(true);
    }

}
