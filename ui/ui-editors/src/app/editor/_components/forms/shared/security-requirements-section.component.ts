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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from "@angular/core";
import {
    CommandFactory,
    ICommand,
    Library,
    OasDocument,
    OasOperation,
    OasSecurityRequirement
} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {EditorsService} from "../../../_services/editors.service";
import {
    ISecurityRequirementEditorHandler,
    SecurityRequirementEditorComponent,
    SecurityRequirementEditorEvent
} from "../../editors/security-requirement-editor.component";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {ModelUtils} from "../../../_util/model.util";


@Component({
    selector: "security-requirements-section",
    templateUrl: "security-requirements-section.component.html",
    styleUrls: [ "security-requirements-section.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityRequirementsSectionComponent extends AbstractBaseComponent {

    @Input() parent: OasDocument | OasOperation;
    @Input() global: boolean;

    public showSectionBody: boolean;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private editorsService: EditorsService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.showSectionBody = this.global;
    }

    public contextHelp(): string {
        if (this.global) {
            return `
                Use this section to configure which of the Security Schemes are needed in order to invoke operations
                in the API.  You can add multiple security requirements, resulting in consumers being allowed to
                provided any one of them.  Each security requirement consists of one or more
                Security Scheme and (in the case of certain security types like OAuth) a list of the scopes the
                consumer must have.`;
        } else {
            return `
                Use this section to configure which of the Security Schemes are needed in order to invoke this
                specific operation.  You can add multiple security requirements, resulting in consumers being allowed to
                provided any one of them.  Each security requirement consists of one or more
                Security Scheme and (in the case of certain security types like OAuth) a list of the scopes the
                consumer must have.`;
        }
    }

    /**
     * Called when the user adds a new security requirement.
     * @param event
     */
    public addSecurityRequirement(event: SecurityRequirementEditorEvent): void {
        console.info("[SecurityRequirementsSectionComponent] Adding security requirement: ", event);
        let requirement: OasSecurityRequirement = this.parent.createSecurityRequirement();
        Library.readNode(event.data, requirement);
        let command: ICommand = CommandFactory.createAddSecurityRequirementCommand(this.parent, requirement);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes an existing Security Requirement.
     * @param event
     */
    public changeSecurityRequirement(event: SecurityRequirementEditorEvent): void {
        let newRequirement: OasSecurityRequirement = this.parent.createSecurityRequirement();
        Library.readNode(event.data, newRequirement);
        let command: ICommand = CommandFactory.createReplaceSecurityRequirementCommand(event.entity, newRequirement);
        this.commandService.emit(command);
    }

    /**
     * Deletes a security requirement.
     * @param requirement
     */
    public deleteSecurityRequirement(requirement: OasSecurityRequirement): void {
        let command: ICommand = CommandFactory.createDeleteSecurityRequirementCommand(this.parent, requirement);
        this.commandService.emit(command);
    }

    /**
     * Returns a summary of the requirement.
     * @param requirement
     */
    public securityRequirementSummary(requirement: OasSecurityRequirement): string {
        return requirement.getSecurityRequirementNames().join(", ");
    }

    /**
     * Opens the security requirement editor for adding or editing a security requirement.
     * @param requirement
     */
    public openSecurityRequirementEditor(requirement?: OasSecurityRequirement): void {
        let editor: SecurityRequirementEditorComponent = this.editorsService.getSecurityRequirementEditor();
        let handler: ISecurityRequirementEditorHandler = {
            onSave: (event: SecurityRequirementEditorEvent) => {
                if (requirement) {
                    this.changeSecurityRequirement(event);
                } else {
                    this.addSecurityRequirement(event);
                }
            },
            onCancel: () => {}
        };
        editor.open(handler, this.parent, requirement);
    }

    /**
     * Returns true if there is at least one security requirement defined.
     */
    public hasSecurityRequirements(): boolean {
        return this.securityRequirements().length > 0;
    }

    /**
     * Returns all defined security requirements.
     */
    public securityRequirements(): OasSecurityRequirement[] {
        return this.parent.security ? this.parent.security : [];
    }

    public securityRequirementsPath(): string {
        if (this.parent.ownerDocument() === this.parent) {
            return "/security";
        } else {
            return ModelUtils.nodeToPath(this.parent) + "/security";
        }
    }

    /**
     * Returns the set of scopes (if any) needed for a particular requirement+scheme name.
     * @param requirement
     * @param schemeName
     */
    public requirementScopes(requirement: OasSecurityRequirement, schemeName: string): string {
        let scopes: any[] = requirement.getScopes(schemeName);
        if (scopes && scopes.length > 0) {
            return scopes.join(", ");
        } else {
            return "";
        }
    }

    /**
     * Returns true if the given security requirement represents "anonymous" access (no security).
     * @param requirement
     */
    public isAnonSecurity(requirement: OasSecurityRequirement): boolean {
        let schemes: string[] = requirement.getSecurityRequirementNames();
        return !schemes || schemes.length === 0;
    }

    /**
     * Called when the user clicks the trash icon to delete all the servers.
     */
    public deleteAllSecurityRequirements(): void {
        let command: ICommand = CommandFactory.createDeleteAllSecurityRequirementsCommand(this.parent);
        this.commandService.emit(command);
    }

}
