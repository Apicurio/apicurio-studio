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

import {Component, ViewEncapsulation} from "@angular/core";
import {
    Oas20Scopes,
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow,
    Oas30ImplicitOAuthFlow,
    Oas30OAuthFlow,
    Oas30PasswordOAuthFlow,
    OasCombinedVisitorAdapter,
    OasDocument,
    OasOperation,
    OasSecurityRequirement,
    OasSecurityScheme,
    OasVisitorUtil
} from "oai-ts-core";
import {EntityEditor, EntityEditorEvent, IEntityEditorHandler} from "./entity-editor.component";
import {SelectionService} from "../../_services/selection.service";
import {ModelUtils} from "../../_util/model.util";


export interface SecurityRequirementData {
    [key: string]: string[];
}

export interface SecurityRequirementEditorEvent extends EntityEditorEvent<OasSecurityRequirement> {
    data: SecurityRequirementData;
}

export interface ScopeInfo {
    name: string;
    description: string;
}

export interface ISecurityRequirementEditorHandler extends IEntityEditorHandler<OasSecurityRequirement, SecurityRequirementEditorEvent> {
    onSave(event: SecurityRequirementEditorEvent): void;
    onCancel(event: SecurityRequirementEditorEvent): void;
}


@Component({
    moduleId: module.id,
    selector: "security-requirement-editor",
    templateUrl: "security-requirement-editor.component.html",
    styleUrls: ["security-requirement-editor.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class SecurityRequirementEditorComponent extends EntityEditor<OasSecurityRequirement, SecurityRequirementEditorEvent> {

    public _expanded: any;

    protected model: SecurityRequirementData;
    protected anonEnabled: boolean = false;
    protected schemes: OasSecurityScheme[];
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
    public open(handler: ISecurityRequirementEditorHandler, context: OasDocument | OasOperation, requirement?: OasSecurityRequirement): void {
        this._expanded = {};
        this.model = {};
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
    public initializeModelFromEntity(entity: OasSecurityRequirement): void {
        let names: string[] = entity.securityRequirementNames();
        if (names.length === 0) {
            this.anonEnabled = true;
        } else {
            names.forEach( name => {
                this.model[name] = entity.scopes(name);
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
            // any other security scheme is mutually exclusive with anonymous access
            this.anonEnabled = false;
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
    public toggleScope(scheme: OasSecurityScheme, scope: string, enable?: boolean): void {
        let checked: boolean = enable;
        if (enable === undefined) {
            checked = !this.isScopeChecked(scheme, scope);
        }

        let modelScopes: string[] = this.model[scheme.schemeName()];
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


/**
 * Used to get an array of available scopes so that the user can choose which
 * of them are required.
 */
class ScopeFinder extends OasCombinedVisitorAdapter {

    private _scopes: ScopeInfo[] = [];
    private _scopeNames: string[] = [];

    public scopes(): ScopeInfo[] {
        return this._scopes;
    }

    protected visitOAuthFlow(node: Oas30OAuthFlow): void {
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
        for (let scope of node.scopes()) {
            if (this._scopeNames.indexOf(scope) === -1) {
                this._scopes.push({
                    name: scope,
                    description: node.getScopeDescription(scope)
                });
                this._scopeNames.push(scope);
            }
        }
    }

    public visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void { this.visitOAuthFlow(node); }
    public visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void { this.visitOAuthFlow(node); }
    public visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void { this.visitOAuthFlow(node); }
    public visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void { this.visitOAuthFlow(node); }

}
