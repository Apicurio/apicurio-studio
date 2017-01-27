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

import {Component, Input, ViewEncapsulation, Output, EventEmitter} from '@angular/core';
import {
    Oas20Operation, Oas20Parameter, JsonSchemaType, Oas20Response,
    Oas20Document
} from "oai-ts-core";
import {ICommand} from "../commands.manager";
import {NewRequestBodyCommand} from "../commands/new-request-body.command";
import {ChangeRequestBodyTypeCommand} from "../commands/change-request-body-type.command";


@Component({
    moduleId: module.id,
    selector: 'operation-form',
    templateUrl: 'operation-form.component.html',
    encapsulation: ViewEncapsulation.None
})
export class OperationFormComponent {

    @Input() operation: Oas20Operation;
    @Output() onCommand: EventEmitter<ICommand> = new EventEmitter<ICommand>();

    public summary(): string {
        if (this.operation.summary) {
            return this.operation.summary;
        } else {
            return "No summary";
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
            return "No description.";
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
            return "No request body description.";
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

    public queryParameters(): Oas20Parameter[] {
        if (!this.operation.parameters) {
            return [];
        }
        return this.operation.parameters.filter((value) => {
            return value.in === 'query';
        });
    }

    public headerParameters(): Oas20Parameter[] {
        if (!this.operation.parameters) {
            return [];
        }
        return this.operation.parameters.filter((value) => {
            return value.in === 'header';
        });
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
            return "No parameter description.";
        }
    }

    public paramType(param: Oas20Parameter): string {
        if (param.schema) {
            return JsonSchemaType[param.schema.type];
        } else {
            return "";
        }
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

    public responseDescription(response: Oas20Response): string {
        if (response && response.description) {
            return response.description;
        } else {
            return "No response description.";
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
        return (<Oas20Document>this.operation.ownerDocument()).definitions.getItemNames().sort();
    }

    public responseType(response: Oas20Response): string {
        // TODO implement this!
        return "TBD";
    }

    public createQueryParameter(): void {
        // TODO implement this!
        console.info("User wants to add a query param.");
    }

    public createRequestBody(): void {
        let command: ICommand = new NewRequestBodyCommand(this.operation);
        this.onCommand.emit(command);
    }

    public setRequestBodyType(type: string, isSimpleType: boolean): void {
        let command: ICommand = new ChangeRequestBodyTypeCommand(this.bodyParam(), type, isSimpleType);
        this.onCommand.emit(command);
    }
}
