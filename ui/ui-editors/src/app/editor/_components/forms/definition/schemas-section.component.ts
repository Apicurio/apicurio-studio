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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from "@angular/core";
import {CommandFactory, ICommand, Oas20SchemaDefinition, Oas30SchemaDefinition, OasSchema} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {ModelUtils} from "../../../_util/model.util";
import {EditorsService} from "../../../_services/editors.service";
import {AddSchemaDialogData} from "../../dialogs/add-schema.component";


@Component({
    selector: "schemas-section",
    templateUrl: "schemas-section.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InheritanceSchemasSectionComponent extends AbstractBaseComponent {

    @Input() definition: Oas20SchemaDefinition | Oas30SchemaDefinition;

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

    public hasSchemas(): boolean {
        return this.schemas().length > 0;
    }

    public schemas(): OasSchema[] {
        let rval: OasSchema[] = [];

        if (this.inheritanceType() != "none") {
            let schemas: OasSchema[] = this.definition[this.inheritanceType()];
            schemas.forEach(schema => {
                if (schema.$ref) {
                    rval.push(schema);
                }
            });
        }

        return rval;
    }

    public schemasNodePath(): string {
        return ModelUtils.nodeToPath(this.definition) + "/" + this.inheritanceType();
    }

    public deleteSchema(schema: OasSchema): void {
        let command: ICommand = CommandFactory.createDeleteChildSchemaCommand(schema);
        this.commandService.emit(command);
    }

    public addSchema(data: AddSchemaDialogData): void {
        let childSchema: OasSchema = this.definition.createAllOfSchema();
        childSchema.$ref = data.ref;
        let command: ICommand = CommandFactory.createAddChildSchemaCommand(this.definition, childSchema, this.inheritanceType());
        this.commandService.emit(command);
    }

    public deleteAllSchemas(): void {
        let command: ICommand = CommandFactory.createDeleteAllChildSchemasCommand(this.definition, this.inheritanceType());
        this.commandService.emit(command);
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
