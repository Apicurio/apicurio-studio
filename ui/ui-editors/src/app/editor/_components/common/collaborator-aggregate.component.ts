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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation} from "@angular/core";
import {DocumentService} from "../../_services/document.service";
import {SelectionService} from "../../_services/selection.service";
import {CollaboratorService} from "../../_services/collaborator.service";
import {AbstractCollaboratorComponent} from "./collaborator-overlay.component";

@Component({
    selector: "collaborator-aggregate",
    templateUrl: "collaborator-aggregate.component.html",
    styleUrls: [ "collaborator-aggregate.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollaboratorAggregateComponent extends AbstractCollaboratorComponent {

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param selectionService
     * @param collaboratorService
     */
    constructor(changeDetectorRef: ChangeDetectorRef, documentService: DocumentService,
                selectionService: SelectionService, collaboratorService: CollaboratorService) {
        super(changeDetectorRef, documentService, selectionService, collaboratorService);
    }

    public displayText(): string {
        let dt: string = "?";
        if (this.hasCollaborators()) {
            dt = "" + this.collaborators().length;
            if (this.collaborators().length === 1) {
                // First letter of the name
                dt = this.collaborators()[0].fullName[0];
            }
        }
        return dt;
    }

    public iconColor(): string {
        let color: string = "CD3EBA";
        if (this.hasCollaborators()) {
            if (this.collaborators().length === 1) {
                color = this.collaborators()[0].attributes["color"];
            }
        }
        return color;
    }
}
