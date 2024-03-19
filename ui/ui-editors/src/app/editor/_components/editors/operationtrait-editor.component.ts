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
    AaiOperationTraitDefinition,
    AaiDocument,
    TraverserDirection,
    VisitorUtil
} from "@apicurio/data-models";
import {EntityEditor, EntityEditorEvent, IEntityEditorHandler} from "./entity-editor.component";
import {FindOperationTraitDefinitionsVisitor} from "../../_visitors/operationtrait-definitions.visitor";


export interface OperationTraitData {
    name: string;
    description: string;
}

export interface OperationTraitEditorEvent extends EntityEditorEvent<AaiOperationTraitDefinition> {
    data: OperationTraitData;
}

export interface IOperationTraitEditorHandler extends IEntityEditorHandler<AaiOperationTraitDefinition, OperationTraitEditorEvent> {
    onSave(event: OperationTraitEditorEvent): void;
    onCancel(event: OperationTraitEditorEvent): void;
}


@Component({
    selector: "operationtrait-editor",
    templateUrl: "operationtrait-editor.component.html",
    styleUrls: ["operationtrait-editor.component.css"]
})
export class OperationTraitEditorComponent extends EntityEditor<AaiOperationTraitDefinition, OperationTraitEditorEvent> {

    operationTraits: string[] = [];
    traitExists: boolean = false;

    public model: OperationTraitData = {
        name: "",
        description: ""
    };

    public doAfterOpen(): void {
        this.operationTraits = [];
        this.traitExists = false;
        let traits: AaiOperationTraitDefinition[] = this.getOperationTraits(<AaiDocument> this.context.ownerDocument());
        this.operationTraits = traits.map(definition => FindOperationTraitDefinitionsVisitor.definitionName(definition));
    }

    /**
     * Initializes the editor's data model from a provided entity (initialize the editor data model from an entity).
     * @param entity
     */
    public initializeModelFromEntity(entity: AaiOperationTraitDefinition): void {
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
    public entityEvent(): OperationTraitEditorEvent {
        let event: OperationTraitEditorEvent = {
            entity: this.entity,
            data: this.model
        };
        return event;
    }

    private getOperationTraits(document: AaiDocument): AaiOperationTraitDefinition[] {
        let vizzy: FindOperationTraitDefinitionsVisitor = new FindOperationTraitDefinitionsVisitor(null);
        VisitorUtil.visitTree(document, vizzy, TraverserDirection.down);
        return vizzy.getSortedOperationTraitDefinitions()
    }

}
