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

import {Oas20Parameter, Oas20PathItem, OasOperation} from "oai-ts-core";
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
