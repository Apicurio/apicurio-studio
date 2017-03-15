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
    Oas20Parameter, Oas20Response, Oas20Responses, Oas20Definitions, Oas20DefinitionSchema, Oas20Tag
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


/**
 * A command used to delete a single parameter from an operation.
 */
export class DeleteParameterCommand extends AbstractCommand implements ICommand {

    private _parameterPath: OasNodePath;
    private _operationPath: OasNodePath;
    private _oldParameter: Oas20Parameter;

    constructor(parameter: Oas20Parameter) {
        super();
        this._parameterPath = this.oasLibrary().createNodePath(parameter);
        this._operationPath = this.oasLibrary().createNodePath(parameter.parent());
    }

    /**
     * Deletes the parameter.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteParameterCommand] Executing.");
        this._oldParameter = null;

        let param: Oas20Parameter = <Oas20Parameter>this._parameterPath.resolve(document);

        if (this.isNullOrUndefined(param)) {
            return;
        }

        let params: Oas20Parameter[] = (<Oas20Operation>param.parent()).parameters;
        params.splice(params.indexOf(param), 1);

        this._oldParameter = param;
    }

    /**
     * Restore the old (deleted) parameter.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteParameterCommand] Reverting.");
        if (!this._oldParameter) {
            return;
        }

        let operation: Oas20Operation = <Oas20Operation>this._operationPath.resolve(document);
        if (this.isNullOrUndefined(operation)) {
            return;
        }

        if (this.isNullOrUndefined(operation.parameters)) {
            operation.parameters = [];
        }

        this._oldParameter._parent = operation;
        this._oldParameter._ownerDocument = operation.ownerDocument();
        operation.parameters.push(this._oldParameter);
    }

}


/**
 * A command used to delete a single response from an operation.
 */
export class DeleteResponseCommand extends AbstractCommand implements ICommand {

    private _responsePath: OasNodePath;
    private _responsesPath: OasNodePath;
    private _oldResponse: Oas20Response;

    constructor(response: Oas20Response) {
        super();
        this._responsePath = this.oasLibrary().createNodePath(response);
        this._responsesPath = this.oasLibrary().createNodePath(response.parent());
    }

    /**
     * Deletes the response.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteResponseCommand] Executing.");
        this._oldResponse = null;

        let response: Oas20Response = <Oas20Response>this._responsePath.resolve(document);
        if (this.isNullOrUndefined(response)) {
            return;
        }

        let responses: Oas20Responses = <Oas20Responses>response.parent();
        if (response.statusCode() === null) {
            responses.default = null;
        } else {
            responses.removeResponse(response.statusCode());
        }

        this._oldResponse = response;
    }

    /**
     * Restore the old (deleted) parameters.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteResponseCommand] Reverting.");
        if (!this._oldResponse) {
            return;
        }

        let responses: Oas20Responses = <Oas20Responses>this._responsesPath.resolve(document);
        if (this.isNullOrUndefined(responses)) {
            return;
        }

        this._oldResponse._parent = responses;
        this._oldResponse._ownerDocument = responses.ownerDocument();

        if (this.isNullOrUndefined(this._oldResponse.statusCode()) && this.isNullOrUndefined(responses.default)) {
            responses.default = this._oldResponse;
        } else {
            responses.addResponse(this._oldResponse.statusCode(), this._oldResponse);
        }
    }

}


/**
 * A command used to delete a definition schema.
 */
export class DeleteDefinitionSchemaCommand extends AbstractCommand implements ICommand {

    private _definitionName: string;
    private _oldDefinition: Oas20DefinitionSchema;

    constructor(definitionName: string) {
        super();
        this._definitionName = definitionName;
    }

    /**
     * Deletes the definition.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteDefinitionSchemaCommand] Executing.");
        this._oldDefinition = null;
        let doc: Oas20Document  = <Oas20Document>document;
        let definitions: Oas20Definitions = doc.definitions;
        if (this.isNullOrUndefined(definitions)) {
            return;
        }

        this._oldDefinition = definitions.removeDefinition(this._definitionName);
    }

    /**
     * Restore the old (deleted) definition.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteDefinitionSchemaCommand] Reverting.");
        let doc: Oas20Document  = <Oas20Document>document;
        let definitions: Oas20Definitions = doc.definitions;
        if (this.isNullOrUndefined(definitions) || this.isNullOrUndefined(this._oldDefinition)) {
            return;
        }

        this._oldDefinition._parent = definitions;
        this._oldDefinition._ownerDocument = definitions.ownerDocument();
        definitions.addDefinition(this._oldDefinition.definitionName(), this._oldDefinition);
    }

}


/**
 * A command used to delete a single tag definition from the document.
 */
export class DeleteTagCommand extends AbstractCommand implements ICommand {

    private _tag: Oas20Tag;

    constructor(tag: Oas20Tag) {
        super();
        this._tag = tag;
    }

    /**
     * Deletes the tag.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteTagCommand] Executing.");

        let doc: Oas20Document = <Oas20Document>document;
        let index: number = 0;
        for (let dt of doc.tags) {
            if (dt.name === this._tag.name) {
                break;
            }
            index++;
        }

        doc.tags.splice(index, 1);
    }

    /**
     * Restore the old (deleted) tag.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteTagCommand] Reverting.");

        let doc: Oas20Document = <Oas20Document>document;
        this._tag._parent = doc;
        this._tag._ownerDocument = doc;
        doc.tags.push(this._tag);
    }

}

