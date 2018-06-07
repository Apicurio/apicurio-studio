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
import {
    Oas30OAuthFlow,
    OasCombinedVisitorAdapter,
    OasDocument,
    OasSecurityRequirement,
    OasSecurityScheme,
    OasVisitorUtil
} from "oai-ts-core";
import {Oas20Scopes} from "oai-ts-core/src/models/2.0/scopes.model";
import {
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow,
    Oas30ImplicitOAuthFlow,
    Oas30PasswordOAuthFlow
} from "oai-ts-core/src/models/3.0/oauth-flow.model";


export interface SecurityRequirementEventData {
    [key: string]: string[];
}

export class ChangeSecurityRequirementEvent {
    requirement: OasSecurityRequirement;
    data: SecurityRequirementEventData;
}

export class ScopeInfo {
    name: string;
    description: string;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
}


@Component({
    moduleId: module.id,
    selector: "security-requirement-dialog",
    templateUrl: "security-requirement.component.html",
    styleUrls: ["security-requirement.component.css"]
})
export class SecurityRequirementDialogComponent {

    @Output() onAdded: EventEmitter<SecurityRequirementEventData> = new EventEmitter<SecurityRequirementEventData>();
    @Output() onChanged: EventEmitter<ChangeSecurityRequirementEvent> = new EventEmitter<ChangeSecurityRequirementEvent>();

    @ViewChildren("securityRequirementModal") securityRequirementModal: QueryList<ModalDirective>;

    protected _isOpen: boolean = false;
    protected _mode: string;
    protected _expanded: any;

    protected schemes: OasSecurityScheme[];
    protected scopeCache: any;

    protected model: SecurityRequirementEventData;
    protected _requirement: OasSecurityRequirement;

    /**
     * Called to open the dialog.
     */
    public open(document: OasDocument, requirement?: OasSecurityRequirement): void {
        this.model = {};
        this.scopeCache = {};
        this._expanded = {};

        if (requirement) {
            this._requirement = requirement;
            let names: string[] = requirement.securityRequirementNames();
            names.forEach( name => {
                this.model[name] = requirement.scopes(name);
            });
            this._mode = "edit";
        } else {
            this._requirement = null;
            this._mode = "add";
        }
        this.schemes = this.findSchemes(document);

        this.securityRequirementModal.changes.subscribe( () => {
            if (this.securityRequirementModal.first) {
                this.securityRequirementModal.first.show();
            }
        });

        this._isOpen = true;
    }

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "OK".
     */
    protected ok(): void {
        if (this._mode === "edit") {
            let event: ChangeSecurityRequirementEvent = new ChangeSecurityRequirementEvent();
            event.requirement = this._requirement;
            event.data = this.model;
            this.onChanged.emit(event);
        } else {
            this.onAdded.emit(this.model);
        }
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.securityRequirementModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Returns true if the model is valid.
     * @return
     */
    public isSecurityRequirementValid(): boolean {
        for (let n in this.model) {
            return true;
        }
        return false;
    }

    /**
     * Returns true if the given scheme is enabled.
     * @param scheme
     * @return
     */
    public isChecked(scheme: OasSecurityScheme): boolean {
        for (let n in this.model) {
            if (n === scheme.schemeName()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns true only if the scheme is one that can be expanded.
     * @param scheme
     * @return
     */
    public canExpand(scheme: OasSecurityScheme): boolean {
        return scheme.type === "oauth2" || scheme.type === "openIdConnect";
    }

    /**
     * Returns true if the given scheme is expanded.
     * @param scheme
     * @return
     */
    public isExpanded(scheme: OasSecurityScheme): boolean {
        return this._expanded[scheme.schemeName()] ? true : false;
    }

    /**
     * Called to toggle the expansion of a scheme.
     * @param scheme
     */
    public toggleExpansion(scheme: OasSecurityScheme): void {
        let pval: boolean = this._expanded[scheme.schemeName()];
        if (pval) {
            this._expanded[scheme.schemeName()] = false;
        } else {
            this._expanded[scheme.schemeName()] = true;
        }
    }

    /**
     * Called to expand a scheme.
     * @param scheme
     */
    public expand(scheme: OasSecurityScheme): void {
        this._expanded[scheme.schemeName()] = true;
    }

    /**
     * Called to collapse a scheme.
     * @param scheme
     */
    public collapse(scheme: OasSecurityScheme): void {
        this._expanded[scheme.schemeName()] = false;
    }

    /**
     * Adds/removes the security scheme from the model.
     * @param scheme
     */
    public toggleSecurityScheme(scheme: OasSecurityScheme, enable?: boolean): void {
        if (enable === undefined) {
            enable = !this.isChecked(scheme);
        }
        if (enable) {
            this.model[scheme.schemeName()] = [];
            if (this.canExpand(scheme)) {
                this.expand(scheme);
            }
        } else {
            delete this.model[scheme.schemeName()];
            if (this.canExpand(scheme)) {
                this.collapse(scheme);
            }
        }
    }

    /**
     * Returns the possible scopes for the given scheme.
     * @param scheme
     * @return
     */
    public scopes(scheme: OasSecurityScheme): ScopeInfo[] {
        if (this.canExpand(scheme)) {
            if (this.scopeCache[scheme.schemeName()]) {
                return this.scopeCache[scheme.schemeName()];
            }
            let visitor: ScopeFinder = new ScopeFinder();
            OasVisitorUtil.visitTree(scheme, visitor);
            let rval: ScopeInfo[] = visitor.scopes();
            this.scopeCache[scheme.schemeName()] = rval;
            return rval;
        }
        return [];
    }

    /**
     * Returns true if the given scope is enabled/checked in the model.
     * @param scheme
     * @param scope
     * @return
     */
    public isScopeChecked(scheme: OasSecurityScheme, scope: string): boolean {
        let modelScopes: string[] = this.model[scheme.schemeName()];
        if (modelScopes !== undefined) {
            return modelScopes.indexOf(scope) != -1;
        }
        return false;
    }

    /**
     * Toggles the enabled/checked status of a single scope for a given scheme.
     * @param scheme
     * @param scope
     * @param enable
     */
    public toggleScope(scheme: OasSecurityScheme, scope: string, enable: boolean): void {
        let modelScopes: string[] = this.model[scheme.schemeName()];
        if (modelScopes === undefined) {
            return;
        }
        let idx: number = modelScopes.indexOf(scope);
        if (idx !== -1 && !enable) {
            modelScopes.splice(idx, 1);
        }
        if (idx === -1 && enable) {
            modelScopes.push(scope);
        }
    }

    /**
     * Finds all security schemes defined in the document.
     * @param document
     * @return
     */
    public findSchemes(document: OasDocument): OasSecurityScheme[] {
        let visitor: SecuritySchemeFinder = new SecuritySchemeFinder();
        OasVisitorUtil.visitTree(document, visitor);
        return visitor.schemes();
    }

}

/**
 * Visitor used to find security schemes in a document.
 */
class SecuritySchemeFinder extends OasCombinedVisitorAdapter {

    private _schemes: OasSecurityScheme[] = [];

    public schemes(): OasSecurityScheme[] {
        return this._schemes;
    }

    public visitSecurityScheme(node: OasSecurityScheme): void {
        this._schemes.push(node);
    }

}


class ScopeFinder extends OasCombinedVisitorAdapter {

    private _scopes: ScopeInfo[] = [];

    public scopes(): ScopeInfo[] {
        return this._scopes;
    }

    protected visitOAuthFlow(node: Oas30OAuthFlow): void {
        for (let scope of node.getScopes()) {
            this._scopes.push(new ScopeInfo(scope, node.scopes[scope]));
        }
    }

    public visitScopes(node: Oas20Scopes): void {
        for (let scope of node.scopes()) {
            this._scopes.push(new ScopeInfo(scope, node.getScopeDescription(scope)));
        }
    }

    public visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void { this.visitOAuthFlow(node); }
    public visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void { this.visitOAuthFlow(node); }
    public visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void { this.visitOAuthFlow(node); }
    public visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void { this.visitOAuthFlow(node); }


}