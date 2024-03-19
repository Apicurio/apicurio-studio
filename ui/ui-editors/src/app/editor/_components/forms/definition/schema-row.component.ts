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
    Output,
    ViewEncapsulation
} from "@angular/core";
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {AbstractRowComponent} from "../../common/item-row.abstract";
import {DocumentType, NodePath, OasSchema} from "@apicurio/data-models";


@Component({
    selector: "schema-row",
    templateUrl: "schema-row.component.html",
    styleUrls: [ "schema-row.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaRowComponent extends AbstractRowComponent<OasSchema, any> {

    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param commandService
     * @param selectionService
     */
    constructor(changeDetectorRef: ChangeDetectorRef, documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected updateModel(): void {
    }

    displayName(): string {
        return this.name();
    }

    public delete(): void {
        this.onDelete.emit();
    }

    refToName($ref: string): string {
        if ($ref) {
            return $ref.substring($ref.lastIndexOf('/') + 1);
        } else {
            return "N/A";
        }
    }

    name(): string {
        return this.refToName(this.item.$ref);
    }

    navigateToSchema(): void {
        let path: NodePath = new NodePath(this.pathPrefix());
        path.appendSegment(this.name(), true);
        this.selectionService.select(path.toString());
    }

    refPrefix(): string {
        let prefix: string = "#/components/schemas/";
        if (this.item.ownerDocument().getDocumentType() === DocumentType.openapi2) {
            prefix = "#/definitions/";
        }
        return prefix;
    }

    pathPrefix(): string {
        return this.refPrefix().substr(1);
    }

}
