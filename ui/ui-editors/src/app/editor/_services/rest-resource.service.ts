/**
 * @license
 * Copyright 2022 Red Hat
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
import {Injectable} from "@angular/core";
import * as pluralize from "pluralize";
import {
    CommandFactory,
    ICommand,
    Library,
    Oas20Parameter,
    Oas20Response,
    Oas30MediaType,
    Oas30Operation,
    Oas30Parameter,
    Oas30PathItem,
    Oas30Response,
    Oas30Schema,
    OasDocument,
    OasOperation,
    OasPathItem,
    OasResponse,
    OasResponses
} from "@apicurio/data-models";

/**
 * A service providing functionality related to managing standard REST resources.
 */
@Injectable()
export class RestResourceService {

    constructor() {
    }

    public generateRESTResourceCommands(dataTypeName: string, document: OasDocument): ICommand[] {
        let commands: ICommand[] = [];

        console.info("[RestResourceService] Creating REST resource from: ", dataTypeName);
        let lcName: string = dataTypeName.toLocaleLowerCase();
        let pluralName: string = pluralize.plural(lcName);
        let pluralCapitalized: string = pluralize.plural(dataTypeName);

        if (!this.canPluralize(lcName)) {
            pluralName = lcName;
            pluralCapitalized = dataTypeName;
        }

        let basePath: string = `/${pluralName}`;
        let subPath: string = `/${pluralName}/{${lcName}Id}`;

        console.info(`[RestResourceService] Paths to create:\n\t${basePath}\n\t${subPath}`);

        // Create the base path item e.g. /widgets with a GET and POST operation
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // The path item
        let basePathItem: OasPathItem = document.createPaths().createPathItem(basePath);

        // The GET operation
        let baseGetOp: OasOperation = basePathItem.createOperation("get");
        basePathItem.get = baseGetOp;
        baseGetOp.summary = `List All ${pluralCapitalized}`;
        baseGetOp.operationId = `get${pluralCapitalized}`;
        baseGetOp.description = `Gets a list of all \`${dataTypeName}\` entities.`;
        let baseGetOpResponses: OasResponses = baseGetOp.createResponses();
        baseGetOp.responses = baseGetOpResponses;
        let baseGetOp200Response: OasResponse = baseGetOpResponses.createResponse("200");
        baseGetOp200Response.description = `Successful response - returns an array of \`${dataTypeName}\` entities.`;
        baseGetOpResponses.addResponse("200", baseGetOp200Response);

        // The POST operation
        let basePostOp: OasOperation = basePathItem.createOperation("post");
        basePathItem.post = basePostOp;
        basePostOp.summary = `Create a ${dataTypeName}`;
        basePostOp.operationId = `create${dataTypeName}`;
        basePostOp.description = `Creates a new instance of a \`${dataTypeName}\`.`;
        let basePostOpResponses: OasResponses = basePostOp.createResponses();
        basePostOp.responses = basePostOpResponses;
        let basePostOp201Response: OasResponse = basePostOpResponses.createResponse("201");
        basePostOp201Response.description = `Successful response.`;
        basePostOpResponses.addResponse("201", basePostOp201Response);

        // OAI 3.0 specific
        if (document.is3xDocument()) {
            // Path Item name + description
            let pi: Oas30PathItem = basePathItem as Oas30PathItem;
            pi.summary = `Path used to manage the list of ${pluralName}.`;
            pi.description = `The REST endpoint/path used to list and create zero or more \`${dataTypeName}\` entities.  This path contains a \`GET\` and \`POST\` operation to perform the list and create tasks, respectively.`;

            // GET operation response
            let getOp200Response: Oas30Response = baseGetOp200Response as Oas30Response;
            let getOp200ResponseMT: Oas30MediaType = getOp200Response.createMediaType("application/json");
            getOp200Response.addMediaType("application/json", getOp200ResponseMT);
            getOp200ResponseMT.schema = getOp200ResponseMT.createSchema();
            getOp200ResponseMT.schema.type = "array";
            getOp200ResponseMT.schema.items = getOp200ResponseMT.schema.createItemsSchema();
            getOp200ResponseMT.schema.items.$ref = `#/components/schemas/${dataTypeName}`;

            // POST operation request body
            let basePostOp30: Oas30Operation = basePostOp as Oas30Operation;
            basePostOp30.requestBody = basePostOp30.createRequestBody();
            basePostOp30.requestBody.required = true;
            basePostOp30.requestBody.description = `A new \`${dataTypeName}\` to be created.`;
            let putOpMT: Oas30MediaType = basePostOp30.requestBody.createMediaType("application/json");
            basePostOp30.requestBody.addMediaType("application/json", putOpMT);
            putOpMT.schema = putOpMT.createSchema();
            putOpMT.schema.$ref = `#/components/schemas/${dataTypeName}`;
        }
        // OAI 2.0 specific
        if (document.is2xDocument()) {
            // GET operation response
            let getOp200Response: Oas20Response = baseGetOp200Response as Oas20Response;
            getOp200Response.schema = getOp200Response.createSchema();
            getOp200Response.schema.type = "array";
            getOp200Response.schema.items = getOp200Response.schema.createItemsSchema();
            getOp200Response.schema.items.$ref = `#/definitions/${dataTypeName}`;

            // PUT operation request body
            let bodyParam: Oas20Parameter = basePostOp.createParameter() as Oas20Parameter;
            bodyParam.name = "body";
            bodyParam.in = "body";
            bodyParam.description = `A new \`${dataTypeName}\` to be created.`;
            bodyParam.required = true;
            bodyParam.schema = bodyParam.createSchema();
            bodyParam.schema.$ref = `#/definitions/${dataTypeName}`;
            basePostOp.addParameter(bodyParam);
        }

        // The command to create it
        let basePathCmd: ICommand = CommandFactory.createAddPathItemCommand(basePath, Library.writeNode(basePathItem));
        commands.push(basePathCmd);

        // Create the sub-path item e.g. "/widgets/{widgetId}" with GET, PUT, and DELETE operations
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // The path item
        let subPathItem: OasPathItem = document.createPaths().createPathItem(subPath);

        // The path parameter
        let subPathParam: Oas30Parameter | Oas20Parameter = subPathItem.createParameter() as Oas30Parameter | Oas20Parameter;
        subPathParam.description = `A unique identifier for a \`${dataTypeName}\`.`;
        subPathParam.name = lcName + "Id";
        subPathParam.in = "path";
        subPathParam.required = true;
        subPathItem.addParameter(subPathParam);

        // The GET operation
        let subGetOp: OasOperation = subPathItem.createOperation("get");
        subPathItem.get = subGetOp;
        subGetOp.summary = `Get a ${dataTypeName}`;
        subGetOp.operationId = `get${dataTypeName}`;
        subGetOp.description = `Gets the details of a single instance of a \`${dataTypeName}\`.`;
        let subGetOpResponses: OasResponses = subGetOp.createResponses();
        subGetOp.responses = subGetOpResponses;
        let subGetOp200Response: OasResponse = subGetOpResponses.createResponse("200");
        subGetOp200Response.description = `Successful response - returns a single \`${dataTypeName}\`.`;
        subGetOpResponses.addResponse("200", subGetOp200Response);

        // The PUT operation
        let subPutOp: OasOperation = subPathItem.createOperation("put");
        subPathItem.put = subPutOp;
        subPutOp.summary = `Update a ${dataTypeName}`;
        subPutOp.operationId = `update${dataTypeName}`;
        subPutOp.description = `Updates an existing \`${dataTypeName}\`.`;
        let subPutOpResponses: OasResponses = subPutOp.createResponses();
        subPutOp.responses = subPutOpResponses;
        let subPutOp202Response: OasResponse = subPutOpResponses.createResponse("202");
        subPutOp202Response.description = `Successful response.`;
        subPutOpResponses.addResponse("202", subPutOp202Response);

        // The DELETE operation
        let subDeleteOp: OasOperation = subPathItem.createOperation("delete");
        subPathItem.delete = subDeleteOp;
        subDeleteOp.summary = `Delete a ${dataTypeName}`;
        subDeleteOp.operationId = `delete${dataTypeName}`;
        subDeleteOp.description = `Deletes an existing \`${dataTypeName}\`.`;
        let subDeleteOpResponses: OasResponses = subDeleteOp.createResponses();
        subDeleteOp.responses = subDeleteOpResponses;
        let subDeleteOp204Response: OasResponse = subDeleteOpResponses.createResponse("204");
        subDeleteOp204Response.description = `Successful response.`;
        subDeleteOpResponses.addResponse("204", subDeleteOp204Response);

        // OAI 3.0 specific
        if (document.is3xDocument()) {
            let pi: Oas30PathItem = subPathItem as Oas30PathItem;
            pi.summary = `Path used to manage a single ${dataTypeName}.`;
            pi.description = `The REST endpoint/path used to get, update, and delete single instances of an \`${dataTypeName}\`.  This path contains \`GET\`, \`PUT\`, and \`DELETE\` operations used to perform the get, update, and delete tasks, respectively.`;

            // GET operation response type
            let getOp200Response: Oas30Response = subGetOp200Response as Oas30Response;
            let getOp200ResponseMT: Oas30MediaType = getOp200Response.createMediaType("application/json");
            getOp200Response.addMediaType("application/json", getOp200ResponseMT);
            getOp200ResponseMT.schema = getOp200ResponseMT.createSchema();
            getOp200ResponseMT.schema.$ref = `#/components/schemas/${dataTypeName}`;

            // PUT operation request body
            let subPutOp30: Oas30Operation = subPutOp as Oas30Operation;
            subPutOp30.requestBody = subPutOp30.createRequestBody();
            subPutOp30.requestBody.required = true;
            subPutOp30.requestBody.description = `Updated \`${dataTypeName}\` information.`;
            let putOpMT: Oas30MediaType = subPutOp30.requestBody.createMediaType("application/json");
            subPutOp30.requestBody.addMediaType("application/json", putOpMT);
            putOpMT.schema = putOpMT.createSchema();
            putOpMT.schema.$ref = `#/components/schemas/${dataTypeName}`;

            // Path parameter type
            let subPathParam30: Oas30Parameter = subPathParam as Oas30Parameter;
            subPathParam30.schema = subPathParam30.createSchema();
            (<Oas30Schema>subPathParam30.schema).type = "string";
        }
        // OAI 2.0 specific
        if (document.is2xDocument()) {
            // GET operation type
            let getOp200Response: Oas20Response = subGetOp200Response as Oas20Response;
            getOp200Response.schema = getOp200Response.createSchema();
            getOp200Response.schema.$ref = `#/definitions/${dataTypeName}`;

            // PUT operation request body
            let bodyParam: Oas20Parameter = subPutOp.createParameter() as Oas20Parameter;
            bodyParam.name = "body";
            bodyParam.in = "body";
            bodyParam.description = `Updated \`${dataTypeName}\` information.`;
            bodyParam.required = true;
            bodyParam.schema = bodyParam.createSchema();
            bodyParam.schema.$ref = `#/definitions/${dataTypeName}`;
            subPutOp.addParameter(bodyParam);

            // Path parameter type
            let subPathParam20: Oas20Parameter = subPathParam as Oas20Parameter;
            subPathParam20.type = "string";
        }

        // The command to create it
        let subPathCmd: ICommand = CommandFactory.createAddPathItemCommand(subPath, Library.writeNode(subPathItem));
        commands.push(subPathCmd);

        return commands;
    }

    private canPluralize(name: string): boolean {
        let regexp: RegExp = /^.+[a-zA-Z]$/;
        return regexp.test(name);
    }

}
