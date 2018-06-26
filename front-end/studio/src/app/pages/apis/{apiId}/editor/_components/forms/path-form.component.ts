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

import {Component, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {Oas30PathItem, OasDocument, OasOperation, OasParameterBase, OasPathItem, OasPaths} from "oai-ts-core";
import {
    createAddPathItemCommand,
    createChangeParameterTypeCommand,
    createChangePropertyCommand,
    createDeleteAllParametersCommand,
    createDeleteOperationCommand,
    createDeleteParameterCommand,
    createDeletePathCommand,
    createNewOperationCommand,
    createNewParamCommand,
    createNewPathCommand,
    createReplacePathItemCommand,
    ICommand,
    SimplifiedParameterType
} from "oai-ts-commands";
import {SourceFormComponent} from "./source-form.base";
import {ModelUtils} from "../../_util/model.util";
import {AddQueryParamDialogComponent} from "../dialogs/add-query-param.component";
import {ClonePathDialogComponent} from "../dialogs/clone-path.component";
import {AddPathDialogComponent} from "../dialogs/add-path.component";


@Component({
    moduleId: module.id,
    selector: "path-form",
    templateUrl: "path-form.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PathFormComponent extends SourceFormComponent<OasPathItem> {

    protected _path: OasPathItem;
    @Input()
    set path(path: OasPathItem) {
        this._path = path;
        this.sourceNode = path;
        this.revertSource();
    }
    get path(): OasPathItem {
        return this._path;
    }

    @ViewChild("addQueryParamDialog") public addQueryParamDialog: AddQueryParamDialogComponent;
    @ViewChild("clonePathDialog") clonePathDialog: ClonePathDialogComponent;
    @ViewChild("addPathDialog") addPathDialog: AddPathDialogComponent;

    protected createEmptyNodeForSource(): OasPathItem {
        return (<OasPaths>this.path.parent()).createPathItem(this.path.path());
    }

    protected createReplaceNodeCommand(node: OasPathItem): ICommand {
        return createReplacePathItemCommand(this.path.ownerDocument(), this.path as any, node as any);
    }

    public document(): OasDocument {
        return this.path.ownerDocument();
    }

    public trace(): OasOperation {
        return (this.path as Oas30PathItem).trace;
    }

    public hasGet(): boolean {
        return this.path.get !== undefined && this.path.get !== null;
    }
    public hasPut(): boolean {
        return this.path.put !== undefined && this.path.put !== null;
    }
    public hasPost(): boolean {
        return this.path.post !== undefined && this.path.post !== null;
    }
    public hasDelete(): boolean {
        return this.path.delete !== undefined && this.path.delete !== null;
    }
    public hasOptions(): boolean {
        return this.path.options !== undefined && this.path.options !== null;
    }
    public hasHead(): boolean {
        return this.path.head !== undefined && this.path.head !== null;
    }
    public hasPatch(): boolean {
        return this.path.patch !== undefined && this.path.patch !== null;
    }
    public hasTrace(): boolean {
        return this.trace() !== undefined && this.trace() !== null;
    }

    public getSummary(): string {
        return this.summary(this.path.get);
    }

    public putSummary(): string {
        return this.summary(this.path.put);
    }

    public postSummary(): string {
        return this.summary(this.path.post);
    }

    public deleteSummary(): string {
        return this.summary(this.path.delete);
    }

    public optionsSummary(): string {
        return this.summary(this.path.options);
    }

    public patchSummary(): string {
        return this.summary(this.path.patch);
    }

    public headSummary(): string {
        return this.summary(this.path.head);
    }

    public traceSummary(): string {
        return this.summary(this.trace());
    }

    private summary(operation: OasOperation): string {
        if (operation === null || operation === undefined) {
            return "Not Supported";
        } else {
            if (operation.summary) {
                return operation.summary;
            } else {
                return null;
            }
        }
    }

    public getDescription(): string {
        return this.description(this.path.get);
    }

    public putDescription(): string {
        return this.description(this.path.put);
    }

    public postDescription(): string {
        return this.description(this.path.post);
    }

    public deleteDescription(): string {
        return this.description(this.path.delete);
    }

    public optionsDescription(): string {
        return this.description(this.path.options);
    }

    public patchDescription(): string {
        return this.description(this.path.patch);
    }

    public headDescription(): string {
        return this.description(this.path.head);
    }

    public traceDescription(): string {
        return this.description(this.trace());
    }

    private description(operation: OasOperation): string {
        if (operation === null || operation === undefined) {
            return "Not Supported";
        } else {
            if (operation.description) {
                return operation.description;
            } else {
                return null;
            }
        }
    }

    public selectOperation(operation: OasOperation): void {
        this.selectionService.selectNode(operation, operation.ownerDocument());
    }

    public createOperation(operationType: string): void {
        let command: ICommand = createNewOperationCommand(this.path.ownerDocument(), this.path.path(), operationType);
        this.commandService.emit(command);
    }

    public deleteOperation(operationType: string): void {
        let command: ICommand = createDeleteOperationCommand(this.document(), operationType, this.path);
        this.commandService.emit(command);
    }

    public changeSummary(newSummary: string, operation: OasOperation): void {
        let command: ICommand = createChangePropertyCommand<string>(this.path.ownerDocument(), operation, "summary", newSummary);
        this.commandService.emit(command);
    }

    public changeDescription(newDescription: string, operation: OasOperation): void {
        let command: ICommand = createChangePropertyCommand<string>(this.path.ownerDocument(), operation, "description", newDescription);
        this.commandService.emit(command);
    }

    public delete(): void {
        let command: ICommand = createDeletePathCommand(this.path.ownerDocument(), this.path.path());
        this.commandService.emit(command);
    }

    public newPath(): void {
        this.addPathDialog.open(this.path.ownerDocument(), this.path.path());
    }

    public addPath(path: string): void {
        let command: ICommand = createNewPathCommand(this.path.ownerDocument(), path);
        this.commandService.emit(command);
    }

    public clone(modalData?: any): void {
        if (undefined === modalData || modalData === null) {
            this.clonePathDialog.open(this.path.ownerDocument(), this.path);
        } else {
            let pathItem: OasPathItem = modalData.object;
            console.info("[PathFormComponent] Clone path item: %s", modalData.path);
            let cloneSrcObj: any = this.oasLibrary().writeNode(pathItem);
            let command: ICommand = createAddPathItemCommand(this.path.ownerDocument(), modalData.path, cloneSrcObj);
            this.commandService.emit(command);
        }
    }

    public canHavePathParams(): boolean {
        return this.path.path().indexOf('{') != -1;
    }

    public pathParam(paramName: string): OasParameterBase {
        let param: OasParameterBase = this.path.parameter("path", paramName) as OasParameterBase;

        if (param === null) {
            param = this.path.createParameter();
            param.in = "path";
            param.name = paramName;
            param.required = true;
            param.n_attribute("missing", true);
        }

        return param;
    }

    public pathParameters(): OasParameterBase[] {
        let pathParamNames: string[] = ModelUtils.detectPathParamNames(this.path.path());
        return pathParamNames.map( pname => {
            return this.pathParam(pname);
        });
    }

    public hasParameters(type: string): boolean {
        if (!this.path.parameters) {
            return false;
        }
        return this.path.parameters.filter((value) => {
                return value.in === type;
            }).length > 0;
    }

    public parameters(paramType: string): OasParameterBase[] {
        if (!this.path.parameters) {
            return [];
        }
        let params: OasParameterBase[] = this.path.parameters;
        return params.filter( value => {
            return value.in === paramType;
        }).sort((param1, param2) => {
            return param1.name.localeCompare(param2.name);
        });
    }

    public createPathParam(paramName: string): void {
        let command: ICommand = createNewParamCommand(this.path.ownerDocument(), this.path as any, paramName, "path");
        this.commandService.emit(command);
    }

    public changeParamDescription(param: OasParameterBase, newParamDescription: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.path.ownerDocument(), param, "description", newParamDescription);
        this.commandService.emit(command);
    }

    public changeParamType(param: OasParameterBase, newType: SimplifiedParameterType): void {
        let command: ICommand = createChangeParameterTypeCommand(this.path.ownerDocument(), param as any, newType);
        this.commandService.emit(command);
    }

    public queryParameters(): OasParameterBase[] {
        return this.parameters("query");
    }

    public deleteParam(parameter: OasParameterBase): void {
        let command: ICommand = createDeleteParameterCommand(this.path.ownerDocument(), parameter as any);
        this.commandService.emit(command);
    }

    public openAddQueryParamModal(): void {
        this.addQueryParamDialog.open();
    }

    public addQueryParam(name: string): void {
        let command: ICommand = createNewParamCommand(this.path.ownerDocument(), this.path as any, name, "query");
        this.commandService.emit(command);
    }

    public deleteAllQueryParams(): void {
        let command: ICommand = createDeleteAllParametersCommand(this.path.ownerDocument(), this.path as any, "query");
        this.commandService.emit(command);
    }

    public enableSourceMode(): void {
        this.sourceNode = this.path;
        super.enableSourceMode();
    }

    public supportsTraceOperation(): boolean {
        return this.document().is3xDocument();
    }
}
