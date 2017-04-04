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
    OasDocument, Oas20Document, Oas20Schema, Oas20Response,
    JsonSchemaType, OasNodePath, Oas20DefinitionSchema
} from "oai-ts-core";
import {SimplifiedType} from "../_models/simplified-type.model";

/**
 * A command used to modify the type of a response.
 */
export class ChangeResponseTypeCommand extends AbstractCommand implements ICommand {

    private _responsePath: OasNodePath;
    private _newType: SimplifiedType;
    private _oldType: Oas20Schema;

    constructor(response: Oas20Response, newType: SimplifiedType) {
        super();
        this._responsePath = this.oasLibrary().createNodePath(response);
        this._newType = newType;
    }

    /**
     * Modifies the type of an operation's response.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeResponseTypeCommand] Executing.");
        let doc: Oas20Document = <Oas20Document> document;
        let response: Oas20Response = <Oas20Response>this._responsePath.resolve(doc);
        if (!response) {
            return;
        }

        this._oldType = null;
        if (response.schema) {
            this._oldType = response.schema;
        }

        response.schema = response.createSchema();

        if (this._newType.isSimpleType()) {
            response.schema.type = JsonSchemaType[this._newType.type];
            response.schema.format = this._newType.as;
        }
        if (this._newType.isRef()) {
            response.schema.$ref = this._newType.type;
        }
        if (this._newType.isArray()) {
            response.schema.type = JsonSchemaType.array;
            response.schema.items = response.schema.createItemsSchema();
            response.schema.items.type = JsonSchemaType[this._newType.of.type];
            response.schema.items.format = this._newType.of.as;
        }
    }

    /**
     * Resets the response type back to its previous state.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeResponseTypeCommand] Reverting.");
        let doc: Oas20Document = <Oas20Document> document;
        let response: Oas20Response = <Oas20Response>this._responsePath.resolve(doc);
        if (!response) {
            return;
        }

        response.schema = this._oldType;
        if (response.schema) {
            response.schema._parent = response;
            response.schema._ownerDocument = response.ownerDocument();
        }
    }

}
