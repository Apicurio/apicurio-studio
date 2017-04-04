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

import {Component, ViewEncapsulation, Input, Output, EventEmitter} from "@angular/core";
import {
    Oas20Document, Oas20Response
} from "oai-ts-core";
import {DropDownOption} from "../../common/drop-down.component";
import {HttpCode, HttpCodeService} from "../../../_services/httpcode.service";
import {SimplifiedType} from "../../../_models/simplified-type.model";
import {ObjectUtils} from "../../../_util/object.util";


@Component({
    moduleId: module.id,
    selector: "response-row",
    templateUrl: "response-row.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ResponseRowComponent {

    private static httpCodes: HttpCodeService = new HttpCodeService();

    @Input() document: Oas20Document;
    @Input() response: Oas20Response;

    @Output() onDescriptionChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() onTypeChange: EventEmitter<SimplifiedType> = new EventEmitter<SimplifiedType>();
    @Output() onDelete: EventEmitter<boolean> = new EventEmitter<boolean>();

    protected _editing: boolean = false;

    protected model: SimplifiedType;

    public statusCodeLine(code: string): string {
        let httpCode: HttpCode = ResponseRowComponent.httpCodes.getCode(code);
        if (httpCode) {
            return httpCode.line;
        }
        return "";
    }

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

        if (this.document.definitions) {
            let co: DropDownOption[] = this.document.definitions.definitions().sort( (def1, def2) => {
                return def1.definitionName().toLocaleLowerCase().localeCompare(def2.definitionName().toLocaleLowerCase());
            }).map( def => {
                return {
                    value: "#/definitions/" + def.definitionName(),
                    name: def.definitionName()
                };
            });
            if (co && co.length > 0) {
                options.push({ divider: true });
                co.forEach( o => options.push(o) );
            }
        }

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

        if (this.document.definitions) {
            let co: DropDownOption[] = this.document.definitions.definitions().sort( (def1, def2) => {
                return def1.definitionName().toLocaleLowerCase().localeCompare(def2.definitionName().toLocaleLowerCase());
            }).map( def => {
                return {
                    value: "#/definitions/" + def.definitionName(),
                    name: def.definitionName()
                };
            });
            if (co && co.length > 0) {
                options.push({ divider: true });
                co.forEach( o => options.push(o) );
            }
        }

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

    public edit(): void {
        this.model = SimplifiedType.fromSchema(this.response.schema);
        this._editing = true;
    }

    public delete(): void {
        this.onDelete.emit(true);
    }

    public displayType(): SimplifiedType {
        return SimplifiedType.fromSchema(this.response.schema);
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

}
