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
import {OasDocument, Oas20Document, Oas20PathItem, Oas20Operation, Oas20Parameter} from "oai-ts-core";
import {ObjectUtils} from "../../../../../util/common";

/**
 * A command used to create a new operation in a path.
 */
export class NewOperationCommand extends AbstractCommand implements ICommand {

    private _path: string;
    private _method: string;
    private _created: boolean;

    constructor(path: string, method: string) {
        super();
        this._path = path;
        this._method = method;
    }

    /**
     * Adds the new operation to the path.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[NewOperationCommand] Executing.");

        this._created = false;

        let doc: Oas20Document = <Oas20Document> document;
        if (this.isNullOrUndefined(doc.paths)) {
            return;
        }

        let path: Oas20PathItem = doc.paths.pathItem(this._path);
        if (this.isNullOrUndefined(path)) {
            return;
        }

        let operation: Oas20Operation = path.createOperation(this._method);

        // Create the path parameters
        let pathParamNames: string[] = this.detectPathParamNames(path.path());
        pathParamNames.forEach( paramName => {
            let param: Oas20Parameter = operation.createParameter();
            param.in = "path";
            param.required = true;
            param.name = paramName;

            let siblingParam: Oas20Parameter = this.detectSiblingParameter(path, paramName);
            // Found a sibling parameter?  Then use its information to initialize this one!
            if (!ObjectUtils.isNullOrUndefined(siblingParam)) {
                if (!ObjectUtils.isNullOrUndefined(siblingParam.$ref)) {
                    param.$ref = siblingParam.$ref;
                }
                if (!ObjectUtils.isNullOrUndefined(siblingParam.description)) {
                    param.description = siblingParam.description;
                }
                if (!ObjectUtils.isNullOrUndefined(siblingParam.type)) {
                    param.type = siblingParam.type;
                }
                if (!ObjectUtils.isNullOrUndefined(siblingParam.schema)) {
                    param.schema = param.createSchema();
                    if (!ObjectUtils.isNullOrUndefined(siblingParam.schema.$ref)) {
                        param.schema.$ref = siblingParam.schema.$ref;
                    }
                }
            }

            operation.addParameter(param);
        });

        path[this._method] = operation;

        this._created = true;
    }

    /**
     * Removes the path item.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[NewOperationCommand] Reverting.");
        if (!this._created) {
            return;
        }

        let doc: Oas20Document = <Oas20Document> document;
        if (this.isNullOrUndefined(doc.paths)) {
            return;
        }

        let path: Oas20PathItem = doc.paths.pathItem(this._path);
        if (this.isNullOrUndefined(path)) {
            return;
        }

        path[this._method] = null;
    }

    private detectPathParamNames(path: string): string[] {
        let segments: string[] = path.split("/");
        let pnames: string[] = segments.filter( segment => {
            return segment.startsWith("{") && segment.endsWith("}");
        }).map( segment => {
            return segment.substring(1, segment.length - 1);
        });
        return pnames;
    }

    private detectSiblingParameter(path: Oas20PathItem, paramName: string): Oas20Parameter {
        let ops: Oas20Operation[] = [
            path.get, path.put, path.post, path.delete, path.options, path.head, path.patch
        ];
        for (let op of ops) {
            if (ObjectUtils.isNullOrUndefined(op)) { continue; }
            let param: Oas20Parameter = this.findParam(op, paramName);
            if (param) {
                return param;
            }
        }
        return null;
    }

    private findParam(operation: Oas20Operation, paramName: string): Oas20Parameter {
        for (let param of operation.parameters) {
            if (param.name === paramName && param.in === "path") {
                return param;
            }
        }
        return null;
    }

}
