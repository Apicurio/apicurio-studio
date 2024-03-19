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
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation
} from "@angular/core";
import {
    Aai20NodeFactory, AaiSecurityRequirement,
    AaiServer,
    CommandFactory,
    ICommand,
    Library,
    SecurityRequirement
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
    selector: "aaisecurity-requirement-row",
    templateUrl: "aaisecurity-requirement-row.component.html",
    styleUrls: [ "security-requirements-section.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AaiSecurityRequirementRowComponent extends AbstractBaseComponent {

    @Input() parent: AaiServer;
    @Input() global: boolean;
    @Input() item: AaiSecurityRequirement;

    @Output() onEdit: EventEmitter<SecurityRequirementEditorEvent> = new EventEmitter<SecurityRequirementEditorEvent>();
    @Output() onDelete: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private editorsService: EditorsService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public contextHelp(): string {
        return `
            Use this section to configure which of the Security Schemes are needed in order to use this
            specific server.  You can add multiple security requirements, resulting in consumers being allowed to
            provided any one of them.  Each security requirement consists of one or more
            Security Scheme and (in the case of certain security types like OAuth) a list of the scopes the
            consumer must have.`;
    }

    /**
     * Called when the user adds a new security requirement.
     * @param event
     */
    public addSecurityRequirement(event: SecurityRequirementEditorEvent): void {
        console.info("[SecurityRequirementsSectionComponent] Adding security requirement: ", event);
        new Aai20NodeFactory().createSecurityRequirement(this.parent)
        let requirement: SecurityRequirement = this.parent.createSecurityRequirement();
        let command: ICommand = CommandFactory.createAddSecurityRequirementCommand(this.parent, requirement);
        Library.readNode(event.data, requirement);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes an existing Security Requirement.
     * @param event
     */
    public changeSecurityRequirement(event: SecurityRequirementEditorEvent): void {
        let newRequirement: SecurityRequirement = this.parent.createSecurityRequirement();
        Library.readNode(event.data, newRequirement);
        let command: ICommand = CommandFactory.createReplaceSecurityRequirementCommand(event.entity, newRequirement);
        this.commandService.emit(command);
    }

    /**
     * Deletes a security requirement.
     * @param requirement
     */
    public deleteSecurityRequirement(requirement: SecurityRequirement): void {
        let command: ICommand = CommandFactory.createDeleteSecurityRequirementCommand(this.parent, requirement);
        this.commandService.emit(command);
    }

    /**
     * Returns a summary of the requirement.
     * @param requirement
     */
    public securityRequirementSummary(requirement: SecurityRequirement): string {
        return requirement.getSecurityRequirementNames().join(", ");
    }

    /**
     * Opens the security requirement editor for adding or editing a security requirement.
     * @param requirement
     */
    public openSecurityRequirementEditor(requirement?: SecurityRequirement): void {
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
    public securityRequirements(): SecurityRequirement[] {
        return this.parent.security ? this.parent.security : [];
    }

    public securityRequirementsPath(): string {
        return ModelUtils.nodeToPath(this.parent) + "/security";
    }

    /**
     * Returns the set of scopes (if any) needed for a particular requirement+scheme name.
     * @param requirement
     * @param schemeName
     */
    public requirementScopes(requirement: SecurityRequirement, schemeName: string): string {
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
    public isAnonSecurity(requirement: SecurityRequirement): boolean {
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
