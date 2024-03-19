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
    AaiMessageTraitDefinition,
    AaiDocument,
    TraverserDirection,
    VisitorUtil
} from "@apicurio/data-models";
import {EntityEditor, EntityEditorEvent, IEntityEditorHandler} from "./entity-editor.component";
import {FindMessageTraitDefinitionsVisitor} from "../../_visitors/messagetrait-definitions.visitor";


export interface MessageTraitData {
    name: string;
    description: string;
}

export interface MessageTraitEditorEvent extends EntityEditorEvent<AaiMessageTraitDefinition> {
    data: MessageTraitData;
}

export interface IMessageTraitEditorHandler extends IEntityEditorHandler<AaiMessageTraitDefinition, MessageTraitEditorEvent> {
    onSave(event: MessageTraitEditorEvent): void;
    onCancel(event: MessageTraitEditorEvent): void;
}


@Component({
    selector: "messagetrait-editor",
    templateUrl: "messagetrait-editor.component.html",
    styleUrls: ["messagetrait-editor.component.css"]
})
export class MessageTraitEditorComponent extends EntityEditor<AaiMessageTraitDefinition, MessageTraitEditorEvent> {

    messageTraits: string[] = [];
    traitExists: boolean = false;

    public model: MessageTraitData = {
        name: "",
        description: ""
    };

    public doAfterOpen(): void {
        this.messageTraits = [];
        this.traitExists = false;
        let traits: AaiMessageTraitDefinition[] = this.getMessageTraits(<AaiDocument> this.context.ownerDocument());
        this.messageTraits = traits.map(definition => FindMessageTraitDefinitionsVisitor.definitionName(definition));
    }

    /**
     * Initializes the editor's data model from a provided entity (initialize the editor data model from an entity).
     * @param entity
     */
    public initializeModelFromEntity(entity: AaiMessageTraitDefinition): void {
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
        return this.model.name !== null && this.model.name.trim().length > 0 && !this.traitExists;
    }

    /**
     * Creates an entity event specific to this entity editor.
     */
    public entityEvent(): MessageTraitEditorEvent {
        let event: MessageTraitEditorEvent = {
            entity: this.entity,
            data: this.model
        };
        return event;
    }

    private getMessageTraits(document: AaiDocument): AaiMessageTraitDefinition[] {
        let vizzy: FindMessageTraitDefinitionsVisitor = new FindMessageTraitDefinitionsVisitor(null);
        VisitorUtil.visitTree(document, vizzy, TraverserDirection.down);
        return vizzy.getSortedMessageTraitDefinitions()
    }

}
