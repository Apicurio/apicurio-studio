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

import {Component, QueryList, ViewChildren, ViewEncapsulation} from "@angular/core";
import {
    Aai20SecurityScheme, AaiDocument,
    CombinedVisitorAdapter,
    DocumentType,
    Oas20Scopes,
    Oas20SecurityScheme,
    Oas30SecurityScheme,
    OasDocument, OAuthFlow,
    SecurityScheme,
    TraverserDirection,
    VisitorUtil
} from "@apicurio/data-models";
import {EntityEditor, EntityEditorEvent, IEntityEditorHandler} from "./entity-editor.component";
import {Scope} from "../../_models/scope.model";
import {NgModel} from "@angular/forms";
import {ObjectUtils} from "apicurio-ts-core";

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

export interface SecuritySchemeData {
    schemeName: string;
    description: string;
    type: string;
    name: string;
    in: string;
    flow: string;
    authorizationUrl: string;
    tokenUrl: string;
    scopes: Scope[];
}

export interface SecurityScheme20Data extends SecuritySchemeData {
    flow: string;
    authorizationUrl: string;
    tokenUrl: string;
    scopes: Scope[];
}

export interface SecurityScheme30Data extends SecuritySchemeData {
    // *http* - Basic, Bearer, Digest
    scheme: string;
    // *http* - JWT, OAuth
    bearerFormat: string;
    // *openIdConnect*
    openIdConnectUrl: string;
    // *oauth2* - implicit, password, clientCredentials, authorizationCode
    flows: Flows;
}

export interface SecuritySchemeAai20Data extends SecuritySchemeData {
    // *http* - Basic, Bearer, Digest
    scheme: string;
    // *http* - JWT, OAuth
    bearerFormat: string;
    // *openIdConnect*
    openIdConnectUrl: string;
    // *oauth2* - implicit, password, clientCredentials, authorizationCode
    flows: Flows;
}

export interface SecuritySchemeEditorEvent extends EntityEditorEvent<SecurityScheme> {
    data: SecurityScheme20Data | SecurityScheme30Data | SecuritySchemeAai20Data;
}

export interface ISecuritySchemeEditorHandler extends IEntityEditorHandler<SecurityScheme, SecuritySchemeEditorEvent> {
    onSave(event: SecuritySchemeEditorEvent): void;
    onCancel(event: SecuritySchemeEditorEvent): void;
}


@Component({
    selector: "security-scheme-editor",
    templateUrl: "security-scheme-editor.component.html",
    styleUrls: ["security-scheme-editor.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class SecuritySchemeEditorComponent extends EntityEditor<SecurityScheme, SecuritySchemeEditorEvent> {

    @ViewChildren("nameInput") nameInput: QueryList<NgModel>;

    public oauthTab: string = "implicit";
    public model: SecuritySchemeData;

    schemeNames: string[];
    schemeExists: boolean;

    /**
     * Called to open the editor.
     * @param handler
     * @param context
     * @param server
     */
    public open(handler: ISecuritySchemeEditorHandler, context: OasDocument | AaiDocument, scheme?: SecurityScheme): void {
        super.open(handler, context, scheme);
    }

    public is2x(): boolean {
        return this.context.ownerDocument().getDocumentType() == DocumentType.openapi2;
    }

    public is3x(): boolean {
        return this.context.ownerDocument().getDocumentType() == DocumentType.openapi3;
    }

    public isAai2x(): boolean {
        return this.context.ownerDocument().getDocumentType() == DocumentType.asyncapi2;
    }

    /**
     * Initializes the editor's data model from a provided entity.
     * @param entity
     */
    public initializeModelFromEntity(entity: SecurityScheme): void {
        this.initModel(entity);
    }

    /**
     * Initializes the editor's data model to an empty state.
     */
    public initializeModel(): void {
        this.initModel();
    }

    /**
     * Returns true if the data model is valid.
     */
    public isValid(): boolean {
        let hasSchemeName: boolean = !ObjectUtils.isNullOrUndefined(this.model.schemeName);
        let hasType: boolean = !ObjectUtils.isNullOrUndefined(this.model.type);
        let validNameInput: boolean = true;
        if (this.nameInput && this.nameInput.first) {
            validNameInput = this.nameInput.first.valid;
        }
        return hasSchemeName && hasType && validNameInput;
    }

    /**
     * Creates an entity event specific to this entity editor.
     */
    public entityEvent(): SecuritySchemeEditorEvent {
        let event: SecuritySchemeEditorEvent = {
            entity: this.entity,
            data: this.model
        };
        return event;
    }

    protected initModel(scheme?: SecurityScheme): void {
        this.schemeExists = false;
        let schemeNames: string[] = [];
        VisitorUtil.visitTree(this.context.ownerDocument(), new class extends CombinedVisitorAdapter {
            public visitSecurityScheme(node: SecurityScheme): void {
                schemeNames.push(node.getName());
            }
        }, TraverserDirection.down);
        this.schemeNames = schemeNames;

        if (this.context.ownerDocument().getDocumentType() == DocumentType.openapi2) {
            this.model = {
                schemeName: null,
                description: null,
                type: null,
                name: null,
                in: null,
                flow: null,
                authorizationUrl: null,
                tokenUrl: null,
                scopes: []
            } as SecurityScheme20Data;
        } else {
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
            } as SecurityScheme30Data | SecuritySchemeAai20Data;
        }

        if (scheme) {
            if (this.context.ownerDocument().getDocumentType() == DocumentType.openapi2) {
                let scheme20: Oas20SecurityScheme = scheme as Oas20SecurityScheme;
                this.model.schemeName = scheme20.getSchemeName();
                this.model.description = scheme20.description;
                this.model.type = scheme20.type;
                this.model.in = scheme20.in;
                this.model.name = scheme20.name;
                this.model.flow = scheme20.flow;
                this.model.authorizationUrl = scheme20.authorizationUrl;
                this.model.tokenUrl = scheme20.tokenUrl;
                this.model.scopes = this.toScopesArray(scheme20.scopes);
            } else if (this.context.ownerDocument().getDocumentType() == DocumentType.openapi3) {
                let scheme30: Oas30SecurityScheme = scheme as Oas30SecurityScheme;
                let model: SecurityScheme30Data = this.model as SecurityScheme30Data;
                model.schemeName = scheme30.getSchemeName();
                model.description = scheme30.description;
                model.type = scheme30.type;
                model.in = scheme30.in;
                model.name = scheme30.name;
                model.scheme = scheme30.scheme;
                model.bearerFormat = scheme30.bearerFormat;
                model.openIdConnectUrl = scheme30.openIdConnectUrl;
                this.readFlows(scheme30);
                if (!ObjectUtils.isNullOrUndefined(scheme30.flows)) {
                    if (!ObjectUtils.isNullOrUndefined(scheme30.flows.authorizationCode)) {
                        this.oauthTab = "authorizationCode";
                    }
                    if (!ObjectUtils.isNullOrUndefined(scheme30.flows.clientCredentials)) {
                        this.oauthTab = "clientCredentials";
                    }
                    if (!ObjectUtils.isNullOrUndefined(scheme30.flows.password)) {
                        this.oauthTab = "password";
                    }
                    if (!ObjectUtils.isNullOrUndefined(scheme30.flows.implicit)) {
                        this.oauthTab = "implicit";
                    }
                }
            } else {
                let aai20SecurityScheme: Aai20SecurityScheme = scheme as Aai20SecurityScheme;
                let model: SecuritySchemeAai20Data = this.model as SecuritySchemeAai20Data;
                model.schemeName = aai20SecurityScheme.getSchemeName();
                model.description = aai20SecurityScheme.description;
                model.type = aai20SecurityScheme.type;
                model.in = aai20SecurityScheme.in;
                model.name = aai20SecurityScheme.name;
                model.scheme = aai20SecurityScheme.scheme;
                model.bearerFormat = aai20SecurityScheme.bearerFormat;
                model.openIdConnectUrl = aai20SecurityScheme.openIdConnectUrl;
                this.readFlows(aai20SecurityScheme);
                if (!ObjectUtils.isNullOrUndefined(aai20SecurityScheme.flows)) {
                    if (!ObjectUtils.isNullOrUndefined(aai20SecurityScheme.flows.authorizationCode)) {
                        this.oauthTab = "authorizationCode";
                    }
                    if (!ObjectUtils.isNullOrUndefined(aai20SecurityScheme.flows.clientCredentials)) {
                        this.oauthTab = "clientCredentials";
                    }
                    if (!ObjectUtils.isNullOrUndefined(aai20SecurityScheme.flows.password)) {
                        this.oauthTab = "password";
                    }
                    if (!ObjectUtils.isNullOrUndefined(aai20SecurityScheme.flows.implicit)) {
                        this.oauthTab = "implicit";
                    }
                }
            }
        }
    }

    /**
     * Reads the flow information from the security scheme and copies it to the model.
     * @param scheme
     */
    private readFlows(scheme: Oas30SecurityScheme | Aai20SecurityScheme) {
        if (!ObjectUtils.isNullOrUndefined(scheme.flows)) {
            if (!ObjectUtils.isNullOrUndefined(scheme.flows.implicit)) {
                this.readFlowInto(scheme.flows.implicit, (this.model as SecurityScheme30Data | SecuritySchemeAai20Data).flows.implicit);
            }
            if (!ObjectUtils.isNullOrUndefined(scheme.flows.password)) {
                this.readFlowInto(scheme.flows.password, (this.model as SecurityScheme30Data | SecuritySchemeAai20Data).flows.password);
            }
            if (!ObjectUtils.isNullOrUndefined(scheme.flows.authorizationCode)) {
                this.readFlowInto(scheme.flows.authorizationCode, (this.model as SecurityScheme30Data | SecuritySchemeAai20Data).flows.authorizationCode);
            }
            if (!ObjectUtils.isNullOrUndefined(scheme.flows.clientCredentials)) {
                this.readFlowInto(scheme.flows.clientCredentials, (this.model as SecurityScheme30Data | SecuritySchemeAai20Data).flows.clientCredentials);
            }
        }
    }

    /**
     * Reads flow information from the data model into the local UI model.
     * @param flowModel
     * @param flow
     */
    private readFlowInto(flowModel: OAuthFlow, flow: Flow) {
        flow.enabled = true;
        flow.authorizationUrl = flowModel.authorizationUrl;
        flow.tokenUrl = flowModel.tokenUrl;
        flow.refreshUrl = flowModel.refreshUrl;
        flow.scopes = this.toScopesArray(flowModel.scopes);
    }

    /**
     * Converts from OAS30 scopes to an array of scope objects.
     * @param scopes
     */
    private toScopesArray(scopes: any): Scope[] {
        if (scopes && (this.is3x() || this.isAai2x())) {
            let rval: Scope[] = [];
            for (let sk in scopes) {
                let sd: string = scopes[sk]
                rval.push({
                    name: sk,
                    description: sd
                });
            }
            return rval;
        } else if (scopes && this.is2x()) {
            let scopes20: Oas20Scopes = scopes as Oas20Scopes;
            return scopes20.getScopeNames().map( sname => {
                return {
                    name: sname,
                    description: scopes20.getScopeDescription(sname)
                }
            });
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
     * Returns true only if all the defined scopes are valid (have names).
     * @return
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

    /**
     * Sets the type.
     * @param type
     */
    public setType(type: string): void {
        this.model.type = type;
    }

    /**
     * Gets the 2.0 version of the data model.
     */
    public model20(): SecurityScheme20Data {
        return this.model as SecurityScheme20Data;
    }

    /**
     * Gets the 3.0 version of the data model.
     */
    public model30(): SecurityScheme30Data {
        return this.model as SecurityScheme30Data;
    }

    /**
     * Gets the Aai 2.0 version of the data model.
     */
    public modelAai20(): SecuritySchemeAai20Data {
        return this.model as SecuritySchemeAai20Data;
    }

}
