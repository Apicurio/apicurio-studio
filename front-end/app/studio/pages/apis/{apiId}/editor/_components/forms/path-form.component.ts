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
import {Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from "@angular/core";
import {Oas20Document, Oas20Operation, Oas20Parameter, Oas20PathItem, Oas20Paths, OasOperation} from "oai-ts-core";
import {ICommand} from "../../_services/commands.manager";
import {NewOperationCommand} from "../../_commands/new-operation.command";
import {ChangePropertyCommand} from "../../_commands/change-property.command";
import {DeleteAllParameters, DeleteParameterCommand, DeletePathCommand} from "../../_commands/delete.command";
import {NodeSelectionEvent, SourceFormComponent} from "./source-form.base";
import {ReplacePathItemCommand} from "../../_commands/replace.command";
import {ModelUtils} from "../../_util/model.util";
import {SimplifiedType} from "../../_models/simplified-type.model";
import {ChangeParameterTypeCommand} from "../../_commands/change-parameter-type.command";
import {NewParamCommand} from "../../_commands/new-param.command";
import {AddQueryParamDialogComponent} from "../dialogs/add-query-param.component";


@Component({
    moduleId: module.id,
    selector: "path-form",
    templateUrl: "path-form.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PathFormComponent extends SourceFormComponent<Oas20PathItem> {

    protected _path: Oas20PathItem;
    @Input()
    set path(path: Oas20PathItem) {
        this._path = path;
        this.sourceNode = path;
    }
    get path(): Oas20PathItem {
        return this._path;
    }

    @Output() onDeselect: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild("addQueryParamDialog") public addQueryParamDialog: AddQueryParamDialogComponent;

    protected createEmptyNodeForSource(): Oas20PathItem {
        return (<Oas20Paths>this.path.parent()).createPathItem(this.path.path());
    }

    protected createReplaceNodeCommand(node: Oas20PathItem) {
        return new ReplacePathItemCommand(this.path, node);
    }

    public document(): Oas20Document {
        return <Oas20Document>this.path.ownerDocument();
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

    public selectOperation(operation: Oas20Operation): void {
        this.onNodeSelected.emit(new NodeSelectionEvent(operation, "operation"));
    }

    public createOperation(operationType: string): void {
        let command: ICommand = new NewOperationCommand(this.path.path(), operationType);
        this.onCommand.emit(command);
    }

    public changeSummary(newSummary: string, operation: Oas20Operation): void {
        let command: ICommand = new ChangePropertyCommand<string>("summary", newSummary, operation);
        this.onCommand.emit(command);
    }

    public changeDescription(newDescription: string, operation: Oas20Operation): void {
        let command: ICommand = new ChangePropertyCommand<string>("description", newDescription, operation);
        this.onCommand.emit(command);
    }

    public delete(): void {
        let command: ICommand = new DeletePathCommand(this.path.path());
        this.onCommand.emit(command);
        this.onDeselect.emit(true);
    }

    public canHavePathParams(): boolean {
        return this.path.path().indexOf('{') != -1;
    }

    public pathParam(paramName: string): Oas20Parameter {
        let param: Oas20Parameter = this.path.parameter("path", paramName) as Oas20Parameter;

        if (param === null) {
            param = this.path.createParameter();
            param.in = "path";
            param.name = paramName;
            param.required = true;
            param.n_attribute("missing", true);
        }

        return param;
    }

    public pathParameters(): Oas20Parameter[] {
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

    public parameters(paramType: string): Oas20Parameter[] {
        if (!this.path.parameters) {
            return [];
        }
        let params: Oas20Parameter[] = this.path.parameters as Oas20Parameter[];
        return params.filter( value => {
            return value.in === paramType;
        }).sort((param1, param2) => {
            return param1.name.localeCompare(param2.name);
        });
    }

    public createPathParam(paramName: string): void {
        let command: ICommand = new NewParamCommand(this.path, paramName, "path");
        this.onCommand.emit(command);
    }

    public changeParamDescription(param: Oas20Parameter, newParamDescription: string): void {
        let command: ICommand = new ChangePropertyCommand<string>("description", newParamDescription, param);
        this.onCommand.emit(command);
    }

    public changeParamType(param: Oas20Parameter, newType: SimplifiedType): void {
        let command: ICommand = new ChangeParameterTypeCommand(param, newType);
        this.onCommand.emit(command);
    }

    public queryParameters(): Oas20Parameter[] {
        return this.parameters("query");
    }

    public deleteParam(parameter: Oas20Parameter): void {
        let command: ICommand = new DeleteParameterCommand(parameter);
        this.onCommand.emit(command);
    }

    public openAddQueryParamModal(): void {
        this.addQueryParamDialog.open();
    }

    public addQueryParam(name: string): void {
        let command: ICommand = new NewParamCommand(this.path, name, "query");
        this.onCommand.emit(command);
    }

    public deleteAllQueryParams(): void {
        let command: ICommand = new DeleteAllParameters(this.path, "query");
        this.onCommand.emit(command);
    }

    public formType(): string {
        return "path";
    }

    public enableSourceMode(): void {
        this.sourceNode = this.path;
        super.enableSourceMode();
    }

}
