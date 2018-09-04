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
import {
    Oas20Scopes,
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow,
    Oas30Document,
    Oas30ImplicitOAuthFlow,
    Oas30OAuthFlow,
    Oas30PasswordOAuthFlow,
    Oas30PathItem,
    OasCombinedVisitorAdapter,
    OasDocument,
    OasLibraryUtils,
    OasOperation,
    OasSecurityRequirement,
    OasSecurityScheme,
    OasVisitorUtil
} from "oai-ts-core";


export interface SecurityRequirementData {
    [key: string]: string[];
}

export class SecurityRequirementEvent {
    requirement: OasSecurityRequirement;
    data: SecurityRequirementData;
}

export class ScopeInfo {
    name: string;
    description: string;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
}

export interface ISecurityRequirementEditorHandler {

    onSave(data: SecurityRequirementEvent): void;
    onCancel(): void;

}


@Component({
    moduleId: module.id,
    selector: "security-requirement-editor",
    templateUrl: "security-requirement-editor.component.html",
    styleUrls: ["security-requirement-editor.component.css"]
})
export class SecurityRequirementEditorComponent {

    @Output() onSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();

    public _library: OasLibraryUtils = new OasLibraryUtils();
    public _isOpen: boolean = false;
    public _mode: string = "create";
    protected _expanded: any;
    protected _requirement: OasSecurityRequirement;

    protected handler: ISecurityRequirementEditorHandler;
    protected context: OasDocument | OasOperation;
    public contextIs: string = "document";
    protected model: SecurityRequirementData;
    protected _expandedContext: any = {
        document: null,
        pathItem: null,
        operation: null
    };
    protected schemes: OasSecurityScheme[];
    protected scopeCache: any;

    /**
     * Called to open the editor.
     * @param handler
     * @param context
     * @param server
     */
    public open(handler: ISecurityRequirementEditorHandler, context: OasDocument | OasOperation, requirement?: OasSecurityRequirement): void {
        this.context = context;
        this.handler = handler;
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
            this._mode = "create";
        }
        if (context) {
            this.expandContext(context);
        }
        this.schemes = this.findSchemes(context.ownerDocument());
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
        let event: SecurityRequirementEvent = new SecurityRequirementEvent();
        event.requirement = this._requirement;
        event.data = this.model;
        this.close();
        this.handler.onSave(event);
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
        for (let n in this.model) {
            return true;
        }
        return false;
    }

    /**
     * Figures out what the context is based on what is passed to it.
     * @param context
     */
    public expandContext(context: OasDocument | OasOperation): void {
        if (context['_method']) {
            this.contextIs = "operation";
            this._expandedContext.operation = context as OasOperation;
            this._expandedContext.pathItem = context.parent() as Oas30PathItem;
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
    public operation(): OasOperation {
        return this._expandedContext.operation;
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
