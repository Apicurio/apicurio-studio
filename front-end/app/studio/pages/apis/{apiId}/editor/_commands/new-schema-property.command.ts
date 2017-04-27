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
import {OasDocument, Oas20Document, Oas20Operation, OasNodePath, Oas20Parameter, Oas20Schema} from "oai-ts-core";

/**
 * A command used to create a new schema property.
 */
export class NewSchemaPropertyCommand extends AbstractCommand implements ICommand {

    private _propertyName: string;
    private _schemaPath: OasNodePath;
    private _created: boolean;

    /**
     * Constructor.
     * @param schema
     * @param propertyName
     */
    constructor(schema: Oas20Schema, propertyName: string) {
        super();
        this._schemaPath = this.oasLibrary().createNodePath(schema);
        this._propertyName = propertyName;
    }

    /**
     * Creates a new property of the schema.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[NewSchemaPropertyCommand] Executing.");

        this._created = false;

        let doc: Oas20Document = <Oas20Document> document;
        let schema: Oas20Schema = <Oas20Schema>this._schemaPath.resolve(doc);

        if (this.isNullOrUndefined(schema)) {
            console.info("[NewSchemaPropertyCommand] Schema is null.");
            return;
        }

        if (schema.property(this._propertyName)) {
            console.info("[NewSchemaPropertyCommand] Property already exists.");
            return;
        }

        schema.addProperty(this._propertyName, schema.createPropertySchema(this._propertyName));
        console.info("[NewSchemaPropertyCommand] Property [%s] created successfully.", this._propertyName);

        this._created = true;
    }

    /**
     * Removes the previously created property.
     * @property document
     */
    public undo(document: OasDocument): void {
        console.info("[NewSchemaPropertyCommand] Reverting.");
        if (!this._created) {
            return;
        }

        let doc: Oas20Document = <Oas20Document> document;
        let schema: Oas20Schema = <Oas20Schema>this._schemaPath.resolve(doc);

        if (this.isNullOrUndefined(schema)) {
            return;
        }

        if (!schema.property(this._propertyName)) {
            return;
        }

        schema.removeProperty(this._propertyName);
    }

}
