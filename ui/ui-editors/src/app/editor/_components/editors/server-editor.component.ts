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

import {Component, ViewChildren, QueryList} from "@angular/core";
import {Oas30Server} from "@apicurio/data-models";
import {EntityEditor, EntityEditorEvent, IEntityEditorHandler} from "./entity-editor.component";
import {NgModel} from "@angular/forms";

export interface ServerVariableData {
    default: string;
    description: string;
    enum: string[];
}

export interface ServerData {
    url: string;
    description: string;
    variables: any; // map of string to ServerVariableData
}

export interface ServerEditorEvent extends EntityEditorEvent<Oas30Server> {
    data: ServerData;
}

export interface IServerEditorHandler extends IEntityEditorHandler<Oas30Server, ServerEditorEvent> {
    onSave(event: ServerEditorEvent): void;
    onCancel(event: ServerEditorEvent): void;
}


@Component({
    selector: "server-editor",
    templateUrl: "server-editor.component.html",
    styleUrls: ["server-editor.component.css"]
})
export class ServerEditorComponent extends EntityEditor<Oas30Server, ServerEditorEvent> {

    @ViewChildren("urlInput") urlInput: QueryList<NgModel>;

    public model: ServerData = {
        url: "",
        description: "",
        variables: {}
    };
    public url: string;
    _varSelected: string = null;

    /**
     * Initializes the editor's data model from a provided entity (initialize the editor data model from an entity).
     * @param entity
     */
    public initializeModelFromEntity(entity: Oas30Server): void {
        this.model.url = entity.url;
        this.model.description = entity.description;
        this.model.variables = {};
        entity.getServerVariables().forEach( variable => {
            this.model.variables[variable.getName()] = {
                "default": variable.default_,
                "description": variable.description,
                "enum": variable.enum_
            };
        });
        this.url = this.model.url;
        this.updateVariables();
    }

    /**
     * Initializes the editor's data model to an empty state.
     */
    public initializeModel(): void {
        this.model = {
            url: "",
            description: "",
            variables: {}
        };
        this.url = "";
    }

    /**
     * Returns true if the data model is valid.
     */
    public isValid(): boolean {
        // TODO should also validate the URL format is OK
        let hasUrl: boolean = this.model.url ? true : false;
        return hasUrl && !this.canApply();
    }

    /**
     * Creates an entity event specific to this entity editor.
     */
    public entityEvent(): ServerEditorEvent {
        let event: ServerEditorEvent = {
            entity: this.entity,
            data: this.model
        };
        return event;
    }

    /**
     * Called when the URL changes.  The URL will be parsed to find any variable substitutions
     * present in the URL spec.  The map of variables is then updated to reflect whatever is found.
     */
    public updateVariables(): void {
        console.info("[ServerEditorComponent] Updating variables for URL: %s", this.model.url);

        let url = this.model.url;
        if (!url) {
            this.model.variables = {};
        }

        console.info("                           Executing regex against: %s", url);
        let regex:RegExp = /{([^}]+)}/gi;
        let result: RegExpExecArray;
        let varNames: string[] = [];
        while ( (result = regex.exec(url)) ) {
            varNames.push(result[1]);
        }
        console.info("                           Variable names found: %o", varNames);

        let newVariables: any = {};

        varNames.forEach( varName => {
            if (this.model.variables[varName]) {
                newVariables[varName] = this.model.variables[varName];
            } else {
                newVariables[varName] = {};
            }
        });

        this.model.variables = newVariables;

        this._varSelected = null;
        if (varNames.length > 0) {
            this._varSelected = varNames[0];
        }
    }

    /**
     * Returns true if there are any variables to be configured.
     * @return
     */
    public hasVariables(): boolean {
        let rval: boolean = false;
        if (this.model.variables) {
            for (let v in this.model.variables) {
                rval = true;
            }
        }
        return rval;
    }

    /**
     * Returns the names of the variables.
     * @return
     */
    public variableNames(): string[] {
        let rval: string[] = [];
        if (this.model.variables) {
            for (let v in this.model.variables) {
                rval.push(v);
            }
        }
        return rval;
    }

    /**
     * @param event
     */
    public onServerUrlKeypress(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            this.apply();
            event.stopPropagation();
            event.preventDefault();
        }
    }

    /**
     * Returns true if there are URL changes.
     */
    public canApply(): boolean {
        return this.model.url !== this.url;
    }

    /**
     * Called when the user clicks the "apply" button.
     */
    public apply(): void {
        this.model.url = this.url;
        this.updateVariables();
    }

    /**
     * Called when the user clicks the "reset" button.
     */
    public reset(): void {
        this.url = this.model.url;
    }

}
