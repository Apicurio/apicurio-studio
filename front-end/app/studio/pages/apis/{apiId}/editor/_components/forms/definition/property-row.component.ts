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

import {Component, ViewEncapsulation, Input} from "@angular/core";
import {SimplifiedType} from "../../../_models/simplified-type.model";
import {Oas20Document, Oas20PropertySchema} from "oai-ts-core";
import {AbstractTypedItemComponent} from "../operation/typed-item.component";
import {DropDownOption} from "../../common/drop-down.component";


@Component({
    moduleId: module.id,
    selector: "property-row",
    templateUrl: "property-row.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PropertyRowComponent extends AbstractTypedItemComponent {

    @Input() property: Oas20PropertySchema;
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
        let doc: Oas20Document = <Oas20Document>this.property.ownerDocument();

        if (doc.definitions) {
            let co: DropDownOption[] = doc.definitions.definitions().sort( (def1, def2) => {
                return def1.definitionName().toLocaleLowerCase().localeCompare(def2.definitionName().toLocaleLowerCase());
            }).map( def => {
                return {
                    value: "#/definitions/" + def.definitionName(),
                    name: def.definitionName()
                };
            });
            if (co && co.length > 0) {
                options.push({ divider: true });
                co.forEach( o => options.push(o) );
            }
        }

        return options;
    }

}
