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
    OasDocument, Oas20Document, Oas20Schema, Oas20Response,
    JsonSchemaType, OasNodePath, Oas20DefinitionSchema
} from "oai-ts-core";

/**
 * A command used to modify the type of a response.
 */
export class ChangeResponseTypeCommand extends AbstractCommand implements ICommand {

    private _responsePath: OasNodePath;
    private _newType: string;
    private _isSimple: boolean;
    private _oldType: Oas20Schema;

    constructor(response: Oas20Response, newType: string, isSimple: boolean) {
        super();
        this._responsePath = this.oasLibrary().createNodePath(response);
        this._newType = newType;
        this._isSimple = isSimple;
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

        if (this._isSimple) {
            response.schema.type = JsonSchemaType[this._newType];
        } else {
            let def: Oas20DefinitionSchema = doc.definitions.definition(this._newType);
            if (def) {
                response.schema.$ref = "#/definitions/" + this._newType;
            }
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
