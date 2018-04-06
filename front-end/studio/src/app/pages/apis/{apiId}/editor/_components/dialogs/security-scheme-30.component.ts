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

import {Component, EventEmitter, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";
import {Oas30OAuthFlow, Oas30SecurityScheme} from "oai-ts-core";
import {Scope} from "./security-scheme-20.component";
import {ObjectUtils} from "../../_util/object.util";


export interface Flow {
    enabled: boolean;
    authorizationUrl: string;
    tokenUrl: string;
    refreshUrl: string;
    scopes: Scope[];
}

export interface Flows {
    implicit: Flow;
    password: Flow;
    clientCredentials: Flow;
    authorizationCode: Flow;
}


export interface SecurityScheme30EventData {
    schemeName: string;
    // apiKey, http, oauth2, openIdConnect
    type: string;
    description: string;
    // *apiKey*
    name: string;
    // *apiKey* - query, header, cookie
    in: string;
    // *http* - Basic, Bearer, Digest
    scheme: string;
    // *http* - JWT, OAuth
    bearerFormat: string;
    // *openIdConnect*
    openIdConnectUrl: string;
    // *oauth2* - implicit, password, clientCredentials, authorizationCode
    flows: Flows;
}



@Component({
    moduleId: module.id,
    selector: "security-scheme-30-dialog",
    templateUrl: "security-scheme-30.component.html"
})
export class SecurityScheme30DialogComponent {

    @Output() onSchemeAdded: EventEmitter<SecurityScheme30EventData> = new EventEmitter<SecurityScheme30EventData>();
    @Output() onSchemeChanged: EventEmitter<SecurityScheme30EventData> = new EventEmitter<SecurityScheme30EventData>();

    @ViewChildren("securitySchemeModal") securitySchemeModal: QueryList<ModalDirective>;

    protected _isOpen: boolean = false;

    protected model: SecurityScheme30EventData;
    protected mode: string;
    protected oauthTab: string;

    /**
     * Called to open the dialog.
     */
    public open(scheme?: Oas30SecurityScheme): void {
        this._isOpen = true;
        this.oauthTab = "implicit";
        this.model = {
            schemeName: null,
            type: null,
            description: null,
            name: null,
            in: null,
            scheme: null,
            bearerFormat: null,
            openIdConnectUrl: null,
            flows: {
                implicit: {
                    enabled: false,
                    authorizationUrl: null,
                    tokenUrl: null,
                    refreshUrl: null,
                    scopes: []
                },
                password: {
                    enabled: false,
                    authorizationUrl: null,
                    tokenUrl: null,
                    refreshUrl: null,
                    scopes: []
                },
                clientCredentials: {
                    enabled: false,
                    authorizationUrl: null,
                    tokenUrl: null,
                    refreshUrl: null,
                    scopes: []
                },
                authorizationCode: {
                    enabled: false,
                    authorizationUrl: null,
                    tokenUrl: null,
                    refreshUrl: null,
                    scopes: []
                }
            }
        };
        this.mode = "create";
        if (scheme) {
            this.model.schemeName = scheme.schemeName();
            this.model.description = scheme.description;
            this.model.type = scheme.type;
            this.model.in = scheme.in;
            this.model.name = scheme.name;
            this.model.scheme = scheme.scheme;
            this.model.bearerFormat = scheme.bearerFormat;
            this.model.openIdConnectUrl = scheme.openIdConnectUrl;
            this.readFlows(scheme);
            this.mode = "edit";

            if (!ObjectUtils.isNullOrUndefined(scheme.flows)) {
                if (!ObjectUtils.isNullOrUndefined(scheme.flows.authorizationCode)) {
                    this.oauthTab = "authorizationCode";
                }
                if (!ObjectUtils.isNullOrUndefined(scheme.flows.clientCredentials)) {
                    this.oauthTab = "clientCredentials";
                }
                if (!ObjectUtils.isNullOrUndefined(scheme.flows.password)) {
                    this.oauthTab = "password";
                }
                if (!ObjectUtils.isNullOrUndefined(scheme.flows.implicit)) {
                    this.oauthTab = "implicit";
                }
            }

        }

        this.securitySchemeModal.changes.subscribe( () => {
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
    }

    /**
     * Called when the user clicks the "Add Scope" button.
     * @param {string} flow
     */
    public addScope(flow: string): void {
        this.model.flows[flow].scopes.push({
            name: "",
            description: ""
        });
    }

    /**
     * Called to delete a scope.
     * @param {string} flow
     * @param {Scope} scope
     */
    public deleteScope(flow: string, scope: Scope): void {
        this.model.flows[flow].scopes.splice(this.model.flows[flow].scopes.indexOf(scope), 1);
    }

    /**
     * Reads the flow information from the security scheme and copies it to the model.
     * @param {Oas30SecurityScheme} scheme
     */
    private readFlows(scheme: Oas30SecurityScheme) {
        if (!ObjectUtils.isNullOrUndefined(scheme.flows)) {
            if (!ObjectUtils.isNullOrUndefined(scheme.flows.implicit)) {
                this.readFlowInto(scheme.flows.implicit, this.model.flows.implicit);
            }
            if (!ObjectUtils.isNullOrUndefined(scheme.flows.password)) {
                this.readFlowInto(scheme.flows.password, this.model.flows.password);
            }
            if (!ObjectUtils.isNullOrUndefined(scheme.flows.authorizationCode)) {
                this.readFlowInto(scheme.flows.authorizationCode, this.model.flows.authorizationCode);
            }
            if (!ObjectUtils.isNullOrUndefined(scheme.flows.clientCredentials)) {
                this.readFlowInto(scheme.flows.clientCredentials, this.model.flows.clientCredentials);
            }
        }
    }

    /**
     * Reads flow information from the data model into the local UI model.
     * @param {Oas30OAuthFlow} flowModel
     * @param {Flow} flow
     */
    private readFlowInto(flowModel: Oas30OAuthFlow, flow: Flow) {
        flow.enabled = true;
        flow.authorizationUrl = flowModel.authorizationUrl;
        flow.tokenUrl = flowModel.tokenUrl;
        flow.refreshUrl = flowModel.refreshUrl;
        flow.scopes = this.toScopesArray(flowModel.scopes);
    }

    /**
     * Converts from OAS30 scopes to an array of scope objects.
     * @param scopes
     * @return {Scope[]}
     */
    private toScopesArray(scopes: any): Scope[] {
        console.info("toScopesArray: %o", scopes);
        let rval: Scope[] = [];
        if (scopes) {
            for (let sk in scopes) {
                console.info("    " + sk);
                let sd: string = scopes[sk]
                rval.push({
                    name: sk,
                    description: sd
                });
            }
        }
        return rval;
    }

    public isValid(): boolean {
        return this.model.type !== null && this.model.type !== undefined;
    }

}
