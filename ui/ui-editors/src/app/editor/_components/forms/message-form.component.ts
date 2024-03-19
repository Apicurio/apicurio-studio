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
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from "@angular/core";
import {AaiMessage, CommandFactory, ICommand} from "@apicurio/data-models";

import {SourceFormComponent} from "./source-form.base";
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";
import {DocumentService} from "../../_services/document.service";
import {EditorsService} from "../../_services/editors.service";
import {ApiCatalogService} from "../../_services/api-catalog.service";
import {SchemaUtil} from "../../_util/schema.util";

@Component({
    selector: "message-form",
    templateUrl: "message-form.component.html",
    styleUrls: ["message-form.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageFormComponent extends SourceFormComponent<AaiMessage> {

    protected _message: AaiMessage;

    currentPart: string = 'payload';


    @Input()
    set message(message: AaiMessage) {
        this._message = message;
        this.sourceNode = message;
        this.revertSource();
    }
    get message(): AaiMessage {
        return this._message;
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

    protected createEmptyNodeForSource(): AaiMessage {
        throw new Error("Method not implemented.");
    }

    protected createReplaceNodeCommand(node: AaiMessage): ICommand {
        throw new Error("Method not implemented.");
    }

    public schemaFormatOptions() {
        return SchemaUtil.schemaFormatOptions;
    }

    public isPartActive(part: string): boolean {
        return this.currentPart === part;
    }

    public setActivePart(part: string): void {
        this.currentPart = part;
    }


    public changeName(newName: string): void {
        console.info("[MessageSectionComponent] Changing message name to: ", newName);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.message,
            "name", newName);
        this.commandService.emit(command);
    }

    public changeTitle(newTitle: string): void {
        console.info("[MessageSectionComponent] Changing message title to: ", newTitle);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.message,
            "title", newTitle);
        this.commandService.emit(command);
    }

    public changeSummary(newSummary: string): void {
        console.info("[MessageSectionComponent] Changing message summary to: ", newSummary);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.message,
            "summary", newSummary);
        this.commandService.emit(command);
    }

    public changeDescription(newDescription: string): void {
        console.info("[MessageSectionComponent] Changing message description to: ", newDescription);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.message,
            "description", newDescription);
        this.commandService.emit(command);
    }

    public changeContentType(newContentType: string): void {
        console.info("[MessageSectionComponent] Changing message contentType to: ", newContentType);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.message,
            "contentType", newContentType);
        this.commandService.emit(command);
    }

    public changeSchemaFormat(newSchemaFormat: boolean): void {
        console.info("[MessageSectionComponent] Changing message schemaFormat to: ", newSchemaFormat);
        let command: ICommand = CommandFactory.createChangePropertyCommand(this.message,
            "schemaFormat", newSchemaFormat);
        this.commandService.emit(command);
    }


    public enableSourceMode(): void {
        this.sourceNode = this.message;
        super.enableSourceMode();
    }


    public tagDefs(): ()=>string[] {
        return ()=> {
            if (this.message.ownerDocument().tags && this.message.ownerDocument().tags.length > 0) {
                let tagDefs: string[] = this.message.ownerDocument().tags.map(tagDef => tagDef.name);
                tagDefs.sort();
                return tagDefs;
            } else {
                return [];
            }
        }
    }
}
