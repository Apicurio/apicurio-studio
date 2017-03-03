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
import {
    OasDocument, Oas20Document, Oas20DefinitionSchema, Oas20PropertySchema, JsonSchemaType,
    Oas20Schema
} from "oai-ts-core";
import {isNumber} from "util";

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

            if (this._newDefinitionExample) {
                this._initializeFromExample(definition, this._newDefinitionExample);
            }

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

    /**
     * Initializes a newly created definition from a JSON example.
     * @param schema
     * @param example
     */
    private _initializeFromExample(schema: Oas20Schema, example: string) {
        try {
            let exampleObj: any = JSON.parse(example);
            for (let propName in exampleObj) {
                console.info("Property name: %s", propName);

                // Create a property schema for this property
                let pschema: Oas20PropertySchema = schema.createPropertySchema(propName);
                schema.addProperty(propName, pschema);

                // Now figure out its type
                let propValue: any = exampleObj[propName];
                if (typeof propValue === "number") {
                    pschema.type = JsonSchemaType.number;
                } else if (typeof propValue === "boolean") {
                    pschema.type = JsonSchemaType.boolean;
                } else if (Array.isArray(propValue)) {
                    pschema.type = JsonSchemaType.array;
                    // TODO more to figure out here!
                } else if (typeof propValue === "object") {
                    pschema.type = JsonSchemaType.object;
                    // TODO more to figure out here!
                } else {
                    pschema.type = JsonSchemaType.string;
                }
            }
        } catch (e) {
            // if there's an error, do nothing
        }
    }
}
