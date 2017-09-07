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

import {Component, Output, EventEmitter, ViewChildren, QueryList} from "@angular/core";
import {ModalDirective} from "ng2-bootstrap";
import {Oas20Scopes, Oas20SecurityScheme} from "oai-ts-core";
import {ObjectUtils} from "../../_util/object.util";


export interface Scope {
    name: string;
    description: string;
}


export interface SecurityScheme20EventData {
    schemeName: string;
    description: string;
    type: string;
    name: string;
    in: string;
    flow: string;
    authorizationUrl: string;
    tokenUrl: string;
    scopes: Scope[]
}



@Component({
    moduleId: module.id,
    selector: "security-scheme-20-dialog",
    templateUrl: "security-scheme-20.component.html"
})
export class SecurityScheme20DialogComponent {

    @Output() onSchemeAdded: EventEmitter<SecurityScheme20EventData> = new EventEmitter<SecurityScheme20EventData>();
    @Output() onSchemeChanged: EventEmitter<SecurityScheme20EventData> = new EventEmitter<SecurityScheme20EventData>();

    @ViewChildren("securitySchemeModal") securitySchemeModal: QueryList<ModalDirective>;

    protected _isOpen: boolean = false;

    protected model: SecurityScheme20EventData;
    protected mode: string;

    /**
     * Called to open the dialog.
     */
    public open(scheme?: Oas20SecurityScheme): void {
        this._isOpen = true;
        this.model = {
            schemeName: null,
            description: null,
            type: "basic",
            name: null,
            in: null,
            flow: null,
            authorizationUrl: null,
            tokenUrl: null,
            scopes: []
        };
        this.mode = "create";
        if (scheme) {
            this.model.schemeName = scheme.schemeName();
            this.model.description = scheme.description;
            this.model.type = scheme.type;
            this.model.in = scheme.in;
            this.model.name = scheme.name;
            this.model.flow = scheme.flow;
            this.model.authorizationUrl = scheme.authorizationUrl;
            this.model.tokenUrl = scheme.tokenUrl;
            this.model.scopes = this.toScopesArray(scheme.scopes);
            this.mode = "edit";
        }

        this.securitySchemeModal.changes.subscribe( thing => {
            if (this.securitySchemeModal.first) {
                this.securitySchemeModal.first.show();
            }
        });
    }

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "add".
     */
    protected ok(): void {
        if (this.mode === "create") {
            this.onSchemeAdded.emit(this.model);
        } else {
            this.onSchemeChanged.emit(this.model);
        }
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.securitySchemeModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return {boolean}
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Sets the type.
     * @param type
     */
    public setType(type: string): void {
        this.model.type = type;

        this.model.name = null;
        this.model.in = null;
        this.model.flow = null;
        this.model.authorizationUrl = null;
        this.model.tokenUrl = null;
        this.model.scopes = [];

        if (type === "basic") {
        }
        if (type === "apiKey") {
            this.model.in = "header";
        }
        if (type === "oauth2") {
            this.model.flow = "implicit";
        }
    }

    /**
     * Sets the flow.
     * @param flow
     */
    public setFlow(flow: string): void {
        this.model.flow = flow;
        if (flow === "implicit") {
            this.model.tokenUrl = null;
        }
        if (flow === "password") {
            this.model.authorizationUrl = null;
        }
        if (flow === "accessCode") {
        }
        if (flow === "application") {
            this.model.authorizationUrl = null;
        }
    }

    /**
     * Gets the array of scopes.
     */
    public scopes(): Scope[] {
        return this.model.scopes;
    }

    /**
     * Called when the user clicks the "Add Scope" button.
     */
    public addScope(): void {
        this.model.scopes.push({
            name: "",
            description: ""
        });
    }

    /**
     * Called to delete a scope.
     * @param scope
     */
    public deleteScope(scope: Scope): void {
        this.model.scopes.splice(this.model.scopes.indexOf(scope), 1);
    }

    /**
     * Converts from OAS20 scopes to an array of scope objects.
     * @param scopes
     * @return {Scope[]}
     */
    private toScopesArray(scopes: Oas20Scopes): Scope[] {
        let rval: Scope[] = [];
        if (scopes) {
            for (let sk of scopes.scopes()) {
                let sd: string = scopes.getScopeDescription(sk);
                rval.push({
                    name: sk,
                    description: sd
                });
            }
        }
        return rval;
    }

    /**
     * Returns true only if all the defined scopes are valid (have names).
     * @return {boolean}
     */
    public scopesAreValid(): boolean {
        if (this.model.type === "oauth2") {
            for (let scope of this.model.scopes) {
                if (ObjectUtils.isNullOrUndefined(scope.name) || scope.name.length === 0) {
                    return false;
                }
            }
        }
        return true;
    }
}
