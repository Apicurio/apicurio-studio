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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation
} from "@angular/core";
import {Oas30Document, Oas30Operation, Oas30PathItem, Oas30Server} from "oai-ts-core";
import {createChangePropertyCommand, ICommand} from "oai-ts-commands";
import {CommandService} from "../../../_services/command.service";
import {EditorsService} from "../../../_services/editors.service";
import {ServerEditorComponent, ServerEditorEvent} from "../../editors/server-editor.component";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {KeypressUtils} from "../../../_util/object.util";
import {SelectionService} from "../../../_services/selection.service";


@Component({
    moduleId: module.id,
    selector: "server-row",
    templateUrl: "server-row.component.html",
    styleUrls: ["server-row.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerRowComponent extends AbstractBaseComponent {

    @Input() server: Oas30Server;

    @Output() onEdit: EventEmitter<ServerEditorEvent> = new EventEmitter<ServerEditorEvent>();
    @Output() onDelete: EventEmitter<boolean> = new EventEmitter<boolean>();

    protected _editing: boolean = false;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private editorsService: EditorsService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public hasUrl(): boolean {
        return this.server.url ? true : false;
    }

    public description(): string {
        return this.server.description
    }

    public hasDescription(): boolean {
        return this.server.description ? true : false;
    }

    public isEditing(): boolean {
        return this._editing;
    }

    public toggle(): void {
        this._editing = !this._editing;
    }

    public edit(): void {
        let serverEditor: ServerEditorComponent = this.editorsService.getServerEditor();
        let parent: Oas30Document | Oas30PathItem | Oas30Operation = this.server.parent() as any;
        serverEditor.open({
            onSave: (data) => this.onEdit.emit(data),
            onCancel: () => {}
        }, parent, this.server);
    }

    public cancel(): void {
        this._editing = false;
    }

    public delete(): void {
        this.onDelete.emit(true);
    }

    public setDescription(description: string): void {
        // TODO create a new ChangeServerDescription command as it's a special case when used in a multi-user editing environment (why?)
        let command: ICommand = createChangePropertyCommand<string>(this.server.ownerDocument(), this.server, "description", description);
        this.commandService.emit(command);
    }

    public onGlobalKeyDown(event: KeyboardEvent): void {
        if (KeypressUtils.isEscapeKey(event)) {
            this.cancel();
        }
    }

}
