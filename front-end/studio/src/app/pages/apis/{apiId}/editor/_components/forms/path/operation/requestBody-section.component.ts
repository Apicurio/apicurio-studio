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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    SimpleChanges,
    ViewEncapsulation
} from "@angular/core";
import {Oas20Operation, Oas20Parameter, Oas30MediaType, Oas30Operation, Oas30RequestBody, OasNode} from "oai-ts-core";
import {CommandService} from "../../../../_services/command.service";
import {
    IParameterEditorHandler,
    ParameterData,
    ParameterEditorComponent
} from "../../../editors/parameter-editor.component";
import {
    createAddExampleCommand,
    createChangeMediaTypeTypeCommand,
    createChangeParameterTypeCommand,
    createChangePropertyCommand,
    createDeleteAllParametersCommand,
    createDeleteExampleCommand,
    createDeleteMediaTypeCommand,
    createDeleteParameterCommand,
    createDeleteRequestBodyCommand,
    createNewMediaTypeCommand,
    createNewParamCommand,
    createNewRequestBodyCommand,
    createSetExampleCommand,
    ICommand,
    SimplifiedParameterType,
    SimplifiedType
} from "oai-ts-commands";
import {EditorsService} from "../../../../_services/editors.service";
import {ObjectUtils} from "../../../../_util/object.util";
import {DropDownOption} from "../../../../../../../../components/common/drop-down.component";
import {
    AddExampleEvent,
    DeleteExampleEvent,
    ExamplePropertyChangeEvent,
    MediaTypeChangeEvent
} from "./content.component";
import {EditExampleEvent} from "../../../dialogs/edit-example.component";
import {AbstractBaseComponent} from "../../../common/base-component";
import {DocumentService} from "../../../../_services/document.service";
import {SelectionService} from "../../../../_services/selection.service";


@Component({
    moduleId: module.id,
    selector: "requestBody-section",
    templateUrl: "requestBody-section.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestBodySectionComponent  extends AbstractBaseComponent {

    @Input() operation: Oas20Operation | Oas30Operation;

    public showRequestBody: boolean;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private editors: EditorsService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.showRequestBody = this.operation.method() === 'put' || this.operation.method() === 'post';
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (changes["operation"]) {
            this.showRequestBody = this.operation.method() === 'put' || this.operation.method() === 'post';
        }
    }

    public is20Document(): boolean {
        return this.operation.ownerDocument().is2xDocument();
    }

    public is30Document(): boolean {
        return this.operation.ownerDocument().is3xDocument();
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

    public parameters(paramType: string): Oas20Parameter[] {
        let params: Oas20Parameter[] = this.operation.getParameters(paramType) as Oas20Parameter[];
        return params.sort((param1, param2) => {
            return param1.name.localeCompare(param2.name);
        });
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

    public hasBodyParam(): boolean {
        if (this.bodyParam() !== null) {
            return true;
        } else {
            return false;
        }
    }

    public hasRequestBody(): boolean {
        return !ObjectUtils.isNullOrUndefined((this.operation as Oas30Operation).requestBody);
    }

    public hasAnything(): boolean {
        return this.hasRequestBody() || this.hasBodyParam() || this.hasFormDataParams();
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

    public deleteRequestBody(): void {
        if (this.is30Document()) {
            let command: ICommand = createDeleteRequestBodyCommand(this.operation.ownerDocument(), this.operation as Oas30Operation);
            this.commandService.emit(command);
        } else {
            if (this.hasBodyParam()) {
                let command: ICommand = createDeleteAllParametersCommand(this.operation.ownerDocument(), this.operation, "body");
                this.commandService.emit(command);
            } else {
                let command: ICommand = createDeleteAllParametersCommand(this.operation.ownerDocument(), this.operation, "formData");
                this.commandService.emit(command);
            }
        }
    }

    public requestBodyParams(): Oas20Parameter[] {
        let params: Oas20Parameter[] = this.operation.getParameters("body") as Oas20Parameter[];
        this.operation.getParameters("formData").forEach( param => {
            params.push(param as Oas20Parameter);
        });
        return params;
    }

    public validationModels(): OasNode[] {
        if (this.is20Document()) {
            return this.requestBodyParams();
        } else {
            return [(this.operation as Oas30Operation).requestBody];
        }
    }

    public addRequestBody(): void {
        let command: ICommand = createNewRequestBodyCommand(this.operation.ownerDocument(), this.operation);
        this.commandService.emit(command);
    }

    public bodyDescription(): string {
        if (this.is20Document()) {
            let bodyParam: Oas20Parameter = this.bodyParam();
            if (bodyParam === null) {
                return null;
            }
            if (!bodyParam.description) {
                return null;
            }
            return bodyParam.description;
        } else {
            if (!this.requestBody()) {
                return null;
            }
            return this.requestBody().description;
        }
    }

    public changeBodyDescription(newBodyDescription: string): void {
        console.info("[RequestBodySectionComponent] Changing request body to: ", newBodyDescription);
        if (this.is20Document()) {
            let bodyParam: Oas20Parameter = this.bodyParam();
            let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), bodyParam,
                "description", newBodyDescription);
            this.commandService.emit(command);
        } else {
            let command: ICommand = createChangePropertyCommand<string>(this.operation.ownerDocument(), this.requestBody(),
                "description", newBodyDescription);
            this.commandService.emit(command);
        }
    }

    public requestBodyType(): SimplifiedType {
        let bodyParam: Oas20Parameter = this.bodyParam();
        if (bodyParam && bodyParam.schema) {
            return SimplifiedType.fromSchema(bodyParam.schema);
        }
        return null;
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

    public deleteParam(parameter: Oas20Parameter): void {
        let command: ICommand = createDeleteParameterCommand(this.operation.ownerDocument(), parameter);
        this.commandService.emit(command);
    }

    public requestBodyRequiredOptions(): DropDownOption[] {
        return [
            { name: "Required", value: "required" },
            { name: "Not Required", value: "not-required" }
        ];
    }

    public requestBody(): Oas30RequestBody {
        return (this.operation as Oas30Operation).requestBody;
    }

    public changeRequestBodyRequired(value: string): void {
        let isRequired: boolean = value === "required";
        let command: ICommand = createChangePropertyCommand(this.operation.ownerDocument(), this.requestBody(), "required", isRequired);
        this.commandService.emit(command);
    }

    public createRequestBodyMediaType(mediaType: string): void {
        console.info("[Operation30FormComponent] Creating request body media type: " + mediaType);
        let command: ICommand = createNewMediaTypeCommand(this.operation.ownerDocument(), this.requestBody(), mediaType);
        this.commandService.emit(command);
    }

    public deleteRequestBodyMediaType(mediaType: string): void {
        console.info("[Operation30FormComponent] Deleting request body media type: " + mediaType);
        let mt: Oas30MediaType = this.requestBody().getMediaType(mediaType);
        let command: ICommand = createDeleteMediaTypeCommand(this.operation.ownerDocument(), mt);
        this.commandService.emit(command);
    }

    public changeRequestBodyMediaType(event: MediaTypeChangeEvent): void {
        console.info("[Operation30FormComponent] Changing request body media type: " + event.name);
        let mt: Oas30MediaType = this.requestBody().getMediaType(event.name);
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

}
