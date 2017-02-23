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


/**
 * A command used to modify a Path Parameter property.  This is different because when a
 * path parameter's property is changed, we often also want to change that same property
 * for all sibling operations.  In other words, if the "description" of a path parameter
 * for a GET operation is changed, we also want to change the "description" parameter for
 * the PUT, POST, DELETE, etc operations for the same path.  The idea is that the
 * documentation for path parameters should be the same for all operations in a path.
 *
 * This is largely a problem with the OpenAPI specification, where path parameters should
 * be declared/documented at the path level rather than at the Operation level (my opinion).
 */
export class ChangePathParameterPropertyCommand<T> extends AbstractCommand implements ICommand {

    private _property: string;
    private _paramName: string;
    private _newValue: T;
    private _pathItemPath: OasNodePath;

    private _oldInfo: any[];

    constructor(property: string, newValue: T, parameter: Oas20Parameter) {
        super();
        this._property = property;
        this._paramName = parameter.name;
        this._newValue = newValue;
        // note: parameter.parent().parent() is the path parameter's "Path Item"
        this._pathItemPath = this.oasLibrary().createNodePath(parameter.parent().parent());
    }

    /**
     * Modifies the property of the node.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangePathParameterPropertyCommand] Executing.");

        let pathItem: Oas20PathItem = <Oas20PathItem>this._pathItemPath.resolve(document);
        if (!pathItem) {
            return;
        }

        this._oldInfo = [];

        // Now find all Path Parameters with the appropriate name from all operations.
        [
            this.findPathParam(pathItem.get, this._paramName),
            this.findPathParam(pathItem.put, this._paramName),
            this.findPathParam(pathItem.post, this._paramName),
            this.findPathParam(pathItem.delete, this._paramName),
            this.findPathParam(pathItem.options, this._paramName),
            this.findPathParam(pathItem.head, this._paramName),
            this.findPathParam(pathItem.patch, this._paramName)
        ].filter( parameter => {
            return !ObjectUtils.isNullOrUndefined(parameter);
        }).forEach( parameter => {
            // Save the old property value.
            this._oldInfo.push({
                nodePath: this.oasLibrary().createNodePath(parameter),
                oldValue: parameter[this._property]
            });
            // Update the property value.
            parameter[this._property] = this._newValue;
        });
    }

    /**
     * Resets the property back to a previous state.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangePathParameterPropertyCommand] Reverting.");
        if (this._oldInfo) {
            for (let info of this._oldInfo) {
                let param: Oas20Parameter = info.nodePath.resolve(document);
                param[this._property] = info.oldValue;
            }
        }
    }

    /**
     * Finds and returns a path parameter (if one exists) with the given name.
     * @param operation
     * @param paramName
     * @return {any}
     */
    private findPathParam(operation: Oas20Operation, paramName: string): Oas20Parameter {
        if (ObjectUtils.isNullOrUndefined(operation)) {
            return null;
        }
        if (operation.parameters) {
            for (let parameter of operation.parameters) {
                if (parameter.name === paramName && parameter.in === "path") {
                    return parameter;
                }
            }
        }
        return null;
    }

}
