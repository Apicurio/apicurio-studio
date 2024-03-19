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
import {Aai20Server, AaiSecurityRequirement, AaiServerBindings} from "@apicurio/data-models";
import {EntityEditor, EntityEditorEvent, IEntityEditorHandler} from "./entity-editor.component";
import {NgModel} from "@angular/forms";

export interface ServerVariableData {
    default: string;
    description: string;
    enum: string[];
}

export interface AaiServerData {
    url: string;
    description: string;
    variables: any; // map of string to ServerVariableData
    name: string;
    protocol: string;
    protocolVersion: string;
    security: AaiSecurityRequirement[];
    bindings: AaiServerBindings;
}

export interface AaiServerEditorEvent extends EntityEditorEvent<Aai20Server> {
    data: AaiServerData;
}

export interface IAaiServerEditorHandler extends IEntityEditorHandler<Aai20Server, AaiServerEditorEvent> {
    onSave(event: AaiServerEditorEvent): void;
    onCancel(event: AaiServerEditorEvent): void;
}


@Component({
    selector: "aaiserver-editor",
    templateUrl: "aaiserver-editor.component.html",
    styleUrls: ["server-editor.component.css", "aaiserver-editor.component.css"]
})
export class AaiServerEditorComponent extends EntityEditor<Aai20Server, AaiServerEditorEvent> {

    @ViewChildren("urlInput") urlInput: QueryList<NgModel>;

    public model: AaiServerData = {
        url: "",
        description: "",
        variables: {},
        name: "",
        protocol: "",
        protocolVersion: "",
        security: [],
        bindings: null
    };
    public url: string;
    _varSelected: string = null;

    serverExists: boolean;

    /**
     * Initializes the editor's data model from a provided entity (initialize the editor data model from an entity).
     * @param entity
     */
    public initializeModelFromEntity(entity: Aai20Server): void {
        this.model.url = entity.url;
        this.model.name = entity.getName();
        this.model.protocol = entity.protocol;
        this.model.protocolVersion = entity.protocolVersion;
        this.model.description = entity.description;
        this.model.variables = {};
        entity.getServerVariables().forEach( variable => {
            this.model.variables[variable.getName()] = {
                "default": variable.default_,
                "description": variable.description,
                "enum": variable.enum_
            };
        });
        this.model.security = entity.security;
        this.model.bindings = entity.bindings;
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
            variables: {},
            name: "",
            protocol: "",
            protocolVersion: "",
            security: [],
            bindings: null
        };
        this.url = "";
        this.serverExists = false;
    }

    /**
     * Returns true if the data model is valid.
     */
    public isValid(): boolean {
        let hasUrl: boolean = !!this.model.url;
        let hasName: boolean = !!this.model.name;
        let hasProtocol: boolean = !!this.model.protocol;
        return hasUrl && hasName && hasProtocol && !this.canApply();
    }

    /**
     * Creates an entity event specific to this entity editor.
     */
    public entityEvent(): AaiServerEditorEvent {
        let event: AaiServerEditorEvent = {
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
        console.info("[AaiServerEditorComponent] Updating variables for URL: %s", this.model.url);

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

    public securityRequirementSummary(): string {
        if (!this.model.security) {
            return "No requirements defined.";
        }
        return this.model.security
            .map(requirement => {
                let names = requirement.getSecurityRequirementNames();
                return names.length > 0 ? `(${names.join(", ")})` : "Anonymous";
            })
            .join(", ");
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
