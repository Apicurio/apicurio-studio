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
import {Oas30PathItem} from "oai-ts-core";
import {createChangePropertyCommand, ICommand} from "oai-ts-commands";
import {CommandService} from "../../../_services/command.service";


@Component({
    moduleId: module.id,
    selector: "path-info-section",
    templateUrl: "info-section.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PathInfoSectionComponent {

    @Input() path: Oas30PathItem;

    constructor(private commandService: CommandService) {}

    /**
     * Called when the user changes the summary.
     * @param newSummary
     */
    public changeSummary(newSummary: string): void {
        console.info("[InfoSectionComponent] User changed the summary.");
        let command: ICommand = createChangePropertyCommand(this.path.ownerDocument(), this.path, "summary", newSummary);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the description.
     * @param newDescription
     */
    public changeDescription(newDescription: string): void {
        console.info("[PathInfoSectionComponent] User changed the data type description.");
        let command: ICommand = createChangePropertyCommand(this.path.ownerDocument(), this.path, 
            "description", newDescription);
        this.commandService.emit(command);
    }

}
