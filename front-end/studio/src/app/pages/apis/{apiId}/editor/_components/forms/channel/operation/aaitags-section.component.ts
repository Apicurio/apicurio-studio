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
    ViewEncapsulation
} from "@angular/core";
import {
    AaiOperationBase,
    AaiMessageBase,
    CommandFactory,
    ICommand,
    Library,
    OasTag,
} from "@apicurio/data-models";
import {CommandService} from "../../../../_services/command.service";
import {AbstractBaseComponent} from "../../../common/base-component";
import {DocumentService} from "../../../../_services/document.service";
import {SelectionService} from "../../../../_services/selection.service";
import {ObjectUtils} from "apicurio-ts-core";


@Component({
    selector: "aaitags-section",
    templateUrl: "aaitags-section.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AaitagsSectionComponent extends AbstractBaseComponent {

    @Input() node: AaiOperationBase | AaiMessageBase;

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
        let tags: OasTag[] = this.node.tags;
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
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(tag, "description", description);
        this.commandService.emit(command);
    }

    /**
     * Called when the user chooses to delete a tag.
     * @param tag
     */
    public deleteTag(tag: OasTag): void {
        let command: ICommand = CommandFactory.createDeleteTagCommand_Aai20(tag.name, this.node);
        this.commandService.emit(command);
    }

    /**
     * Called when the user clicks 'Add' on the Add Tag modal dialog.
     * @param tag
     */
    public addTag(tag: any): void {
        let command: ICommand = CommandFactory.createNewTagCommand_Aai20(tag.name, tag.description, this.node);
        this.commandService.emit(command);
        let path = Library.createNodePath(this.node);
        path.appendSegment("tags", false);
        this.selectionService.select(path.toString());
    }

    /**
     * Returns true if the document has at least one tag defined.
     */
    public hasTags(): boolean {
        return this.node.tags && this.node.tags.length > 0;
    }

    /**
     * Called when the user clicks the trash icon to delete all the tags.
     */
    public deleteAllTags(): void {
        let command: ICommand = CommandFactory.createDeleteAllTagsCommand_Aai20(this.node);
        this.commandService.emit(command);
    }
}
