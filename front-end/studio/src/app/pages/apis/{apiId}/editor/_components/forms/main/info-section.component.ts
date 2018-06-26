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

import {Component, EventEmitter, Input, Output, ViewEncapsulation} from "@angular/core";
import {
    Oas30Document,
    Oas30Operation,
    Oas30PathItem,
    Oas30Server,
    Oas30ServerVariable,
    OasDocument,
    OasInfo
} from "oai-ts-core";
import {
    createChangeDescriptionCommand,
    createChangePropertyCommand,
    createChangeServerCommand,
    createChangeVersionCommand,
    createDeleteServerCommand,
    createNewServerCommand,
    ICommand
} from "oai-ts-commands";
import {ObjectUtils} from "../../../_util/object.util";
import {ServerEventData} from "../../dialogs/add-server.component";
import {CommandService} from "../../../_services/command.service";


@Component({
    moduleId: module.id,
    selector: "info-section",
    templateUrl: "info-section.component.html",
    encapsulation: ViewEncapsulation.None
})
export class InfoSectionComponent {

    @Input() document: OasDocument;
    @Input() info: OasInfo;

    constructor(private commandService: CommandService) {}

    /**
     * returns the version.
     */
    public version(): string {
        if (this.info) {
            return this.info.version;
        } else {
            return null;
        }
    }

    /**
     * returns the description.
     */
    public description(): string {
        if (this.info) {
            return this.info.description;
        } else {
            return null;
        }
    }

    /**
     * Called when the user changes the version.
     * @param newVersion
     */
    public onVersionChange(newVersion: string): void {
        console.info("[MainFormComponent] User changed the version to: " + newVersion);
        let command: ICommand = createChangeVersionCommand(this.document, newVersion);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the description.
     * @param newDescription
     */
    public onDescriptionChange(newDescription: string): void {
        console.info("[MainFormComponent] User changed the description.");
        let command: ICommand = createChangeDescriptionCommand(this.document, newDescription);
        this.commandService.emit(command);
    }

}
