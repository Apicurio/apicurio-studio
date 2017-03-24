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
    JsonSchemaType, OasNodePath, Oas20DefinitionSchema, Oas20PathItem, Oas20Operation
} from "oai-ts-core";
import {ObjectUtils} from "../../../../../util/common";

/**
 * A command used to modify the type of a parameter of an operation.
 */
export class ChangeParameterTypeCommand extends AbstractCommand implements ICommand {

    private _paramPath: OasNodePath;
    private _newType: string;
    private _isSimple: boolean;

    private _oldType: JsonSchemaType;
    private _oldSchema: Oas20Schema;

    constructor(parameter: Oas20Parameter, newType: string, isSimple: boolean) {
        super();
        this._paramPath = this.oasLibrary().createNodePath(parameter);
        this._newType = newType;
        this._isSimple = isSimple;
    }

    /**
     * Modifies the type of an operation's parameter.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeParameterTypeCommand] Executing.");
        let doc: Oas20Document = <Oas20Document> document;
        let param: Oas20Parameter = <Oas20Parameter>this._paramPath.resolve(doc);
        if (!param) {
            return;
        }

        this._oldType = null;
        this._oldSchema = null;

        this._oldType = param.type;
        this._oldSchema = param.schema;
        if (this._isSimple) {
            param.type = JsonSchemaType[this._newType];
            param.schema = null;
        } else {
            param.type = null;
            param.schema = param.createSchema();
            let def: Oas20DefinitionSchema = doc.definitions.definition(this._newType);
            if (def) {
                param.schema.$ref = "#/definitions/" + this._newType;
            }
        }
    }

    /**
     * Resets the param type back to its previous state.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeParameterTypeCommand] Reverting.");
        let doc: Oas20Document = <Oas20Document> document;
        let param: Oas20Parameter = <Oas20Parameter>this._paramPath.resolve(doc);
        if (!param) {
            return;
        }

        param.type = this._oldType;
        param.schema = this._oldSchema;
        if (param.schema) {
            param.schema._parent = param;
            param.schema._ownerDocument = param.ownerDocument();
        }
    }

}
