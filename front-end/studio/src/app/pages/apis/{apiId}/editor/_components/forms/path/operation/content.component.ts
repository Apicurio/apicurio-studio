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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from "@angular/core";
import {
    Oas30Document,
    Oas30MediaType,
    Oas30RequestBody,
    Oas30RequestBodyContent,
    Oas30Response,
    Oas30ResponseContent
} from "oai-ts-core";
import {createNewMediaTypeCommand, ICommand, SimplifiedType} from "oai-ts-commands";
import {Oas30Example} from "oai-ts-core/src/models/3.0/example.model";
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
    moduleId: module.id,
    selector: "content",
    templateUrl: "content.component.html",
    styleUrls: [ "content.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent extends AbstractBaseComponent {

    @Input() parent: Oas30Response | Oas30RequestBody;
    @Input() content: Oas30ResponseContent | Oas30RequestBodyContent;

    protected mediaTypeName: string;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private selectionService: SelectionService, private commandService: CommandService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public hasMediaTypes(): boolean {
        if (this.content) {
            return Object.keys(this.content).length > 0;
        }
        return false;
    }

    public mediaTypeNames(): string[] {
        if (this.content) {
            return Object.keys(this.content);
        }
        return [];
    }

    public mediaTypeByName(name: string): Oas30MediaType {
        return this.content[name];
    }

    public addMediaType(mediaType: string): void {
        let command: ICommand = createNewMediaTypeCommand(this.parent.ownerDocument(), this.parent, mediaType);
        this.commandService.emit(command);
    }

}
