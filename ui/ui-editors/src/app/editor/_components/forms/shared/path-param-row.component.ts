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
    CombinedVisitorAdapter,
    CommandFactory,
    DocumentType,
    ICommand,
    Library,
    Oas30Example,
    Oas30Parameter,
    OasDocument,
    OasOperation,
    OasParameter,
    OasPathItem,
    Schema,
    SimplifiedParameterType,
    SimplifiedType
} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {EditExampleEvent} from "../../dialogs/edit-example.component";
import {AbstractRowComponent} from "../../common/item-row.abstract";


@Component({
    selector: "path-param-row",
    templateUrl: "path-param-row.component.html",
    styleUrls: [ "path-param-row.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PathParamRowComponent extends AbstractRowComponent<OasParameter, SimplifiedParameterType> {

    private _overriddenParam: OasParameter;

    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();

    private overrideFlag: boolean;
    private missingFlag: boolean;
    private _parentType: string;

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

    public is3xDocument(): boolean {
        return (<OasDocument> this.item.ownerDocument()).is3xDocument();
    }

    public hasExamples(): boolean {
        if (this.item instanceof Oas30Parameter) {
            return this.paramExamples().length > 0;
        }
        return false;
    }

    public paramExamples(): Oas30Example[] {
        return <any>(<Oas30Parameter> this.item).getExamples();
    }

    public exampleValue(example: Oas30Example): string {
        let evalue: any = example.value;
        if (typeof evalue === "object" || Array.isArray(evalue)) {
            evalue = JSON.stringify(evalue);
        }
        return evalue;
    }

    public description(): string {
        return this.item.description
    }

    public isEditingDescription(): boolean {
        return this.isEditingTab("description");
    }

    public isEditingSummary(): boolean {
        return this.isEditingTab("summary");
    }

    public isEditingExamples(): boolean {
        return this.isEditingTab("examples");
    }

    public toggleDescription(): void {
        if (this.isOverridable() || this.isMissing()) {
            this._editing = false;
            return;
        }
        this.toggleTab("description");
    }

    public toggleSummary(): void {
        if (this.isOverridable() || this.isMissing()) {
            this._editing = false;
            return;
        }
        this.toggleTab("summary");
    }

    public toggleExamples(): void {
        if (this.isOverridable() || this.isMissing()) {
            this._editing = false;
            return;
        }
        this.toggleTab("examples");
    }

    public delete(): void {
        this.onDelete.emit();
    }

    public displayType(): SimplifiedParameterType {
        return SimplifiedParameterType.fromParameter(this.item as any);
    }

    public displayExamples(): string {
        if (this.hasExamples()) {
            return `${this.paramExamples().length} example(s) defined.`;
        } else {
            return "No examples defined."
        }
    }

    public rename(): void {
        // TODO implement this!
        alert("Not yet implemented.");
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

    public addExample(exampleData: any): void {
        var param = <Oas30Parameter> this.item;
        let command: ICommand = CommandFactory.createAddParameterExampleCommand(param,
            exampleData.value, exampleData.name, null, null);
        this.commandService.emit(command);
        let nodePath = Library.createNodePath(this.item);
        nodePath.appendSegment("examples", false);
        this.__selectionService.select(nodePath.toString());
    }

    public deleteExample(example: Oas30Example): void {
        console.info("[PathParamRowComponent] Deleting an example of a path parameter.");
        let command: ICommand = CommandFactory.createDeleteParameterExampleCommand(example);
        this.commandService.emit(command);
    }

    public deleteAllExamples(): void {
        var param = <Oas30Parameter> this.item;
        let command: ICommand = CommandFactory.createDeleteAllParameterExamplesCommand(param);
        this.commandService.emit(command);
    }

    public editExample(event: EditExampleEvent): void {
        console.info("[PathParamRowComponent] Changing the value of a Parameter example.");
        if (this.item.ownerDocument().getDocumentType() === DocumentType.openapi3) {
            let command: ICommand = CommandFactory.createSetParameterExampleCommand(<Oas30Parameter>this.item,
                event.value, event.example.getName());
            this.commandService.emit(command);
        }
    }

    public schemaForExample(): Schema {
        var param = <Oas30Parameter> this.item;
        return param.schema;
    }

    public create(): void {
        let command: ICommand = CommandFactory.createNewParamCommand(this.item.parent() as any,
            this.item.name, "path", null, null, false);
        this.commandService.emit(command);
        let nodePath = Library.createNodePath(this.item.parent());
        let index: number = (this.item.parent() as any).parameters.findIndex(p => p.name === this.item.name); // TODO hackish
        nodePath.appendSegment("parameters", false);
        nodePath.appendSegment(String(index), true);
        this.__selectionService.select(nodePath.toString());
    }

    public override(): void {
        let command: ICommand = CommandFactory.createNewParamCommand(this.item.parent() as any,
            this.item.name, "path", null, null, true);
        this.commandService.emit(command);
        let nodePath = Library.createNodePath(this.item.parent());
        let index: number = (this.item.parent() as any).parameters.findIndex(p => p.name === this.item.name); // TODO hackish
        nodePath.appendSegment("parameters", false);
        nodePath.appendSegment(String(index), true);
        this.__selectionService.select(nodePath.toString());
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
        return this.isInherited();
    }

    public isInherited(): boolean {
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
