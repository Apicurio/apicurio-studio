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
    OasDocument, Oas20Document, Oas20Schema, Oas20Parameter,
    OasNodePath, Oas20Items
} from "oai-ts-core";
import {SimplifiedType} from "../_models/simplified-type.model";

/**
 * A command used to modify the type of a parameter of an operation.
 */
export class ChangeParameterTypeCommand extends AbstractCommand implements ICommand {

    private _paramPath: OasNodePath;
    private _newType: SimplifiedType;
    private _oldType: string;
    private _oldFormat: string;
    private _oldItems: Oas20Items;
    private _oldSchema: Oas20Schema;

    constructor(parameter: Oas20Parameter, newType: SimplifiedType) {
        super();
        this._paramPath = this.oasLibrary().createNodePath(parameter);
        this._newType = newType;
    }

    /**
     * Modifies the type of an operation's parameter.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeParameterTypeCommand] Executing: ");
        let doc: Oas20Document = <Oas20Document> document;
        let param: Oas20Parameter = <Oas20Parameter>this._paramPath.resolve(doc);
        if (!param) {
            return;
        }

        // Save the old info (for later undo operation)
        this._oldType = param.type;
        this._oldFormat = param.format;
        this._oldItems = param.items;
        this._oldSchema = param.schema;

        // If it's a body param, change the schema child.  Otherwise change the param itself.
        if (param.in === "body") {
            param.schema = param.createSchema();

            if (this._newType.isSimpleType()) {
                param.schema.type = this._newType.type;
                param.schema.format = this._newType.as;
            }
            if (this._newType.isRef()) {
                param.schema.$ref = this._newType.type;
            }
            if (this._newType.isArray()) {
                param.schema.type = "array";
                param.schema.format = null;
                param.schema.items = param.schema.createItemsSchema();
                if (this._newType.of) {
                    if (this._newType.of.isSimpleType()) {
                        param.schema.items.type = this._newType.of.type;
                        param.schema.items.format = this._newType.of.as;
                    }
                    if (this._newType.of.isRef()) {
                        param.schema.items.$ref = this._newType.of.type;
                    }
                }
            }
        } else {
            if (this._newType.isSimpleType()) {
                param.type = this._newType.type;
                param.format = this._newType.as;
                param.items = null;
            }
            if (this._newType.isArray()) {
                param.type = "array";
                param.items = param.createItems();
                if (this._newType.of) {
                    param.items.type = this._newType.of.type;
                    param.items.format = this._newType.of.as;
                }
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
        param.format = this._oldFormat;
        param.items = this._oldItems;
        if (param.items) {
            param.items._parent = param;
            param.items._ownerDocument = param.ownerDocument();
        }
        param.schema = this._oldSchema;
        if (param.schema) {
            param.schema._parent = param;
            param.schema._ownerDocument = param.ownerDocument();
        }
    }

}
