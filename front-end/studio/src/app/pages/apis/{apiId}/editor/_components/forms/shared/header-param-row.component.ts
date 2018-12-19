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
    createChangeParameterTypeCommand,
    createChangePropertyCommand,
    createNewParamCommand,
    ICommand,
    SimplifiedParameterType,
    SimplifiedType
} from "oai-ts-commands";
import {OasCombinedVisitorAdapter, OasDocument, OasOperation, OasParameterBase, OasPathItem} from "oai-ts-core";
import {DropDownOption} from '../../../../../../../components/common/drop-down.component';
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {Subscription} from "rxjs";
import {AbstractBaseComponent} from "../../common/base-component";
import {SelectionService} from "../../../_services/selection.service";


@Component({
    moduleId: module.id,
    selector: "header-param-row",
    templateUrl: "header-param-row.component.html",
    styleUrls: [ "header-param-row.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderParamRowComponent extends AbstractBaseComponent {

    @Input() parameter: OasParameterBase;
    private _overriddenParam: OasParameterBase;

    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();

    protected _editing: boolean = false;
    protected _tab: string = "description";
    protected _model: SimplifiedParameterType = null;
    private _parentType: string;

    private overrideFlag: boolean;
    private missingFlag: boolean;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected onDocumentChange(): void {
        this.updateModel();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (changes["parameter"]) {
            this.updateModel();
        }
    }

    private updateModel(): void {
        this._model = SimplifiedParameterType.fromParameter(this.parameter as any);
        this.missingFlag = this.parameter.n_attribute("missing") === true;
        this._overriddenParam = this.getOverriddenParam(this.parameter);
        this.overrideFlag = this._overriddenParam !== null;
        this._parentType = this.detectParentType();
    }

    public isParentOperation(): boolean {
        return this._parentType === "operation";
    }

    public isParentPath(): boolean {
        return this._parentType === "pathItem";
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
        return this.parameter.description
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
        if (this.isOverridable()) {
            this._editing = false;
            return;
        }
        if (this.isEditing() && this._tab === "description") {
            this._editing = false;
        } else {
            this._editing = true;
            this._tab = "description";
        }
    }

    public toggleSummary(): void {
        if (this.isOverridable()) {
            this._editing = false;
            return;
        }
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

    public changeType(newType: SimplifiedType): void {
        let nt: SimplifiedParameterType = new SimplifiedParameterType();
        nt.required = this.model().required;
        nt.type = newType.type;
        nt.enum = newType.enum;
        nt.of = newType.of;
        nt.as = newType.as;
        let command: ICommand = createChangeParameterTypeCommand(this.parameter.ownerDocument(), this.parameter as any, nt);
        this.commandService.emit(command);
        this._model = nt;
    }

    public override(): void {
        let command: ICommand = createNewParamCommand(this.parameter.ownerDocument(), this.parameter.parent() as any,
            this.parameter.name, "header", null, null, true);
        this.commandService.emit(command);
    }

    public isMissing(): boolean {
        return this.missingFlag && !this.overrideFlag;
    }

    public isExists(): boolean {
        return !this.missingFlag;
    }

    public isOverride(): boolean {
        return !this.missingFlag && this.overrideFlag;
    }

    public isOverridable(): boolean {
        return this.missingFlag && this.overrideFlag;
    }

    public isLocalOnly(): boolean {
        return !this.overrideFlag && !this.missingFlag;
    }

    public getOverriddenParam(param: OasParameterBase): OasParameterBase {
        let viz: DetectOverrideVisitor = new DetectOverrideVisitor(param);
        param.parent().accept(viz);
        return viz.overriddenParam;
    }

    private detectParentType(): string {
        let viz: DetectParentTypeVisitor = new DetectParentTypeVisitor();
        this.parameter.parent().accept(viz);
        return viz.parentType;
    }

}


class DetectOverrideVisitor extends OasCombinedVisitorAdapter {

    public overriddenParam: OasParameterBase = null;

    constructor(private param: OasParameterBase) {
        super();
    }

    public visitOperation(node: OasOperation): void {
        this.overriddenParam = (<OasPathItem>node.parent()).parameter(this.param.in, this.param.name) as OasParameterBase;
    }

}


class DetectParentTypeVisitor extends OasCombinedVisitorAdapter {

    public parentType: string = null;

    public visitOperation(node: OasOperation): void {
        this.parentType = "operation";
    }

    public visitPathItem(node: OasPathItem): void {
        this.parentType = "pathItem";
    }

}
