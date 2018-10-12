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
    Oas20Parameter,
    Oas20PathItem,
    Oas20Schema,
    Oas30Schema,
    OasNode,
    OasOperation,
    OasValidationRuleUtil
} from "oai-ts-core";
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

    /**
     * Generates an example from the given schema.
     * @param schema
     */
    public static generateExampleFromSchema(schema: Oas20Schema | Oas30Schema): any {
        let generator: ExampleGenerator = new ExampleGenerator();
        return generator.generate(schema);
    }

}


export class ExampleGenerator {

    private refStack: any[] = [];

    public generate(schema: Oas20Schema | Oas30Schema): any {
        console.info("[ExampleGenerator] Generating example from schema of type: ", schema.type);
        let object: any;
        if (schema.$ref) {
            object = this.generateFromRef(schema);
        } else if (schema.type === "object" || !schema.type) {
            console.info("[ExampleGenerator] Schema is type 'object'");
            object = this.generateObject(schema);
        } else if (schema.type === "array") {
            console.info("[ExampleGenerator] Schema is type 'array'");
            object = this.generateArray(schema);
        } else if (this.isSimpleType(schema.type)) {
            console.info("[ExampleGenerator] Schema is a simple type.");
            object = this.generateSimpleType(schema.type, schema.format);
        }
        return object;
    }

    private generateFromRef(schema: Oas20Schema | Oas30Schema): any {
        if (this.refStack.indexOf(schema.$ref) !== -1) {
            return {};
        }
        let refSchema: Oas20Schema | Oas30Schema = OasValidationRuleUtil.resolveRef(schema.$ref, schema) as Oas20Schema | Oas30Schema;
        if (refSchema) {
            console.info("[ExampleGenerator] Successfully resolved $ref: ", schema.$ref);
            this.refStack.push(schema.$ref);
            let rval: any = this.generate(refSchema);
            this.refStack.pop();
            return rval;
        } else {
            return {};
        }
    }

    private generateObject(schema: Oas20Schema | Oas30Schema): any {
        let object: any = {};
        if (schema.properties) {
            console.info("[ExampleGenerator] Schema has properties.");
            Object.keys(schema.properties).forEach( propertyName => {
                console.info("[ExampleGenerator] Processing schema property named: ", propertyName);
                let propertyExample: any = this.generate(schema.properties[propertyName] as Oas20Schema | Oas30Schema);
                object[propertyName] = propertyExample;
            });
        }
        return object;
    }

    private generateArray(schema: Oas20Schema | Oas30Schema): any {
        let object: any[] = [];
        if (schema.items) {
            // Push two objects into the array...
            object.push(this.generate(schema.items as Oas20Schema | Oas30Schema));
            object.push(this.generate(schema.items as Oas20Schema | Oas30Schema));
        }
        return object;
    }

    private isSimpleType(type: string): boolean {
        const simpleTypes: string[] = [
            "string", "boolean", "integer", "number"
        ]
        return simpleTypes.indexOf(type) !== -1;
    }

    private generateSimpleType(type: string, format: string): any {
        let key: string = type;
        if (format) {
            key = type + "_" + format;
        }
        switch (key) {
            case "string":
                return "some text";
            case "string_date":
                return "2018-01-17";
            case "string_date-time":
                return "2018-02-10T09:30Z";
            case "string_password":
                return "**********";
            case "string_byte":
                return "R28gUGF0cyE=";
            case "string_binary":
                return "<FILE>";
            case "integer":
            case "integer_int32":
            case "integer_int64":
                return Math.floor(Math.random() * Math.floor(100));
            case "number":
            case "number_float":
            case "number_double":
                return Math.floor((Math.random() * 100) * 100) / 100;
            case "boolean":
                return true;
            default:
                return "";
        }
    }

}