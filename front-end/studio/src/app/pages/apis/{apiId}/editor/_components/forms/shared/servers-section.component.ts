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

import {Component, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {Oas30Document, Oas30Operation, Oas30PathItem, Oas30Server, Oas30ServerVariable} from "oai-ts-core";
import {createChangeServerCommand, createDeleteServerCommand, createNewServerCommand, ICommand} from "oai-ts-commands";
import {ObjectUtils} from "../../../_util/object.util";
import {CommandService} from "../../../_services/command.service";
import {EditorsService} from "../../../_services/editors.service";
import {ServerData, ServerEditorComponent, ServerEditorEvent} from "../../editors/server-editor.component";


@Component({
    moduleId: module.id,
    selector: "servers-section",
    templateUrl: "servers-section.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ServersSectionComponent implements OnInit {

    @Input() parent: Oas30Document | Oas30PathItem | Oas30Operation;
    @Input() collapsed: boolean;
    @Input() description: string;

    public showSectionBody: boolean;

    constructor(private commandService: CommandService, private editorsService: EditorsService) {}

    public ngOnInit(): void {
        this.showSectionBody = !this.collapsed;
    }

    /**
     * Returns the list of global servers defined in the document.
     * @return
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
     * Called when the user chooses to delete a server.
     * @param server
     */
    public deleteServer(server: Oas30Server): void {
        let command: ICommand = createDeleteServerCommand(this.parent.ownerDocument(), server);
        this.commandService.emit(command);
    }

    /**
     * Called when the user adds a new server.
     * @param data
     */
    public addServer(data: ServerData): void {
        console.info("[ServersSectionComponent] Adding a server: %s", data.url);

        let newServer: Oas30Server = this.parent.createServer();

        this.copyServerToModel(data, newServer);

        let command: ICommand = createNewServerCommand(this.parent.ownerDocument(), this.parent, newServer);
        this.commandService.emit(command);
    }

    /**
     * Called when the user edits an existing server.
     * @param event
     */
    public changeServer(event: ServerEditorEvent): void {
        console.info("[ServersSectionComponent] Editing a server: %s", event.data.url);

        let newServer: Oas30Server = this.parent.createServer();

        this.copyServerToModel(event.data, newServer);

        let command: ICommand = createChangeServerCommand(this.parent.ownerDocument(), newServer);
        this.commandService.emit(command);
    }

    /**
     * Opens the full screen modal "server editor" so that advanced editing of the
     * server can be accomplished.
     */
    public onAddServer(): void {
        let serverEditor: ServerEditorComponent = this.editorsService.getServerEditor();
        serverEditor.open({
            onSave: (event) => this.addServer(event.data),
            onCancel: () => {}
        }, this.parent);
    }

    /**
     * Copies the data from the event to the new server model.
     * @param fromData
     * @param toServer
     */
    private copyServerToModel(fromData: ServerData, toServer: Oas30Server): void {
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
