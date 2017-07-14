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

import {AbstractCommand, ICommand} from "../_services/commands.manager";
import {Oas20Document, Oas20ItemsSchema, Oas20PropertySchema, OasDocument, OasNodePath} from "oai-ts-core";
import {SimplifiedType} from "../_models/simplified-type.model";

/**
 * A command used to modify the type of a property of an operation.
 */
export class ChangePropertyTypeCommand extends AbstractCommand implements ICommand {

    private _propPath: OasNodePath;
    private _newType: SimplifiedType;

    private _oldRef: string;
    private _oldType: string;
    private _oldFormat: string;
    private _oldItems: Oas20ItemsSchema | Oas20ItemsSchema[];

    constructor(property: Oas20PropertySchema, newType: SimplifiedType) {
        super();
        this._propPath = this.oasLibrary().createNodePath(property);
        this._newType = newType;
    }

    /**
     * Modifies the type of an operation's property.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangePropertyTypeCommand] Executing: " + this._newType);
        let doc: Oas20Document = <Oas20Document> document;
        let prop: Oas20PropertySchema = <Oas20PropertySchema>this._propPath.resolve(doc);
        if (!prop) {
            return;
        }

        // Save the old info (for later undo operation)
        this._oldRef = prop.$ref;
        this._oldType = prop.type;
        this._oldFormat = prop.format;
        if (Array.isArray(prop.items)) {
            this._oldItems = prop.items as Oas20ItemsSchema[];
        } else if (prop.items) {
            this._oldItems = prop.items as Oas20ItemsSchema;
        }

        if (this._newType.isSimpleType()) {
            prop.$ref = null;
            prop.type = this._newType.type;
            prop.format = this._newType.as;
            prop.items = null;
        }
        if (this._newType.isRef()) {
            prop.$ref = this._newType.type;
            prop.type = null;
            prop.format = null;
            prop.items = null;
        }
        if (this._newType.isArray()) {
            prop.$ref = null;
            prop.type = "array";
            prop.format = null;
            prop.items = prop.createItemsSchema();
            if (this._newType.of) {
                if (this._newType.of.isRef()) {
                    prop.items.$ref = this._newType.of.type;
                } else {
                    prop.items.type = this._newType.of.type;
                    prop.items.format = this._newType.of.as;
                }
            }
        }
    }

    /**
     * Resets the prop type back to its previous state.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangePropertyTypeCommand] Reverting.");
        let doc: Oas20Document = <Oas20Document> document;
        let prop: Oas20PropertySchema = <Oas20PropertySchema>this._propPath.resolve(doc);
        if (!prop) {
            return;
        }

        prop.$ref = this._oldRef;
        prop.type = this._oldType;
        prop.format = this._oldFormat;
        prop.items = this._oldItems;
        if (prop.items && Array.isArray(prop.items)) {
            (<Oas20ItemsSchema[]>prop.items).forEach( schema => {
                schema._parent = prop;
                schema._ownerDocument = prop.ownerDocument();
            });
        } else if (prop.items) {
            (<Oas20ItemsSchema>prop.items)._parent = prop;
            (<Oas20ItemsSchema>prop.items)._ownerDocument = prop.ownerDocument();
        }
    }

}
