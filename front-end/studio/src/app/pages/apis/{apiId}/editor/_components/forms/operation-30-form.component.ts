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
import {Oas30MediaType, Oas30Operation, Oas30Parameter, Oas30PathItem, Oas30Response, OasPathItem} from "oai-ts-core";
import {
    createAddExampleCommand,
    createChangeMediaTypeTypeCommand,
    createChangeParameterTypeCommand,
    createChangePropertyCommand,
    createDeleteAllResponsesCommand,
    createDeleteExampleCommand,
    createDeleteMediaTypeCommand,
    createDeleteOperationCommand,
    createDeleteParameterCommand,
    createDeleteRequestBodyCommand,
    createDeleteResponseCommand,
    createNewMediaTypeCommand,
    createNewRequestBodyCommand,
    createNewResponseCommand,
    createReplaceOperationCommand,
    createSetExampleCommand,
    ICommand,
    SimplifiedParameterType
} from "oai-ts-commands";
import {AddResponseDialogComponent} from "../dialogs/add-response.component";
import {SourceFormComponent} from "./source-form.base";
import {ObjectUtils} from "../../_util/object.util";
import {
    AddExampleEvent,
    DeleteExampleEvent,
    ExamplePropertyChangeEvent,
    MediaTypeChangeEvent
} from "./operation/content.component";
import {DropDownOption} from '../../../../../../components/common/drop-down.component';
import {EditExampleEvent} from "../dialogs/edit-example.component";


@Component({
    moduleId: module.id,
    selector: "operation-30-form",
    templateUrl: "operation-30-form.component.html",
    encapsulation: ViewEncapsulation.None
})
export class Operation30FormComponent extends SourceFormComponent<Oas30Operation> {

    protected _operation: Oas30Operation;
    @Input()
    set operation(operation: Oas30Operation) {
        this._operation = operation;
        this.sourceNode = operation;
        this.revertSource();
    }
    get operation(): Oas30Operation {
        return this._operation;
    }

    @Output() onDeselect: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild("addResponseDialog") public addResponseDialog: AddResponseDialogComponent;

    public showRequestBody: boolean;

    public ngOnInit(): void {
        super.ngOnInit();
        this.showRequestBody = this.operation.method() === 'put' || this.operation.method() === 'post';
    }

    protected createEmptyNodeForSource(): Oas30Operation {
        return (<Oas30PathItem>this.operation.parent()).createOperation(this.operation.method());
    }

    protected createReplaceNodeCommand(node: Oas30Operation): ICommand {
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

    public bodyDescription(): string {
        if (this.operation.requestBody) {
            return this.operation.requestBody.description;
        }
        return null;
    }

    public parameters(paramType: string): Oas30Parameter[] {
        let params: Oas30Parameter[] = this.operation.getParameters(paramType) as Oas30Parameter[];
        return params.sort((param1, param2) => {
            return param1.name.localeCompare(param2.name);
        });
    }

    public headerParameters(): Oas30Parameter[] {
        return this.parameters("header");
    }

    public formDataParameters(): Oas30Parameter[] {
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

    public responses(): Oas30Response[] {
        if (!this.operation.responses) {
            return [];
        }
        let rval: Oas30Response[] = [];
        for (let scode of this.operation.responses.responseStatusCodes()) {
            let response: Oas30Response = this.operation.responses.response(scode) as Oas30Response;
            rval.push(response);
        }
        return rval.sort((a, b) => {
            return a.statusCode().localeCompare(b.statusCode());
        });
    }

    public hasRequestBody(): boolean {
        return !ObjectUtils.isNullOrUndefined(this.operation.requestBody);
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

    public changeBodyDescription(newBodyDescription: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), this.operation.requestBody,"description", newBodyDescription);
        this.commandService.emit(command);
    }

    public changeParamDescription(param: Oas30Parameter, newParamDescription: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), param, "description", newParamDescription);
        this.commandService.emit(command);
    }

    public changeParamType(param: Oas30Parameter, newType: SimplifiedParameterType): void {
        let command: ICommand = createChangeParameterTypeCommand(this.operation.ownerDocument(), param, newType);
        this.commandService.emit(command);
    }

    public delete(): void {
        let command: ICommand = createDeleteOperationCommand(this.operation.ownerDocument(), this.operation.method(),
            this.operation.parent() as OasPathItem);
        this.commandService.emit(command);
        this.onDeselect.emit(true);
    }

    public deleteAllResponses(): void {
        let command: ICommand = createDeleteAllResponsesCommand(this.operation.ownerDocument(), this.operation);
        this.commandService.emit(command);
    }

    public deleteParam(parameter: Oas30Parameter): void {
        let command: ICommand = createDeleteParameterCommand(this.operation.ownerDocument(), parameter);
        this.commandService.emit(command);
    }

    public deleteResponse(response: Oas30Response): void {
        let command: ICommand = createDeleteResponseCommand(this.operation.ownerDocument(), response);
        this.commandService.emit(command);
    }

    public addRequestBody(): void {
        let command: ICommand = createNewRequestBodyCommand(this.operation.ownerDocument(), this.operation);
        this.commandService.emit(command);
    }

    public deleteRequestBody(): void {
        let command: ICommand = createDeleteRequestBodyCommand(this.operation.ownerDocument(), this.operation);
        this.commandService.emit(command);
    }

    public createRequestBodyMediaType(mediaType: string): void {
        console.info("[Operation30FormComponent] Creating request body media type: " + mediaType);
        let command: ICommand = createNewMediaTypeCommand(this.operation.ownerDocument(), this.operation.requestBody, mediaType);
        this.commandService.emit(command);
    }

    public deleteRequestBodyMediaType(mediaType: string): void {
        console.info("[Operation30FormComponent] Deleting request body media type: " + mediaType);
        let mt: Oas30MediaType = this.operation.requestBody.getMediaType(mediaType);
        let command: ICommand = createDeleteMediaTypeCommand(this.operation.ownerDocument(), mt);
        this.commandService.emit(command);
    }

    public changeRequestBodyMediaType(event: MediaTypeChangeEvent): void {
        console.info("[Operation30FormComponent] Changing request body media type: " + event.name);
        let mt: Oas30MediaType = this.operation.requestBody.getMediaType(event.name);
        let command: ICommand = createChangeMediaTypeTypeCommand(this.operation.ownerDocument(), mt, event.type);
        this.commandService.emit(command);
    }

    public addMediaTypeExample(event: AddExampleEvent): void {
        console.info("[Operation30FormComponent] Adding an example named: " + event.name);
        let mt: Oas30MediaType = event.mediaType;
        let command: ICommand = createAddExampleCommand(this.operation.ownerDocument(), mt, event.value, event.name);
        this.commandService.emit(command);
    }

    public deleteMediaTypeExample(event: DeleteExampleEvent): void {
        console.info("[Operation30FormComponent] Deleting an example of a media type.");
        let command: ICommand = createDeleteExampleCommand(this.operation.ownerDocument(), event.example);
        this.commandService.emit(command);
    }

    public changeMediaTypeExampleSummary(event: ExamplePropertyChangeEvent): void {
        console.info("[Operation30FormComponent] Changing the summary of a Media Type example.");
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), event.example, "summary", event.value);
        this.commandService.emit(command);
    }

    public changeMediaTypeExampleDescription(event: ExamplePropertyChangeEvent): void {
        console.info("[Operation30FormComponent] Changing the description of a Media Type example.");
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), event.example, "description", event.value);
        this.commandService.emit(command);
    }

    public changeMediaTypeExampleValue(event: EditExampleEvent): void {
        console.info("[Operation30FormComponent] Changing the value of a Media Type example.");
        let mt: Oas30MediaType = event.example.parent() as Oas30MediaType;
        let command: ICommand = createSetExampleCommand(this.operation.ownerDocument(), mt, event.value, event.example.name());
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

    public requestBodyRequiredOptions(): DropDownOption[] {
        return [
            { name: "Required", value: "required" },
            { name: "Not Required", value: "not-required" }
        ];
    }

    public changeRequestBodyRequired(value: string): void {
        let isRequired: boolean = value === "required";
        let command: ICommand = createChangePropertyCommand(this.operation.ownerDocument(), this.operation.requestBody, "required", isRequired);
        this.commandService.emit(command);
    }

    public parentPath() {
        return (this.operation.parent() as OasPathItem).path()
    }

}
