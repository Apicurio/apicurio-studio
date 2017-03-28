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
import {
    OasDocument, Oas20Document,
    Oas20SecurityScheme
} from "oai-ts-core";

/**
 * A command used to create a new definition in a document.
 */
export class NewSecuritySchemeCommand extends AbstractCommand implements ICommand {

    private _scheme: Oas20SecurityScheme;
    private _schemeExisted: boolean;
    private _nullSecurityDefinitions: boolean;

    constructor(scheme: Oas20SecurityScheme) {
        super();
        this._scheme = scheme;
    }

    /**
     * Adds the new security scheme to the document.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[NewSecuritySchemeCommand] Executing.");
        let doc: Oas20Document = <Oas20Document> document;
        if (this.isNullOrUndefined(doc.securityDefinitions)) {
            doc.securityDefinitions = doc.createSecurityDefinitions();
            this._nullSecurityDefinitions = true;
        }

        if (this.isNullOrUndefined(doc.securityDefinitions.securityScheme(this._scheme.schemeName()))) {
            let scheme: Oas20SecurityScheme = doc.securityDefinitions.createSecurityScheme(this._scheme.schemeName());
            scheme.description = this._scheme.description;
            scheme.type = this._scheme.type;
            scheme.name = this._scheme.name;
            scheme.tokenUrl = this._scheme.tokenUrl;
            scheme.authorizationUrl = this._scheme.authorizationUrl;
            scheme.flow = this._scheme.flow;
            scheme.in = this._scheme.in;
            scheme.scopes = this._scheme.scopes;
            doc.securityDefinitions.addSecurityScheme(scheme.schemeName(), scheme);

            this._schemeExisted = false;
        } else {
            this._schemeExisted = true;
        }
    }

    /**
     * Removes the security scheme.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[NewSecuritySchemeCommand] Reverting.");
        if (this._schemeExisted) {
            return;
        }
        let doc: Oas20Document = <Oas20Document> document;
        if (this._nullSecurityDefinitions) {
            doc.securityDefinitions = null;
        } else {
            doc.securityDefinitions.removeSecurityScheme(this._scheme.schemeName());
        }
    }
}
