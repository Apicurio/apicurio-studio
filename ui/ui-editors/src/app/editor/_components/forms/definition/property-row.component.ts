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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Output,
    ViewEncapsulation
} from "@angular/core";
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {AbstractRowComponent} from "../../common/item-row.abstract";
import {
    CommandFactory, DocumentType,
    ICommand,
    Oas20Schema,
    Oas30Schema,
    SimplifiedParameterType,
    SimplifiedPropertyType, SimplifiedType
} from "@apicurio/data-models";
import Oas20PropertySchema = Oas20Schema.Oas20PropertySchema;
import Oas30PropertySchema = Oas30Schema.Oas30PropertySchema;
import {DropDownOption, DropDownOptionValue} from "../../common/drop-down.component";


@Component({
    selector: "property-row",
    templateUrl: "property-row.component.html",
    styleUrls: [ "property-row.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyRowComponent extends AbstractRowComponent<Oas20PropertySchema | Oas30PropertySchema, SimplifiedPropertyType> {

    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();
    @Output() onRename: EventEmitter<void> = new EventEmitter<void>();

    _ptab: string = null;

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param commandService
     * @param selectionService
     */
    constructor(changeDetectorRef: ChangeDetectorRef, documentService: DocumentService,
                private commandService: CommandService, selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected updateModel(): void {
        this._model = SimplifiedPropertyType.fromPropertySchema(this.item);
    }

    public isParameter(): boolean {
        return false;
    }

    public hasDescription(): boolean {
        if (this.item.description) {
            return true;
        } else {
            return false;
        }
    }

    public hasType(): boolean {
        if (this.item.type) {
            return true;
        } else {
            return false;
        }
    }

    public description(): string {
        return this.item.description
    }

    public example(): string {
        return this.item.example
    }

    public minimum(): number {
        return this.item.minimum
    }

    public maximum(): number {
        return this.item.maximum
    }

    public isRequired(): boolean {
        let required: string[] = this.item.parent()["required"];
        if (required && required.length > 0) {
            return required.indexOf(this.item.getPropertyName()) != -1;
        }
        return false;
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

    public minimumIsSet(): string | null {
        return  this.item.minimum ? this.item.minimum.toString() : null;
    }

    public maximumIsSet(): string | null {
        return this.item.maximum ? this.item.maximum.toString() : null;
    }

    public multipleOfIsSet(): string | null {
        return this.item.multipleOf ? this.item.multipleOf.toString() : null;
    }

    public minItemsIsSet(): string | null {
        return  this.item.minItems ? this.item.minItems.toString() : null;
    }

    public maxItemsIsSet(): string | null {
        return this.item.maxItems ? this.item.maxItems.toString() : null;
    }

    public minLengthIsSet(): string | null {
        return  this.item.minLength ? this.item.minLength.toString() : null;
    }

    public maxLengthIsSet(): string | null {
        return this.item.maxLength ? this.item.maxLength.toString() : null;
    }

    public exclusiveMinIsSet(): boolean | null {
        return  this.item.exclusiveMinimum ? this.item.exclusiveMinimum : false;
    }

    public uniqueItemsIsSet(): boolean | null {
        return  this.item.uniqueItems ? this.item.uniqueItems : false;
    }

    public readOnlyIsSet(): boolean | null {
        return  this.item.readOnly ? this.item.readOnly : false;
    }

    public writeOnlyIsSet(): boolean | null {
        if (this.item.ownerDocument().getDocumentType() == DocumentType.openapi3) {
            return (<Oas30PropertySchema>this.item).writeOnly ? true : false;
        }
        return false;
    }

    public minPropertiesIsSet(): string | null {
        return  this.item.minProperties ? this.item.minProperties.toString() : null;
    }

    public maxPropertiesIsSet(): string | null {
        return  this.item.maxProperties ? this.item.maxProperties.toString() : null;
    }

    // public writeOnlyIsSet(): boolean | null {
    //     return  this.item.writeOnly ? this.item.writeOnly : false; TODO nullable not exist in dataModels
    // }

    // public nullableIsSet(): boolean | null {
    //     return  this.item.nullable ? this.item.nullable : false; TODO nullable not exist in dataModels
    // }

    public exclusiveMaxIsSet(): boolean | null {
        return  this.item.exclusiveMaximum ? this.item.exclusiveMaximum : false;
    }

    public isEditingDescription(): boolean {
        return this.isEditingTab("description");
    }

    public isEditingSummary(): boolean {
        return this.isEditingTab("summary");
    }

    public isEditingExample(): boolean {
        return this.isEditingTab("example");
    }

    public isIntFloatEligible(): boolean  {
        return this.item.type === "integer" || this.item.type === "float"
    }

    public isStringEligible(): boolean  {
        return this.item.type === "string"
    }

    public isArrayEligible(): boolean  {
        return this.item.type === "array"
    }

    public toggleDescription(): void {
        this.toggleTab("description");
    }

    public toggleSummary(): void {
        this.toggleTab("summary");
    }

    public toggleExample(): void {
        this.toggleTab("example");
    }

    public delete(): void {
        this.onDelete.emit();
    }

    public displayType(): SimplifiedParameterType {
        return SimplifiedPropertyType.fromPropertySchema(this.item);
    }

    public rename(): void {
        this.onRename.emit();
    }

    public setDescription(description: string): void {
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.item, "description", description);
        this.commandService.emit(command);
    }

    public setExample(example: string): void {
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.item, "example", example);
        this.commandService.emit(command);
    }

    public setNumValue(val: string, name: string): void {
        let command: ICommand = CommandFactory.createChangePropertyCommand<number>(this.item, name, Number(val));
        this.commandService.emit(command);
    }

    public setArrayValue(val: string, name: string): void {
        let command: ICommand = CommandFactory.createChangePropertyCommand<Array<any>>(this.item, name, Array(val));
        this.commandService.emit(command);
    }

    public setPattern(pattern: string): void {
            let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.item, "pattern", pattern);
            this.commandService.emit(command);
    }

    public changeRequired(newValue: string): void {
        this.model().required = newValue === "required";
        let nt: SimplifiedPropertyType = SimplifiedPropertyType.fromPropertySchema(this.item);
        nt.required = this.model().required;
        let command: ICommand = CommandFactory.createChangePropertyTypeCommand(this.item, nt);
        this.commandService.emit(command);
    }

    public changeType(newType: SimplifiedType): void {
        let nt: SimplifiedPropertyType = new SimplifiedPropertyType();
        nt.required = this.model().required;
        nt.type = newType.type;
        nt.enum_ = newType.enum_;
        nt.of = newType.of;
        nt.as = newType.as;
        let command: ICommand = CommandFactory.createChangePropertyTypeCommand(this.item, nt);
        this.commandService.emit(command);
        this._model = nt;
        this._ptab = null;
    }

    public setBoolean(val: boolean, name: string): void {
        let command: ICommand = CommandFactory.createChangePropertyCommand<boolean>(this.item, name, val);
        this.commandService.emit(command);
    }

}
