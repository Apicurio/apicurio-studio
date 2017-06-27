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
import {OasDocument, Oas20Document, Oas20PathItem, Oas20Operation} from "oai-ts-core";

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

        let path: Oas20PathItem = doc.paths.pathItem(this._path) as Oas20PathItem;
        if (this.isNullOrUndefined(path)) {
            return;
        }

        let operation: Oas20Operation = path.createOperation(this._method);
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

        let path: Oas20PathItem = doc.paths.pathItem(this._path) as Oas20PathItem;
        if (this.isNullOrUndefined(path)) {
            return;
        }

        path[this._method] = null;
    }

}
