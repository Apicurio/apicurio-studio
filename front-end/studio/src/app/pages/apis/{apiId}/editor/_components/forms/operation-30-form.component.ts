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
import {
    Oas20Response, Oas30MediaType, Oas30Operation, Oas30Parameter, Oas30PathItem, Oas30Response, OasLibraryUtils,
    OasPathItem, OasSecurityRequirement
} from "oai-ts-core";
import {
    createChangeMediaTypeTypeCommand,
    createChangeParameterTypeCommand,
    createChangePropertyCommand,
    createDeleteAllParametersCommand,
    createDeleteMediaTypeCommand,
    createDeleteParameterCommand,
    createDeleteResponseCommand,
    createNewMediaTypeCommand,
    createNewParamCommand,
    createNewRequestBodyCommand,
    createNewResponseCommand,
    createReplaceOperationCommand,
    createDeleteOperationCommand,
    createDeleteAllResponsesCommand,
    createDeleteRequestBodyCommand,
    SimplifiedParameterType,
    ICommand,
    createAddExampleCommand,
    createDeleteExampleCommand,
    createSetExampleCommand,
    createAddSecurityRequirementCommand, createReplaceSecurityRequirementCommand, createDeleteSecurityRequirementCommand
} from "oai-ts-commands";
import {AddQueryParamDialogComponent} from "../dialogs/add-query-param.component";
import {AddResponseDialogComponent} from "../dialogs/add-response.component";
import {SourceFormComponent} from "./source-form.base";
import {ModelUtils} from "../../_util/model.util";
import {ObjectUtils} from "../../_util/object.util";
import {
    AddExampleEvent, DeleteExampleEvent, ExamplePropertyChangeEvent,
    MediaTypeChangeEvent
} from "./operation/content.component";
import {DropDownOption} from '../../../../../../components/common/drop-down.component';
import {EditExampleEvent} from "../dialogs/edit-example.component";
import {
    ChangeSecurityRequirementEvent,
    SecurityRequirementDialogComponent,
    SecurityRequirementEventData
} from "../dialogs/security-requirement.component";


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

    @ViewChild("addQueryParamDialog") public addQueryParamDialog: AddQueryParamDialogComponent;
    @ViewChild("addResponseDialog") public addResponseDialog: AddResponseDialogComponent;
    @ViewChild("securityRequirementDialog") securityRequirementDialog: SecurityRequirementDialogComponent;

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

    public pathParam(paramName: string): Oas30Parameter {
        let param: Oas30Parameter = this.operation.parameter("path", paramName) as Oas30Parameter;

        if (param === null) {
            param = this.operation.createParameter();
            param.in = "path";
            param.name = paramName;
            param.required = true;
            param.n_attribute("missing", true);
        }

        return param;
    }

    public pathParameters(): Oas30Parameter[] {
        let pathParamNames: string[] = ModelUtils.detectPathParamNames((<Oas30PathItem>this.operation.parent()).path());
        return pathParamNames.map( pname => {
            return this.pathParam(pname);
        });
    }

    public queryParameters(): Oas30Parameter[] {
        let opParams: Oas30Parameter[] = this.parameters("query");
        let piParams: Oas30Parameter[] = (<Oas30PathItem>this.operation.parent()).getParameters("query") as Oas30Parameter[];
        let hasOpParam = function(param: Oas30Parameter): boolean {
            var found: boolean = false;
            opParams.forEach( opParam => {
                if (opParam.name === param.name) {
                    found = true;
                }
            });
            return found;
        };
        piParams.forEach( param => {
            if (!hasOpParam(param)) {
                let missingParam: Oas30Parameter = this.operation.createParameter();
                missingParam.in = "query";
                missingParam.name = param.name;
                missingParam.required = true;
                missingParam.n_attribute("missing", true);
                opParams.push(missingParam);
            }
        });
        return opParams.sort((param1, param2) => {
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

    public hasQueryParameters(): boolean {
        return this.operation.getParameters("query").length > 0 ||
            (<Oas30PathItem>this.operation.parent()).getParameters("query").length > 0;
    }

    public canHavePathParams(): boolean {
        return (<Oas30PathItem>this.operation.parent()).path().indexOf("{") !== -1;
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

    public changeSummary(newSummary: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), this.operation,"summary", newSummary);
        this.onCommand.emit(command);
    }

    public changeOperationId(newId: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), this.operation,"operationId", newId);
        this.onCommand.emit(command);
    }

    public changeDescription(newDescription: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), this.operation, "description", newDescription);
        this.onCommand.emit(command);
    }

    public changeBodyDescription(newBodyDescription: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), this.operation.requestBody,"description", newBodyDescription);
        this.onCommand.emit(command);
    }

    public changeParamDescription(param: Oas30Parameter, newParamDescription: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), param, "description", newParamDescription);
        this.onCommand.emit(command);
    }

    public changeParamType(param: Oas30Parameter, newType: SimplifiedParameterType): void {
        let command: ICommand = createChangeParameterTypeCommand(this.operation.ownerDocument(), param, newType);
        this.onCommand.emit(command);
    }

    public delete(): void {
        let command: ICommand = createDeleteOperationCommand(this.operation.ownerDocument(), this.operation.method(),
            this.operation.parent() as OasPathItem);
        this.onCommand.emit(command);
        this.onDeselect.emit(true);
    }

    public deleteAllQueryParams(): void {
        let command: ICommand = createDeleteAllParametersCommand(this.operation.ownerDocument(), this.operation, "query");
        this.onCommand.emit(command);
    }

    public deleteAllResponses(): void {
        let command: ICommand = createDeleteAllResponsesCommand(this.operation.ownerDocument(), this.operation);
        this.onCommand.emit(command);
    }

    public deleteParam(parameter: Oas30Parameter): void {
        let command: ICommand = createDeleteParameterCommand(this.operation.ownerDocument(), parameter);
        this.onCommand.emit(command);
    }

    public deleteResponse(response: Oas30Response): void {
        let command: ICommand = createDeleteResponseCommand(this.operation.ownerDocument(), response);
        this.onCommand.emit(command);
    }

    public openAddQueryParamModal(): void {
        this.addQueryParamDialog.open();
    }

    public addQueryParam(name: string): void {
        let command: ICommand = createNewParamCommand(this.operation.ownerDocument(), this.operation, name, "query");
        this.onCommand.emit(command);
    }

    public addRequestBody(): void {
        let command: ICommand = createNewRequestBodyCommand(this.operation.ownerDocument(), this.operation);
        this.onCommand.emit(command);
    }

    public deleteRequestBody(): void {
        let command: ICommand = createDeleteRequestBodyCommand(this.operation.ownerDocument(), this.operation);
        this.onCommand.emit(command);
    }

    public createRequestBodyMediaType(mediaType: string): void {
        console.info("[Operation30FormComponent] Creating request body media type: " + mediaType);
        let command: ICommand = createNewMediaTypeCommand(this.operation.ownerDocument(), this.operation.requestBody, mediaType);
        this.onCommand.emit(command);
    }

    public deleteRequestBodyMediaType(mediaType: string): void {
        console.info("[Operation30FormComponent] Deleting request body media type: " + mediaType);
        let mt: Oas30MediaType = this.operation.requestBody.getMediaType(mediaType);
        let command: ICommand = createDeleteMediaTypeCommand(this.operation.ownerDocument(), mt);
        this.onCommand.emit(command);
    }

    public changeRequestBodyMediaType(event: MediaTypeChangeEvent): void {
        console.info("[Operation30FormComponent] Changing request body media type: " + event.name);
        let mt: Oas30MediaType = this.operation.requestBody.getMediaType(event.name);
        let command: ICommand = createChangeMediaTypeTypeCommand(this.operation.ownerDocument(), mt, event.type);
        this.onCommand.emit(command);
    }

    public addMediaTypeExample(event: AddExampleEvent): void {
        console.info("[Operation30FormComponent] Adding an example named: " + event.name);
        let mt: Oas30MediaType = event.mediaType;
        let command: ICommand = createAddExampleCommand(this.operation.ownerDocument(), mt, event.value, event.name);
        this.onCommand.emit(command);
    }

    public deleteMediaTypeExample(event: DeleteExampleEvent): void {
        console.info("[Operation30FormComponent] Deleting an example of a media type.");
        let command: ICommand = createDeleteExampleCommand(this.operation.ownerDocument(), event.example);
        this.onCommand.emit(command);
    }

    public changeMediaTypeExampleSummary(event: ExamplePropertyChangeEvent): void {
        console.info("[Operation30FormComponent] Changing the summary of a Media Type example.");
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), event.example, "summary", event.value);
        this.onCommand.emit(command);
    }

    public changeMediaTypeExampleDescription(event: ExamplePropertyChangeEvent): void {
        console.info("[Operation30FormComponent] Changing the description of a Media Type example.");
        let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), event.example, "description", event.value);
        this.onCommand.emit(command);
    }

    public changeMediaTypeExampleValue(event: EditExampleEvent): void {
        console.info("[Operation30FormComponent] Changing the value of a Media Type example.");
        let mt: Oas30MediaType = event.example.parent() as Oas30MediaType;
        let command: ICommand = createSetExampleCommand(this.operation.ownerDocument(), mt, event.value, event.example.name());
        this.onCommand.emit(command);
    }

    public openAddResponseModal(): void {
        this.addResponseDialog.open("200");
    }

    public addResponse(statusCode: string): void {
        let command: ICommand = createNewResponseCommand(this.operation.ownerDocument(), this.operation, statusCode);
        this.onCommand.emit(command);
    }

    public createPathParam(paramName: string): void {
        let command: ICommand = createNewParamCommand(this.operation.ownerDocument(), this.operation, paramName, "path");
        this.onCommand.emit(command);
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
        this.onCommand.emit(command);
    }

    public parentPath() {
        return (this.operation.parent() as OasPathItem).path()
    }

    /**
     * Returns true if there is at least one security requirement defined.
     * @return {boolean}
     */
    public hasSecurityRequirements(): boolean {
        return this.securityRequirements().length > 0;
    }

    /**
     * Returns all defined security requirements.
     * @return {OasSecurityRequirement[]}
     */
    public securityRequirements(): OasSecurityRequirement[] {
        return this.operation.security ? this.operation.security : [];
    }

    /**
     * Returns a summary of the requirement.
     * @param {OasSecurityRequirement} requirement
     * @return {string}
     */
    public securityRequirementSummary(requirement: OasSecurityRequirement): string {
        return requirement.securityRequirementNames().join(", ");
    }

    /**
     * Opens the security requirement dialog for adding or editing a security requirement.
     * @param {OasSecurityRequirement} requirement
     */
    public openSecurityRequirementDialog(requirement?: OasSecurityRequirement): void {
        this.securityRequirementDialog.open(this.operation.ownerDocument(), requirement);
    }

    /**
     * Called when the user adds a new security requirement.
     * @param {SecurityRequirementEventData} event
     */
    public addSecurityRequirement(event: SecurityRequirementEventData): void {
        let requirement: OasSecurityRequirement = this.operation.createSecurityRequirement();
        let library: OasLibraryUtils = new OasLibraryUtils();
        library.readNode(event, requirement);
        let command: ICommand = createAddSecurityRequirementCommand(this.operation.ownerDocument(), this.operation, requirement);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user changes an existing Security Requirement.
     * @param {SecurityRequirementEventData} event
     */
    public changeSecurityRequirement(event: ChangeSecurityRequirementEvent): void {
        let newRequirement: OasSecurityRequirement = this.operation.createSecurityRequirement();
        let library: OasLibraryUtils = new OasLibraryUtils();
        library.readNode(event.data, newRequirement);
        let command: ICommand = createReplaceSecurityRequirementCommand(this.operation.ownerDocument(), event.requirement, newRequirement);
        this.onCommand.emit(command);
    }

    /**
     * Deletes a security requirement.
     * @param {OasSecurityRequirement} requirement
     */
    public deleteSecurityRequirement(requirement: OasSecurityRequirement): void {
        let command: ICommand = createDeleteSecurityRequirementCommand(this.operation.ownerDocument(), this.operation, requirement);
        this.onCommand.emit(command);
    }

}
