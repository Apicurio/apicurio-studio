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
    Oas30Example,
    Oas30MediaType,
    Oas30RequestBody,
    Oas30Response,
    SimplifiedType
} from "@apicurio/data-models";
import {AbstractBaseComponent} from "../../../common/base-component";
import {DocumentService} from "../../../../_services/document.service";
import {SelectionService} from "../../../../_services/selection.service";
import {CommandService} from "../../../../_services/command.service";

export interface MediaTypeChangeEvent {
    name: string;
    type: SimplifiedType;
}

export interface AddExampleEvent {
    mediaType: Oas30MediaType;
    name: string;
    value: any;
}

export interface DeleteExampleEvent {
    example: Oas30Example;
}

export interface ExamplePropertyChangeEvent {
    example: Oas30Example;
    value: string;
}


@Component({
    selector: "content",
    templateUrl: "content.component.html",
    styleUrls: [ "content.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent extends AbstractBaseComponent {

    @Input() parent: Oas30Response | Oas30RequestBody;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private selectionService: SelectionService, private commandService: CommandService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public hasMediaTypes(): boolean {
        return this.parent.getMediaTypes().length > 0;
    }

    public mediaTypeNames(): string[] {
        if (this.parent.content) {
            return Object.keys(this.parent.content);
        }
        return [];
    }

    public mediaTypeByName(name: string): Oas30MediaType {
        return this.parent.getMediaType(name);
    }

    public addMediaType(mediaType: string): void {
        let command: ICommand = CommandFactory.createNewMediaTypeCommand(this.parent, mediaType);
        this.commandService.emit(command);
        let nodePath = Library.createNodePath(this.parent);
        nodePath.appendSegment("content", false);
        nodePath.appendSegment(mediaType, true);
        this.selectionService.select(nodePath.toString());
    }

}
