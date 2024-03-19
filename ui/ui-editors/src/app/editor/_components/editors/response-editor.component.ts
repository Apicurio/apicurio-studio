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
    Oas20ResponseDefinition,
    Oas30ResponseDefinition,
    OasDocument,
    TraverserDirection,
    VisitorUtil
} from "@apicurio/data-models";
import {EntityEditor, EntityEditorEvent, IEntityEditorHandler} from "./entity-editor.component";
import {FindResponseDefinitionsVisitor} from "../../_visitors/response-definitions.visitor";


export interface ResponseData {
    name: string;
    description: string;
}

export interface ResponseEditorEvent extends EntityEditorEvent<Oas20ResponseDefinition | Oas30ResponseDefinition> {
    data: ResponseData;
}

export interface IResponseEditorHandler extends IEntityEditorHandler<Oas20ResponseDefinition | Oas30ResponseDefinition, ResponseEditorEvent> {
    onSave(event: ResponseEditorEvent): void;
    onCancel(event: ResponseEditorEvent): void;
}


@Component({
    selector: "response-editor",
    templateUrl: "response-editor.component.html",
    styleUrls: ["response-editor.component.css"]
})
export class ResponseEditorComponent extends EntityEditor<Oas20ResponseDefinition | Oas30ResponseDefinition, ResponseEditorEvent> {

    responses: string[] = [];
    respExists: boolean = false;

    public model: ResponseData = {
        name: "",
        description: ""
    };

    public doAfterOpen(): void {
        this.responses = [];
        this.respExists = false;
        let responses: (Oas20ResponseDefinition | Oas30ResponseDefinition)[] = this.getResponses(<OasDocument> this.context.ownerDocument());
        this.responses = responses.map(definition => FindResponseDefinitionsVisitor.definitionName(definition));
    }

    /**
     * Initializes the editor's data model from a provided entity (initialize the editor data model from an entity).
     * @param entity
     */
    public initializeModelFromEntity(entity: Oas20ResponseDefinition | Oas30ResponseDefinition): void {
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
        return this.model.name !== null && this.model.name.trim().length > 0 && !this.respExists;
    }

    /**
     * Creates an entity event specific to this entity editor.
     */
    public entityEvent(): ResponseEditorEvent {
        let event: ResponseEditorEvent = {
            entity: this.entity,
            data: this.model
        };
        return event;
    }

    private getResponses(document: OasDocument): (Oas20ResponseDefinition | Oas30ResponseDefinition)[] {
        let vizzy: FindResponseDefinitionsVisitor = new FindResponseDefinitionsVisitor(null);
        VisitorUtil.visitTree(document, vizzy, TraverserDirection.down);
        return vizzy.getSortedResponseDefinitions()
    }

}
