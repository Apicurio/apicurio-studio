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

import {ICommand, AbstractCommand} from "../commands.manager";
import {OasDocument, Oas20Document, Oas20SecurityScheme} from "oai-ts-core";

/**
 * A command used to modify the license information of a document.
 */
export class ChangeSecuritySchemeCommand extends AbstractCommand implements ICommand {

    private _scheme: Oas20SecurityScheme;

    private _oldScheme: Oas20SecurityScheme;

    constructor(scheme: Oas20SecurityScheme) {
        super();
        this._scheme = scheme;
    }

    /**
     * Modifies the security scheme.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeSecuritySchemeCommand] Executing.");
        this._oldScheme  = null;

        let doc: Oas20Document = <Oas20Document> document;
        if (this.isNullOrUndefined(doc.securityDefinitions)) {
            return;
        }

        let scheme: Oas20SecurityScheme = doc.securityDefinitions.securityScheme(this._scheme.schemeName());
        if (this.isNullOrUndefined(scheme)) {
            return;
        }
        // Back up the old scheme info (for undo)
        this._oldScheme = doc.securityDefinitions.createSecurityScheme(this._scheme.schemeName());
        this._oldScheme.description = scheme.description;
        this._oldScheme.type = scheme.type;
        this._oldScheme.name = scheme.name;
        this._oldScheme.tokenUrl = scheme.tokenUrl;
        this._oldScheme.authorizationUrl = scheme.authorizationUrl;
        this._oldScheme.flow = scheme.flow;
        this._oldScheme.in = scheme.in;
        this._oldScheme.scopes = scheme.scopes;

        // Replace with new scheme info
        scheme.description = this._scheme.description;
        scheme.type = this._scheme.type;
        scheme.name = this._scheme.name;
        scheme.tokenUrl = this._scheme.tokenUrl;
        scheme.authorizationUrl = this._scheme.authorizationUrl;
        scheme.flow = this._scheme.flow;
        scheme.in = this._scheme.in;
        scheme.scopes = scheme.createScopes();
        if (this._scheme.scopes) {
            this._scheme.scopes.scopes().forEach( name => {
                scheme.scopes.addScope(name, this._scheme.scopes.getScopeDescription(name));
            });
        }
    }

    /**
     * Resets the security scheme back to the original value.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeSecuritySchemeCommand] Reverting.");
        let doc: Oas20Document = <Oas20Document> document;
        if (this.isNullOrUndefined(this._oldScheme)) {
            return;
        }

        let scheme: Oas20SecurityScheme = doc.securityDefinitions.securityScheme(this._scheme.schemeName());
        if (this.isNullOrUndefined(scheme)) {
            return;
        }

        scheme.description = this._oldScheme.description;
        scheme.type = this._oldScheme.type;
        scheme.name = this._oldScheme.name;
        scheme.tokenUrl = this._oldScheme.tokenUrl;
        scheme.authorizationUrl = this._oldScheme.authorizationUrl;
        scheme.flow = this._oldScheme.flow;
        scheme.in = this._oldScheme.in;
        scheme.scopes = scheme.createScopes();
        if (this._oldScheme.scopes) {
            this._oldScheme.scopes.scopes().forEach( name => {
                scheme.scopes.addScope(name, this._oldScheme.scopes.getScopeDescription(name));
            });
        }
    }

}
