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

import {SimplifiedType} from "oai-ts-commands";
import {Oas20SchemaDefinition, Oas30SchemaDefinition, OasDocument, OasNode, OasVisitorUtil} from "oai-ts-core";
import {FindSchemaDefinitionsVisitor} from "../../../_visitors/schema-definitions.visitor";
import {DropDownOption} from '../../../../../../../components/common/drop-down.component';
import {ObjectUtils} from "../../../_util/object.util";


export abstract class TypedRow {

    public abstract model(): SimplifiedType;
    public abstract document(): OasDocument;
    public abstract isParameter(): boolean;

    public type(): string {
        if (!ObjectUtils.isNullOrUndefined(this.model())) {
            return ObjectUtils.undefinedAsNull(this.model().type);
        }
        return null;
    }

    public typeOptions(): DropDownOption[] {
        let options: DropDownOption[] = [
            { value: "array", name: "Array" },
            { divider: true },
            { value: "string", name: "String" },
            { value: "integer", name: "Integer" },
            { value: "boolean", name: "Boolean" },
            { value: "number", name: "Number" }
        ];

        if (!this.isParameter()) {
            let refPrefix: string = "#/components/schemas/";
            if (this.document().is2xDocument()) {
                refPrefix = "#/definitions/";
            }

            let viz: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(null);
            OasVisitorUtil.visitTree(this.document(), viz);
            let defs: (Oas20SchemaDefinition | Oas30SchemaDefinition)[] = viz.getSortedSchemaDefinitions();
            if (defs.length > 0) {
                options.push({divider: true});
                defs.forEach(def => {
                    let defName: string = (def.ownerDocument().is2xDocument()) ? (def as Oas20SchemaDefinition).definitionName() : (def as Oas30SchemaDefinition).name();
                    options.push({
                        value: refPrefix + defName,
                        name: defName
                    });
                });
            }
        }

        return options;
    }

    public typeOf(): string {
        if (this.model() && this.model().of) {
            return ObjectUtils.undefinedAsNull(this.model().of.type);
        }
        return null;
    }

    public typeOfOptions(): DropDownOption[] {
        let options: DropDownOption[] = [
            { value: "string", name: "String" },
            { value: "integer", name: "Integer" },
            { value: "boolean", name: "Boolean" },
            { value: "number", name: "Number" }
        ];

        if (!this.isParameter()) {
            let refPrefix: string = "#/components/schemas/";
            if (this.document().is2xDocument()) {
                refPrefix = "#/definitions/";
            }

            let viz: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(null);
            OasVisitorUtil.visitTree(this.document(), viz);
            let defs: (Oas20SchemaDefinition | Oas30SchemaDefinition)[] = viz.getSortedSchemaDefinitions();
            if (defs.length > 0) {
                options.push({divider: true});
                defs.forEach(def => {
                    let defName: string = (def.ownerDocument().is2xDocument()) ? (def as Oas20SchemaDefinition).definitionName() : (def as Oas30SchemaDefinition).name();
                    options.push({
                        value: refPrefix + defName,
                        name: defName
                    });
                });
            }
        }

        return options;
    }

    public typeAs(): string {
        if (ObjectUtils.isNullOrUndefined(this.model())) {
            return null;
        }
        if (this.model().isArray() && this.model().of && this.model().of.isSimpleType()) {
            return ObjectUtils.undefinedAsNull(this.model().of.as);
        }
        if (this.model().isSimpleType()) {
            return ObjectUtils.undefinedAsNull(this.model().as);
        }
        return null;
    }

    public typeAsOptions(): DropDownOption[] {
        let options: DropDownOption[];
        let st: SimplifiedType = this.model();
        if (this.model() && this.model().isArray() && this.model().of && this.model().of.isSimpleType()) {
            st = this.model().of;
        }
        if (st.type === "string") {
            options = [
                { value: null, name: "String" },
                { value: "byte", name: "Byte" },
                { value: "binary", name: "Binary" },
                { value: "date", name: "Date" },
                { value: "date-time", name: "DateTime" },
                { value: "password", name: "Password" }
            ];
        } else if (st.type === "integer") {
            options = [
                { value: null, name: "Integer" },
                { value: "int32", name: "32-Bit Integer" },
                { value: "int64", name: "64-Bit Integer" }
            ];
        } else if (st.type === "number") {
            options = [
                { value: null, name: "Number" },
                { value: "float", name: "Float" },
                { value: "double", name: "Double" }
            ];
        }
        return options;
    }

    public shouldShowFormattedAs(): boolean {
        let st: SimplifiedType = this.model();
        if (this.model() && this.model().isArray() && this.model().of && this.model().of.isSimpleType()) {
            st = this.model().of;
        }
        return st && st.isSimpleType() && (st.type !== "boolean");
    }

}
