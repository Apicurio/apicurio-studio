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
    OasDocument, Oas20Document, Oas20PathItem, OasNode, OasNodePath, Oas20Paths, Oas20Operation,
    Oas20Parameter, Oas20Response, Oas20Responses, Oas20Definitions, Oas20SchemaDefinition, Oas20Tag,
    Oas20SecurityScheme, Oas20SecurityDefinitions, Oas20PropertySchema, Oas20Schema, IOasParameterParent,
    OasParameterBase
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
        console.info("[DeletePathCommand] Executing for path: %s", this._path);
        this._oldPath = null;
        let doc: Oas20Document  = <Oas20Document>document;
        let paths: Oas20Paths = doc.paths as Oas20Paths;
        if (this.isNullOrUndefined(paths)) {
            return;
        }

        this._oldPath = paths.removePathItem(this._path) as Oas20PathItem;
    }

    /**
     * Restore the old (deleted) path.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeletePathCommand] Reverting.");
        let doc: Oas20Document  = <Oas20Document>document;
        let paths: Oas20Paths = doc.paths as Oas20Paths;
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

    private _parentPath: OasNodePath;
    private _paramType: string;
    private _oldQueryParams: Oas20Parameter[];

    constructor(parent: Oas20Operation|Oas20PathItem, type: string) {
        super();
        this._parentPath = this.oasLibrary().createNodePath(parent);
        this._paramType = type;
    }

    /**
     * Deletes the parameters.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteAllParameters] Executing.");
        this._oldQueryParams = [];

        let parent: IOasParameterParent = (<any>this._parentPath.resolve(document)) as IOasParameterParent;

        if (this.isNullOrUndefined(parent) || this.isNullOrUndefined(parent.parameters) || parent.parameters.length === 0) {
            return;
        }

        for (let param of parent.parameters) {
            if (param.in === this._paramType) {
                this._oldQueryParams.push(param as Oas20Parameter);
            }
        }

        if (this._oldQueryParams.length === 0) {
            return;
        }

        for (let param of this._oldQueryParams) {
            parent.parameters.splice(parent.parameters.indexOf(param), 1);
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

        let parent: IOasParameterParent = (<any>this._parentPath.resolve(document)) as IOasParameterParent;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        for (let param of this._oldQueryParams) {
            param._parent = <any>parent as OasNode;
            param._ownerDocument = (<any>parent as OasNode).ownerDocument();
            if (!parent.parameters) {
                parent.parameters = [];
            }
            parent.parameters.push(param);
        }
    }

}


/**
 * A command used to delete a single parameter from an operation.
 */
export class DeleteParameterCommand extends AbstractCommand implements ICommand {

    private _parameterPath: OasNodePath;
    private _parentPath: OasNodePath;
    private _oldParameter: Oas20Parameter;

    constructor(parameter: Oas20Parameter) {
        super();
        this._parameterPath = this.oasLibrary().createNodePath(parameter);
        this._parentPath = this.oasLibrary().createNodePath(parameter.parent());
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

        let params: OasParameterBase[] = (<Oas20Operation>param.parent()).parameters;
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

        let parent: IOasParameterParent = <any>this._parentPath.resolve(document) as IOasParameterParent;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        if (this.isNullOrUndefined(parent.parameters)) {
            parent.parameters = [];
        }

        this._oldParameter._parent = <any>parent as OasNode;
        this._oldParameter._ownerDocument = (<any>parent as OasNode).ownerDocument();
        parent.parameters.push(this._oldParameter);
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
    private _oldDefinition: Oas20SchemaDefinition;

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


/**
 * A command used to delete a security scheme.
 */
export class DeleteSecuritySchemeCommand extends AbstractCommand implements ICommand {

    private _schemeName: string;
    private _oldScheme: Oas20SecurityScheme;

    constructor(schemeName: string) {
        super();
        this._schemeName = schemeName;
    }

    /**
     * Deletes the security scheme.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteSecuritySchemeCommand] Executing.");
        this._oldScheme = null;
        let doc: Oas20Document  = <Oas20Document>document;
        let definitions: Oas20SecurityDefinitions = doc.securityDefinitions;
        if (this.isNullOrUndefined(definitions)) {
            return;
        }

        this._oldScheme = definitions.removeSecurityScheme(this._schemeName);
    }

    /**
     * Restore the old (deleted) security scheme.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteSecuritySchemeCommand] Reverting.");
        let doc: Oas20Document  = <Oas20Document>document;
        let definitions: Oas20SecurityDefinitions = doc.securityDefinitions;
        if (this.isNullOrUndefined(definitions) || this.isNullOrUndefined(this._oldScheme)) {
            return;
        }

        this._oldScheme._parent = definitions;
        this._oldScheme._ownerDocument = definitions.ownerDocument();
        definitions.addSecurityScheme(this._oldScheme.schemeName(), this._oldScheme);
    }

}


/**
 * A command used to delete a single property from a schema.
 */
export class DeletePropertyCommand extends AbstractCommand implements ICommand {

    private _propertyPath: OasNodePath;
    private _schemaPath: OasNodePath;
    private _oldProperty: Oas20PropertySchema;

    constructor(property: Oas20PropertySchema) {
        super();
        this._propertyPath = this.oasLibrary().createNodePath(property);
        this._schemaPath = this.oasLibrary().createNodePath(property.parent());
    }

    /**
     * Deletes the property.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeletePropertyCommand] Executing.");
        this._oldProperty = null;

        let property: Oas20PropertySchema = <Oas20PropertySchema>this._propertyPath.resolve(document);

        if (this.isNullOrUndefined(property)) {
            return;
        }

        this._oldProperty = (<Oas20Schema>property.parent()).removeProperty(property.propertyName()) as Oas20PropertySchema;
    }

    /**
     * Restore the old (deleted) property.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeletePropertyCommand] Reverting.");
        if (!this._oldProperty) {
            return;
        }

        let schema: Oas20Schema = <Oas20Schema>this._schemaPath.resolve(document);
        if (this.isNullOrUndefined(schema)) {
            return;
        }

        this._oldProperty._parent = schema;
        this._oldProperty._ownerDocument = schema.ownerDocument();
        schema.addProperty(this._oldProperty.propertyName(), this._oldProperty);
    }

}


/**
 * A command used to delete all properties from a schema.
 */
export class DeleteAllPropertiesCommand extends AbstractCommand implements ICommand {

    private _schemaPath: OasNodePath;
    private _oldProperties: Oas20PropertySchema[];

    constructor(schema: Oas20Schema) {
        super();
        this._schemaPath = this.oasLibrary().createNodePath(schema);
    }

    /**
     * Deletes the properties.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteAllPropertiesCommand] Executing.");
        this._oldProperties = [];

        let schema: Oas20Schema = <Oas20Schema>this._schemaPath.resolve(document);

        if (this.isNullOrUndefined(schema)) {
            return;
        }

        schema.propertyNames().forEach( pname => {
            this._oldProperties.push(schema.removeProperty(pname) as Oas20PropertySchema);
        });
    }

    /**
     * Restore the old (deleted) property.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteAllPropertiesCommand] Reverting.");
        if (this._oldProperties.length === 0) {
            return;
        }

        let schema: Oas20Schema = <Oas20Schema>this._schemaPath.resolve(document);
        if (this.isNullOrUndefined(schema)) {
            return;
        }

        this._oldProperties.forEach( prop => {
            prop._parent = schema;
            prop._ownerDocument = schema.ownerDocument();
            schema.addProperty(prop.propertyName(), prop);
        });
    }

}
