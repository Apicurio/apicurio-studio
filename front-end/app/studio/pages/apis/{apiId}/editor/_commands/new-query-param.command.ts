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

import {ICommand, AbstractCommand} from "../_services/commands.manager";
import {OasDocument, Oas20Document, Oas20Operation, OasNodePath, Oas20Parameter} from "oai-ts-core";

/**
 * A command used to create a new query parameter.
 */
export class NewQueryParamCommand extends AbstractCommand implements ICommand {

    private _paramName: string;
    private _operationPath: OasNodePath;
    private _created: boolean;

    /**
     * Constructor.
     * @param operation
     * @param paramName
     */
    constructor(operation: Oas20Operation, paramName: string) {
        super();
        this._operationPath = this.oasLibrary().createNodePath(operation);
        this._paramName = paramName;
    }

    /**
     * Creates a request body parameter for the operation.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[NewQueryParamCommand] Executing.");

        this._created = false;

        let doc: Oas20Document = <Oas20Document> document;
        let operation: Oas20Operation = <Oas20Operation>this._operationPath.resolve(doc);

        if (this.isNullOrUndefined(operation)) {
            return;
        }

        if (this.hasQueryParam(this._paramName, operation)) {
            return;
        }

        if (this.isNullOrUndefined(operation.parameters)) {
            operation.parameters = [];
        }

        let param: Oas20Parameter = operation.createParameter();
        param.in = "query";
        param.name = this._paramName;
        operation.addParameter(param);

        this._created = true;
    }

    /**
     * Removes the previously created query param.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[NewQueryParamCommand] Reverting.");
        if (!this._created) {
            return;
        }

        let doc: Oas20Document = <Oas20Document> document;
        let operation: Oas20Operation = <Oas20Operation>this._operationPath.resolve(doc);

        if (this.isNullOrUndefined(operation)) {
            return;
        }

        let queryParam: Oas20Parameter = null;
        for (let param of operation.parameters) {
            if (param.in === "query" && param.name === this._paramName) {
                queryParam = param;
                break;
            }
        }

        // If found, remove it from the params.
        if (queryParam) {
            operation.parameters.splice(operation.parameters.indexOf(queryParam), 1);

            if (operation.parameters.length === 0) {
                operation.parameters = null;
            }
        }
    }

    /**
     * Returns true if the given query param already exists in the operation.
     * @param paramName
     * @param operation
     * @returns {boolean}
     */
    private hasQueryParam(paramName: string, operation: Oas20Operation): boolean {
        return operation.parameters && operation.parameters.filter((value) => {
            return value.in === "query" && value.name === paramName;
        }).length > 0;
    }

}
