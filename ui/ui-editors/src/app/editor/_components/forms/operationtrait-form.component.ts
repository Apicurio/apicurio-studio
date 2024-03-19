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
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {
    CombinedVisitorAdapter,
    CommandFactory,
    DocumentType,
    ICommand,
    Library,
    AaiDocument,
    AaiOperationTraitDefinition,
    ReferenceUtil,
    SimplifiedType,
    TraverserDirection,
    VisitorUtil
} from "@apicurio/data-models";

import {SourceFormComponent} from "./source-form.base";
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";
import {DocumentService} from "../../_services/document.service";
import {EditorsService} from "../../_services/editors.service";
import {ApiCatalogService} from "../../_services/api-catalog.service";

@Component({
    selector: "operationtrait-form",
    templateUrl: "operationtrait-form.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationTraitFormComponent extends SourceFormComponent<AaiOperationTraitDefinition> {

    protected _operationTrait: AaiOperationTraitDefinition;

    @Input()
    set operationTrait(messageTrait: AaiOperationTraitDefinition) {
        this._operationTrait = messageTrait;
        this.sourceNode = messageTrait;
        this.revertSource();
    }
    get operationTrait(): AaiOperationTraitDefinition {
        return this._operationTrait;
    }

     /**
     * C'tor.
     * @param changeDetectorRef
     * @param selectionService
     * @param commandService
     * @param documentService
     * @param editors
     * @param catalog
     */
    public constructor(protected changeDetectorRef: ChangeDetectorRef,
            protected selectionService: SelectionService,
            protected commandService: CommandService,
            protected documentService: DocumentService,
            private editors: EditorsService,
            private catalog: ApiCatalogService) {
        super(changeDetectorRef, selectionService, commandService, documentService);
    }

    protected createEmptyNodeForSource(): AaiOperationTraitDefinition {
        throw new Error("Method not implemented.");
    }
    protected createReplaceNodeCommand(node: AaiOperationTraitDefinition): ICommand {
        throw new Error("Method not implemented.");
    }

    public enableSourceMode(): void {
        this.sourceNode = this.operationTrait;
        super.enableSourceMode();
    }

    public changeSummary(newSummary: string): void {
        console.info("[OperationTraitFormComponent] Changing message summary to: ", newSummary);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.operationTrait,
                "summary", newSummary);
        this.commandService.emit(command);
    }

    public changeDescription(newDescription: string): void {
        console.info("[OperationTraitFormComponent] Changing message description to: ", newDescription);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.operationTrait,
                "description", newDescription);
        this.commandService.emit(command);
    }

    public changeTags(newTags: string[]): void {
        console.info("[OperationTraitFormComponent] User changed the tags.");
        let command: ICommand = CommandFactory.createChangePropertyCommand(this.operationTrait, "tags", newTags);
        this.commandService.emit(command);
    }

    public tagDefs(): ()=>string[] {
        return ()=> {
            if (this.operationTrait.ownerDocument().tags && this.operationTrait.ownerDocument().tags.length > 0) {
                let tagDefs: string[] = this.operationTrait.ownerDocument().tags.map(tagDef => tagDef.name);
                tagDefs.sort();
                return tagDefs;
            } else {
                return [];
            }
        }
    }
}
