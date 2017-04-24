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
    OasNodePath, Oas20PathItem
} from "oai-ts-core";
import {ModelUtils} from "../_util/model.util";

/**
 * A command used to modify the description of all path parameters for all operations in a given
 * path, with a given path parameter name.
 */
export class ChangePathParametersDescriptionCommand extends AbstractCommand implements ICommand {

    private _pathPath: OasNodePath;
    private _paramName: string;
    private _newDescription: string;

    private _oldDescriptions: {
        path: OasNodePath,
        description: string
    }[];

    constructor(path: Oas20PathItem, paramName: string, newDescription: string) {
        super();
        this._pathPath = this.oasLibrary().createNodePath(path);
        this._paramName = paramName;
        this._newDescription = newDescription;
    }

    /**
     * Modifies the descriptions of all named path parameters for all operations in the path.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeParameterTypeCommand] Executing.");
        let doc: Oas20Document = <Oas20Document> document;
        this._oldDescriptions = [];
        let path: Oas20PathItem = <Oas20PathItem>this._pathPath.resolve(doc);
        if (!path) {
            return;
        }

        let params: Oas20Parameter[] = ModelUtils.getAllPathParams(path, this._paramName);
        params.forEach( param => {
            this._oldDescriptions.push({
                path: this.oasLibrary().createNodePath(param),
                description: param.description
            });
            param.description = this._newDescription;
        });
    }

    /**
     * Resets the param type back to its previous state.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeParameterTypeCommand] Reverting %d params.", this._oldDescriptions.length);
        let doc: Oas20Document = <Oas20Document> document;
        let path: Oas20PathItem = <Oas20PathItem>this._pathPath.resolve(doc);
        if (!path || this._oldDescriptions.length === 0) {
            return;
        }

        this._oldDescriptions.forEach( od => {
            let param: Oas20Parameter = <Oas20Parameter>od.path.resolve(doc);
            if (param) {
                param.description = od.description;
            }
        });
    }

}


/**
 * A command used to modify the type of a path parameter of an operation.
 */
export class ChangePathParametersTypeCommand extends AbstractCommand implements ICommand {

    private _pathPath: OasNodePath;
    private _paramName: string;
    private _newType: Oas20Schema;

    private _oldTypes: {
        path: OasNodePath,
        type: string,
        format: string
    }[];

    constructor(path: Oas20PathItem, paramName: string, newType: Oas20Schema) {
        super();
        this._pathPath = this.oasLibrary().createNodePath(path);
        this._paramName = paramName;
        this._newType = newType;
    }

    /**
     * Modifies the descriptions of all named path parameters for all operations in the path.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangePathParametersTypeCommand] Executing.");
        let doc: Oas20Document = <Oas20Document> document;
        this._oldTypes = [];
        let path: Oas20PathItem = <Oas20PathItem>this._pathPath.resolve(doc);
        if (!path) {
            return;
        }

        let params: Oas20Parameter[] = ModelUtils.getAllPathParams(path, this._paramName);
        params.forEach( param => {
            this._oldTypes.push({
                path: this.oasLibrary().createNodePath(param),
                type: param.type,
                format: param.format
            });
            param.type = this._newType.type;
            param.format = this._newType.format;
        });
    }

    /**
     * Resets the param type back to its previous state.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangePathParametersTypeCommand] Reverting %d params.", this._oldTypes.length);
        let doc: Oas20Document = <Oas20Document> document;
        let path: Oas20PathItem = <Oas20PathItem>this._pathPath.resolve(doc);
        if (!path || this._oldTypes.length === 0) {
            return;
        }

        this._oldTypes.forEach( od => {
            let param: Oas20Parameter = <Oas20Parameter>od.path.resolve(doc);
            if (param) {
                param.type = od.type;
                param.format = od.format;
            }
        });
    }

}
