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

import {Oas20Parameter, Oas20PathItem, OasNode, OasOperation} from "oai-ts-core";
import {ObjectUtils} from "./object.util";
import {ApiEditorUser} from "../../../../../models/editor-user.model";

export class ModelUtils {

    /**
     * Detects the appropriate path parameter names from a path.  For example, if the
     * string "/resources/{fooId}/subresources/{barId}" is passed in, the following
     * string array will be returned:  [ "fooId", "barId" ]
     * @param path
     * @return
     */
    public static detectPathParamNames(path: string): string[] {
        // TODO remove this in favor of the same method found in oai-ts-commands
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
     * @return
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

    /**
     * Clears any possible selection that may exist on the given node for the local user.
     * @param node
     */
    public static clearSelection(node: OasNode): void {
        node.n_attribute("local-selection", false);
    }

    /**
     * Sets the local selection on the node.  Essentially this marks the node as "selected"
     * for the local user.
     * @param node
     */
    public static setSelection(node: OasNode): void {
        node.n_attribute("local-selection", true);
    }

    /**
     * Checks whether the given item is selected by the local user.
     * @param node
     * @return
     */
    public static isSelected(node: OasNode): boolean {
        let rval: boolean = node.n_attribute("local-selection");
        if (rval === undefined || rval === null) {
            return false;
        }
        return rval;
    }

    /**
     * Clears any possible selection that may exist on the given node for the given user.
     * @param user
     * @param node
     */
    public static clearCollaboratorSelection(user: ApiEditorUser, node: OasNode): void {
        let selections: any = node.n_attribute("collaborator-selections");
        if (selections) {
            delete selections[user.userId];
        }
    }

    /**
     * Sets the collaborator selection for the given user on the node.  Essentially this marks
     * the node as "selected" by the external (active) collaborator.
     * @param user
     * @param node
     */
    public static setCollaboratorSelection(user: ApiEditorUser, node: OasNode): void {
        let selections: any = node.n_attribute("collaborator-selections");
        if (!selections) {
            selections = {};
            node.n_attribute("collaborator-selections", selections);
        }
        selections[user.userId] = user;
    }

    /**
     * Checks whether the given item is selected by an external collaborator.  Returns the collaborator
     * information if the item is selected or else null.
     * @param node
     * @return
     */
    public static isSelectedByCollaborator(node: OasNode): ApiEditorUser {
        let selections: any = node.n_attribute("collaborator-selections");
        if (selections) {
            let rval: ApiEditorUser = null;
            for (let key in selections) {
                if (selections.hasOwnProperty(key)) {
                    rval = selections[key];
                }
            }
            return rval;
        } else {
            return null;
        }
    }

}
