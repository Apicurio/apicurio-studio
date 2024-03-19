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
    CommandFactory,
    ICommand,
    Oas30Document,
    Oas30Operation,
    Oas30PathItem,
    Oas30Server
} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {EditorsService} from "../../../_services/editors.service";
import {ServerEditorComponent, ServerEditorEvent} from "../../editors/server-editor.component";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {AbstractRowComponent} from "../../common/item-row.abstract";


@Component({
    selector: "server-row",
    templateUrl: "server-row.component.html",
    styleUrls: ["server-row.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerRowComponent extends AbstractRowComponent<Oas30Server, string> {

    @Output() onEdit: EventEmitter<ServerEditorEvent> = new EventEmitter<ServerEditorEvent>();
    @Output() onDelete: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(changeDetectorRef: ChangeDetectorRef, documentService: DocumentService,
                private commandService: CommandService, private editorsService: EditorsService,
                selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected updateModel(): void {
        // Nothing to do for this row impl
    }

    public hasUrl(): boolean {
        return this.item.url ? true : false;
    }

    public description(): string {
        return this.item.description
    }

    public hasDescription(): boolean {
        return this.item.description ? true : false;
    }

    public toggle(): void {
        this.toggleTab("server");
    }

    public edit(): void {
        let serverEditor: ServerEditorComponent = this.editorsService.getServerEditor();
        let parent: Oas30Document | Oas30PathItem | Oas30Operation = this.item.parent() as any;
        serverEditor.open({
            onSave: (data) => this.onEdit.emit(data),
            onCancel: () => {}
        }, parent, this.item);
    }

    public delete(): void {
        this.onDelete.emit(true);
    }

    public setDescription(description: string): void {
        // TODO create a new ChangeServerDescription command as it's a special case when used in a multi-user editing environment (why?)
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.item, "description", description);
        this.commandService.emit(command);
    }

}
