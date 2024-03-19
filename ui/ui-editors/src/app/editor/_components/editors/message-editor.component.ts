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

import {Component} from "@angular/core";
import {
    AaiMessage,
    AaiDocument,
    TraverserDirection,
    VisitorUtil
} from "@apicurio/data-models";
import {EntityEditor, EntityEditorEvent, IEntityEditorHandler} from "./entity-editor.component";
import {FindMessageDefinitionsVisitor} from "../../_visitors/message-definitions.visitor";


export interface MessageData {
    name: string;
    description: string;
}

export interface MessageEditorEvent extends EntityEditorEvent<AaiMessage> {
    data: MessageData;
}

export interface IMessageEditorHandler extends IEntityEditorHandler<AaiMessage, MessageEditorEvent> {
    onSave(event: MessageEditorEvent): void;
    onCancel(event: MessageEditorEvent): void;
}


@Component({
    selector: "message-editor",
    templateUrl: "message-editor.component.html",
    styleUrls: ["message-editor.component.css"]
})
export class MessageEditorComponent extends EntityEditor<AaiMessage, MessageEditorEvent> {

    messages: string[] = [];
    messageExists: boolean = false;

    public model: MessageData = {
        name: "",
        description: ""
    };

    public doAfterOpen(): void {
        this.messages = [];
        this.messageExists = false;
        let mess: AaiMessage[] = this.getMessages(<AaiDocument> this.context.ownerDocument());
        this.messages = mess.map(definition => FindMessageDefinitionsVisitor.definitionName(definition));
    }

    /**
     * Initializes the editor's data model from a provided entity (initialize the editor data model from an entity).
     * @param entity
     */
    public initializeModelFromEntity(entity: AaiMessage): void {
        // Note: nothing to do here because data types aren't editable via the full screen editor.
    }

    /**
     * Initializes the editor's data model to an empty state.
     */
    public initializeModel(): void {
        this.model = {
            name: "",
            description: ""
        };
    }

    /**
     * Returns true if the data model is valid.
     */
    public isValid(): boolean {
        return this.model.name !== null && this.model.name.trim().length > 0 && !this.messageExists;
    }

    /**
     * Creates an entity event specific to this entity editor.
     */
    public entityEvent(): MessageEditorEvent {
        let event: MessageEditorEvent = {
            entity: this.entity,
            data: this.model
        };
        return event;
    }

    private getMessages(document: AaiDocument): AaiMessage[] {
        let vizzy: FindMessageDefinitionsVisitor = new FindMessageDefinitionsVisitor(null);
        VisitorUtil.visitTree(document, vizzy, TraverserDirection.down);
        return vizzy.getSortedMessageDefinitions()
    }

}
