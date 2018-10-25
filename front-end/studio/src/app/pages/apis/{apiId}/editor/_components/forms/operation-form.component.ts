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
import {DropDownOption} from '../../../../../../components/common/drop-down.component';
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";
import {DocumentService} from "../../_services/document.service";
import {IParameterEditorHandler, ParameterData, ParameterEditorComponent} from "../editors/parameter-editor.component";
import {EditorsService} from "../../_services/editors.service";


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

    @ViewChild("addResponseDialog") public addResponseDialog: AddResponseDialogComponent;

    public showRequestBody: boolean;

    public constructor(protected selectionService: SelectionService, protected commandService: CommandService,
                       protected documentService: DocumentService, protected editors: EditorsService) {
        super(selectionService, commandService, documentService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.showRequestBody = this.operation.method() === 'put' || this.operation.method() === 'post';
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

    public requestBodyType(): SimplifiedType {
        let bodyParam: Oas20Parameter = this.bodyParam();
        if (bodyParam && bodyParam.schema) {
            return SimplifiedType.fromSchema(bodyParam.schema);
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

    public changeRequestBodyType(newType: SimplifiedType): void {
        let bodyParam: Oas20Parameter = this.bodyParam();
        let nt: SimplifiedParameterType = new SimplifiedParameterType();
        nt.type = newType.type;
        nt.enum = newType.enum;
        nt.of = newType.of;
        nt.as = newType.as;
        nt.required = true; // Body params are always required

        let command: ICommand = createChangeParameterTypeCommand(this.operation.ownerDocument(), bodyParam, nt);
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

    public changeBodyDescription(newBodyDescription: string): void {
        let bodyParam: Oas20Parameter = this.bodyParam();
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), bodyParam,"description", newBodyDescription);
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

    public openAddFormDataParamEditor(): void {
        let editor: ParameterEditorComponent = this.editors.getParameterEditor();
        editor.setParamType("formData");
        let handler: IParameterEditorHandler = {
            onSave: (event) => {
                this.addFormDataParam(event.data);
            },
            onCancel: () => {}
        };
        editor.open(handler, this.operation);
    }

    public addFormDataParam(data: ParameterData): void {
        let command: ICommand = createNewParamCommand(this.operation.ownerDocument(), this.operation, data.name,
            "formData", data.description, data.type);
        this.commandService.emit(command);
    }

    public openAddResponseModal(): void {
        this.addResponseDialog.open(this.operation,"200");
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
