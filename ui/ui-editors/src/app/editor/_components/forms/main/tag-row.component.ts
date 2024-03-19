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
import {CommandFactory, ICommand, OasTag} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {AbstractRowComponent} from "../../common/item-row.abstract";


@Component({
    selector: "tag-row",
    templateUrl: "tag-row.component.html",
    styleUrls: ["tag-row.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagRowComponent extends AbstractRowComponent<OasTag, string> {

    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();
    @Output() onRename: EventEmitter<void> = new EventEmitter<void>();

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param commandService
     * @param selectionService
     */
    constructor(changeDetectorRef: ChangeDetectorRef, documentService: DocumentService,
                private commandService: CommandService, selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected updateModel(): void {
        // No internal model for this row impl
    }

    public name(): string {
        if (this.item.name) {
            return this.item.name;
        } else {
            return "No name.";
        }
    }

    public hasName(): boolean {
        return this.item.name ? true : false;
    }

    public description(): string {
        return this.item.description
    }

    public hasDescription(): boolean {
        return this.item.description ? true : false;
    }

    public toggle(): void {
        this.toggleTab("tag");
    }

    public delete(): void {
        this.onDelete.emit();
    }

    public renameTag(): void {
        this.onRename.emit();
    }

    public setDescription(description: string): void {
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.item, "description", description);
        this.commandService.emit(command);
    }

}
