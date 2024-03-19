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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {
    Aai20NodeFactory,
    Aai20SecurityScheme,
    AaiDocument, AaiSecurityScheme,
    CombinedVisitorAdapter,
    CommandFactory,
    ICommand,
    Library,
    SecurityScheme,
    TraverserDirection,
    VisitorUtil
} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {EditorsService} from "../../../_services/editors.service";
import {
    ISecuritySchemeEditorHandler,
    SecuritySchemeAai20Data,
    SecuritySchemeEditorComponent,
    SecuritySchemeEditorEvent
} from "../../editors/security-scheme-editor.component";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {Scope} from "../../../_models/scope.model";
import {RenameEntityDialogComponent, RenameEntityEvent} from "../../dialogs/rename-entity.component";


@Component({
    selector: "aaisecurity-schemes-section",
    templateUrl: "security-schemes-section.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AaiSecuritySchemesSectionComponent extends AbstractBaseComponent {

    @Input() document: AaiDocument;

    @ViewChild("renameDialog", { static: true }) renameDialog: RenameEntityDialogComponent;

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param commandService
     * @param editors
     * @param selectionService
     */
    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private editors: EditorsService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    /**
     * Opens the security scheme dialog.
     * @param scheme
     */
    public openSecuritySchemeModal(scheme?: SecurityScheme): void {
        let editor: SecuritySchemeEditorComponent = this.editors.getSecuritySchemeEditor();
        let handler: ISecuritySchemeEditorHandler = {
            onSave: (event: SecuritySchemeEditorEvent) => {
                if (!scheme) {
                    this.addSecurityScheme(event.data as SecuritySchemeAai20Data);
                } else {
                    this.changeSecurityScheme(event.data as SecuritySchemeAai20Data);
                }
            },
            onCancel: () => {}
        };
        editor.open(handler, this.document, scheme);
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
    public securitySchemes(): SecurityScheme[] {
            if (this.document.components) {
                let schemes: AaiSecurityScheme[] = this.document.components.getSecuritySchemesList();
                return schemes.sort( (scheme1, scheme2) => {
                    return scheme1.getSchemeName().localeCompare(scheme2.getSchemeName());
                });
            }
            return [];
    }

    /**
     * Node path that is the base for all security schemes.
     */
    public securitySchemesPath(): string {
        return "/components/securitySchemes";
    }

    /**
     * Called when the user adds a new security scheme.
     * @param event
     */
    public addSecurityScheme(event: SecuritySchemeAai20Data): void {
        console.info("[AaiSecuritySchemesSectionComponent] Adding a security scheme: %s", event.schemeName);

        let scheme: Aai20SecurityScheme = new Aai20NodeFactory().createSecurityScheme(this.document.createComponents(), event.schemeName);
        this.copySchemeToModel(event, scheme);

        let command: ICommand = CommandFactory.createNewSecuritySchemeCommand(this.document.getDocumentType(), scheme);
        this.commandService.emit(command);
        let path = Library.createNodePath(scheme);
        this.selectionService.select(path.toString());
    }

    /**
     * Called when the user changes an existing security scheme.
     * @param event
     */
    public changeSecurityScheme(event: SecuritySchemeAai20Data): void {
        console.info("[AaiSecuritySchemesSectionComponent] Changing a security scheme: %s", event.schemeName);

        let scheme: Aai20SecurityScheme = new Aai20NodeFactory().createSecurityScheme(this.document.components, event.schemeName);
        this.copySchemeToModel(event, scheme);

        let command: ICommand = CommandFactory.createChangeSecuritySchemeCommand(this.document.getDocumentType(), scheme);
        this.commandService.emit(command);
    }

    /**
     * Deletes a security scheme.
     * @param scheme
     */
    public deleteSecurityScheme(scheme: SecurityScheme): void {
        let command: ICommand = CommandFactory.createDeleteSecuritySchemeCommand(this.document.getDocumentType(), scheme.getSchemeName());
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
    private copySchemeToModel(event: SecuritySchemeAai20Data, scheme: Aai20SecurityScheme) {
        scheme.description = event.description;
        scheme.type = event.type;
        if (scheme.type === "http") {
            scheme.scheme = event.scheme;
            if (scheme.scheme === "Bearer") {
                scheme.bearerFormat = event.bearerFormat;
            }
        }
        if (scheme.type === "httpApiKey") {
            scheme.in = event.in;
            scheme.name = event.name;
        }
        if (scheme.type === "apiKey") {
            scheme.in = event.in;
        }
        if (scheme.type === "oauth2") {
            scheme.flows = new Aai20NodeFactory().createOAuthFlows(scheme);
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

    /**
     * Called when the user clicks the trash icon to delete all the servers.
     */
    public deleteAllSecuritySchemes(): void {
        let command: ICommand = CommandFactory.createDeleteAllSecuritySchemesCommand();
        this.commandService.emit(command);
    }

    /**
     * Opens the rename security scheme dialog.
     * @param scheme
     */
    public openRenameDialog(scheme: SecurityScheme): void {
        let schemeNames: string[] = [];
        VisitorUtil.visitTree(scheme.ownerDocument(), new class extends CombinedVisitorAdapter {
            public visitSecurityScheme(node: SecurityScheme): void {
                schemeNames.push(node.getSchemeName());
            }
        }, TraverserDirection.down);
        this.renameDialog.open(scheme, scheme.getSchemeName(), newName => {
            return schemeNames.indexOf(newName) !== -1;
        });
    }

    /**
     * Renames the security scheme.
     * @param event
     */
    public rename(event: RenameEntityEvent): void {
        let scheme: SecurityScheme = <any>event.entity;
        let command: ICommand = CommandFactory.createRenameSecuritySchemeCommand(scheme.getSchemeName(), event.newName);
        this.commandService.emit(command);
    }

}
