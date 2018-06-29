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

import {Component, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {
    Oas20Document,
    Oas20SecurityDefinitions,
    Oas20SecurityScheme,
    Oas30Document,
    Oas30SecurityScheme,
    OasDocument,
    OasSecurityScheme
} from "oai-ts-core";
import {CommandService} from "../../../_services/command.service";
import {
    createChangePropertyCommand,
    createChangeSecuritySchemeCommand,
    createDeleteSecuritySchemeCommand,
    createNewSecuritySchemeCommand,
    ICommand
} from "oai-ts-commands";
import {
    Scope,
    SecurityScheme20DialogComponent,
    SecurityScheme20EventData
} from "../../dialogs/security-scheme-20.component";
import {SecurityScheme30DialogComponent, SecurityScheme30EventData} from "../../dialogs/security-scheme-30.component";


@Component({
    moduleId: module.id,
    selector: "security-schemes-section",
    templateUrl: "security-schemes-section.component.html",
    encapsulation: ViewEncapsulation.None
})
export class SecuritySchemesSectionComponent {

    @Input() document: OasDocument;

    @ViewChild("securityScheme20Dialog") securitySchemeDialog_20: SecurityScheme20DialogComponent;
    @ViewChild("securityScheme30Dialog") securitySchemeDialog_30: SecurityScheme30DialogComponent;

    constructor(private commandService: CommandService) {}

    /**
     * Opens the security scheme dialog.
     * @param scheme
     */
    public openSecuritySchemeDialog(scheme?: OasSecurityScheme): void {
        if (this.document.is2xDocument()) {
            this.securitySchemeDialog_20.open(scheme as Oas20SecurityScheme);
        } else {
            this.securitySchemeDialog_30.open(scheme as Oas30SecurityScheme);
        }
    }

    /**
     * Returns true if there is at least one security scheme defined.
     * @return
     */
    public hasSecuritySchemes(): boolean {
        return this.securitySchemes().length > 0;
    }

    /**
     * Returns all defined security schemes.
     * @return
     */
    public securitySchemes(): OasSecurityScheme[] {
        if (this.document.is2xDocument()) {
            let secdefs: Oas20SecurityDefinitions = (this.document as Oas20Document).securityDefinitions;
            if (secdefs) {
                return secdefs.securitySchemes().sort( (scheme1, scheme2) => {
                    return scheme1.schemeName().localeCompare(scheme2.schemeName());
                });
            }
            return [];
        } else {
            let doc: Oas30Document = this.document as Oas30Document;
            if (doc.components) {
                let schemes: Oas30SecurityScheme[] = doc.components.getSecuritySchemes();
                return schemes.sort( (scheme1, scheme2) => {
                    return scheme1.schemeName().localeCompare(scheme2.schemeName());
                });
            }
            return [];
        }
    }

    /**
     * Called when the user changes the description of a security scheme in the table of schemes.
     * @param scheme
     * @param description
     */
    public changeSecuritySchemeDescription(scheme: OasSecurityScheme, description: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.document, scheme, "description", description);
        this.commandService.emit(command);
    }

    /**
     * Called when the user adds a new security scheme.
     * @param event
     */
    public addSecurityScheme(event: SecurityScheme20EventData | SecurityScheme30EventData): void {
        if (this.document.is2xDocument()) {
            let evt : SecurityScheme20EventData = event as SecurityScheme20EventData;
            console.info("[MainFormComponent] Adding a security scheme: %s", event.schemeName);
            let scheme: Oas20SecurityScheme = (this.document as Oas20Document).createSecurityDefinitions().createSecurityScheme(event.schemeName);
            scheme.description = event.description;
            scheme.type = event.type;
            // TODO set values in the Oas20SecurityScheme only if necessary based on the type - avoid potential of leaking info from the dialog into the data model
            scheme.name = event.name;
            scheme.in = event.in;
            scheme.flow = evt.flow;
            scheme.authorizationUrl = evt.authorizationUrl;
            scheme.tokenUrl = evt.tokenUrl;
            if (scheme.type === "oauth2") {
                scheme.scopes = scheme.createScopes();
                if (evt.scopes) {
                    for (let s of evt.scopes) {
                        scheme.scopes.addScope(s.name, s.description);
                    }
                }
            }


            let command: ICommand = createNewSecuritySchemeCommand(this.document, scheme);
            this.commandService.emit(command);
        } else {
            console.info("[MainFormComponent] Adding a security scheme: %s", event.schemeName);
            let evt : SecurityScheme30EventData = event as SecurityScheme30EventData;

            let scheme: Oas30SecurityScheme = (this.document as Oas30Document).createComponents().createSecurityScheme(event.schemeName);
            this.copySchemeToModel(evt, scheme);

            let command: ICommand = createNewSecuritySchemeCommand(this.document, scheme);
            this.commandService.emit(command);
        }
    }

    /**
     * Called when the user changes an existing security scheme.
     * @param event
     */
    public changeSecurityScheme(event: SecurityScheme20EventData | SecurityScheme30EventData): void {
        if (this.document.is2xDocument()) {
            let evt : SecurityScheme20EventData = event as SecurityScheme20EventData;
            console.info("[MainFormComponent] Changing a security scheme: %s", event.schemeName);
            let scheme: Oas20SecurityScheme = (this.document as Oas20Document).createSecurityDefinitions().createSecurityScheme(event.schemeName);
            scheme.description = event.description;
            scheme.type = event.type;
            scheme.name = event.name;
            scheme.in = event.in;
            scheme.flow = evt.flow;
            scheme.authorizationUrl = evt.authorizationUrl;
            scheme.tokenUrl = evt.tokenUrl;
            if (scheme.type === "oauth2") {
                if (evt.scopes) {
                    scheme.scopes = scheme.createScopes();
                    for (let s of evt.scopes) {
                        scheme.scopes.addScope(s.name, s.description);
                    }
                }
            }

            let command: ICommand = createChangeSecuritySchemeCommand(this.document, scheme);
            this.commandService.emit(command);
        } else {
            console.info("[MainFormComponent] Changing a security scheme: %s", event.schemeName);
            let evt : SecurityScheme30EventData = event as SecurityScheme30EventData;

            let scheme: Oas30SecurityScheme = (this.document as Oas30Document).createComponents().createSecurityScheme(event.schemeName);
            this.copySchemeToModel(evt, scheme);

            let command: ICommand = createChangeSecuritySchemeCommand(this.document, scheme);
            this.commandService.emit(command);
        }
    }

    /**
     * Deletes a security scheme.
     * @param scheme
     */
    public deleteSecurityScheme(scheme: OasSecurityScheme): void {
        let command: ICommand = createDeleteSecuritySchemeCommand(this.document, scheme.schemeName());
        this.commandService.emit(command);
    }

    /**
     * Converts from array of scopes to scopes object for data model.
     * @param scopes
     */
    private toScopes(scopes: Scope[]): any {
        let rval: any = {};
        scopes.forEach( scope => {
            rval[scope.name] = scope.description;
        });
        return rval;
    }

    /**
     * Copy the event data to the data model.
     * @param event
     * @param scheme
     */
    private copySchemeToModel(event: SecurityScheme30EventData, scheme: Oas30SecurityScheme) {
        scheme.description = event.description;
        scheme.type = event.type;
        if (scheme.type === "http") {
            scheme.scheme = event.scheme;
            if (scheme.scheme === "Bearer") {
                scheme.bearerFormat = event.bearerFormat;
            }
        }
        if (scheme.type === "apiKey") {
            scheme.in = event.in;
            scheme.name = event.name;
        }
        if (scheme.type === "oauth2") {
            scheme.flows = scheme.createOAuthFlows();
            if (event.flows.implicit.enabled) {
                scheme.flows.implicit = scheme.flows.createImplicitOAuthFlow();
                scheme.flows.implicit.authorizationUrl = event.flows.implicit.authorizationUrl;
                scheme.flows.implicit.tokenUrl = event.flows.implicit.tokenUrl;
                scheme.flows.implicit.refreshUrl = event.flows.implicit.refreshUrl;
                scheme.flows.implicit.scopes = this.toScopes(event.flows.implicit.scopes);
            }
            if (event.flows.password.enabled) {
                scheme.flows.password = scheme.flows.createPasswordOAuthFlow();
                scheme.flows.password.authorizationUrl = event.flows.password.authorizationUrl;
                scheme.flows.password.tokenUrl = event.flows.password.tokenUrl;
                scheme.flows.password.refreshUrl = event.flows.password.refreshUrl;
                scheme.flows.password.scopes = this.toScopes(event.flows.password.scopes);
            }
            if (event.flows.clientCredentials.enabled) {
                scheme.flows.clientCredentials = scheme.flows.createClientCredentialsOAuthFlow();
                scheme.flows.clientCredentials.authorizationUrl = event.flows.clientCredentials.authorizationUrl;
                scheme.flows.clientCredentials.tokenUrl = event.flows.clientCredentials.tokenUrl;
                scheme.flows.clientCredentials.refreshUrl = event.flows.clientCredentials.refreshUrl;
                scheme.flows.clientCredentials.scopes = this.toScopes(event.flows.clientCredentials.scopes);
            }
            if (event.flows.authorizationCode.enabled) {
                scheme.flows.authorizationCode = scheme.flows.createAuthorizationCodeOAuthFlow();
                scheme.flows.authorizationCode.authorizationUrl = event.flows.authorizationCode.authorizationUrl;
                scheme.flows.authorizationCode.tokenUrl = event.flows.authorizationCode.tokenUrl;
                scheme.flows.authorizationCode.refreshUrl = event.flows.authorizationCode.refreshUrl;
                scheme.flows.authorizationCode.scopes = this.toScopes(event.flows.authorizationCode.scopes);
            }
        }
        if (scheme.type === "openIdConnect") {
            scheme.openIdConnectUrl = event.openIdConnectUrl;
        }
    }

}
