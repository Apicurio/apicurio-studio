/**
 * @license
 * Copyright 2017 JBoss Inc
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

import {Component, ElementRef, EventEmitter, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";
import {Oas30Server} from "oai-ts-core";


export interface ServerVariableData {
    default: string;
    description: string;
    enum: string[];
}

export interface ServerEventData {
    url: string;
    description: string;
    variables: any; // map of string to ServerVariableData
}


@Component({
    moduleId: module.id,
    selector: "add-server-dialog",
    templateUrl: "add-server.component.html",
    styleUrls: ["add-server.component.css"]
})
export class AddServerDialogComponent {

    @Output() onAdd: EventEmitter<ServerEventData> = new EventEmitter<ServerEventData>();
    @Output() onChange: EventEmitter<ServerEventData> = new EventEmitter<ServerEventData>();

    @ViewChildren("addServerModal") addServerModal: QueryList<ModalDirective>;

    protected mode: string;

    protected _isOpen: boolean = false;

    protected model: ServerEventData = {
        url: "",
        description: "",
        variables: {}
    };

    protected _varSelected: string = null;

    /**
     * Called to open the dialog.
     * @param {Oas30Server} server
     */
    public open(server?: Oas30Server): void {
        this.mode = "create";
        if (server) {
            this.mode = "edit";
            this.model.url = server.url;
            this.model.description = server.description;
            this.model.variables = {};
            server.getServerVariables().forEach( variable => {
                this.model.variables[variable.name()] = {
                    "default": variable.default,
                    "description": variable.description,
                    "enum": variable.enum
                };
            });
            this.updateVariables();
        }
        this._isOpen = true;
        this.addServerModal.changes.subscribe( () => {
            if (this.addServerModal.first) {
                this.addServerModal.first.show();
            }
        });
    }

    /**
     * Called when the URL changes.  The URL will be parsed to find any variable substitutions
     * present in the URL spec.  The map of variables is then updated to reflect whatever is found.
     */
    public updateVariables(): void {
        console.info("[AddServerDialogComponent] Updating variables for URL: %s", this.model.url);

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
     * @return {boolean}
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
     * @return {string[]}
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
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
        this.model.url = "";
        this.model.description = "";
    }

    /**
     * Called when the user clicks "ok".
     */
    protected ok(): void {
        if (this.mode === "create") {
            this.onAdd.emit(this.model);
        } else {
            this.onChange.emit(this.model);
        }
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.addServerModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return {boolean}
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

}
