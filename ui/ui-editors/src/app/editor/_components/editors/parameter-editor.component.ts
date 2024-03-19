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

import {Component, ViewEncapsulation} from "@angular/core";
import {
    Aai20SchemaDefinition,
    DocumentType,
    IOasParameterParent,
    Oas20Parameter,
    Oas20SchemaDefinition,
    Oas30Parameter,
    Oas30SchemaDefinition,
    OasDocument,
    OasParameter,
    ReferenceUtil,
    SimplifiedParameterType,
    SimplifiedType,
    TraverserDirection,
    VisitorUtil
} from "@apicurio/data-models";
import {EntityEditor, EntityEditorEvent, IEntityEditorHandler} from "./entity-editor.component";
import {ObjectUtils} from "apicurio-ts-core";
import {FindSchemaDefinitionsVisitor} from "../../_visitors/schema-definitions.visitor";
import {DIVIDER, DropDownOption, DropDownOptionValue} from "../common/drop-down.component";

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
    selector: "parameter-editor",
    templateUrl: "parameter-editor.component.html",
    styleUrls: ["parameter-editor.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class ParameterEditorComponent extends EntityEditor<Oas20Parameter | Oas30Parameter, ParameterEditorEvent> {

    params: string[] = [];
    paramExists: boolean = false;

    model: ParameterData;
    _paramType: string = "query";

    public setParamType(paramType: string): void {
        this._paramType = paramType;
    }

    public doAfterOpen(): void {
        this.params = [];
        this.paramExists = false;
        let parameters: OasParameter[] = this.getParams();
        this.params = parameters.map(p => p.name);
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
    private getParams(): OasParameter[] {
        return ((<IOasParameterParent>this.context).getParametersIn(this._paramType));
    }

    public isRequired(): boolean {
        return this.model.type.required;
    }

    public required(): string {
        return this.isRequired() ? "required" : "not-required";
    }

    public requiredOptions(): DropDownOption[] {
        return [
            new DropDownOptionValue("Required", "required"),
            new DropDownOptionValue("Not Required", "not-required")
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
            new DropDownOptionValue("Array", "array"),
            new DropDownOptionValue("Enum", "enum"),
            DIVIDER,
            new DropDownOptionValue("String", "string"),
            new DropDownOptionValue("Integer", "integer"),
            new DropDownOptionValue("Boolean", "boolean"),
            new DropDownOptionValue("Number", "number")
        ];
        this.addRefTypes(options);

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
            new DropDownOptionValue("String", "string"),
            new DropDownOptionValue("Integer", "integer"),
            new DropDownOptionValue("Boolean", "boolean"),
            new DropDownOptionValue("Number", "number")
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
                new DropDownOptionValue("String", null),
                new DropDownOptionValue("Byte", "byte"),
                new DropDownOptionValue("Binary", "binary"),
                new DropDownOptionValue("Date", "date"),
                new DropDownOptionValue("DateTime", "date-time"),
                new DropDownOptionValue("Password", "password")
            ];
        } else if (st.type === "integer") {
            options = [
                new DropDownOptionValue("Integer", null),
                new DropDownOptionValue("32-Bit Integer", "int32"),
                new DropDownOptionValue("64-Bit Integer", "int64")
            ];
        } else if (st.type === "number") {
            options = [
                new DropDownOptionValue("Number", null),
                new DropDownOptionValue("Float", "float"),
                new DropDownOptionValue("Double", "double")
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
        return st && st.isSimpleType() && !st.isEnum() && (st.type !== "boolean");
    }

    public changeRequired(newValue: string): void {
        this.model.type.required = newValue === "required";
    }

    public changeType(type: string): void {
        if (type === "enum") {
            this.model.type.type = "string";
            this.model.type.enum_ = [];
        } else {
            this.model.type.type = type;
            this.model.type.enum_ = null;
            this.model.type.of = null;
            this.model.type.as = null;
        }
    }

    public changeTypeEnum(value: string[]): void {
        this.model.type.enum_ = value;
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
        if (this._paramType === "header") {
            return "Define a New Header Parameter";
        }
        if (this._paramType === "cookie") {
            return "Define a New Cookie Parameter";
        }
        if (this._paramType === "formData") {
            return "Define a New Form Data Parameter";
        }
    }

    private addRefTypes(options: DropDownOption[]): void {
        let refPrefix: string = "#/components/schemas/";
        let defs: (Oas20SchemaDefinition | Oas30SchemaDefinition | Aai20SchemaDefinition)[];

        const isSimpleType: (schemaDef: Oas20SchemaDefinition | Oas30SchemaDefinition, recursionDepth?: number) => boolean = (schemaDef, recursionDepth) => {
            if (!recursionDepth) {
                recursionDepth = 1;
            }
            if (schemaDef.type === "string" || schemaDef.type === "number" || schemaDef.type === "integer" || schemaDef.type === "boolean") {
                return true;
            }
            if (recursionDepth < 5 && schemaDef.$ref !== null && ReferenceUtil.canResolveRef(schemaDef.$ref, schemaDef)) {
                const resolvedSchemaDef: Oas20SchemaDefinition | Oas30SchemaDefinition = <any>(ReferenceUtil.resolveNodeRef(schemaDef));
                return isSimpleType(resolvedSchemaDef, recursionDepth + 1);
            }

            // TODO if the SchemaDef is an **external** "$ref" we need to resolve it here and include it if the $ref points to a simple
            // type schema.  This should use the API catalog to resolve the reference.

            return false;
        };

        if (this.context.ownerDocument().getDocumentType() == DocumentType.asyncapi2) {
            // TODO TBD on this - not sure what is appropriate for AsyncAPI documents
        } else {
            let doc: OasDocument = <OasDocument> this.context.ownerDocument();
            if (doc.is2xDocument()) {
                refPrefix = "#/definitions/";
            }

            let viz: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(isSimpleType);
            VisitorUtil.visitTree(doc, viz, TraverserDirection.down);
            defs = viz.getSortedSchemaDefinitions();
        }

        if (defs.length > 0) {
            options.push(DIVIDER);
            defs.forEach(def => {
                let defName: string = def.getName();
                options.push(new DropDownOptionValue(defName, refPrefix + defName));
            });
        }
    }

}
