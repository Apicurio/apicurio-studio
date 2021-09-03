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

/**
 * @author vvilerio
 */
import { Component} from "@angular/core";
import {
    Oas20Schema,
    Oas30Schema, Aai20Schema, Oas20SchemaDefinition, Oas30SchemaDefinition, Aai20SchemaDefinition
} from "apicurio-data-models";
import {EntityEditor, EntityEditorEvent, IEntityEditorHandler} from "./entity-editor.component";
import Aai20PropertySchema = Aai20Schema.Aai20PropertySchema;
import Oas20PropertySchema = Oas20Schema.Oas20PropertySchema;
import Oas30PropertySchema = Oas30Schema.Oas30PropertySchema;

export interface PropertiesData {
    minProperties: number;
    maxProperties: number;
}

export interface PropertiesEditorEvent extends EntityEditorEvent<Oas20Schema | Oas30Schema | Aai20PropertySchema> {
    data: PropertiesData;
}

export interface IPropertiesEditorHandler extends IEntityEditorHandler<Oas20Schema | Oas30Schema | Aai20PropertySchema, PropertiesEditorEvent> {
    onSave(event: PropertiesEditorEvent): void;
    onCancel(event: PropertiesEditorEvent): void;
}


@Component({
    selector: "properties-editor",
    templateUrl: "properties-editor.component.html",
    styleUrls: ["properties-editor.component.css"]
    // , changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertiesEditorComponent extends EntityEditor<Oas20Schema | Oas30Schema | Aai20PropertySchema, PropertiesEditorEvent> {

    props: string[] = [];
    propExists: boolean = false;
    minOrMax: string = "min";
    state: boolean = false;
    public model: PropertiesData;

    public doAfterOpen(): void {
        console.debug("doAfterOpen in PropertiesEditorComponent");
        this.props = [];
        this.propExists = false;
        let properties: (Oas20PropertySchema | Oas30PropertySchema | Aai20PropertySchema)[] = this.getProps();
        this.props = properties.map(p => p.getPropertyName());
    }

    /**
     * Initializes the editor's data model from a provided entity (initialize the editor data model from an entity).
     * @param entity
     */
    public initializeModelFromEntity(entity: Oas20Schema | Oas30Schema): void {
        // Note: nothing to do here because data types aren't editable via the full screen editor.
    }

    /**
     * Initializes the editor's data model to an empty state.
     */
    public initializeModel(): void {
        if (!this.model) {
            this.model = {
                minProperties: 0,
                maxProperties: 0
            }
        }

    }

    /**
     * Returns true if the data model is valid.
     */
    public dataIsValid(nameInput: string): boolean {
        const regex = new RegExp('[0-9]+');
        this.state = (this.model.minProperties !== null || this.model.maxProperties != null) && regex.test(nameInput);
        console.log("dataIsValid : ", this.state);
        return this.state;
    }

    /**
     * Creates an entity event specific to this entity editor.
     */
    public entityEvent(): PropertiesEditorEvent {
        let event: PropertiesEditorEvent = {
            entity: this.entity,
            data: this.model
        };
        return event;
    }


    isValid(): boolean {
        return this.state;
    }

    /**
     * Gets the array of properties for the current context.
     */
    private getProps(): (Oas20PropertySchema | Oas30PropertySchema | Aai20PropertySchema)[] {
        let parent: Oas20SchemaDefinition | Oas30SchemaDefinition |  Aai20SchemaDefinition = this.context as Oas20SchemaDefinition | Oas30SchemaDefinition | Aai20SchemaDefinition;
        if (parent.properties) {
            let props: (Oas20PropertySchema | Oas30PropertySchema |  Aai20PropertySchema)[] = [];
            Object.keys(parent.properties).forEach( pkey => {
                props.push(parent.properties[pkey] as Oas20PropertySchema | Oas30PropertySchema |  Aai20PropertySchema);
            });
            return props;
        }
        return [];
    }
}
