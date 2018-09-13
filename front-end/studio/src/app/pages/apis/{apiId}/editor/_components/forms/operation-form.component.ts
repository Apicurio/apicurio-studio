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
import {Oas20Document, Oas20Operation, Oas20Parameter, Oas20PathItem, Oas20Response, OasPathItem} from "oai-ts-core";
import {
    createChangeParameterTypeCommand,
    createChangePropertyCommand,
    createChangeResponseTypeCommand,
    createDeleteAllParametersCommand,
    createDeleteAllResponsesCommand,
    createDeleteOperationCommand,
    createDeleteParameterCommand,
    createDeleteResponseCommand,
    createNewParamCommand,
    createNewRequestBodyCommand,
    createNewResponseCommand,
    createReplaceOperationCommand,
    ICommand,
    SimplifiedParameterType,
    SimplifiedType
} from "oai-ts-commands";
import {AddResponseDialogComponent} from "../dialogs/add-response.component";
import {SourceFormComponent} from "./source-form.base";
import {ObjectUtils} from "../../_util/object.util";
import {AddFormDataParamDialogComponent} from "../dialogs/add-formData-param.component";
import {DropDownOption} from '../../../../../../components/common/drop-down.component';
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";


@Component({
    moduleId: module.id,
    selector: "operation-form",
    templateUrl: "operation-form.component.html",
    encapsulation: ViewEncapsulation.None
})
export class OperationFormComponent extends SourceFormComponent<Oas20Operation> {

    protected _operation: Oas20Operation;
    @Input()
    set operation(operation: Oas20Operation) {
        this._operation = operation;
        this.sourceNode = operation;
        this.revertSource();
    }
    get operation(): Oas20Operation {
        return this._operation;
    }

    @ViewChild("addFormDataParamDialog") public addFormDataParamDialog: AddFormDataParamDialogComponent;
    @ViewChild("addResponseDialog") public addResponseDialog: AddResponseDialogComponent;

    /**
     * C'tor.
     * @param selectionService
     * @param commandService
     */
    constructor(protected selectionService: SelectionService, protected commandService: CommandService) {
        super(selectionService, commandService);
    }

    protected createEmptyNodeForSource(): Oas20Operation {
        return (<Oas20PathItem>this.operation.parent()).createOperation(this.operation.method());
    }

    protected createReplaceNodeCommand(node: Oas20Operation): ICommand {
        return createReplaceOperationCommand(this.operation.ownerDocument(), this.operation, node);
    }

    public summary(): string {
        if (this.operation.summary) {
            return this.operation.summary;
        } else {
            return null;
        }
    }

    public operationId(): string {
        if (this.operation.operationId) {
            return this.operation.operationId;
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
        let params: Oas20Parameter[] = this.operation.parameters as Oas20Parameter[];
        if (params) {
            for (let param of params) {
                if (param.in === "body") {
                    return param;
                }
            }
        }
        return null;
    }

    public requestBodyParams(): Oas20Parameter[] {
        let params: Oas20Parameter[] = this.operation.getParameters("body") as Oas20Parameter[];
        this.operation.getParameters("formData").forEach( param => {
            params.push(param as Oas20Parameter);
        });
        return params;
    }

    public requestBodyType(): string {
        let bodyParam: Oas20Parameter = this.bodyParam();
        if (bodyParam && bodyParam.schema) {
            return SimplifiedType.fromSchema(bodyParam.schema).type;
        }
        return null;
    }

    public requestBodyTypeOf(): string {
        let bodyParam: Oas20Parameter = this.bodyParam();
        if (bodyParam && bodyParam.schema) {
            let st: SimplifiedType = SimplifiedType.fromSchema(bodyParam.schema);
            if (st.of) {
                return st.of.type;
            }
        }
        return null;
    }

    public requestBodyTypeAs(): string {
        let bodyParam: Oas20Parameter = this.bodyParam();
        if (bodyParam && bodyParam.schema) {
            let st: SimplifiedType = SimplifiedType.fromSchema(bodyParam.schema);
            if (st.isArray() && st.of) {
                return st.of.as;
            }
            if (st.isSimpleType()) {
                return st.as;
            }
        }
        return null;
    }

    public hasBodyParam(): boolean {
        if (this.bodyParam() !== null) {
            return true;
        } else {
            return false;
        }
    }

    public requestBodyTypeOptions(): DropDownOption[] {
        let options: DropDownOption[] = [
            { value: "array", name: "Array" },
            { divider: true },
            { value: "string", name: "String" },
            { value: "integer", name: "Integer" },
            { value: "boolean", name: "Boolean" },
            { value: "number", name: "Number" }
        ];

        let doc: Oas20Document = (<Oas20Document>this.operation.ownerDocument());
        if (doc.definitions) {
            let co: DropDownOption[] = doc.definitions.definitions().sort( (def1, def2) => {
                return def1.definitionName().toLocaleLowerCase().localeCompare(def2.definitionName().toLocaleLowerCase());
            }).map( def => {
                return {
                    value: "#/definitions/" + def.definitionName(),
                    name: def.definitionName()
                };
            });
            if (co && co.length > 0) {
                options.push({ divider: true });
                co.forEach( o => options.push(o) );
            }
        }

        return options;
    }

    public requestBodyTypeOfOptions(): DropDownOption[] {
        let options: DropDownOption[] = [
            { value: "string", name: "String" },
            { value: "integer", name: "Integer" },
            { value: "boolean", name: "Boolean" },
            { value: "number", name: "Number" }
        ];

        let doc: Oas20Document = (<Oas20Document>this.operation.ownerDocument());
        if (doc.definitions) {
            let co: DropDownOption[] = doc.definitions.definitions().sort( (def1, def2) => {
                return def1.definitionName().toLocaleLowerCase().localeCompare(def2.definitionName().toLocaleLowerCase());
            }).map( def => {
                return {
                    value: "#/definitions/" + def.definitionName(),
                    name: def.definitionName()
                };
            });
            if (co && co.length > 0) {
                options.push({ divider: true });
                co.forEach( o => options.push(o) );
            }
        }

        return options;
    }

    public requestBodyTypeAsOptions(): DropDownOption[] {
        let bodyParam: Oas20Parameter = this.bodyParam();
        if (ObjectUtils.isNullOrUndefined(bodyParam)) {
            return [];
        }
        if (ObjectUtils.isNullOrUndefined(bodyParam.schema)) {
            return [];
        }
        let options: DropDownOption[] = [];
        let st: SimplifiedType = SimplifiedType.fromSchema(this.bodyParam().schema);
        if (st.isArray() && st.of && st.of.isSimpleType()) {
            st = st.of;
        }
        if (st.type === "string") {
            options = [
                { value: null, name: "String" },
                { value: "byte", name: "Byte" },
                { value: "binary", name: "Binary" },
                { value: "date", name: "Date" },
                { value: "date-time", name: "DateTime" },
                { value: "password", name: "Password" }
            ];
        } else if (st.type === "integer") {
            options = [
                { value: null, name: "Integer" },
                { value: "int32", name: "32-Bit Integer" },
                { value: "int64", name: "64-Bit Integer" }
            ];
        } else if (st.type === "number") {
            options = [
                { value: null, name: "Number" },
                { value: "float", name: "Float" },
                { value: "double", name: "Double" }
            ];
        }
        return options;
    }

    public shouldShowRequestBodyTypeOf(): boolean {
        let bodyParam: Oas20Parameter = this.bodyParam();
        if (!bodyParam) {
            return false;
        }
        let nt: SimplifiedType = SimplifiedType.fromSchema(bodyParam.schema);
        return nt.isArray();
    }

    public shouldShowRequestBodyTypeAs(): boolean {
        let bodyParam: Oas20Parameter = this.bodyParam();
        if (!bodyParam) {
            return false;
        }
        let nt: SimplifiedType = SimplifiedType.fromSchema(bodyParam.schema);
        return (nt.isSimpleType() && nt.type !== "boolean") ||
               (nt.isArray() && nt.of && nt.of.isSimpleType() && nt.of.type !== "boolean");
    }

    public changeRequestBodyType(newType: string): void {
        let bodyParam: Oas20Parameter = this.bodyParam();
        let nt: SimplifiedParameterType = new SimplifiedParameterType();
        nt.type = newType;
        let command: ICommand = createChangeParameterTypeCommand(this.operation.ownerDocument(), bodyParam, nt);
        this.commandService.emit(command);
    }

    public changeRequestBodyTypeOf(newOf: string): void {
        let bodyParam: Oas20Parameter = this.bodyParam();
        let newType: SimplifiedParameterType = SimplifiedParameterType.fromParameter(bodyParam);
        newType.of = new SimplifiedType();
        newType.of.type = newOf;
        newType.as = null;
        let command: ICommand = createChangeParameterTypeCommand(this.operation.ownerDocument(), bodyParam, newType);
        this.commandService.emit(command);
    }

    public changeRequestBodyTypeAs(newAs: string): void {
        let bodyParam: Oas20Parameter = this.bodyParam();
        let newType: SimplifiedParameterType = SimplifiedParameterType.fromParameter(bodyParam);
        if (newType.isSimpleType()) {
            newType.as = newAs;
        }
        if (newType.isArray() && newType.of) {
            newType.of.as = newAs;
        }
        let command: ICommand = createChangeParameterTypeCommand(this.operation.ownerDocument(), bodyParam, newType);
        this.commandService.emit(command);
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

    public parameters(paramType: string): Oas20Parameter[] {
        let params: Oas20Parameter[] = this.operation.getParameters(paramType) as Oas20Parameter[];
        return params.sort((param1, param2) => {
            return param1.name.localeCompare(param2.name);
        });
    }

    public headerParameters(): Oas20Parameter[] {
        return this.parameters("header");
    }

    public formDataParameters(): Oas20Parameter[] {
        return this.parameters("formData");
    }

    public hasFormDataParams(): boolean {
        return this.hasParameters("formData");
    }

    public hasParameters(type: string): boolean {
        if (!this.operation.parameters) {
            return false;
        }
        return this.operation.parameters.filter((value) => {
            return value.in === type;
        }).length > 0;
    }

    public responses(): Oas20Response[] {
        if (!this.operation.responses) {
            return [];
        }
        let rval: Oas20Response[] = [];
        for (let scode of this.operation.responses.responseStatusCodes()) {
            let response: Oas20Response = this.operation.responses.response(scode) as Oas20Response;
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

    public changeSummary(newSummary: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), this.operation,"summary", newSummary);
        this.commandService.emit(command);
    }

    public changeOperationId(newId: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), this.operation,"operationId", newId);
        this.commandService.emit(command);
    }

    public changeDescription(newDescription: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), this.operation, "description", newDescription);
        this.commandService.emit(command);
    }

    public changeBodyDescription(newBodyDescription: string): void {
        let bodyParam: Oas20Parameter = this.bodyParam();
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), bodyParam,"description", newBodyDescription);
        this.commandService.emit(command);
    }

    public changeParamDescription(param: Oas20Parameter, newParamDescription: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), param, "description", newParamDescription);
        this.commandService.emit(command);
    }

    public changeParamType(param: Oas20Parameter, newType: SimplifiedParameterType): void {
        let command: ICommand = createChangeParameterTypeCommand(this.operation.ownerDocument(), param, newType);
        this.commandService.emit(command);
    }

    public createRequestBody(): void {
        let command: ICommand = createNewRequestBodyCommand(this.operation.ownerDocument(), this.operation);
        this.commandService.emit(command);
    }

    public delete(): void {
        let command: ICommand = createDeleteOperationCommand(this.operation.ownerDocument(), this.operation.method(),
            this.operation.parent() as OasPathItem);
        this.commandService.emit(command);
    }

    public deleteRequestBody(): void {
        if (this.hasBodyParam()) {
            let command: ICommand = createDeleteAllParametersCommand(this.operation.ownerDocument(), this.operation, "body");
            this.commandService.emit(command);
        } else {
            let command: ICommand = createDeleteAllParametersCommand(this.operation.ownerDocument(), this.operation, "formData");
            this.commandService.emit(command);
        }
    }

    public deleteAllResponses(): void {
        let command: ICommand = createDeleteAllResponsesCommand(this.operation.ownerDocument(), this.operation);
        this.commandService.emit(command);
    }

    public deleteParam(parameter: Oas20Parameter): void {
        let command: ICommand = createDeleteParameterCommand(this.operation.ownerDocument(), parameter);
        this.commandService.emit(command);
    }

    public deleteResponse(response: Oas20Response): void {
        let command: ICommand = createDeleteResponseCommand(this.operation.ownerDocument(), response);
        this.commandService.emit(command);
    }

    public openAddFormDataParamModal(): void {
        this.addFormDataParamDialog.open();
    }

    public addFormDataParam(name: string): void {
        let command: ICommand = createNewParamCommand(this.operation.ownerDocument(), this.operation, name, "formData");
        this.commandService.emit(command);
    }

    public openAddResponseModal(): void {
        this.addResponseDialog.open("200");
    }

    public addResponse(statusCode: string): void {
        let command: ICommand = createNewResponseCommand(this.operation.ownerDocument(), this.operation, statusCode);
        this.commandService.emit(command);
    }

    public enableSourceMode(): void {
        this.sourceNode = this.operation;
        super.enableSourceMode();
    }

    public parentPath() {
        return (this.operation.parent() as OasPathItem).path()
    }

}
