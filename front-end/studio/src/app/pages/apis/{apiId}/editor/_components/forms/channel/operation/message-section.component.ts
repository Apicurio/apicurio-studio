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
    SimpleChanges,
    ViewEncapsulation
} from "@angular/core";
import { 
    AaiMessage,
    AaiOperation,
    ICommand,
    CommandFactory
} from "apicurio-data-models";
import {CommandService} from "../../../../_services/command.service";
import {AbstractBaseComponent} from "../../../common/base-component";
import {DocumentService} from "../../../../_services/document.service";
import {SelectionService} from "../../../../_services/selection.service";
import {ModelUtils} from "../../../../_util/model.util";
import {ObjectUtils} from "apicurio-ts-core";

@Component({
    moduleId: module.id,
    selector: "message-section",
    templateUrl: "message-section.component.html",
    styleUrls: [ "message-section.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageSectionComponent extends AbstractBaseComponent {

    @Input() operation: AaiOperation;

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

    ngOnInit(): void {
        console.log("operation.ownerDocument: " + this.operation.ownerDocument());
        console.log("operation.message: " + this.operation.message);
        if (this.operation.message != null) {
            console.log("operation.message.ownerDocument: " + this.operation.message.ownerDocument());
            console.log("operation.message.name: " + this.operation.message.name);
            console.log("operation.message.title: " + this.operation.message.title);
            console.log("operation.message.description: " + this.operation.message.description);
        }
    }

    public messagePath(): string {
        return ModelUtils.nodeToPath(this.operation) + "/message";
    }

    public addMessage(): void {
        /*
        let command: ICommand = CommandFactory.createNewRequestBodyCommand(this.operation.ownerDocument().getDocumentType(), this.operation);
        this.commandService.emit(command);
        let nodePath = Library.createNodePath(this.operation);
        nodePath.appendSegment("requestBody", false);
        this.selectionService.select(nodePath.toString());
        */
    }

    public message(): AaiMessage {
        return this.operation.message;
    }

    public hasMessage(): boolean {
        return !ObjectUtils.isNullOrUndefined((this.operation).message);
    }

    public changeName(newName: string): void {
        console.info("[MessageSectionComponent] Changing message name to: ", newName);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.message(),
                "name", newName);
        this.commandService.emit(command);
    }

    public changeTitle(newTitel: string): void {
        console.info("[MessageSectionComponent] Changing message title to: ", newTitel);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.message(),
                "title", newTitel);
        this.commandService.emit(command);
    }

    public changeSummary(newSummary: string): void {
        console.info("[MessageSectionComponent] Changing message summary to: ", newSummary);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.message(),
                "summary", newSummary);
        this.commandService.emit(command);
    }

    public changeDescription(newDescription: string): void {
        console.info("[MessageSectionComponent] Changing message description to: ", newDescription);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.message(),
                "description", newDescription);
        this.commandService.emit(command);
    }
}