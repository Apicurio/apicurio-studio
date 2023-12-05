/**
 * @license
 * Copyright 2019 JBoss Inc
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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {Oas20Schema, Oas30Schema,
    OasSchema,
    Schema
} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {ModelUtils} from "../../../_util/model.util";
import {EditorsService} from "../../../_services/editors.service";
import {RenameEntityDialogComponent} from "../../dialogs/rename-entity.component";
import Oas20PropertySchema = Oas20Schema.Oas20PropertySchema;
import Oas30PropertySchema = Oas30Schema.Oas30PropertySchema;


@Component({
    selector: "reference-properties-section",
    templateUrl: "reference-properties-section.component.html",
    styleUrls: [ "properties-section.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferencePropertiesSectionComponent extends AbstractBaseComponent {

    @Input() definition: Oas20Schema | Oas30Schema;

    @ViewChild("renamePropertyDialog", { static: true }) renamePropertyDialog: RenameEntityDialogComponent;

    _pconfigOpen: boolean = false;

    _sorted: boolean = true;

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param commandService
     * @param selectionService
     * @param editors
     */
    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService,
                private editors: EditorsService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public hasProperties(): boolean {
        return this.properties().length > 0;
    }

    public properties(): Schema[] {
        let rval: Schema[] = [];

        let sourceSchema: OasSchema = this.getPropertySourceSchema();
        // let propertyNames: String[] = sourceSchema.getPropertyNames();
        if(sourceSchema!= null){
            if (this._sorted) {
                sourceSchema.getPropertyNames().sort((left, right) => {
                    return left.localeCompare(right)
                }).forEach(name => rval.push(sourceSchema.getProperty(name)));
            } else {
                sourceSchema.getPropertyNames().forEach(name => rval.push(sourceSchema.getProperty(name)));
            }
        }

        return rval;
    }

    public getPropertySourceSchema(): OasSchema {
        let pschema: OasSchema = this.definition;

        if (pschema != null && this.inheritanceType() != "none") {
            let schemas: OasSchema[] = this.definition[this.inheritanceType()];
            if (schemas) {
                schemas.forEach(schema => {
                    if (schema.type == "object") {
                        pschema = schema;
                    }
                });
            }
        }

        return pschema;
    }

    public propertiesNodePath(): string {
        return ModelUtils.nodeToPath(this.getPropertySourceSchema()) + "/properties";
    }

    public inheritanceType(): string {
        if (this.definition.allOf) {
            return "allOf";
        }
        if (this.definition['anyOf']) {
            return "anyOf";
        }
        if (this.definition['oneOf']) {
            return "oneOf";
        }

        return "none";
    }

}
