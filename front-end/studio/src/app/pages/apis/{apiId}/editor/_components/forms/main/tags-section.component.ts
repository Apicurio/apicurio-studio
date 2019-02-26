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
    Input,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {OasCombinedVisitorAdapter, OasDocument, OasTag, OasVisitorUtil} from "oai-ts-core";
import {CommandService} from "../../../_services/command.service";
import {
    createChangePropertyCommand,
    createDeleteAllTagsCommand,
    createDeleteTagCommand,
    createNewTagCommand,
    createRenameTagDefinitionCommand,
    ICommand
} from "oai-ts-commands";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {RenameEntityDialogComponent, RenameEntityEvent} from "../../dialogs/rename-entity.component";
import {ObjectUtils} from "apicurio-ts-core";


@Component({
    moduleId: module.id,
    selector: "tags-section",
    templateUrl: "tags-section.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsSectionComponent extends AbstractBaseComponent {

    @Input() document: OasDocument;

    @ViewChild("renameDialog") renameDialog: RenameEntityDialogComponent;

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param commandService
     * @param selectionService
     */
    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    /**
     * Returns the list of tags defined in the document.
     * @return
     */
    public tags(): OasTag[] {
        let tags: OasTag[] = this.document.tags;
        if (ObjectUtils.isNullOrUndefined(tags)) {
            tags = [];
        }
        // Clone the array
        tags = tags.slice(0);
        // Sort it
        tags.sort( (obj1, obj2) => {
            return obj1.name.toLowerCase().localeCompare(obj2.name.toLowerCase());
        });
        return tags;
    }

    /**
     * Called when the user changes the description of a tag.
     * @param tag
     * @param description
     */
    public changeTagDescription(tag: OasTag, description: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.document, tag, "description", description);
        this.commandService.emit(command);
    }

    /**
     * Called when the user chooses to delete a tag.
     * @param tag
     */
    public deleteTag(tag: OasTag): void {
        let command: ICommand = createDeleteTagCommand(this.document, tag.name);
        this.commandService.emit(command);
    }

    /**
     * Called when the user clicks 'Add' on the Add Tag modal dialog.
     * @param tag
     */
    public addTag(tag: any): void {
        let command: ICommand = createNewTagCommand(this.document, tag.name, tag.description);
        this.commandService.emit(command);
    }

    /**
     * Returns true if the document has at least one tag defined.
     */
    public hasTags(): boolean {
        return this.document.tags && this.document.tags.length > 0;
    }

    /**
     * Called when the user clicks the trash icon to delete all the tags.
     */
    public deleteAllTags(): void {
        let command: ICommand = createDeleteAllTagsCommand();
        this.commandService.emit(command);
    }

    /**
     * Opens the rename tag dialog.
     * @param tag
     */
    public openRenameDialog(tag: OasTag): void {
        let tagNames: string[] = [];
        OasVisitorUtil.visitTree(tag.ownerDocument(), new class extends OasCombinedVisitorAdapter {
            public visitTag(node: OasTag): void {
                tagNames.push(node.name);
            }
        });
        this.renameDialog.open(tag, tag.name, newName => {
            return tagNames.indexOf(newName) !== -1;
        });
    }

    /**
     * Renames the tag.
     * @param event
     */
    public rename(event: RenameEntityEvent): void {
        let tag: OasTag = <any>event.entity;
        let command: ICommand = createRenameTagDefinitionCommand(tag.name, event.newName);
        this.commandService.emit(command);
    }

}
