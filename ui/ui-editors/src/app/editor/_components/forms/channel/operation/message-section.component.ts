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
import {
    AaiDocument,
    AaiMessage,
    AaiOperation,
    CommandFactory,
    ICommand,
    Library,
    NodePath,
    ReferenceUtil
} from "@apicurio/data-models";
import {CommandService} from "../../../../_services/command.service";
import {AbstractBaseComponent} from "../../../common/base-component";
import {DocumentService} from "../../../../_services/document.service";
import {SelectionService} from "../../../../_services/selection.service";
import {ModelUtils} from "../../../../_util/model.util";
import {ObjectUtils} from "apicurio-ts-core";
import {SchemaUtil} from "../../../../_util/schema.util";
import {EditorsService} from "../../../../_services/editors.service";
import {DropDownOption, DropDownOptionValue} from "../../../common/drop-down.component";

const INHERITANCE_TYPES: DropDownOption[] = [
    new DropDownOptionValue("OneOf", "oneOf")
];

@Component({
    selector: "message-section",
    templateUrl: "message-section.component.html",
    styleUrls: [ "message-section.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageSectionComponent extends AbstractBaseComponent {

    @Input() operation: AaiOperation;

    currentPart: string = 'payload';
    nodePathToDel: NodePath = undefined;

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param commandService
     * @param selectionService
     * @param editors
     */
    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService, private editors: EditorsService) {
            super(changeDetectorRef, documentService, selectionService);
    }

    ngOnInit(): void {
        console.log("operation.ownerDocument: " + this.operation.ownerDocument());
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

    /**
     * Called when the user selects the main/default element from the master area.
     */
    public selectMain(): void {
        this.__selectionService.selectRoot();
    }

    /**
     * Deselects the currently selected message definition.
     */
    public deselectMessage(): void {
        this.selectMain();
    }

    public addOneOf(newOneOf: string){
        let doc: AaiDocument = this.operation.ownerDocument() as AaiDocument;
        let message: AaiMessage = doc.components.getMessage(newOneOf);
        message.setReference(message.payload.$ref.replace("schemas","messages").replace(message.payload.$ref.split("/")[3],message.getName()));
        message.name = null;
        message.payload = null;
        let command: ICommand = CommandFactory.createAddOneOfInMessageCommand(message,this.operation.message);
        this.commandService.emit(command);

        let nodePath = Library.createNodePath(this.operation);
        this.__selectionService.select(nodePath.toString());
    }

    public deleteMessageInOneOf(data: AaiMessage, idx: number): void {
        let command: ICommand = CommandFactory.createDeleteOneOfMessageCommand(data, idx);
        this.commandService.emit(command);

        let nodePath = Library.createNodePath(this.operation);
        this.__selectionService.select(nodePath.toString());
    }


    public isMultiMessages(): boolean {
        if (ObjectUtils.isNullOrUndefined((this.messageFromOperation()))) {
            return false;
        }
        return !ObjectUtils.isNullOrUndefined((this.messageFromOperation().oneOf)) && this.messageFromOperation().oneOf.length > 0;
    }

    //message from operation
    public messageFromOperation(): AaiMessage {
        return this.operation.message;
    }

    // Name Message list from document
    public getMessagesFromDocument(): string[] {
        let doc: AaiDocument = this.operation.ownerDocument() as AaiDocument;
        return doc.components.getMessagesList().map( m =>
            m.getName()
        );
    }

    public referenceAlreadyAdd(): string[] {
        return this.operation.message.oneOf.map(m => m.getReference().split('/')[3]);
    }

    public hasMessage(): boolean {
        return !ObjectUtils.isNullOrUndefined((this.operation).message);
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

    public oneOfName(message: AaiMessage): string {
        if (message && message.$ref) {
            const r: any = this.deref(message);
            if (r && r.getName && r.getName()) {
                return r.getName();
            } else {
                return message.$ref;
            }
        } else if (message.name) {
            return message.name;
        } else {
            return "Unknown message";
        }
    }

    public deref(message: AaiMessage){
        return ReferenceUtil.resolveFragmentFromJS(this.messageFromOperation().ownerDocument(), message.$ref);
    }

    public changeName(newName: string): void {
        console.info("[MessageSectionComponent] Changing message name to: ", this.messageFromOperation());
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.messageFromOperation(),
                "name", newName);
        this.commandService.emit(command);
    }

    public changeTitle(newTitle: string): void {
        console.info("[MessageSectionComponent] Changing message title to: ", newTitle);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.messageFromOperation(),
                "title", newTitle);
        this.commandService.emit(command);
    }

    public changeSummary(newSummary: string): void {
        console.info("[MessageSectionComponent] Changing message summary to: ", newSummary);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.messageFromOperation(),
                "summary", newSummary);
        this.commandService.emit(command);
    }

    public changeDescription(newDescription: string): void {
        console.info("[MessageSectionComponent] Changing message description to: ", newDescription);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.messageFromOperation(),
                "description", newDescription);
        this.commandService.emit(command);
    }

    public changeContentType(newContentType: string): void {
        console.info("[MessageSectionComponent] Changing message contentType to: ", newContentType);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.messageFromOperation(),
                "contentType", newContentType);
        this.commandService.emit(command);
    }

    public changeSchemaFormat(newSchemaFormat: boolean): void {
        console.info("[MessageSectionComponent] Changing message schemaFormat to: ", newSchemaFormat);
        let command: ICommand = CommandFactory.createChangePropertyCommand(this.messageFromOperation(),
                "schemaFormat", newSchemaFormat);
        this.commandService.emit(command);
    }

    public inheritanceType(): string {
        return "oneOf";
    }


}
