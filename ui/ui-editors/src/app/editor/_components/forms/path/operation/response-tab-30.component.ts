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
import {CommandFactory, DocumentType, ICommand, NodePath, Oas30Response} from "@apicurio/data-models";
import {CommandService} from "../../../../_services/command.service";
import {AbstractBaseComponent} from "../../../common/base-component";
import {DocumentService} from "../../../../_services/document.service";
import {SelectionService} from "../../../../_services/selection.service";


@Component({
    selector: "response-tab-30",
    templateUrl: "response-tab-30.component.html",
    styleUrls: ["response-tab-30.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponseTab30Component extends AbstractBaseComponent {

    @Input() response: Oas30Response;

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param commandService
     * @param selectionService
     */
    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    isRef(): boolean {
        return this.response.$ref !== null && this.response.$ref !== undefined;
    }

    responseDefRefPrefix(): string {
        let prefix: string = "#/components/responses/";
        if (this.response.ownerDocument().getDocumentType() === DocumentType.openapi2) {
            prefix = "#/responses/";
        }
        return prefix;
    }

    responseDefPathPrefix(): string {
        return this.responseDefRefPrefix().substr(1);
    }

    definitionName(): string {
        if (this.isRef()) {
            let prefix: string = this.responseDefRefPrefix();
            let $ref: string = this.response.$ref;
            if ($ref.startsWith(prefix)) {
                return $ref.substr(prefix.length);
            }
            return this.response.$ref
        }
        return null;
    }

    navigateToDefinition(): void {
        let path: NodePath = new NodePath(this.responseDefPathPrefix());
        path.appendSegment(this.definitionName(), true);
        this.selectionService.select(path.toString());
    }

    public setDescription(description: string): void {
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.response, "description", description);
        this.commandService.emit(command);
    }

}
