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
import {Oas30Document, Oas30Operation, Oas30PathItem, Oas30Server, Oas30ServerVariable} from "oai-ts-core";
import {
    createChangePropertyCommand, createChangeServerCommand, createDeleteServerCommand, createNewServerCommand,
    ICommand
} from "oai-ts-commands";
import {ObjectUtils} from "../../../_util/object.util";
import {ServerEventData} from "../../dialogs/add-server.component";


@Component({
    moduleId: module.id,
    selector: "servers-section",
    templateUrl: "servers.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ServersSectionComponent {

    @Input() parent: Oas30Document | Oas30PathItem | Oas30Operation;
    @Input() description: string;

    @Output() onCommand: EventEmitter<ICommand> = new EventEmitter<ICommand>();

    /**
     * Returns the list of global servers defined in the document.
     * @return {Oas30Server[]}
     */
    public servers(): Oas30Server[] {
        let servers: Oas30Server[] = this.parent.servers;
        if (ObjectUtils.isNullOrUndefined(servers)) {
            servers = [];
        }
        // Clone the array
        servers = servers.slice(0);
        // Sort it
        servers.sort( (obj1, obj2) => {
            return obj1.url.toLowerCase().localeCompare(obj2.url.toLowerCase());
        });
        return servers;
    }

    /**
     * Called when the user changes the description of a server.
     * @param server
     * @param description
     */
    public changeServerDescription(server: Oas30Server, description: string): void {
        // TODO create a new ChangeServerDescription command as it's a special case when used in a multi-user editing environment (why?)
        let command: ICommand = createChangePropertyCommand<string>(this.parent.ownerDocument(), server, "description", description);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user chooses to delete a server.
     * @param server
     */
    public deleteServer(server: Oas30Server): void {
        let command: ICommand = createDeleteServerCommand(this.parent.ownerDocument(), server);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user adds a new server.
     * @param {Server30EventData} event
     */
    public addServer(event: ServerEventData): void {
        console.info("[MainFormComponent] Adding a server: %s", event.url);

        let newServer: Oas30Server = this.parent.createServer();

        this.copyServerToModel(event, newServer);

        let command: ICommand = createNewServerCommand(this.parent.ownerDocument(), this.parent, newServer);
        this.onCommand.emit(command);
    }

    /**
     * Called when the user edits an existing server.
     * @param {ServerEventData} event
     */
    public changeServer(event: ServerEventData): void {
        console.info("[MainFormComponent] Editing a server: %s", event.url);

        let newServer: Oas30Server = this.parent.createServer();

        this.copyServerToModel(event, newServer);

        let command: ICommand = createChangeServerCommand(this.parent.ownerDocument(), newServer);
        this.onCommand.emit(command);
    }

    /**
     * Copies the data from the event to the new server model.
     * @param {ServerEventData} fromData
     * @param {Oas30Server} toServer
     */
    private copyServerToModel(fromData: ServerEventData, toServer: Oas30Server): void {
        toServer.url = fromData.url;
        toServer.description = fromData.description;
        if (fromData.variables) {
            for (let varName in fromData.variables) {
                let serverVar: Oas30ServerVariable = toServer.createServerVariable(varName);
                serverVar.default = fromData.variables[varName].default;
                serverVar.description = fromData.variables[varName].description;
                serverVar.enum = fromData.variables[varName].enum;
                toServer.addServerVariable(varName, serverVar);
            }
        }
    }

}
