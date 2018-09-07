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

import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation} from "@angular/core";
import {
    createChangePropertyCommand, createChangePropertyTypeCommand,
    ICommand,
    SimplifiedParameterType,
    SimplifiedPropertyType,
    SimplifiedType
} from "oai-ts-commands";
import {
    Oas20PropertySchema,
    Oas20SchemaDefinition,
    Oas30PropertySchema,
    Oas30SchemaDefinition,
    OasVisitorUtil
} from "oai-ts-core";
import {AbstractTypedItemComponent} from "../operation/typed-item.component";
import {FindSchemaDefinitionsVisitor} from "../../../_visitors/schema-definitions.visitor";
import {DropDownOption} from '../../../../../../../components/common/drop-down.component';
import {CommandService} from "../../../_services/command.service";
import {ObjectUtils} from "../../../_util/object.util";


@Component({
    moduleId: module.id,
    selector: "property-row",
    templateUrl: "property-row.component.html",
    styleUrls: [ "property-row.component.css" ],
    encapsulation: ViewEncapsulation.None
})
export class PropertyRowComponent implements OnChanges {

    @Input() property: Oas20PropertySchema | Oas30PropertySchema;

    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();

    protected _editing: boolean = false;
    protected _tab: string = "description";
    protected _model: SimplifiedParameterType = null;

    constructor(private commandService: CommandService) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["property"]) {
            this._model = SimplifiedPropertyType.fromPropertySchema(this.property);
        }
    }

    public model(): SimplifiedParameterType {
        return this._model;
    }

    public hasDescription(): boolean {
        if (this.property.description) {
            return true;
        } else {
            return false;
        }
    }

    public description(): string {
        if (this.property.description) {
            return this.property.description
        } else {
            return "No description.";
        }
    }

    public isRequired(): boolean {
        let required: string[] = this.property.parent()["required"];
        if (required && required.length > 0) {
            return required.indexOf(this.property.propertyName()) != -1;
        }
        return false;
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
        if (!ObjectUtils.isNullOrUndefined(this.model())) {
            return this.model().type;
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
        let refPrefix: string = "#/components/schemas/";
        if (this.property.ownerDocument().getSpecVersion() === "2.0") {
            refPrefix = "#/definitions/";
        }

        let viz: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(null);
        OasVisitorUtil.visitTree(this.property.ownerDocument(), viz);
        let defs: (Oas20SchemaDefinition | Oas30SchemaDefinition)[] = viz.getSortedSchemaDefinitions();
        if (defs.length > 0) {
            options.push({ divider: true });
            defs.forEach( def => {
                let defName: string = (def.ownerDocument().getSpecVersion() === "2.0") ? (def as Oas20SchemaDefinition).definitionName() : (def as Oas30SchemaDefinition).name();
                options.push({
                    value: refPrefix + defName,
                    name: defName
                });
            });
        }

        return options;
    }

    public typeOf(): string {
        if (this.model() && this.model().of) {
            return this.model().of.type;
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
        let refPrefix: string = "#/components/schemas/";
        if (this.property.ownerDocument().getSpecVersion() === "2.0") {
            refPrefix = "#/definitions/";
        }

        let viz: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(null);
        OasVisitorUtil.visitTree(this.property.ownerDocument(), viz);
        let defs: (Oas20SchemaDefinition | Oas30SchemaDefinition)[] = viz.getSortedSchemaDefinitions();
        if (defs.length > 0) {
            options.push({ divider: true });
            defs.forEach( def => {
                let defName: string = (def.ownerDocument().getSpecVersion() === "2.0") ? (def as Oas20SchemaDefinition).definitionName() : (def as Oas30SchemaDefinition).name();
                options.push({
                    value: refPrefix + defName,
                    name: defName
                });
            });
        }

        return options;
    }

    public typeAs(): string {
        if (ObjectUtils.isNullOrUndefined(this.model())) {
            return null;
        }
        if (this.model().isArray() && this.model().of && this.model().of.isSimpleType()) {
            return this.model().of.as;
        }
        if (this.model().isSimpleType()) {
            return this.model().as;
        }
        return null;
    }

    public typeAsOptions(): DropDownOption[] {
        let options: DropDownOption[];
        let st: SimplifiedType = this.model();
        if (this.model() && this.model().isArray() && this.model().of && this.model().of.isSimpleType()) {
            st = this.model().of;
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

    public shouldShowFormattedAs(): boolean {
        let st: SimplifiedType = this.model();
        if (this.model() && this.model().isArray() && this.model().of && this.model().of.isSimpleType()) {
            st = this.model().of;
        }
        return st && st.isSimpleType() && (st.type !== "boolean");
    }

    public isEditing(): boolean {
        return this._editing;
    }

    public isEditingDescription(): boolean {
        return this._editing && this._tab === "description";
    }

    public isEditingSummary(): boolean {
        return this._editing && this._tab === "summary";
    }

    public toggle(event: MouseEvent): void {
        if (event.target['localName'] !== "button" && event.target['localName'] !== "a") {
            this._editing = !this._editing;
        }
    }

    public toggleDescription(): void {
        if (this.isEditing() && this._tab === "description") {
            this._editing = false;
        } else {
            this._editing = true;
            this._tab = "description";
        }
    }

    public toggleSummary(): void {
        if (this.isEditing() && this._tab === "summary") {
            this._editing = false;
        } else {
            this._editing = true;
            this._tab = "summary";
        }
    }

    public edit(): void {
        this._editing = true;
    }

    public ok(): void {
        this._editing = false;
    }

    public cancel(): void {
        this._editing = false;
    }

    public delete(): void {
        this.onDelete.emit();
    }

    public isValid(): boolean {
        return true;
    }

    public displayType(): SimplifiedParameterType {
        return SimplifiedPropertyType.fromPropertySchema(this.property);
    }

    public rename(): void {
        // TODO implement this!
        alert("Not yet implemented.");
    }

    public setDescription(description: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.property.ownerDocument(), this.property, "description", description);
        this.commandService.emit(command);
    }

    public changeRequired(newValue: string): void {
        let nt: SimplifiedPropertyType = SimplifiedPropertyType.fromPropertySchema(this.property);
        nt.required = newValue === "required";
        let command: ICommand = createChangePropertyTypeCommand(this.property.ownerDocument(), this.property, nt);
        this.commandService.emit(command);
    }

    public changeType(type: string): void {
        let nt: SimplifiedPropertyType = new SimplifiedPropertyType();
        nt.required = this.model().required;
        nt.type = type;
        nt.of = null;
        nt.as = null;
        let command: ICommand = createChangePropertyTypeCommand(this.property.ownerDocument(), this.property, nt);
        this.commandService.emit(command);
        this._model = nt;
    }

    public changeTypeOf(typeOf: string): void {
        let nt: SimplifiedPropertyType = SimplifiedPropertyType.fromPropertySchema(this.property);
        nt.required = this.model().required;
        nt.of = new SimplifiedType();
        nt.of.type = typeOf;
        nt.as = null;
        let command: ICommand = createChangePropertyTypeCommand(this.property.ownerDocument(), this.property, nt);
        this.commandService.emit(command);
        this._model = nt;
    }

    public changeTypeAs(typeAs: string): void {
        let nt: SimplifiedPropertyType = SimplifiedPropertyType.fromPropertySchema(this.property);
        nt.required = this.model().required;
        if (nt.isSimpleType()) {
            nt.as = typeAs;
        }
        if (nt.isArray() && nt.of) {
            nt.of.as = typeAs;
        }
        let command: ICommand = createChangePropertyTypeCommand(this.property.ownerDocument(), this.property, nt);
        this.commandService.emit(command);
        this._model = nt;
    }

}
