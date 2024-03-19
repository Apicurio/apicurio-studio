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

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SimpleChanges, ViewEncapsulation, Directive } from "@angular/core";
import {DocumentService} from "../../_services/document.service";
import {AbstractBaseComponent} from "./base-component";
import {SelectionService} from "../../_services/selection.service";
import {CollaboratorService} from "../../_services/collaborator.service";
import {TopicSubscription} from "apicurio-ts-core";
import {ApiEditorUser} from "../../_models/editor-user.model";

/**
 * Common base class for collaboration components (overlay and aggregate icon).
 */
@Directive()
export abstract class AbstractCollaboratorComponent extends AbstractBaseComponent {

    @Input() nodePath: string | string[];

    private _open: boolean = false;
    public left: string;
    public top: string;

    private _collaborators: ApiEditorUser[];

    private _collabSub: TopicSubscription<ApiEditorUser>;

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param selectionService
     * @param collaboratorService
     */
    protected constructor(changeDetectorRef: ChangeDetectorRef, documentService: DocumentService,
                selectionService: SelectionService, private collaboratorService: CollaboratorService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this._collabSub = this.collaboratorService.collaboratorSelection().subscribe(() => {
            this.updateCollaborators();
            this.__changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this._collabSub) {
            this._collabSub.unsubscribe();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.updateCollaborators();
    }

    protected onDocumentChange(): void {
        this.updateCollaborators();
    }

    /**
     * Update the list of collaborators for the currently configured node path.
     */
    protected updateCollaborators(): void {
        // console.info("[CollaboratorOverlayComponent] Determine collaborators for node path: ", this.nodePath);
        if (Array.isArray(this.nodePath)) {
            this._collaborators = [];
            (<string[]>this.nodePath).forEach( nodePath => {
                this._collaborators = this._collaborators.concat(this.collaboratorService.getCollaboratorsForPath(nodePath));
            });
        } else {
            this._collaborators = this.collaboratorService.getCollaboratorsForPath(<string>this.nodePath);
        }
        // console.info("[CollaboratorOverlayComponent] # Collaborators found: ", this._collaborators.length);
    }

    public open(event: MouseEvent): void {
        this.left = (event.clientX + 5) + "px";
        this.top = (event.clientY + 12) + "px";
        this._open = true;
    }

    public close(): void {
        this._open = false;
    }

    public isOpen(): boolean {
        return this._open;
    }

    public hasCollaborators(): boolean {
        return this._collaborators && this._collaborators.length > 0;
    }

    public collaborators(): ApiEditorUser[] {
        return this._collaborators;
    }

    public iconColorFor(collaborator: ApiEditorUser): string {
        let color: string = collaborator.attributes["color"];
        if (color === null) {
            color = "CD3EBA";
        }
        return color;
    }
}


@Component({
    selector: "collaborator-overlay",
    templateUrl: "collaborator-overlay.component.html",
    styleUrls: [ "collaborator-overlay.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollaboratorOverlayComponent extends AbstractCollaboratorComponent {

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

    public overlayColor(): string {
        let color: string = "CD3EBA";
        if (this.hasCollaborators()) {
            if (this.collaborators().length === 1) {
                color = this.collaborators()[0].attributes["color"];
            }
        }
        return color;
    }
}
