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

/**
 * @author vvilerio
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

export interface OneOfInMessageEditorEvent extends EntityEditorEvent<AaiMessage> {
    data: MessageData;
}

export interface IOneOfInMessageEditorHandler extends IEntityEditorHandler<AaiMessage, OneOfInMessageEditorEvent> {
    onSave(event: OneOfInMessageEditorEvent): void;
    onCancel(event: OneOfInMessageEditorEvent): void;
}


@Component({
    selector: "oneOfMessage-editor",
    templateUrl: "oneof-in-message-editor.component.html",
    styleUrls: ["oneof-in-message-editor.component.css"]
})
export class OneOfInMessageEditorComponent extends EntityEditor<AaiMessage, OneOfInMessageEditorEvent> {

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
    public entityEvent(): OneOfInMessageEditorEvent {
        let event: OneOfInMessageEditorEvent = {
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
