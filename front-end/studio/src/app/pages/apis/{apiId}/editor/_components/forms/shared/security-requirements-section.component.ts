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
import {OasDocument, OasLibraryUtils, OasOperation, OasSecurityRequirement} from "oai-ts-core";
import {CommandService} from "../../../_services/command.service";
import {
    ChangeSecurityRequirementEvent,
    SecurityRequirementDialogComponent,
    SecurityRequirementEventData
} from "../../dialogs/security-requirement.component";
import {
    createAddSecurityRequirementCommand,
    createDeleteSecurityRequirementCommand,
    createReplaceSecurityRequirementCommand,
    ICommand
} from "oai-ts-commands";


@Component({
    moduleId: module.id,
    selector: "security-requirements-section",
    templateUrl: "security-requirements-section.component.html",
    encapsulation: ViewEncapsulation.None
})
export class SecurityRequirementsSectionComponent {

    @Input() parent: OasDocument | OasOperation;
    @Input() global: boolean;

    @ViewChild("securityRequirementDialog") securityRequirementDialog: SecurityRequirementDialogComponent;

    constructor(private commandService: CommandService) {}

    /**
     * Called when the user adds a new security requirement.
     * @param event
     */
    public addSecurityRequirement(event: SecurityRequirementEventData): void {
        let requirement: OasSecurityRequirement = this.parent.createSecurityRequirement();
        let library: OasLibraryUtils = new OasLibraryUtils();
        library.readNode(event, requirement);
        let command: ICommand = createAddSecurityRequirementCommand(this.parent.ownerDocument(), this.parent, requirement);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes an existing Security Requirement.
     * @param event
     */
    public changeSecurityRequirement(event: ChangeSecurityRequirementEvent): void {
        let newRequirement: OasSecurityRequirement = this.parent.createSecurityRequirement();
        let library: OasLibraryUtils = new OasLibraryUtils();
        library.readNode(event.data, newRequirement);
        let command: ICommand = createReplaceSecurityRequirementCommand(this.parent.ownerDocument(), event.requirement, newRequirement);
        this.commandService.emit(command);
    }

    /**
     * Deletes a security requirement.
     * @param requirement
     */
    public deleteSecurityRequirement(requirement: OasSecurityRequirement): void {
        let command: ICommand = createDeleteSecurityRequirementCommand(this.parent.ownerDocument(), this.parent, requirement);
        this.commandService.emit(command);
    }

    /**
     * Returns a summary of the requirement.
     * @param requirement
     * @return
     */
    public securityRequirementSummary(requirement: OasSecurityRequirement): string {
        return requirement.securityRequirementNames().join(", ");
    }

    /**
     * Opens the security requirement dialog for adding or editing a security requirement.
     * @param requirement
     */
    public openSecurityRequirementDialog(requirement?: OasSecurityRequirement): void {
        this.securityRequirementDialog.open(this.parent.ownerDocument(), requirement);
    }

    /**
     * Returns true if there is at least one security requirement defined.
     * @return
     */
    public hasSecurityRequirements(): boolean {
        return this.securityRequirements().length > 0;
    }

    /**
     * Returns all defined security requirements.
     * @return
     */
    public securityRequirements(): OasSecurityRequirement[] {
        return this.parent.security ? this.parent.security : [];
    }

}
