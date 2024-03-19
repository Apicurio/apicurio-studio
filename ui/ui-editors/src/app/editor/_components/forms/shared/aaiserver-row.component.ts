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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Output,
    ViewEncapsulation
} from "@angular/core";
import {
    Aai20Document,
    Aai20SecurityRequirement,
    Aai20Server,
    AaiSecurityRequirement,
    CommandFactory,
    ICommand
} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {EditorsService} from "../../../_services/editors.service";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {AbstractRowComponent} from "../../common/item-row.abstract";
import {AaiServerEditorComponent, AaiServerEditorEvent} from "../../editors/aaiserver-editor.component";
import {
    SecurityRequirementData,
    SecurityRequirementEditorComponent,
    SecurityRequirementEditorEvent
} from "../../editors/security-requirement-editor.component";
import {ModelUtils} from "../../../_util/model.util";


@Component({
    selector: "aaiserver-row",
    templateUrl: "aaiserver-row.component.html",
    styleUrls: ["server-row.component.css", "aaiserver-row.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AaiServerRowComponent extends AbstractRowComponent<Aai20Server, string> {

    @Output() onEdit: EventEmitter<AaiServerEditorEvent> = new EventEmitter<AaiServerEditorEvent>();
    @Output() onDelete: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onRename: EventEmitter<boolean> = new EventEmitter<boolean>();

    showSecurityRequirements: boolean = true;

    constructor(changeDetectorRef: ChangeDetectorRef, documentService: DocumentService,
                private commandService: CommandService, private editorsService: EditorsService,
                selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected updateModel(): void {
        // Nothing to do for this row impl
    }

    public hasUrl(): boolean {
        return !!this.item.url;
    }

    public description(): string {
        return this.item.description
    }

    public hasDescription(): boolean {
        return !!this.item.description;
    }

    public securityRequirements(): AaiSecurityRequirement[] {
        return this.item.security;
    }

    public hasSecurityRequirements(): boolean {
        return !!this.item.security && this.item.security.length > 0;
    }

    public securityRequirementsPath(): string {
        return ModelUtils.nodeToPath(this.item) + "/security";
    }

    public toggle(): void {
        this.toggleTab("server");
    }

    public edit(): void {
        let serverEditor: AaiServerEditorComponent = this.editorsService.getAaiServerEditor();
        let parent: Aai20Document = this.item.parent() as any;
        serverEditor.open({
            onSave: (data) => this.onEdit.emit(data),
            onCancel: () => {}
        }, parent, this.item);
    }

    public rename(): void {
        this.onRename.emit(true);
    }

    public delete(): void {
        this.onDelete.emit(true);
    }

    public setDescription(description: string): void {
        // TODO create a new ChangeServerDescription command as it's a special case when used in a multi-user editing environment (why?)
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.item, "description", description);
        this.commandService.emit(command);
    }

    /**
     * Opens the full screen modal "security requirement editor" so that advanced editing of the
     * security requirement can be accomplished.
     */
    public onAddSecurityRequirement(): void {
        let editor: SecurityRequirementEditorComponent = this.editorsService.getSecurityRequirementEditor();
        editor.open({
            onSave: (event) => this.addSecurityRequirement(event.data),
            onCancel: () => {}
        }, this.item);
    }

    public deleteAllSecurityRequirements(): void {
        console.info("[AaiServerRowComponent] Deleting all security requirements %s", JSON.stringify(this.item, (k,v) =>  ["_ownerDocument", "_parent"].includes(k) && !!v ? "<ref>" : v, 2));
        let command: ICommand = CommandFactory.createDeleteAllSecurityRequirementsCommand(this.item);
        this.commandService.emit(command);
    }

    public addSecurityRequirement(data: SecurityRequirementData) {
        console.info("[AaiServerRowComponent] Adding a security requirement: %s", JSON.stringify(data));

        let newRequirement: Aai20SecurityRequirement = this.item.createSecurityRequirement();

        this.copySecurityRequirementToModel(data, newRequirement);

        let command: ICommand = CommandFactory.createAddSecurityRequirementCommand(this.item, newRequirement);
        this.commandService.emit(command);
    }

    private copySecurityRequirementToModel(data: SecurityRequirementData, newRequirement: Aai20SecurityRequirement) {
        for (let partialRequirementKey in data) {
            let scopes: string[] = [...data[partialRequirementKey]];
            newRequirement.addSecurityRequirementItem(partialRequirementKey, scopes);
        }
    }

    public changeSecurityRequirement(event: SecurityRequirementEditorEvent) {
        console.info("[AaiServerRowComponent] Changing a security requirement: %s to %s", event.entity, JSON.stringify(event.data));

        let newRequirement: Aai20SecurityRequirement = this.item.createSecurityRequirement();

        this.copySecurityRequirementToModel(event.data, newRequirement);

        let command: ICommand = CommandFactory.createReplaceSecurityRequirementCommand(event.entity, newRequirement);
        this.commandService.emit(command);
    }


    public deleteSecurityRequirement(requirement: Aai20SecurityRequirement) {
        console.info("[AaiServerRowComponent] Deleting a security requirement: %s", requirement);

        let command: ICommand = CommandFactory.createDeleteSecurityRequirementCommand(this.item, requirement);
        this.commandService.emit(command);
    }
}
