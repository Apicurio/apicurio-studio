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

import {Component, Input, ViewEncapsulation} from "@angular/core";
import {SimplifiedType} from "oai-ts-commands";
import {
    Oas20PropertySchema,
    Oas20SchemaDefinition,
    Oas30PropertySchema,
    Oas30SchemaDefinition,
    OasVisitorUtil
} from "oai-ts-core";
import {AbstractTypedItemComponent} from "../operation/typed-item.component";
import {DropDownOption} from "../../common/drop-down.component";
import {FindSchemaDefinitionsVisitor} from "../../../_visitors/schema-definitions.visitor";


@Component({
    moduleId: module.id,
    selector: "property-row",
    templateUrl: "property-row.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PropertyRowComponent extends AbstractTypedItemComponent {

    @Input() property: Oas20PropertySchema | Oas30PropertySchema;
    @Input() propertyClass: string = "";
    @Input() canDelete: boolean = true;

    protected modelForEditing(): SimplifiedType {
        return SimplifiedType.fromSchema(this.property);
    }

    protected modelForViewing(): SimplifiedType {
        return SimplifiedType.fromSchema(this.property);
    }

    public typeOptions(): DropDownOption[] {
        let options: DropDownOption[] = super.typeOptions();

        let viz: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(null);
        OasVisitorUtil.visitTree(this.property.ownerDocument(), viz);
        let defs: (Oas20SchemaDefinition | Oas30SchemaDefinition)[] = viz.getSortedSchemaDefinitions();
        if (defs.length > 0) {
            options.push({ divider: true });
            defs.forEach( def => {
                let defName: string = (def.ownerDocument().getSpecVersion() === "2.0") ? (def as Oas20SchemaDefinition).definitionName() : (def as Oas30SchemaDefinition).name();
                options.push({
                    value: "#/definitions/" + defName,
                    name: defName
                });
            });
        }

        return options;
    }

    public typeOfOptions(): DropDownOption[] {
        let options: DropDownOption[] = super.typeOfOptions();

        let viz: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(null);
        OasVisitorUtil.visitTree(this.property.ownerDocument(), viz);
        let defs: (Oas20SchemaDefinition | Oas30SchemaDefinition)[] = viz.getSortedSchemaDefinitions();
        if (defs.length > 0) {
            options.push({ divider: true });
            defs.forEach( def => {
                let defName: string = (def.ownerDocument().getSpecVersion() === "2.0") ? (def as Oas20SchemaDefinition).definitionName() : (def as Oas30SchemaDefinition).name();
                options.push({
                    value: "#/definitions/" + defName,
                    name: defName
                });
            });
        }

        return options;
    }

}
