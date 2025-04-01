/**
 * @license
 * Copyright 2019 JBoss Inc
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
    AaiDocument,
    TraverserDirection,
    VisitorUtil,
    AaiCorrelationId,
} from "@apicurio/data-models";
import {EntityEditor, EntityEditorEvent, IEntityEditorHandler} from "./entity-editor.component";
import {FindCorrelationIdDefinitionsVisitor} from "../../_visitors/correlationid-definitions.visitor";


export interface CorrelationIdData {
    name: string
    description: string;
}

export interface CorrelationIdEditorEvent extends EntityEditorEvent<AaiCorrelationId> {
    data: CorrelationIdData;
}

export interface ICorrelationIdEditorHandler extends IEntityEditorHandler<AaiCorrelationId, CorrelationIdEditorEvent> {
    onSave(event: CorrelationIdEditorEvent): void;
    onCancel(event: CorrelationIdEditorEvent): void;
}


@Component({
    selector: "correlationid-editor",
    templateUrl: "correlationid-editor.component.html",
    styleUrls: ["correlationid-editor.component.css"]
})
export class CorrelationIdEditorComponent extends EntityEditor<AaiCorrelationId, CorrelationIdEditorEvent> {

    correlationIds: string[] = [];
    corrIdExists: boolean = false;

    public model: CorrelationIdData = {
        name: "",
        description: ""
    };

    public doAfterOpen(): void {
        this.correlationIds = [];
        this.corrIdExists = false;
        let corrIds: AaiCorrelationId[] = this.getCorrelationIds(<AaiDocument> this.context.ownerDocument());
        this.correlationIds = corrIds.map(definition => FindCorrelationIdDefinitionsVisitor.definitionName(definition));
    }

    /**
     * Initializes the editor's data model from a provided entity (initialize the editor data model from an entity).
     * @param entity
     */
    public initializeModelFromEntity(entity: AaiCorrelationId): void {
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
        return this.model.name !== null && this.model.name.trim().length > 0 && !this.corrIdExists;
    }

    /**
     * Creates an entity event specific to this entity editor.
     */
    public entityEvent(): CorrelationIdEditorEvent {
        let event: CorrelationIdEditorEvent = {
            entity: this.entity,
            data: this.model
        };
        return event;
    }

    private getCorrelationIds(document: AaiDocument): AaiCorrelationId[] {
        let vizzy: FindCorrelationIdDefinitionsVisitor = new FindCorrelationIdDefinitionsVisitor(null);
        VisitorUtil.visitTree(document, vizzy, TraverserDirection.down);
        return vizzy.getSortedCorrelationIdDefinitions()
    }

}
