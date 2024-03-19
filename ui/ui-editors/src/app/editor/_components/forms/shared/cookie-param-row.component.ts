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
import {
    CombinedVisitorAdapter, CommandFactory,
    ICommand,
    OasOperation,
    OasParameter,
    OasPathItem,
    SimplifiedParameterType,
    SimplifiedType
} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {AbstractRowComponent} from "../../common/item-row.abstract";
import {DropDownOption, DropDownOptionValue} from "../../common/drop-down.component";


// TODO combine with Query Param Row (and Header Param Row) to share code/logic
@Component({
    selector: "cookie-param-row",
    templateUrl: "cookie-param-row.component.html",
    styleUrls: [ "cookie-param-row.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CookieParamRowComponent extends AbstractRowComponent<OasParameter, SimplifiedParameterType> {

    private _overriddenParam: OasParameter;

    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();
    @Output() onRename: EventEmitter<void> = new EventEmitter<void>();

    private _parentType: string;

    private overrideFlag: boolean;
    private missingFlag: boolean;

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
        this._model = SimplifiedParameterType.fromParameter(this.item as any);
        this.missingFlag = this.item.getAttribute("missing") === true;
        this._overriddenParam = this.getOverriddenParam(this.item);
        this.overrideFlag = this._overriddenParam !== null;
        this._parentType = this.detectParentType();
    }

    public isParentOperation(): boolean {
        return this._parentType === "operation";
    }

    public isParentPath(): boolean {
        return this._parentType === "pathItem";
    }

    public isParameter(): boolean {
        return true;
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
        return this.item.required;
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

    public isEditingDescription(): boolean {
        return this.isEditingTab("description");
    }

    public isEditingSummary(): boolean {
        return this.isEditingTab("summary");
    }

    public toggleDescription(): void {
        if (this.isOverridable()) {
            this._editing = false;
            return;
        }
        this.toggleTab("description");
    }

    public toggleSummary(): void {
        if (this.isOverridable()) {
            this._editing = false;
            return;
        }
        this.toggleTab("summary");
    }

    public delete(): void {
        this.onDelete.emit();
    }

    public displayType(): SimplifiedParameterType {
        return SimplifiedParameterType.fromParameter(this.item as any);
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
        let command: ICommand = CommandFactory.createChangePropertyCommand<boolean>(this.item, "required", this.model().required);
        this.commandService.emit(command);
    }

    public changeType(newType: SimplifiedType): void {
        let nt: SimplifiedParameterType = new SimplifiedParameterType();
        nt.required = this.model().required;
        nt.type = newType.type;
        nt.enum_ = newType.enum_;
        nt.of = newType.of;
        nt.as = newType.as;
        let command: ICommand = CommandFactory.createChangeParameterTypeCommand(this.item.ownerDocument().getDocumentType(),
            this.item as any, nt);
        this.commandService.emit(command);
        this._model = nt;
    }

    public override(): void {
        let command: ICommand = CommandFactory.createNewParamCommand(this.item.parent() as any,
            this.item.name, "cookie", null, null, true);
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

    public getOverriddenParam(param: OasParameter): OasParameter {
        let viz: DetectOverrideVisitor = new DetectOverrideVisitor(param);
        param.parent().accept(viz);
        return viz.overriddenParam;
    }

    private detectParentType(): string {
        let viz: DetectParentTypeVisitor = new DetectParentTypeVisitor();
        this.item.parent().accept(viz);
        return viz.parentType;
    }

}


class DetectOverrideVisitor extends CombinedVisitorAdapter {

    public overriddenParam: OasParameter = null;

    constructor(private param: OasParameter) {
        super();
    }

    public visitOperation(node: OasOperation): void {
        this.overriddenParam = (<OasPathItem>node.parent()).getParameter(this.param.in, this.param.name) as OasParameter;
    }

}


class DetectParentTypeVisitor extends CombinedVisitorAdapter {

    public parentType: string = null;

    public visitOperation(node: OasOperation): void {
        this.parentType = "operation";
    }

    public visitPathItem(node: OasPathItem): void {
        this.parentType = "pathItem";
    }

}
