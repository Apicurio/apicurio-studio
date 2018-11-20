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
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from "@angular/core";
import {
    createChangePropertyCommand,
    createChangePropertyTypeCommand,
    ICommand,
    SimplifiedParameterType,
    SimplifiedPropertyType,
    SimplifiedType
} from "oai-ts-commands";
import {Oas20PropertySchema, Oas30PropertySchema, OasDocument} from "oai-ts-core";
import {DropDownOption} from '../../../../../../../components/common/drop-down.component';
import {CommandService} from "../../../_services/command.service";
import {Subscription} from "rxjs";
import {DocumentService} from "../../../_services/document.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {SelectionService} from "../../../_services/selection.service";


@Component({
    moduleId: module.id,
    selector: "property-row",
    templateUrl: "property-row.component.html",
    styleUrls: [ "property-row.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyRowComponent extends AbstractBaseComponent {

    @Input() property: Oas20PropertySchema | Oas30PropertySchema;

    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();

    protected _editing: boolean = false;
    protected _tab: string = "description";
    protected _model: SimplifiedParameterType = null;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected onDocumentChange(): void {
        this._model = SimplifiedPropertyType.fromPropertySchema(this.property);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["property"]) {
            this._model = SimplifiedPropertyType.fromPropertySchema(this.property);
        }
    }

    public model(): SimplifiedParameterType {
        return this._model;
    }

    public document(): OasDocument {
        return this.property.ownerDocument();
    }

    public isParameter(): boolean {
        return false;
    }

    public hasDescription(): boolean {
        if (this.property.description) {
            return true;
        } else {
            return false;
        }
    }

    public description(): string {
        return this.property.description
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
        this.model().required = newValue === "required";
        let nt: SimplifiedPropertyType = SimplifiedPropertyType.fromPropertySchema(this.property);
        nt.required = this.model().required;
        let command: ICommand = createChangePropertyTypeCommand(this.property.ownerDocument(), this.property, nt);
        this.commandService.emit(command);
    }

    public changeType(newType: SimplifiedType): void {
        let nt: SimplifiedPropertyType = new SimplifiedPropertyType();
        nt.required = this.model().required;
        nt.type = newType.type;
        nt.enum = newType.enum;
        nt.of = newType.of;
        nt.as = newType.as;
        let command: ICommand = createChangePropertyTypeCommand(this.property.ownerDocument(), this.property, nt);
        this.commandService.emit(command);
        this._model = nt;
    }

}
