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
import {Oas20Document, Oas20Operation, Oas30Operation, OasDocument, OasInfo} from "oai-ts-core";
import {
    createChangeDescriptionCommand,
    createChangePropertyCommand,
    createChangeVersionCommand,
    ICommand
} from "oai-ts-commands";
import {CommandService} from "../../../_services/command.service";


@Component({
    moduleId: module.id,
    selector: "operation-info-section",
    templateUrl: "info-section.component.html",
    styleUrls: [ "info-section.component.css" ],
    encapsulation: ViewEncapsulation.None
})
export class OperationInfoSectionComponent {

    @Input() operation: Oas20Operation | Oas30Operation;

    constructor(private commandService: CommandService) {}

    /**
     * Called when the user changes the summary.
     * @param newSummary
     */
    public changeSummary(newSummary: string): void {
        console.info("[InfoSectionComponent] User changed the summary.");
        let command: ICommand = createChangePropertyCommand(this.operation.ownerDocument(), this.operation, "summary", newSummary);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the description.
     * @param newDescription
     */
    public changeDescription(newDescription: string): void {
        console.info("[InfoSectionComponent] User changed the description.");
        let command: ICommand = createChangePropertyCommand(this.operation.ownerDocument(), this.operation, "description", newDescription);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the operationId.
     * @param newOperationId
     */
    public changeOperationId(newOperationId: string): void {
        console.info("[InfoSectionComponent] User changed the operationId.");
        let command: ICommand = createChangePropertyCommand(this.operation.ownerDocument(), this.operation, "operationId", newOperationId);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the tags.
     * @param newTags
     */
    public changeTags(newTags: string[]): void {
        console.info("[InfoSectionComponent] User changed the operationId.");
        let command: ICommand = createChangePropertyCommand(this.operation.ownerDocument(), this.operation, "tags", newTags);
        this.commandService.emit(command);
    }

}
