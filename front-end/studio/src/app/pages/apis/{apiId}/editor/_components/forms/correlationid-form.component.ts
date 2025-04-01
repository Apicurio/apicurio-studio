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
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from "@angular/core";
import {Aai20CorrelationId, AaiCorrelationId, CommandFactory, ICommand} from "@apicurio/data-models";

import {SourceFormComponent} from "./source-form.base";
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";
import {DocumentService} from "../../_services/document.service";
import {EditorsService} from "../../_services/editors.service";
import {ApiCatalogService} from "../../_services/api-catalog.service";

@Component({
    selector: "correlationid-form",
    templateUrl: "correlationid-form.component.html",
    styleUrls: ["correlationid-form.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorrelationIdFormComponent extends SourceFormComponent<AaiCorrelationId> {

    protected _correlationId: AaiCorrelationId;

    @Input()
    set correlationId(correlationId: AaiCorrelationId) {
        this._correlationId = correlationId;
        this.sourceNode = correlationId;
        this.revertSource();
    }
    get correlationId(): AaiCorrelationId {
        return this._correlationId;
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

    protected createEmptyNodeForSource(): AaiCorrelationId {
        const correlationId = new Aai20CorrelationId(this._correlationId.parent(), this._correlationId.getName());
        correlationId._ownerDocument = this._correlationId.ownerDocument();
        return correlationId;
    }

    protected createReplaceNodeCommand(node: AaiCorrelationId): ICommand {
        return CommandFactory.createReplaceCorrelationIdDefinitionCommand(this._correlationId, node);
    }

    public changeLocation(newLocation: string): void {
        console.info("[CorrelationIdFormComponent] Changing correlation id summary to: ", newLocation);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.correlationId,
            "location", newLocation);
        this.commandService.emit(command);
    }

    public changeDescription(newDescription: string): void {
        console.info("[CorrelationIdFormComponent] Changing correlation id description to: ", newDescription);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.correlationId,
            "description", newDescription);
        this.commandService.emit(command);
    }

    public enableSourceMode(): void {
        this.sourceNode = this.correlationId;
        super.enableSourceMode();
    }
}