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
    OasDocument, Oas20Document, Oas20Schema, Oas20Parameter,
    JsonSchemaType, OasNodePath, Oas20DefinitionSchema
} from "oai-ts-core";

/**
 * A command used to modify the type of a request body for an operation.
 */
export class ChangeRequestBodyTypeCommand extends AbstractCommand implements ICommand {

    private _bodyParamPath: OasNodePath;
    private _newType: string;
    private _isSimple: boolean;
    private _oldType: Oas20Schema;

    constructor(bodyParameter: Oas20Parameter, newType: string, isSimple: boolean) {
        super();
        this._bodyParamPath = this.oasLibrary().createNodePath(bodyParameter);
        this._newType = newType;
        this._isSimple = isSimple;
    }

    /**
     * Modifies the type of an operation's request body.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeRequestBodyTypeCommand] Executing.");
        let doc: Oas20Document = <Oas20Document> document;
        let bodyParam: Oas20Parameter = <Oas20Parameter>this._bodyParamPath.resolve(doc);
        if (!bodyParam) {
            return;
        }

        this._oldType = null;
        if (bodyParam.schema) {
            this._oldType = bodyParam.schema;
        }

        bodyParam.schema = bodyParam.createSchema();

        if (this._isSimple) {
            bodyParam.schema.type = JsonSchemaType[this._newType];
        } else {
            let def: Oas20DefinitionSchema = doc.definitions.definition(this._newType);
            if (def) {
                bodyParam.schema.$ref = "#/definitions/" + this._newType;
            }
        }
    }

    /**
     * Resets the param type back to its previous state.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeRequestBodyTypeCommand] Reverting.");
        let doc: Oas20Document = <Oas20Document> document;
        let bodyParam: Oas20Parameter = <Oas20Parameter>this._bodyParamPath.resolve(doc);
        if (!bodyParam) {
            return;
        }

        bodyParam.schema = this._oldType;
        if (bodyParam.schema) {
            bodyParam.schema._parent = bodyParam;
            bodyParam.schema._ownerDocument = bodyParam.ownerDocument();
        }
    }

}
