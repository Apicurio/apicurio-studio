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
    Component,
    EventEmitter,
    Input,
    OnChanges, OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from "@angular/core";
import {
    createChangeParameterTypeCommand,
    createChangePropertyCommand,
    ICommand,
    SimplifiedParameterType,
    SimplifiedType
} from "oai-ts-commands";
import {OasDocument, OasParameterBase} from "oai-ts-core";
import {DropDownOption} from '../../../../../../../components/common/drop-down.component';
import {CommandService} from "../../../_services/command.service";
import {TypedRow} from "../shared/typed-row.base";
import {Subscription} from "rxjs";
import {DocumentService} from "../../../_services/document.service";


@Component({
    moduleId: module.id,
    selector: "formData-param-row",
    templateUrl: "formData-param-row.component.html",
    styleUrls: [ "formData-param-row.component.css" ],
    encapsulation: ViewEncapsulation.None
})
export class FormDataParamRowComponent extends TypedRow implements OnChanges, OnInit, OnDestroy {

    @Input() parameter: OasParameterBase;

    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();

    protected _editing: boolean = false;
    protected _tab: string = "description";
    protected _model: SimplifiedParameterType = null;
    private _docSub: Subscription;

    constructor(private commandService: CommandService, private documentService: DocumentService) { super(); }

    public ngOnInit(): void {
        this._docSub = this.documentService.change().subscribe( () => {
            this._model = SimplifiedParameterType.fromParameter(this.parameter as any);
        });
    }

    public ngOnDestroy(): void {
        this._docSub.unsubscribe();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["parameter"]) {
            this._model = SimplifiedParameterType.fromParameter(this.parameter as any);
        }
    }

    public model(): SimplifiedParameterType {
        return this._model;
    }

    public document(): OasDocument {
        return this.parameter.ownerDocument();
    }

    public isParameter(): boolean {
        return true;
    }

    public hasDescription(): boolean {
        if (this.parameter.description) {
            return true;
        } else {
            return false;
        }
    }

    public description(): string {
        if (this.parameter.description) {
            return this.parameter.description
        } else {
            return "No description.";
        }
    }

    public isRequired(): boolean {
        return this.parameter.required;
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
        return SimplifiedParameterType.fromParameter(this.parameter as any);
    }

    public rename(): void {
        // TODO implement this!
        alert("Not yet implemented.");
    }

    public setDescription(description: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.parameter.ownerDocument(), this.parameter, "description", description);
        this.commandService.emit(command);
    }

    public changeRequired(newValue: string): void {
        this.model().required = newValue === "required";
        let command: ICommand = createChangePropertyCommand<boolean>(this.parameter.ownerDocument(), this.parameter, "required", this.model().required);
        this.commandService.emit(command);
    }

    public changeType(type: string): void {
        let nt: SimplifiedParameterType = new SimplifiedParameterType();
        nt.required = this.model().required;
        nt.type = type;
        nt.of = null;
        nt.as = null;
        let command: ICommand = createChangeParameterTypeCommand(this.parameter.ownerDocument(), this.parameter as any, nt);
        this.commandService.emit(command);
        this._model = nt;
    }

    public changeTypeOf(typeOf: string): void {
        let nt: SimplifiedParameterType = SimplifiedParameterType.fromParameter(this.parameter as any);
        nt.required = this.model().required;
        nt.of = new SimplifiedType();
        nt.of.type = typeOf;
        nt.as = null;
        let command: ICommand = createChangeParameterTypeCommand(this.parameter.ownerDocument(), this.parameter as any, nt);
        this.commandService.emit(command);
        this._model = nt;
    }

    public changeTypeAs(typeAs: string): void {
        let nt: SimplifiedParameterType = SimplifiedParameterType.fromParameter(this.parameter as any);
        nt.required = this.model().required;
        if (nt.isSimpleType()) {
            nt.as = typeAs;
        }
        if (nt.isArray() && nt.of) {
            nt.of.as = typeAs;
        }
        let command: ICommand = createChangeParameterTypeCommand(this.parameter.ownerDocument(), this.parameter as any, nt);
        this.commandService.emit(command);
        this._model = nt;
    }

}
