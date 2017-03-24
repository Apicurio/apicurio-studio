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
    OasDocument, Oas20Document, OasNode, OasNodePath, Oas20Parameter, Oas20Operation,
    Oas20PathItem
} from "oai-ts-core";
import {ObjectUtils} from "../../../../../util/common";

/**
 * A command used to modify the simple property of a node.
 */
export class ChangePropertyCommand<T> extends AbstractCommand implements ICommand {

    private _property: string;
    private _newValue: T;
    private _oldValue: T;
    private _nodePath: OasNodePath;

    constructor(property: string, newValue: T, node: OasNode) {
        super();
        this._property = property;
        this._newValue = newValue;
        this._nodePath = this.oasLibrary().createNodePath(node);
    }

    /**
     * Modifies the property of the node.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangePropertyCommand] Executing.");
        let node: OasNode = this._nodePath.resolve(document);
        if (!node) {
            return;
        }

        this._oldValue = <T>node[this._property];

        node[this._property] = this._newValue;
    }

    /**
     * Resets the property back to a previous state.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangePropertyCommand] Reverting.");
        let node: OasNode = this._nodePath.resolve(document);
        if (!node) {
            return;
        }

        node[this._property] = this._oldValue;
        this._oldValue = null;
    }

}
