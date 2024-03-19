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
    AaiMessageTraitDefinition,
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
    selector: "messagetrait-form",
    templateUrl: "messagetrait-form.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageTraitFormComponent extends SourceFormComponent<AaiMessageTraitDefinition> {

    protected _messageTrait: AaiMessageTraitDefinition;

    @Input()
    set messageTrait(messageTrait: AaiMessageTraitDefinition) {
        this._messageTrait = messageTrait;
        this.sourceNode = messageTrait;
        this.revertSource();
    }
    get messageTrait(): AaiMessageTraitDefinition {
        return this._messageTrait;
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

    protected createEmptyNodeForSource(): AaiMessageTraitDefinition {
        throw new Error("Method not implemented.");
    }
    protected createReplaceNodeCommand(node: AaiMessageTraitDefinition): ICommand {
        throw new Error("Method not implemented.");
    }

    public enableSourceMode(): void {
        this.sourceNode = this.messageTrait;
        super.enableSourceMode();
    }

    public changeTitle(newTitle: string): void {
        console.info("[MessageTraitFormComponent] Changing message title to: ", newTitle);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.messageTrait,
                "title", newTitle);
        this.commandService.emit(command);
    }

    public changeSummary(newSummary: string): void {
        console.info("[MessageTraitFormComponent] Changing message summary to: ", newSummary);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.messageTrait,
                "summary", newSummary);
        this.commandService.emit(command);
    }

    public changeDescription(newDescription: string): void {
        console.info("[MessageTraitFormComponent] Changing message description to: ", newDescription);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.messageTrait,
                "description", newDescription);
        this.commandService.emit(command);
    }

    public changeTags(newTags: string[]): void {
        console.info("[MessageTraitFormComponent] User changed the tags.");
        let command: ICommand = CommandFactory.createChangePropertyCommand(this.messageTrait, "tags", newTags);
        this.commandService.emit(command);
    }

    public tagDefs(): ()=>string[] {
        return ()=> {
            if (this.messageTrait.ownerDocument().tags && this.messageTrait.ownerDocument().tags.length > 0) {
                let tagDefs: string[] = this.messageTrait.ownerDocument().tags.map(tagDef => tagDef.name);
                tagDefs.sort();
                return tagDefs;
            } else {
                return [];
            }
        }
    }
}
