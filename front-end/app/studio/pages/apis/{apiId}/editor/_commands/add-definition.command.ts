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
    OasDocument, Oas20Document, Oas20SchemaDefinition, Oas20SchemaFactory
} from "oai-ts-core";

/**
 * A command used to add a new definition in a document.  Source for the new
 * definition must be provided.  This source will be converted to an OAS
 * definition object and then added to the data model.
 */
export class AddDefinitionCommand extends AbstractCommand implements ICommand {

    private _defExisted: boolean;
    private _newDefinitionName: string;
    private _newDefinitionObj: any;
    private _nullDefinitions: boolean;

    constructor(definitionName: string, obj: any) {
        super();
        this._newDefinitionName = definitionName;
        this._newDefinitionObj = obj;
    }

    /**
     * Adds the new definition to the document.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[AddDefinitionCommand] Executing.");
        let doc: Oas20Document = <Oas20Document> document;
        if (this.isNullOrUndefined(doc.definitions)) {
            doc.definitions = doc.createDefinitions();
            this._nullDefinitions = true;
        }

        if (doc.definitions.definition(this._newDefinitionName)) {
            console.info("[AddDefinitionCommand] Definition with name %s already exists.", this._newDefinitionName);
            this._defExisted = true;
        } else {
            let definition: Oas20SchemaDefinition = doc.definitions.createSchemaDefinition(this._newDefinitionName);
            definition = this.oasLibrary().readNode(this._newDefinitionObj, definition) as Oas20SchemaDefinition;
            doc.definitions.addDefinition(this._newDefinitionName, definition);
            this._defExisted = false;
        }
    }

    /**
     * Removes the definition.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[AddDefinitionCommand] Reverting.");
        if (this._defExisted) {
            return;
        }
        let doc: Oas20Document = <Oas20Document> document;
        if (this._nullDefinitions) {
            doc.definitions = null;
        } else {
            doc.definitions.removeDefinition(this._newDefinitionName);
        }
    }
}
