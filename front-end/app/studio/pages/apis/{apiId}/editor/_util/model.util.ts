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

import {
    Oas20Parameter, Oas20Operation, Oas20PathItem, IOas20NodeVisitor, Oas20Document, Oas20Info,
    Oas20Contact, Oas20License, Oas20Paths, Oas20ParameterDefinition, Oas20ExternalDocumentation,
    Oas20SecurityRequirement, Oas20Responses, Oas20Response, Oas20ResponseDefinition, Oas20SchemaDefinition, Oas20XML,
    Oas20Scopes, Oas20SecurityScheme, Oas20SecurityDefinitions, Oas20Tag, Oas20Items, Oas20Example, Oas20Header,
    Oas20Headers, Oas20Schema, Oas20PropertySchema, Oas20AllOfSchema, Oas20ItemsSchema, Oas20Definitions,
    Oas20ParametersDefinitions, Oas20ResponsesDefinitions, OasExtension, Oas20AdditionalPropertiesSchema, OasNode,
    OasOperation
} from "oai-ts-core";
import {ObjectUtils} from "./object.util";

export class ModelUtils {

    /**
     * Detects the appropriate path parameter names from a path.  For example, if the
     * string "/resources/{fooId}/subresources/{barId}" is passed in, the following
     * string array will be returned:  [ "fooId", "barId" ]
     * @param path
     * @return {string[]}
     */
    public static detectPathParamNames(path: string): string[] {
        let segments: string[] = path.split("/");
        let pnames: string[] = segments.filter(segment => {
            return segment.startsWith("{") && segment.endsWith("}");
        }).map(segment => {
            return segment.substring(1, segment.length - 1);
        });
        return pnames;
    }

    /**
     * Goes through all of the operations defined on the given path item, then returns an array
     * of the named path param (if it exists) for each operation.  This is useful when changing
     * the description and/or type simultaneously for all path parameters with the same name
     * for a given path.
     * @param path
     * @param paramName
     * @return {Oas20Parameter[]}
     */
    public static getAllPathParams(path: Oas20PathItem, paramName: string): Oas20Parameter[] {
        let operations: OasOperation[] = [
            path.get, path.put, path.post, path.delete, path.options, path.head, path.patch
        ];
        let params: Oas20Parameter[] = [];
        operations.filter(operation => {
            return !ObjectUtils.isNullOrUndefined(operation);
        }).forEach( operation => {
            if (operation.parameters) {
                operation.parameters.forEach( parameter => {
                    if (parameter.name === paramName && parameter.in === "path") {
                        params.push(parameter as Oas20Parameter);
                    }
                });
            }
        });
        return params;
    }

}


export abstract class AllNodeVisitor implements IOas20NodeVisitor {

    protected abstract doVisitNode(node: OasNode): void;


    visitDocument(node: Oas20Document): void {
        this.doVisitNode(node);
    }

    visitInfo(node: Oas20Info): void {
        this.doVisitNode(node);
    }

    visitContact(node: Oas20Contact): void {
        this.doVisitNode(node);
    }

    visitLicense(node: Oas20License): void {
        this.doVisitNode(node);
    }

    visitPaths(node: Oas20Paths): void {
        this.doVisitNode(node);
    }

    visitPathItem(node: Oas20PathItem): void {
        this.doVisitNode(node);
    }

    visitOperation(node: Oas20Operation): void {
        this.doVisitNode(node);
    }

    visitParameter(node: Oas20Parameter): void {
        this.doVisitNode(node);
    }

    visitParameterDefinition(node: Oas20ParameterDefinition): void {
        this.doVisitNode(node);
    }

    visitExternalDocumentation(node: Oas20ExternalDocumentation): void {
        this.doVisitNode(node);
    }

    visitSecurityRequirement(node: Oas20SecurityRequirement): void {
        this.doVisitNode(node);
    }

    visitResponses(node: Oas20Responses): void {
        this.doVisitNode(node);
    }

    visitResponse(node: Oas20Response): void {
        this.doVisitNode(node);
    }

    visitResponseDefinition(node: Oas20ResponseDefinition): void {
        this.doVisitNode(node);
    }

    visitSchema(node: Oas20Schema): void {
        this.doVisitNode(node);
    }

    visitHeaders(node: Oas20Headers): void {
        this.doVisitNode(node);
    }

    visitHeader(node: Oas20Header): void {
        this.doVisitNode(node);
    }

    visitExample(node: Oas20Example): void {
        this.doVisitNode(node);
    }

    visitItems(node: Oas20Items): void {
        this.doVisitNode(node);
    }

    visitTag(node: Oas20Tag): void {
        this.doVisitNode(node);
    }

    visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {
        this.doVisitNode(node);
    }

    visitSecurityScheme(node: Oas20SecurityScheme): void {
        this.doVisitNode(node);
    }

    visitScopes(node: Oas20Scopes): void {
        this.doVisitNode(node);
    }

    visitXML(node: Oas20XML): void {
        this.doVisitNode(node);
    }

    visitSchemaDefinition(node: Oas20SchemaDefinition): void {
        this.doVisitNode(node);
    }

    visitPropertySchema(node: Oas20PropertySchema): void {
        this.doVisitNode(node);
    }

    visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void {
        this.doVisitNode(node);
    }

    visitAllOfSchema(node: Oas20AllOfSchema): void {
        this.doVisitNode(node);
    }

    visitItemsSchema(node: Oas20ItemsSchema): void {
        this.doVisitNode(node);
    }

    visitDefinitions(node: Oas20Definitions): void {
        this.doVisitNode(node);
    }

    visitParametersDefinitions(node: Oas20ParametersDefinitions): void {
        this.doVisitNode(node);
    }

    visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void {
        this.doVisitNode(node);
    }

    visitExtension(node: OasExtension): void {
        this.doVisitNode(node);
    }
}