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
import {
    OasDocument, Oas20Document, Oas20PathItem
} from "oai-ts-core";

/**
 * A command used to add a new pathItem in a document.  Source for the new
 * pathItem must be provided.  This source will be converted to an OAS
 * pathItem object and then added to the data model.
 */
export class AddPathItemCommand extends AbstractCommand implements ICommand {

    private _pathItemExits: boolean;
    private _newPathItemName: string;
    private _newPathItemObj: any;
    private _nullPathItems: boolean;

    constructor(pathItemName: string, obj: any) {
        super();
        this._newPathItemName = pathItemName;
        this._newPathItemObj = obj;
    }

    /**
     * Adds the new pathItem to the document.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[AddPathItemCommand] Executing.");
        let doc: Oas20Document = <Oas20Document> document;
        if (this.isNullOrUndefined(doc.paths)) {
            doc.paths = doc.createPaths();
            this._nullPathItems = true;
        }

        if (doc.paths.pathItem(this._newPathItemName)) {
            console.info("[AddPathItemCommand] PathItem with name %s already exists.", this._newPathItemName);
            this._pathItemExits = true;
        } else {
            let pathItem: Oas20PathItem = doc.paths.createPathItem(this._newPathItemName) as Oas20PathItem;
            pathItem = this.oasLibrary().readNode(this._newPathItemObj, pathItem) as Oas20PathItem;
            doc.paths.addPathItem(this._newPathItemName, pathItem);
            this._pathItemExits = false;
        }
    }

    /**
     * Removes the pathItem.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[AddPathItemCommand] Reverting.");
        if (this._pathItemExits) {
            return;
        }
        let doc: Oas20Document = <Oas20Document> document;
        if (this._nullPathItems) {
            doc.paths = null;
        } else {
            doc.paths.removePathItem(this._newPathItemName);
        }
    }
}
