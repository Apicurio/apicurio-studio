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
import {OasDocument, Oas20Document, Oas20DefinitionSchema, Oas20PropertySchema, JsonSchemaType} from "oai-ts-core";

/**
 * A command used to create a new definition in a document.
 */
export class NewDefinitionCommand extends AbstractCommand implements ICommand {

    private _defExisted: boolean;
    private _newDefinitionName: string;
    private _newDefinitionExample: string;
    private _nullDefinitions: boolean;

    constructor(definitionName: string, example: string) {
        super();
        this._newDefinitionName = definitionName;
        this._newDefinitionExample = example;
    }

    /**
     * Adds the new definition to the document.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[NewDefinitionCommand] Executing.");
        let doc: Oas20Document = <Oas20Document> document;
        if (this.isNullOrUndefined(doc.definitions)) {
            doc.definitions = doc.createDefinitions();
            this._nullDefinitions = true;
        }

        if (this.isNullOrUndefined(doc.definitions.definition(this._newDefinitionName))) {
            let definition: Oas20DefinitionSchema = doc.definitions.createDefinitionSchema(this._newDefinitionName);
            doc.definitions.addDefinition(this._newDefinitionName, definition);

            // TODO replace this with some code that processes the example and generates a schema
            let pschema: Oas20PropertySchema = definition.createPropertySchema("property-1");
            definition.addProperty("property-1", pschema);
            pschema.type = JsonSchemaType.string;
            pschema.format = "date-time";

            this._defExisted = false;
        } else {
            this._defExisted = true;
        }
    }

    /**
     * Removes the definition.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[NewDefinitionCommand] Reverting.");
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
