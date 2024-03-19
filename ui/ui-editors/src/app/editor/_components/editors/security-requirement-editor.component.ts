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

import {Component, ViewEncapsulation} from "@angular/core";
import {
    Aai20AuthorizationCodeOAuthFlow,
    Aai20ClientCredentialsOAuthFlow,
    Aai20ImplicitOAuthFlow,
    Aai20PasswordOAuthFlow,
    AaiServer,
    CombinedVisitorAdapter,
    Document,
    Oas20Scopes,
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow,
    Oas30ImplicitOAuthFlow,
    Oas30PasswordOAuthFlow,
    OasDocument,
    OasOperation,
    OAuthFlow,
    SecurityRequirement,
    SecurityScheme,
    TraverserDirection,
    VisitorUtil
} from "@apicurio/data-models";
import {EntityEditor, EntityEditorEvent, IEntityEditorHandler} from "./entity-editor.component";
import {SelectionService} from "../../_services/selection.service";
import {ModelUtils} from "../../_util/model.util";


export interface SecurityRequirementData {
    [key: string]: string[];
}

export interface SecurityRequirementEditorEvent extends EntityEditorEvent<SecurityRequirement> {
    data: SecurityRequirementData;
}

export interface ScopeInfo {
    name: string;
    description: string;
}

export interface ISecurityRequirementEditorHandler extends IEntityEditorHandler<SecurityRequirement, SecurityRequirementEditorEvent> {
    onSave(event: SecurityRequirementEditorEvent): void;
    onCancel(event: SecurityRequirementEditorEvent): void;
}


@Component({
    selector: "security-requirement-editor",
    templateUrl: "security-requirement-editor.component.html",
    styleUrls: ["security-requirement-editor.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class SecurityRequirementEditorComponent extends EntityEditor<SecurityRequirement, SecurityRequirementEditorEvent> {

    public _expanded: any;

    protected model: SecurityRequirementData;
    anonEnabled: boolean = false;
    schemes: SecurityScheme[];
    protected scopeCache: any;

    /**
     * C'tor.
     * @param selectionService
     */
    constructor(protected selectionService: SelectionService) {
        super();
    }

    /**
     * Called to open the editor.
     * @param handler
     * @param context
     * @param server
     */
    public open(handler: ISecurityRequirementEditorHandler, context: OasDocument | OasOperation | AaiServer, requirement?: SecurityRequirement): void {
        this._expanded = {};
        this.model = {};
        this.anonEnabled = false;
        this.scopeCache = {};
        this.schemes = this.findSchemes(context.ownerDocument());
        super.open(handler, context, requirement);

        if (requirement) {
            this.selectionService.simpleSelect(ModelUtils.nodeToPath(requirement));
        } else {
            this.selectionService.simpleSelect(ModelUtils.nodeToPath(context) + "/security");
        }
    }

    /**
     * Initializes the editor's data model from a provided entity.
     * @param entity
     */
    public initializeModelFromEntity(entity: SecurityRequirement): void {
        let names: string[] = entity.getSecurityRequirementNames();
        if (names.length === 0) {
            this.anonEnabled = true;
        } else {
            names.forEach( name => {
                this.model[name] = entity.getScopes(name);
            });
        }
    }

    /**
     * Initializes the editor's data model to an empty state.
     */
    public initializeModel(): void {
        this.anonEnabled = false;
        this.model = {};
    }

    /**
     * Creates an entity event specific to this entity editor.
     */
    public entityEvent(): SecurityRequirementEditorEvent {
        let event: SecurityRequirementEditorEvent = {
            entity: this.entity,
            data: this.model
        };
        return event;
    }

    /**
     * Enables/disable anonymous access.
     * @param isAnon
     */
    public setAnon(isAnon: boolean): void {
        this.anonEnabled = isAnon;
        if (isAnon) {
            // anonymous access is mutually exclusive with all other security types
            this.model = {};
        }
    }

    /**
     * Returns true if the editor is currently valid.
     */
    public isValid(): boolean {
        for (let n in this.model) {
            return true;
        }
        return this.anonEnabled;
    }

    /**
     * Returns true if the given scheme is enabled.
     * @param scheme
     * @return
     */
    public isChecked(scheme: SecurityScheme): boolean {
        for (let n in this.model) {
            if (n === scheme.getSchemeName()) {
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
    public canExpand(scheme: SecurityScheme): boolean {
        return scheme.type === "oauth2" || scheme.type === "openIdConnect";
    }

    /**
     * Returns true if the given scheme is expanded.
     * @param scheme
     * @return
     */
    public isExpanded(scheme: SecurityScheme): boolean {
        return this._expanded[scheme.getSchemeName()] ? true : false;
    }

    /**
     * Called to toggle the expansion of a scheme.
     * @param scheme
     */
    public toggleExpansion(scheme: SecurityScheme): void {
        let pval: boolean = this._expanded[scheme.getSchemeName()];
        if (pval) {
            this._expanded[scheme.getSchemeName()] = false;
        } else {
            this._expanded[scheme.getSchemeName()] = true;
        }
    }

    /**
     * Called to expand a scheme.
     * @param scheme
     */
    public expand(scheme: SecurityScheme): void {
        this._expanded[scheme.getSchemeName()] = true;
    }

    /**
     * Called to collapse a scheme.
     * @param scheme
     */
    public collapse(scheme: SecurityScheme): void {
        this._expanded[scheme.getSchemeName()] = false;
    }

    /**
     * Adds/removes the security scheme from the model.
     * @param scheme
     */
    public toggleSecurityScheme(scheme: SecurityScheme, enable?: boolean): void {
        if (enable === undefined) {
            enable = !this.isChecked(scheme);
        }
        if (enable) {
            // any other security scheme is mutually exclusive with anonymous access
            this.anonEnabled = false;
            this.model[scheme.getSchemeName()] = [];
            if (this.canExpand(scheme)) {
                this.expand(scheme);
            }
        } else {
            delete this.model[scheme.getSchemeName()];
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
    public scopes(scheme: SecurityScheme): ScopeInfo[] {
        if (this.canExpand(scheme)) {
            if (this.scopeCache[scheme.getSchemeName()]) {
                return this.scopeCache[scheme.getSchemeName()];
            }
            let visitor: ScopeFinder = new ScopeFinder();
            VisitorUtil.visitTree(scheme, visitor, TraverserDirection.down);
            let rval: ScopeInfo[] = visitor.scopes();
            this.scopeCache[scheme.getSchemeName()] = rval;
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
    public isScopeChecked(scheme: SecurityScheme, scope: string): boolean {
        let modelScopes: string[] = this.model[scheme.getSchemeName()];
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
    public toggleScope(scheme: SecurityScheme, scope: string, enable?: boolean): void {
        let checked: boolean = enable;
        if (enable === undefined) {
            checked = !this.isScopeChecked(scheme, scope);
        }

        let modelScopes: string[] = this.model[scheme.getSchemeName()];
        if (modelScopes === undefined) {
            return;
        }
        let idx: number = modelScopes.indexOf(scope);
        if (idx !== -1 && !checked) {
            modelScopes.splice(idx, 1);
        }
        if (idx === -1 && checked) {
            modelScopes.push(scope);
        }
    }

    /**
     * Finds all security schemes defined in the document.
     * @param document
     * @return
     */
    public findSchemes(document: Document): SecurityScheme[] {
        let visitor: SecuritySchemeFinder = new SecuritySchemeFinder();
        VisitorUtil.visitTree(document, visitor, TraverserDirection.down);
        return visitor.schemes();
    }

}

/**
 * Visitor used to find security schemes in a document.
 */
class SecuritySchemeFinder extends CombinedVisitorAdapter {

    private _schemes: SecurityScheme[] = [];

    public schemes(): SecurityScheme[] {
        return this._schemes;
    }

    public visitSecurityScheme(node: SecurityScheme): void {
        this._schemes.push(node);
    }

}


/**
 * Used to get an array of available scopes so that the user can choose which
 * of them are required.
 */
class ScopeFinder extends CombinedVisitorAdapter {

    private _scopes: ScopeInfo[] = [];
    private _scopeNames: string[] = [];

    public scopes(): ScopeInfo[] {
        return this._scopes;
    }

    protected visitOAuthFlow(node: OAuthFlow): void {
        for (let scope of node.getScopes()) {
            if (this._scopeNames.indexOf(scope) === -1) {
                this._scopes.push({
                    name: scope,
                    description: node.scopes[scope]
                });
                this._scopeNames.push(scope);
            }
        }
    }

    public visitScopes(node: Oas20Scopes): void {
        for (let scope of node.getScopeNames()) {
            if (this._scopeNames.indexOf(scope) === -1) {
                this._scopes.push({
                    name: scope,
                    description: node.getScopeDescription(scope)
                });
                this._scopeNames.push(scope);
            }
        }
    }

    public visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow | Aai20ImplicitOAuthFlow): void { this.visitOAuthFlow(node); }
    public visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow | Aai20PasswordOAuthFlow): void { this.visitOAuthFlow(node); }
    public visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow | Aai20ClientCredentialsOAuthFlow): void { this.visitOAuthFlow(node); }
    public visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow | Aai20AuthorizationCodeOAuthFlow): void { this.visitOAuthFlow(node); }

}
