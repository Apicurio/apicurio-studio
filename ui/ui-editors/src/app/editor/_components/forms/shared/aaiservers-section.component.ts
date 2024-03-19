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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation, ViewChild} from "@angular/core";
import {
    Aai20Document, Aai20SecurityRequirement, Aai20Server, Aai20ServerVariable, AaiServer, CombinedVisitorAdapter,
    CommandFactory,
    ICommand, Server, TraverserDirection, VisitorUtil
} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {EditorsService} from "../../../_services/editors.service";
import {AaiServerData, AaiServerEditorComponent, AaiServerEditorEvent} from "../../editors/aaiserver-editor.component";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {ModelUtils} from "../../../_util/model.util";
import {ObjectUtils} from "apicurio-ts-core";
import {RenameEntityDialogComponent, RenameEntityEvent} from "../../dialogs/rename-entity.component";


@Component({
    selector: "aaiservers-section",
    templateUrl: "aaiservers-section.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AaiServersSectionComponent extends AbstractBaseComponent {

    @Input() parent: Aai20Document;
    @Input() collapsed: boolean;
    @Input() description: string;

    @ViewChild("renameDialog", { static: true }) renameDialog: RenameEntityDialogComponent;

    public showSectionBody: boolean;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private editorsService: EditorsService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.showSectionBody = !this.collapsed;
    }

    /**
     * Returns the list of global servers defined in the document.
     * @return
     */
    public servers(): Aai20Server[] {
        let servers: { [key: string]: Aai20Server } = this.parent.servers;
        if (ObjectUtils.isNullOrUndefined(servers)) {
            servers = {};
        }
        // Clone the array
        let serverList: Aai20Server[] = [];
        for (let serverName in servers) {
            serverList.push(servers[serverName]);
        }
        // Sort it
        serverList.sort( (obj1, obj2) => {
            return obj1.getName().toLowerCase().localeCompare(obj2.getName().toLowerCase());
        });
        return serverList;
    }

    public serversPath(): string {
        if (this.parent.ownerDocument() === this.parent) {
            return "/servers";
        } else {
            return ModelUtils.nodeToPath(this.parent) + "/servers";
        }
    }

    /**
     * Called when the user chooses to delete a server.
     * @param server
     */
    public deleteServer(server: Aai20Server): void {
        let command: ICommand = CommandFactory.createDeleteServerCommand_Aai20(server); //
        this.commandService.emit(command);
    }

    /**
     * Called when the user adds a new server.
     * @param data
     */
    public addServer(data: AaiServerData): void {
        console.info("[AaiServersSectionComponent] Adding a server: %s", data.url);

        let newServer: Aai20Server = <any>(this.parent.createServer(data.name));

        this.copyServerToModel(data, newServer);

        let command: ICommand = CommandFactory.createNewServerCommand_Aai20(this.parent, newServer);
        this.commandService.emit(command);
    }

    /**
     * Called when the user edits an existing server.
     * @param event
     */
    public changeServer(event: AaiServerEditorEvent): void {
        console.info("[AaiServersSectionComponent] Editing a server: %s", event.data.name);

        let newServer: Aai20Server = <any>(this.parent.createServer(event.data.name));

        this.copyServerToModel(event.data, newServer);

        let command: ICommand = CommandFactory.createChangeServerCommand_Aai20(newServer);
        this.commandService.emit(command);
    }

    /**
     * Copies the data from the event to the new server model.
     * @param fromData
     * @param toServer
     */
    private copyServerToModel(fromData: AaiServerData, toServer: Aai20Server): void {
        toServer.url = fromData.url;
        toServer.protocol = fromData.protocol;
        toServer.protocolVersion = AaiServersSectionComponent.nonBlankOrNullString(fromData.protocolVersion);
        if (fromData.variables) {
            for (let varName in fromData.variables) {
                let serverVar: Aai20ServerVariable = toServer.createServerVariable(varName);
                serverVar.default_ = AaiServersSectionComponent.nonBlankOrNullString(fromData.variables[varName].default);
                serverVar.description = AaiServersSectionComponent.nonBlankOrNullString(fromData.variables[varName].description);
                serverVar.enum_ = fromData.variables[varName].enum;
                toServer.addServerVariable(varName, serverVar);
            }
        }
        // No writing to AaiServer.security since the form field is read only
        toServer.bindings = fromData.bindings;
        toServer.description = AaiServersSectionComponent.nonBlankOrNullString(fromData.description);
    }
    /**
     * Utility method for nullable string fields
     */
    private static nonBlankOrNullString(input: string): string {
        if (!input)
            return null;
        let trimmed = input.trim();
        return trimmed.length == 0 ? null : trimmed;
    }

    /**
     * Opens the full screen modal "server editor" so that advanced editing of the
     * server can be accomplished.
     */
    public onAddServer(): void {
        let serverEditor: AaiServerEditorComponent = this.editorsService.getAaiServerEditor();
        serverEditor.open({
            onSave: (event) => this.addServer(event.data),
            onCancel: () => {}
        }, this.parent);
    }

    public hasServers(): boolean {
        return this.parent.servers && Object.keys(this.parent.servers).length > 0;
    }

    /**
     * Called when the user clicks the trash icon to delete all the servers.
     */
    public deleteAllServers(): void {
        let command: ICommand = CommandFactory.createDeleteAllServersCommand_Aai20();
        this.commandService.emit(command);
    }

    /**
     * Opens the rename security scheme dialog.
     * @param scheme
     */
    public openRenameDialog(server: AaiServer): void {
        let ownerDocument: Aai20Document = <Aai20Document>server.ownerDocument();
        // copy the server names
        let serverNames: string[] = ownerDocument.servers
            ? Object.keys(ownerDocument.servers).splice(0)
            : [];

        VisitorUtil.visitTree(ownerDocument, new class extends CombinedVisitorAdapter {
            public visitServer(node: Server) {
                serverNames.push((<AaiServer>node).getName())
            }
        }, TraverserDirection.down);
        this.renameDialog.open(server, server.getName(), newName => {
            return serverNames.indexOf(newName) !== -1;
        });
    }

    /**
     * Renames the security scheme.
     * @param event
     */
    public rename(event: RenameEntityEvent): void {
        let aaiServer: AaiServer = <any>event.entity;
        let command: ICommand = CommandFactory.createRenameServerCommand(aaiServer.ownerDocument().getDocumentType(), aaiServer.getName(), event.newName);
        this.commandService.emit(command);
    }



}
