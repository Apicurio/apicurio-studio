/**
 * @license
 * Copyright 2018 JBoss Inc
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

import {Component, EventEmitter, Output} from "@angular/core";
import {Oas30Document, Oas30Operation, Oas30PathItem, Oas30Server, OasLibraryUtils} from "oai-ts-core";

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

export interface IServerEditorHandler {

    onSave(data: ServerEventData): void;
    onCancel(): void;

}


@Component({
    moduleId: module.id,
    selector: "server-editor",
    templateUrl: "server-editor.component.html",
    styleUrls: ["server-editor.component.css"]
})
export class ServerEditorComponent {

    @Output() onSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();

    public _library: OasLibraryUtils = new OasLibraryUtils();
    public _isOpen: boolean = false;
    public _mode: string = "create";
    public _varSelected: string = null;

    protected handler: IServerEditorHandler;
    protected context: Oas30Document | Oas30PathItem | Oas30Operation;
    public contextIs: string = "document";
    protected model: ServerEventData = {
        url: "",
        description: "",
        variables: {}
    };
    protected _expandedContext: any = {
        document: null,
        pathItem: null,
        operation: null
    };
    protected url: string;

    /**
     * Called to open the editor.
     * @param handler
     * @param context
     * @param server
     */
    public open(handler: IServerEditorHandler, context: Oas30Document | Oas30PathItem | Oas30Operation, server?: Oas30Server): void {
        this.context = context;
        this.handler = handler;
        if (server) {
            this._mode = "edit";
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
        } else {
            this._mode = "create";
            this.model = {
                url: "",
                description: "",
                variables: {}
            };
        }
        if (context) {
            this.expandContext(context);
        }
        this.url = this.model.url;
        this._isOpen = true;
    }

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "save".
     */
    protected save(): void {
        if (!this.isValid()) {
            return;
        }
        for (let varName of this.variableNames()) {
            let varModel: any = this.model.variables[varName];
            if (varModel && varModel.default === "") {
                varModel.default = undefined;
            }
        }
        this.close();
        this.handler.onSave(this.model);
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.close();
        this.handler.onCancel();
    }

    /**
     * Returns true if the dialog is open.
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Returns true if the editor is currently valid.
     */
    public isValid(): boolean {
        // TODO should also validate the URL format is OK
        let hasUrl: boolean = this.model.url ? true : false;
        return hasUrl && !this.canApply();
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
     * Figures out what the context is based on what is passed to it.
     * @param context
     */
    public expandContext(context: Oas30Document | Oas30PathItem | Oas30Operation): void {
        if (context['_method']) {
            this.contextIs = "operation";
            this._expandedContext.operation = context as Oas30Operation;
            this._expandedContext.pathItem = context.parent() as Oas30PathItem;
            this._expandedContext.document = context.ownerDocument();
        } else if (context['_path']) {
            this.contextIs = "pathItem";
            this._expandedContext.pathItem = context as Oas30PathItem;
            this._expandedContext.document = context.ownerDocument();
        } else {
            this.contextIs = "document";
            this._expandedContext.document = context as Oas30Document;
        }
    }

    /**
     * Gets the context path item (if any).
     */
    public pathItem(): Oas30PathItem {
        return this._expandedContext.pathItem;
    }

    /**
     * Gets the context operation (if any).
     */
    public operation(): Oas30Operation {
        return this._expandedContext.operation;
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

    /**
     * @param event
     */
    public onKeypress(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    public onGlobalKeyDown(event: KeyboardEvent): void {
        if (event.key === "Escape"  && !event.metaKey && !event.altKey && !event.ctrlKey) {
            this.cancel();
        }
    }

}
