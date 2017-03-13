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

import {Component, Input, ViewEncapsulation, Output, EventEmitter, ViewChild} from "@angular/core";
import {
    Oas20Operation, Oas20Parameter, JsonSchemaType, Oas20Response,
    Oas20Document, Oas20Schema
} from "oai-ts-core";
import {ICommand} from "../commands.manager";
import {NewRequestBodyCommand} from "../commands/new-request-body.command";
import {ChangeParameterTypeCommand, ChangePathParameterTypeCommand} from "../commands/change-parameter-type.command";
import {ChangePropertyCommand, ChangePathParameterPropertyCommand} from "../commands/change-property.command";
import {
    DeleteNodeCommand, DeleteAllParameters, DeleteParameterCommand,
    DeleteResponseCommand
} from "../commands/delete.command";
import {NewQueryParamCommand} from "../commands/new-query-param.command";
import {NewResponseCommand} from "../commands/new-response.command";
import {ChangeResponseTypeCommand} from "../commands/change-response-type.command";
import {ObjectUtils} from "../../../../../util/common";
import {AddQueryParamDialogComponent} from "./dialogs/add-query-param.component";
import {AddResponseDialogComponent} from "./dialogs/add-response.component";


@Component({
    moduleId: module.id,
    selector: "operation-form",
    templateUrl: "operation-form.component.html",
    encapsulation: ViewEncapsulation.None
})
export class OperationFormComponent {

    @Input() operation: Oas20Operation;
    @Output() onCommand: EventEmitter<ICommand> = new EventEmitter<ICommand>();
    @Output() onDeselect: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild("addQueryParamDialog") public addQueryParamDialog: AddQueryParamDialogComponent;
    @ViewChild("addResponseDialog") public addResponseDialog: AddResponseDialogComponent;

    public summary(): string {
        if (this.operation.summary) {
            return this.operation.summary;
        } else {
            return null;
        }
    }

    public hasSummary(): boolean {
        if (this.operation.summary) {
            return true;
        } else {
            return false;
        }
    }

    public description(): string {
        if (this.operation.description) {
            return this.operation.description;
        } else {
            return null;
        }
    }

    public hasDescription(): boolean {
        if (this.operation.description) {
            return true;
        } else {
            return false;
        }
    }

    public bodyParam(): Oas20Parameter {
        let params: Oas20Parameter[] = this.operation.parameters;
        if (params) {
            for (let param of params) {
                if (param.in === "body") {
                    return param;
                }
            }
        }
        return null;
    }

    public requestBodyType(): string {
        let bodyParam: Oas20Parameter = this.bodyParam();
        if (bodyParam && bodyParam.schema) {
            if (bodyParam.schema.$ref && bodyParam.schema.$ref.indexOf("#/definitions/") === 0) {
                return bodyParam.schema.$ref.substr(14);
            } else {
                return JsonSchemaType[bodyParam.schema.type];
            }
        }
        return "None Selected";
    }

    public hasBodyParam(): boolean {
        if (this.bodyParam() !== null) {
            return true;
        } else {
            return false;
        }
    }

    public bodyDescription(): string {
        let bodyParam: Oas20Parameter = this.bodyParam();
        if (bodyParam === null) {
            return "";
        }
        if (bodyParam.description) {
            return bodyParam.description;
        } else {
            return null;
        }
    }

    public hasBodyDescription(): boolean {
        let bodyParam: Oas20Parameter = this.bodyParam();
        if (bodyParam === null) {
            return false;
        }
        if (bodyParam.description) {
            return true;
        } else {
            return false;
        }
    }

    public parameters(paramType: string): Oas20Parameter[] {
        if (!this.operation.parameters) {
            return [];
        }
        return this.operation.parameters.filter((value) => {
            return value.in === paramType;
        }).sort((param1, param2) => {
            return param1.name.localeCompare(param2.name);
        });
    }

    public pathParameters(): Oas20Parameter[] {
        return this.parameters("path");
    }

    public queryParameters(): Oas20Parameter[] {
        return this.parameters("query");
    }

    public headerParameters(): Oas20Parameter[] {
        return this.parameters("header");
    }

    public hasParameters(type: string): boolean {
        if (!this.operation.parameters) {
            return false;
        }
        return this.operation.parameters.filter((value) => {
            return value.in === type;
        }).length > 0;
    }

    public paramDescription(param: Oas20Parameter): string {
        if (param.description) {
            return param.description;
        } else {
            return null;
        }
    }

    public paramType(param: Oas20Parameter): Oas20Schema {
        if (!ObjectUtils.isNullOrUndefined(param.type)) {
            let schema: Oas20Schema = new Oas20Schema();
            schema.type = param.type;
            schema.format = param.format;
            return schema;
        }
        return param.schema;
    }

    public paramHasDescription(param: Oas20Parameter): boolean {
        if (param.description) {
            return true;
        } else {
            return false;
        }
    }

    public responses(): Oas20Response[] {
        if (!this.operation.responses) {
            return [];
        }
        let rval: Oas20Response[] = [];
        for (let scode of this.operation.responses.responseStatusCodes()) {
            let response: Oas20Response = this.operation.responses.response(scode);
            rval.push(response);
        }
        return rval.sort((a, b) => {
            return a.statusCode().localeCompare(b.statusCode());
        });
    }

    public hasResponses(): boolean {
        if (!this.operation.responses) {
            return false;
        }
        if (this.operation.responses.responseStatusCodes().length === 0) {
            return false;
        }

        return true;
    }

    public responseDescription(response: Oas20Response): string {
        if (response && response.description) {
            return response.description;
        } else {
            return null;
        }
    }

    public hasDefinitions(): boolean {
        if (this.definitionNames()) {
            return true;
        } else {
            return false;
        }
    }

    public definitionNames(): string[] {
        let doc: Oas20Document = <Oas20Document>this.operation.ownerDocument();
        if (ObjectUtils.isNullOrUndefined(doc.definitions)) {
            return [];
        } else {
            return doc.definitions.getItemNames().sort();
        }
    }

    public responseType(response: Oas20Response): Oas20Schema {
        return response.schema;
    }

    public changeSummary(newSummary: string): void {
        let command: ICommand = new ChangePropertyCommand<string>("summary", newSummary, this.operation);
        this.onCommand.emit(command);
    }

    public changeDescription(newDescription: string): void {
        let command: ICommand = new ChangePropertyCommand<string>("description", newDescription, this.operation);
        this.onCommand.emit(command);
    }

    public changeBodyDescription(newBodyDescription: string): void {
        let bodyParam: Oas20Parameter = this.bodyParam();
        let command: ICommand = new ChangePropertyCommand<string>("description", newBodyDescription, bodyParam);
        this.onCommand.emit(command);
    }

    public changeQueryParamDescription(param: Oas20Parameter, newParamDescription: string): void {
        let command: ICommand = new ChangePropertyCommand<string>("description", newParamDescription, param);
        this.onCommand.emit(command);
    }

    public changeQueryParamType(param: Oas20Parameter, newParamType: Oas20Schema): void {
        let type: string = JsonSchemaType[newParamType.type];
        let isSimpleType: boolean = true;
        if (!newParamType.type) {
            if (!newParamType.$ref) {
                return;
            }
            isSimpleType = false;
            type = newParamType.$ref.substr(14);
        }

        let command: ICommand = new ChangeParameterTypeCommand(param, type, isSimpleType);
        this.onCommand.emit(command);
    }

    public changePathParamDescription(param: Oas20Parameter, newParamDescription: string): void {
        let command: ICommand = new ChangePathParameterPropertyCommand<string>("description", newParamDescription, param);
        this.onCommand.emit(command);
    }

    public changePathParamType(param: Oas20Parameter, newParamType: Oas20Schema): void {
        let type: string = JsonSchemaType[newParamType.type];
        let isSimpleType: boolean = true;
        if (!newParamType.type) {
            if (!newParamType.$ref) {
                return;
            }
            isSimpleType = false;
            type = newParamType.$ref.substr(14);
        }

        let command: ICommand = new ChangePathParameterTypeCommand(param, type, isSimpleType);
        this.onCommand.emit(command);
    }

    public changeResponseType(response: Oas20Response, newResponseType: Oas20Schema): void {
        let type: string = JsonSchemaType[newResponseType.type];
        let isSimpleType: boolean = true;
        if (!newResponseType.type) {
            if (!newResponseType.$ref) {
                return;
            }
            isSimpleType = false;
            type = newResponseType.$ref.substr(14);
        }

        let command: ICommand = new ChangeResponseTypeCommand(response, type, isSimpleType);
        this.onCommand.emit(command);
    }

    public changeResponseDescription(response: Oas20Response, newDescription: string): void {
        let command: ICommand = new ChangePropertyCommand<string>("description", newDescription, response);
        this.onCommand.emit(command);
    }

    public createRequestBody(): void {
        let command: ICommand = new NewRequestBodyCommand(this.operation);
        this.onCommand.emit(command);
    }

    public setRequestBodyType(type: string, isSimpleType: boolean): void {
        let command: ICommand = new ChangeParameterTypeCommand(this.bodyParam(), type, isSimpleType);
        this.onCommand.emit(command);
    }

    public delete(): void {
        let command: ICommand = new DeleteNodeCommand(this.operation.method(), this.operation.parent());
        this.onCommand.emit(command);
        this.onDeselect.emit(true);
    }

    public deleteRequestBody(): void {
        let command: ICommand = new DeleteAllParameters(this.operation, "body");
        this.onCommand.emit(command);
    }

    public deleteAllQueryParams(): void {
        let command: ICommand = new DeleteAllParameters(this.operation, "query");
        this.onCommand.emit(command);
    }

    public deleteAllResponses(): void {
        let command: ICommand = new DeleteNodeCommand("responses", this.operation);
        this.onCommand.emit(command);
    }

    public deleteQueryParam(parameter: Oas20Parameter): void {
        let command: ICommand = new DeleteParameterCommand(parameter);
        this.onCommand.emit(command);
    }

    public deleteResponse(response: Oas20Response): void {
        let command: ICommand = new DeleteResponseCommand(response);
        this.onCommand.emit(command);
    }

    public openAddQueryParamModal(): void {
        this.addQueryParamDialog.open();
    }

    public addQueryParam(name: string): void {
        let command: ICommand = new NewQueryParamCommand(this.operation, name);
        this.onCommand.emit(command);
    }

    public openAddResponseModal(): void {
        this.addResponseDialog.open("200");
    }

    public addResponse(statusCode: string): void {
        let command: ICommand = new NewResponseCommand(this.operation, statusCode);
        this.onCommand.emit(command);
    }
}
