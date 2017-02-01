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

import {ICommand, AbstractCommand} from "../commands.manager";
import {OasDocument, Oas20Document, Oas20Operation, OasNodePath, Oas20Parameter} from "oai-ts-core";

/**
 * A command used to create a new request body (parameter of an operation).
 */
export class NewRequestBodyCommand extends AbstractCommand implements ICommand {

    private _operationPath: OasNodePath;
    private _created: boolean;

    constructor(operation: Oas20Operation) {
        super();
        this._operationPath = this.oasLibrary().createNodePath(operation);
    }

    /**
     * Creates a request body parameter for the operation.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[NewRequestBodyCommand] Executing.");

        this._created = false;

        let doc: Oas20Document = <Oas20Document> document;
        let operation: Oas20Operation = <Oas20Operation>this._operationPath.resolve(doc);

        if (this.isNullOrUndefined(operation)) {
            return;
        }

        if (this.hasBodyParameter(operation)) {
            return;
        }

        if (this.isNullOrUndefined(operation.parameters)) {
            operation.parameters = [];
        }

        let param: Oas20Parameter = operation.createParameter();
        param.in = "body";
        operation.addParameter(param);

        this._created = true;
    }

    /**
     * Removes the previously created body param.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[NewRequestBodyCommand] Reverting.");
        if (!this._created) {
            return;
        }

        let doc: Oas20Document = <Oas20Document> document;
        let operation: Oas20Operation = <Oas20Operation>this._operationPath.resolve(doc);

        if (this.isNullOrUndefined(operation)) {
            return;
        }

        let bodyParam: Oas20Parameter = null;
        for (let param of operation.parameters) {
            if (param.in === "body") {
                bodyParam = param;
                break;
            }
        }

        // If found, remove it from the params.
        if (bodyParam) {
            operation.parameters.splice(operation.parameters.indexOf(bodyParam), 1);

            if (operation.parameters.length === 0) {
                operation.parameters = null;
            }
        }
    }

    /**
     * Returns true if the given operation already has a body parameter.
     * @param operation
     * @return {boolean}
     */
    private hasBodyParameter(operation: Oas20Operation): boolean {
        return operation.parameters && operation.parameters.filter((value) => {
            return value.in === "body";
        }).length > 0;
    }

}
