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
import {
    Oas20PropertySchema,
    Oas20SchemaDefinition,
    Oas30PropertySchema,
    Oas30SchemaDefinition, OasDocument,
    OasVisitorUtil
} from "oai-ts-core";
import {EntityEditor, EntityEditorEvent, IEntityEditorHandler} from "./entity-editor.component";
import {Subject} from "rxjs";
import {SimplifiedPropertyType, SimplifiedType} from "oai-ts-commands";
import {ObjectUtils} from "../../_util/object.util";
import {DropDownOption} from "../../../../../../components/common/drop-down.component";
import {FindSchemaDefinitionsVisitor} from "../../_visitors/schema-definitions.visitor";

export interface PropertyData {
    name: string;
    description: string;
    type: SimplifiedPropertyType;
}

export interface PropertyEditorEvent extends EntityEditorEvent<Oas20PropertySchema | Oas30PropertySchema> {
    data: PropertyData;
}

export interface IPropertyEditorHandler extends IEntityEditorHandler<Oas20PropertySchema | Oas30PropertySchema, PropertyEditorEvent> {
    onSave(event: PropertyEditorEvent): void;
    onCancel(event: PropertyEditorEvent): void;
}


@Component({
    moduleId: module.id,
    selector: "property-editor",
    templateUrl: "property-editor.component.html",
    styleUrls: ["property-editor.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class PropertyEditorComponent extends EntityEditor<Oas20PropertySchema | Oas30PropertySchema, PropertyEditorEvent> {

    protected propChanged: Subject<string> = new Subject<string>();
    protected props: string[] = [];
    protected propExists: boolean = false;

    public model: PropertyData;

    public doAfterOpen(): void {
        this.props = [];
        this.propExists = false;
        let properties: (Oas20PropertySchema | Oas30PropertySchema)[] = this.getProps();
        this.props = properties.map(p => p.propertyName());
        this.propChanged
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe( pname => {
                this.propExists = this.props.indexOf(pname) != -1;
            });
    }

    /**
     * Initializes the editor's data model from a provided entity (initialize the editor data model from an entity).
     * @prop entity
     */
    public initializeModelFromEntity(entity: Oas20PropertySchema | Oas30PropertySchema): void {
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
    private getProps(): (Oas20PropertySchema | Oas30PropertySchema)[] {
        let parent: Oas20SchemaDefinition | Oas30SchemaDefinition = this.context as Oas20SchemaDefinition | Oas30SchemaDefinition;
        if (parent.properties) {
            let props: (Oas20PropertySchema | Oas30PropertySchema)[] = [];
            Object.keys(parent.properties).forEach( pkey => {
                props.push(parent.properties[pkey] as Oas20PropertySchema | Oas30PropertySchema);
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
            { value: "string", name: "String" },
            { value: "integer", name: "Integer" },
            { value: "boolean", name: "Boolean" },
            { value: "number", name: "Number" }
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

    private addRefTypes(options: DropDownOption[]): void {
        let doc: OasDocument = this.context.ownerDocument();
        let refPrefix: string = "#/components/schemas/";
        if (doc.is2xDocument()) {
            refPrefix = "#/definitions/";
        }

        let viz: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(null);
        OasVisitorUtil.visitTree(doc, viz);
        let defs: (Oas20SchemaDefinition | Oas30SchemaDefinition)[] = viz.getSortedSchemaDefinitions();
        if (defs.length > 0) {
            options.push({divider: true});
            defs.forEach(def => {
                let defName: string = (def.ownerDocument().is2xDocument()) ? (def as Oas20SchemaDefinition).definitionName() : (def as Oas30SchemaDefinition).name();
                options.push({
                    value: refPrefix + defName,
                    name: defName
                });
            });
        }
    }

}
