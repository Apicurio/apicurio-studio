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
    Input,
    SimpleChanges,
    ViewEncapsulation
} from "@angular/core";
import {
    CommandFactory,
    ICommand,
    AaiOperation
} from "@apicurio/data-models";
import {CommandService} from "../../../../_services/command.service";
import {AbstractBaseComponent} from "../../../common/base-component";
import {DocumentService} from "../../../../_services/document.service";
import {SelectionService} from "../../../../_services/selection.service";
import {ModelUtils} from "../../../../_util/model.util";


@Component({
    selector: "channel-operation-info-section",
    templateUrl: "info-section.component.html",
    styleUrls: [ "info-section.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChannelOperationInfoSectionComponent extends AbstractBaseComponent {

    @Input() operation: AaiOperation;

    private _operationInfoPaths: string[];

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

    ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        this._operationInfoPaths = null;
    }

    /**
     * Returns the node paths of all the properties editable in this section.
     */
    public operationInfoPaths(): string[] {
        if (!this._operationInfoPaths) {
            let basePath: string = ModelUtils.nodeToPath(this.operation);
            this._operationInfoPaths = [ "summary", "description", "operationId", "tags" ].map( prop => {
                return basePath + "/" + prop;
            });
        }
        return this._operationInfoPaths;
    }

    /**
     * Called when the user changes the summary.
     * @param newSummary
     */
    public changeSummary(newSummary: string): void {
        console.info("[ChannelOperationInfoSectionComponent] User changed the summary.");
        let command: ICommand = CommandFactory.createChangePropertyCommand(this.operation, "summary", newSummary);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the description.
     * @param newDescription
     */
    public changeDescription(newDescription: string): void {
        console.info("[ChannelOperationInfoSectionComponent] User changed the description.");
        let command: ICommand = CommandFactory.createChangePropertyCommand(this.operation, "description", newDescription);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the operationId.
     * @param newOperationId
     */
    public changeOperationId(newOperationId: string): void {
        console.info("[ChannelOperationInfoSectionComponent] User changed the operationId.");
        let command: ICommand = CommandFactory.createChangePropertyCommand(this.operation, "operationId", newOperationId);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the tags.
     * @param newTags
     */
    public changeTags(newTags: string[]): void {
        console.info("[ChannelOperationInfoSectionComponent] User changed the tags.");
        let command: ICommand = CommandFactory.createChangePropertyCommand(this.operation, "tags", newTags);
        this.commandService.emit(command);
    }

    public tagDefs(): ()=>string[] {
        return ()=> {
            if (this.operation.ownerDocument().tags && this.operation.ownerDocument().tags.length > 0) {
                let tagDefs: string[] = this.operation.ownerDocument().tags.map(tagDef => tagDef.name);
                tagDefs.sort();
                return tagDefs;
            } else {
                return [];
            }
        }
    }
}
