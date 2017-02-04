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
    OasDocument, Oas20Document, Oas20PathItem, OasNode, OasNodePath, Oas20Paths, Oas20Operation,
    Oas20Parameter
} from "oai-ts-core";

/**
 * A command used to delete a child node.
 */
export class DeleteNodeCommand extends AbstractCommand implements ICommand {

    private _property: string;
    private _parentPath: OasNodePath;
    private _oldValue: OasNode;

    constructor(property: string, parent: OasNode) {
        super();
        this._property = property;
        this._parentPath = this.oasLibrary().createNodePath(parent);
    }

    /**
     * Deletes the property of the node.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteNodeCommand] Executing.");
        let parent: OasNode = this._parentPath.resolve(document);
        if (!parent) {
            return;
        }

        this._oldValue = <OasNode>parent[this._property];

        parent[this._property] = null;
        delete parent[this._property];
    }

    /**
     * Restore the old (deleted) child node.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteNodeCommand] Reverting.");
        let parent: OasNode = this._parentPath.resolve(document);
        if (!parent) {
            return;
        }

        parent[this._property] = this._oldValue;
        this._oldValue._parent = parent;
        this._oldValue._ownerDocument = parent.ownerDocument();
    }

}


/**
 * A command used to delete a path.
 */
export class DeletePathCommand extends AbstractCommand implements ICommand {

    private _path: string;
    private _oldPath: Oas20PathItem;

    constructor(path: string) {
        super();
        this._path = path;
    }

    /**
     * Deletes the path.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeletePathCommand] Executing.");
        this._oldPath = null;
        let doc: Oas20Document  = <Oas20Document>document;
        let paths: Oas20Paths = doc.paths;
        if (this.isNullOrUndefined(paths)) {
            return;
        }

        this._oldPath = paths.removePathItem(this._path);
    }

    /**
     * Restore the old (deleted) path.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeletePathCommand] Reverting.");
        let doc: Oas20Document  = <Oas20Document>document;
        let paths: Oas20Paths = doc.paths;
        if (this.isNullOrUndefined(paths) || this.isNullOrUndefined(this._oldPath)) {
            return;
        }

        this._oldPath._parent = paths;
        this._oldPath._ownerDocument = paths.ownerDocument();
        paths.addPathItem(this._oldPath.path(), this._oldPath);
    }

}



/**
 * A command used to delete all parameters from an operation.
 */
export class DeleteAllParameters extends AbstractCommand implements ICommand {

    private _operationPath: OasNodePath;
    private _paramType: string;
    private _oldQueryParams: Oas20Parameter[];

    constructor(operation: Oas20Operation, type: string) {
        super();
        this._operationPath = this.oasLibrary().createNodePath(operation);
        this._paramType = type;
    }

    /**
     * Deletes the parameters.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteAllParameters] Executing.");
        this._oldQueryParams = [];

        let operation: Oas20Operation = <Oas20Operation>this._operationPath.resolve(document);

        if (this.isNullOrUndefined(operation) || this.isNullOrUndefined(operation.parameters) || operation.parameters.length === 0) {
            return;
        }

        for (let param of operation.parameters) {
            if (param.in === this._paramType) {
                this._oldQueryParams.push(param);
            }
        }

        if (this._oldQueryParams.length === 0) {
            return;
        }

        for (let param of this._oldQueryParams) {
            operation.parameters.splice(operation.parameters.indexOf(param), 1);
        }
    }

    /**
     * Restore the old (deleted) parameters.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteAllParameters] Reverting.");

        if (this._oldQueryParams.length === 0) {
            return;
        }

        let operation: Oas20Operation = <Oas20Operation>this._operationPath.resolve(document);
        if (this.isNullOrUndefined(operation)) {
            return;
        }

        for (let param of this._oldQueryParams) {
            param._parent = operation;
            param._ownerDocument = operation.ownerDocument();
            if (!operation.parameters) {
                operation.parameters = [];
            }
            operation.parameters.push(param);
        }
    }

}
