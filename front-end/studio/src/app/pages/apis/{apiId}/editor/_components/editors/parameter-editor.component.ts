/**
 * @license
 * Copyright 2018 JBoss Inc
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

import {Component, ViewEncapsulation} from "@angular/core";
import {IOasParameterParent, Oas20Parameter, Oas30Parameter} from "oai-ts-core";
import {EntityEditor, EntityEditorEvent, IEntityEditorHandler} from "./entity-editor.component";
import {Subject} from "rxjs";
import {SimplifiedParameterType, SimplifiedType} from "oai-ts-commands";
import {ObjectUtils} from "../../_util/object.util";
import {DropDownOption} from "../../../../../../components/common/drop-down.component";

export interface ParameterData {
    name: string;
    description: string;
    type: SimplifiedParameterType;
}

export interface ParameterEditorEvent extends EntityEditorEvent<Oas20Parameter | Oas30Parameter> {
    data: ParameterData;
}

export interface IParameterEditorHandler extends IEntityEditorHandler<Oas20Parameter | Oas30Parameter, ParameterEditorEvent> {
    onSave(event: ParameterEditorEvent): void;
    onCancel(event: ParameterEditorEvent): void;
}


@Component({
    moduleId: module.id,
    selector: "parameter-editor",
    templateUrl: "parameter-editor.component.html",
    styleUrls: ["parameter-editor.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class ParameterEditorComponent extends EntityEditor<Oas20Parameter | Oas30Parameter, ParameterEditorEvent> {

    protected paramChanged: Subject<string> = new Subject<string>();
    protected params: string[] = [];
    protected paramExists: boolean = false;

    public model: ParameterData;
    public _paramType: string = "query";

    public setParamType(paramType: string): void {
        this._paramType = paramType;
    }

    public doAfterOpen(): void {
        this.params = [];
        this.paramExists = false;
        let parameters: (Oas20Parameter | Oas30Parameter)[] = this.getParams();
        this.params = parameters.map(p => p.name);
        this.paramChanged
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe( pname => {
                this.paramExists = this.params.indexOf(pname) != -1;
            });
    }

    /**
     * Initializes the editor's data model from a provided entity (initialize the editor data model from an entity).
     * @param entity
     */
    public initializeModelFromEntity(entity: Oas20Parameter | Oas30Parameter): void {
        // Note: nothing to do here because parameters aren't editable via the full screen editor.
    }

    /**
     * Initializes the editor's data model to an empty state.
     */
    public initializeModel(): void {
        this.model = {
            name: "",
            description: "",
            type: new SimplifiedParameterType()
        };
    }

    /**
     * Returns true if the data model is valid.
     */
    public isValid(): boolean {
        return this.model.name !== null && this.model.name.trim().length > 0 && !this.paramExists;
    }

    /**
     * Creates an entity event specific to this entity editor.
     */
    public entityEvent(): ParameterEditorEvent {
        let event: ParameterEditorEvent = {
            entity: this.entity,
            data: this.model
        };
        return event;
    }

    /**
     * Gets the array of parameters for the current context.
     */
    private getParams(): (Oas20Parameter | Oas30Parameter)[] {
        return (this.context as IOasParameterParent).getParameters(this._paramType) as any;
    }

    public isRequired(): boolean {
        return this.model.type.required;
    }

    public required(): string {
        return this.isRequired() ? "required" : "not-required";
    }

    public requiredOptions(): DropDownOption[] {
        return [
            { name: "Required", value: "required" },
            { name: "Not Required", value: "not-required" }
        ];
    }

    public type(): string {
        if (!ObjectUtils.isNullOrUndefined(this.model.type)) {
            if (this.model.type.isEnum()) {
                return "enum";
            }
            return ObjectUtils.undefinedAsNull(this.model.type.type);
        }
        return null;
    }

    public typeOptions(): DropDownOption[] {
        let options: DropDownOption[] = [
            { value: "array", name: "Array" },
            { value: "enum", name: "Enum" },
            { divider: true },
            { value: "string", name: "String" },
            { value: "integer", name: "Integer" },
            { value: "boolean", name: "Boolean" },
            { value: "number", name: "Number" }
        ];

        return options;
    }

    public typeOf(): string {
        if (this.model.type && this.model.type.of) {
            return ObjectUtils.undefinedAsNull(this.model.type.of.type);
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

    public typeAs(): string {
        if (ObjectUtils.isNullOrUndefined(this.model.type)) {
            return null;
        }
        if (this.model.type.isArray() && this.model.type.of && this.model.type.of.isSimpleType()) {
            return ObjectUtils.undefinedAsNull(this.model.type.of.as);
        }
        if (this.model.type.isSimpleType()) {
            return ObjectUtils.undefinedAsNull(this.model.type.as);
        }
        return null;
    }

    public typeAsOptions(): DropDownOption[] {
        let options: DropDownOption[];
        let st: SimplifiedType = this.model.type;
        if (this.model.type && this.model.type.isArray() && this.model.type.of && this.model.type.of.isSimpleType()) {
            st = this.model.type.of;
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

    public shouldShowEnumEditor(): boolean {
        return this.model.type && this.model.type.isEnum();
    }

    public shouldShowFormattedAs(): boolean {
        let st: SimplifiedType = this.model.type;
        if (this.model.type && this.model.type.isArray() && this.model.type.of && this.model.type.of.isSimpleType()) {
            st = this.model.type.of;
        }
        return st && st.isSimpleType() && (st.type !== "boolean");
    }

    public changeRequired(newValue: string): void {
        this.model.type.required = newValue === "required";
    }

    public changeType(type: string): void {
        if (type === "enum") {
            this.model.type.type = null;
            this.model.type.enum = [];
        } else {
            this.model.type.type = type;
            this.model.type.enum = null;
            this.model.type.of = null;
            this.model.type.as = null;
        }
    }

    public changeTypeEnum(value: string[]): void {
        this.model.type.enum = value;
    }

    public changeTypeOf(typeOf: string): void {
        this.model.type.of = new SimplifiedType();
        this.model.type.of.type = typeOf;
        this.model.type.as = null;
    }

    public changeTypeAs(typeAs: string): void {
        if (this.model.type.isSimpleType()) {
            this.model.type.as = typeAs;
        }
        if (this.model.type.isArray() && this.model.type.of) {
            this.model.type.of.as = typeAs;
        }
    }

    public heading(): string {
        if (this._paramType === "query") {
            return "Define a New Query Parameter";
        }
        if (this._paramType === "formData") {
            return "Define a New Form Data Parameter";
        }
    }

}
