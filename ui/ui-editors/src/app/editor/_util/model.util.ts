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

import {AaiSchema, Library, Node, OasSchema, ReferenceUtil} from "@apicurio/data-models";
import {ApiEditorUser} from "../_models/editor-user.model";

export class ModelUtils {

    /**
     * Converts a node into a nodepath.
     * @param node
     */
    public static nodeToPath(node: Node): string {
        if (node) {
            return Library.createNodePath(node).toString();
        } else {
            return null;
        }
    }

    /**
     * Clears any possible selection that may exist on the given node for the local user.
     * @param node
     */
    public static clearSelection(node: Node): void {
        node.setAttribute("local-selection", false);
    }

    /**
     * Sets the local selection on the node.  Essentially this marks the node as "selected"
     * for the local user.
     * @param node
     */
    public static setSelection(node: Node): void {
        node.setAttribute("local-selection", true);
    }

    /**
     * Checks whether the given item is selected by the local user.
     * @param node
     * @return
     */
    public static isSelected(node: Node): boolean {
        let rval: boolean = node.getAttribute("local-selection");
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
    public static clearCollaboratorSelection(user: ApiEditorUser, node: Node): void {
        let selections: any = node.getAttribute("collaborator-selections");
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
    public static setCollaboratorSelection(user: ApiEditorUser, node: Node): void {
        let selections: any = node.getAttribute("collaborator-selections");
        if (!selections) {
            selections = {};
            node.setAttribute("collaborator-selections", selections);
        }
        selections[user.userId] = user;
    }

    /**
     * Checks whether the given item is selected by an external collaborator.  Returns the collaborator
     * information if the item is selected or else null.
     * @param node
     * @return
     */
    public static isSelectedByCollaborator(node: Node): ApiEditorUser {
        let selections: any = node.getAttribute("collaborator-selections");
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
    public static generateExampleFromSchema(schema: OasSchema | AaiSchema): any {
        let generator: ExampleGenerator = new ExampleGenerator();
        return generator.generate(schema);
    }

}


export class ExampleGenerator {

    private refStack: any[] = [];

    public generate(schema: OasSchema | AaiSchema): any {
        console.info("[ExampleGenerator] Generating example from schema of type: ", schema.type);
        let object: any;
        if (schema.$ref) {
            object = this.generateFromRef(schema);
        } else if (this.isEnum(schema)) {
            console.info("[ExampleGenerator] Schema is enum.");
            object = this.generateEnumValue(schema);
        } else if (this.isSimpleType(schema.type)) {
            console.info("[ExampleGenerator] Schema is a simple type.");
            object = this.generateSimpleType(schema.type, schema.format);
        } else if (schema.type === "object" || !schema.type) {
            console.info("[ExampleGenerator] Schema is type 'object'");
            object = this.generateObject(schema);
        } else if (schema.type === "array") {
            console.info("[ExampleGenerator] Schema is type 'array'");
            object = this.generateArray(schema);
        }
        return object;
    }

    private generateFromRef(schema: OasSchema | AaiSchema): any {
        if (this.refStack.indexOf(schema.$ref) !== -1) {
            return {};
        }
        let refSchema: OasSchema = ReferenceUtil.resolveRef(schema.$ref, schema) as OasSchema;
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

    private generateObject(schema: OasSchema | AaiSchema): any {
        let object: any = {};
        if (schema.properties) {
            console.info("[ExampleGenerator] Schema has properties.");
            Object.keys(schema.properties).forEach( propertyName => {
                console.info("[ExampleGenerator] Processing schema property named: ", propertyName);
                let propertyExample: any = this.generate(schema.properties[propertyName] as OasSchema);
                object[propertyName] = propertyExample;
            });
        }
        return object;
    }

    private generateArray(schema: OasSchema | AaiSchema): any {
        let object: any[] = [];
        if (schema.items) {
            // Push two objects into the array...
            object.push(this.generate(schema.items as OasSchema));
            object.push(this.generate(schema.items as OasSchema));
        }
        return object;
    }

    private isSimpleType(type: string): boolean {
        const simpleTypes: string[] = [
            "string", "boolean", "integer", "number"
        ]
        return simpleTypes.indexOf(type) !== -1;
    }

    private isEnum(schema: OasSchema | AaiSchema ): boolean {
        return schema.enum_ && schema.enum_.length > 0;
    }

    private generateEnumValue(schema: OasSchema | AaiSchema): any {
        if (schema.enum_.length > 0) {
            return schema.enum_[Math.floor(Math.random()*schema.enum_.length)];
        }
        return "??";
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
