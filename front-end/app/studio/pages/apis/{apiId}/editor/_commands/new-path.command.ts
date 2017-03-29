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
import {OasDocument, Oas20Document, Oas20PathItem} from "oai-ts-core";

/**
 * A command used to create a new path item in a document.
 */
export class NewPathCommand extends AbstractCommand implements ICommand {

    private _pathExisted: boolean;
    private _newPath: string;
    private _nullPaths: boolean;

    constructor(newPath: string) {
        super();
        this._newPath = newPath;
    }

    /**
     * Adds the new path to the document.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[NewPathCommand] Executing.");
        let doc: Oas20Document = <Oas20Document> document;
        if (this.isNullOrUndefined(doc.paths)) {
            doc.paths = doc.createPaths();
            this._nullPaths = true;
        }

        if (this.isNullOrUndefined(doc.paths.pathItem(this._newPath))) {
            let pathItem: Oas20PathItem = doc.paths.createPathItem(this._newPath);
            doc.paths.addPathItem(this._newPath, pathItem);
            this._pathExisted = false;
        } else {
            this._pathExisted = true;
        }

    }

    /**
     * Removes the path item.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[NewPathCommand] Reverting.");
        if (this._pathExisted) {
            console.info("[NewPathCommand] path already existed, nothing done so no rollback necessary.");
            return;
        }
        let doc: Oas20Document = <Oas20Document> document;
        if (this._nullPaths) {
            console.info("[NewPathCommand] Paths was null, deleting it.");
            doc.paths = null;
        } else {
            console.info("[NewPathCommand] Removing a path item: %s", this._newPath);
            doc.paths.removePathItem(this._newPath);
        }
    }

}
