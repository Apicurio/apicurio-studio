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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Output,
    ViewEncapsulation
} from "@angular/core";
import {DropDownOption, DropDownOptionValue as Value} from '../../../../../../../components/common/drop-down.component';
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {AbstractRowComponent} from "../../common/item-row.abstract";
import {
    CommandFactory,
    ICommand,
    Oas20Schema,
    Oas30Schema,
    SimplifiedParameterType,
    SimplifiedPropertyType, SimplifiedType
} from "apicurio-data-models";
import Oas20PropertySchema = Oas20Schema.Oas20PropertySchema;
import Oas30PropertySchema = Oas30Schema.Oas30PropertySchema;


@Component({
    moduleId: module.id,
    selector: "property-row",
    templateUrl: "property-row.component.html",
    styleUrls: [ "property-row.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyRowComponent extends AbstractRowComponent<Oas20PropertySchema | Oas30PropertySchema, SimplifiedPropertyType> {

    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();
    @Output() onRename: EventEmitter<void> = new EventEmitter<void>();

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

    public description(): string {
        return this.item.description
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
            new Value("Required", "required"),
            new Value("Not Required", "not-required")
        ];
    }

    public isEditingDescription(): boolean {
        return this.isEditingTab("description");
    }

    public isEditingSummary(): boolean {
        return this.isEditingTab("summary");
    }

    public toggleDescription(): void {
        this.toggleTab("description");
    }

    public toggleSummary(): void {
        this.toggleTab("summary");
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
    }

}
