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
    Aai20Schema,
    Aai20SchemaDefinition,
    AaiDocument,
    DocumentType,
    Oas20Schema,
    Oas20SchemaDefinition,
    Oas30Schema,
    Oas30SchemaDefinition,
    OasDocument,
    SimplifiedPropertyType,
    SimplifiedType,
    TraverserDirection,
    VisitorUtil
} from "@apicurio/data-models";
import {EntityEditor, EntityEditorEvent, IEntityEditorHandler} from "./entity-editor.component";
import {
    FindAaiSchemaDefinitionsVisitor,
    FindSchemaDefinitionsVisitor
} from "../../_visitors/schema-definitions.visitor";
import {ObjectUtils} from "apicurio-ts-core";
import Oas20PropertySchema = Oas20Schema.Oas20PropertySchema;
import Oas30PropertySchema = Oas30Schema.Oas30PropertySchema;
import Aai20PropertySchema = Aai20Schema.Aai20PropertySchema;
import {DIVIDER, DropDownOption, DropDownOptionValue} from "../common/drop-down.component";

export interface PropertyData {
    name: string;
    description: string;
    type: SimplifiedPropertyType;
}

export interface PropertyEditorEvent extends EntityEditorEvent<Oas20PropertySchema | Oas30PropertySchema | Aai20PropertySchema> {
    data: PropertyData;
}

export interface IPropertyEditorHandler extends IEntityEditorHandler<Oas20PropertySchema | Oas30PropertySchema | Aai20PropertySchema, PropertyEditorEvent> {
    onSave(event: PropertyEditorEvent): void;
    onCancel(event: PropertyEditorEvent): void;
}


@Component({
    selector: "property-editor",
    templateUrl: "property-editor.component.html",
    styleUrls: ["property-editor.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class PropertyEditorComponent extends EntityEditor<Oas20PropertySchema | Oas30PropertySchema | Aai20PropertySchema, PropertyEditorEvent> {

    props: string[] = [];
    propExists: boolean = false;

    public model: PropertyData;

    public doAfterOpen(): void {
        this.props = [];
        this.propExists = false;
        let properties: (Oas20PropertySchema | Oas30PropertySchema | Aai20PropertySchema)[] = this.getProps();
        this.props = properties.map(p => p.getPropertyName());
    }

    /**
     * Initializes the editor's data model from a provided entity (initialize the editor data model from an entity).
     * @prop entity
     */
    public initializeModelFromEntity(entity: Oas20PropertySchema | Oas30PropertySchema | Aai20PropertySchema): void {
        // Note: nothing to do here because properties aren't editable via the full screen editor.
    }

    /**
     * Initializes the editor's data model to an empty state.
     */
    public initializeModel(): void {
        this.model = {
            name: "",
            description: "",
            type: new SimplifiedPropertyType()
        };
    }

    /**
     * Returns true if the data model is valid.
     */
    public isValid(): boolean {
        return this.model.name !== null && this.model.name.trim().length > 0 && !this.propExists;
    }

    /**
     * Creates an entity event specific to this entity editor.
     */
    public entityEvent(): PropertyEditorEvent {
        let event: PropertyEditorEvent = {
            entity: this.entity,
            data: this.model
        };
        return event;
    }

    /**
     * Gets the array of properties for the current context.
     */
    private getProps(): (Oas20PropertySchema | Oas30PropertySchema | Aai20PropertySchema)[] {
        let parent: Oas20SchemaDefinition | Oas30SchemaDefinition |  Aai20SchemaDefinition = this.context as Oas20SchemaDefinition | Oas30SchemaDefinition | Aai20SchemaDefinition;
        if (parent.properties) {
            let props: (Oas20PropertySchema | Oas30PropertySchema |  Aai20PropertySchema)[] = [];
            Object.keys(parent.properties).forEach( pkey => {
                props.push(parent.properties[pkey] as Oas20PropertySchema | Oas30PropertySchema |  Aai20PropertySchema);
            });
            return props;
        }
        return [];
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
        this.addRefTypes(options);
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

    private addRefTypes(options: DropDownOption[]): void {
        let refPrefix: string = "#/components/schemas/";
        let defs: (Oas20SchemaDefinition | Oas30SchemaDefinition | Aai20SchemaDefinition)[]

        if (this.context.ownerDocument().getDocumentType() == DocumentType.asyncapi2) {
            let doc: AaiDocument = <AaiDocument> this.context.ownerDocument();
            let viz: FindAaiSchemaDefinitionsVisitor = new FindAaiSchemaDefinitionsVisitor(null);
            VisitorUtil.visitTree(doc, viz, TraverserDirection.down);
            defs = viz.getSortedSchemaDefinitions();

        } else {
            let doc: OasDocument = <OasDocument> this.context.ownerDocument();
            if (doc.is2xDocument()) {
                refPrefix = "#/definitions/";
            }
            let viz: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(null);
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
