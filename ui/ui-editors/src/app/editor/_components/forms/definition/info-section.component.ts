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
import {
    CommandFactory,
    DocumentType,
    ICommand, Oas20Document,
    Oas20SchemaDefinition, Oas30Document,
    Oas30SchemaDefinition
} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {ModelUtils} from "../../../_util/model.util";


@Component({
    selector: "definition-info-section",
    templateUrl: "info-section.component.html",
    styleUrls: [ "info-section.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefinitionInfoSectionComponent extends AbstractBaseComponent {

    @Input() definition: Oas20SchemaDefinition | Oas30SchemaDefinition;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public definitionInfoPaths(): string[] {
        return [
            ModelUtils.nodeToPath(this.definition) + "/description"
        ];
    }


    /**
     * returns the description.
     */
    public description(): string {
        return this.definition.description;
    }

    /**
     * Called when the user changes the description.
     * @param newDescription
     */
    public onDescriptionChange(newDescription: string): void {
        console.info("[DefinitionInfoSectionComponent] User changed the data type description.");
        let command: ICommand = CommandFactory.createChangePropertyCommand(this.definition, "description", newDescription);
        this.commandService.emit(command);
    }

    isObject(): boolean {
        return this.definition.type === "object" || this.definition === null || this.definition === undefined;
    }

    switchToSimpleType(): void {
        let newDefinition: Oas20SchemaDefinition | Oas30SchemaDefinition = this.createSchemaDefinition(this.definition.description);
        newDefinition.type = "string";
        let command: ICommand = CommandFactory.createReplaceSchemaDefinitionCommand(
            this.definition.ownerDocument().getDocumentType(), this.definition, newDefinition);
        this.commandService.emit(command);
    }

    switchToObject(): void {
        let newDefinition: Oas20SchemaDefinition | Oas30SchemaDefinition = this.createSchemaDefinition(this.definition.description);
        newDefinition.type = "object";
        let command: ICommand = CommandFactory.createReplaceSchemaDefinitionCommand(
            this.definition.ownerDocument().getDocumentType(), this.definition, newDefinition);
        this.commandService.emit(command);
    }

    createSchemaDefinition(description: string): Oas30SchemaDefinition | Oas20SchemaDefinition {
        let newDefinition: Oas20SchemaDefinition | Oas30SchemaDefinition;
        if (this.definition.ownerDocument().getDocumentType() == DocumentType.openapi2) {
            let doc20: Oas20Document = <Oas20Document> this.definition.ownerDocument();
            newDefinition = doc20.definitions.createSchemaDefinition(this.definition.getName());
        } else {
            let doc30: Oas30Document = <Oas30Document> this.definition.ownerDocument();
            newDefinition = doc30.components.createSchemaDefinition(this.definition.getName());
        }
        newDefinition.description = description;
        return newDefinition;
    }

}
