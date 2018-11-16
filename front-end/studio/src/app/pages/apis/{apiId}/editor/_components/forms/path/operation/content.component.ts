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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation
} from "@angular/core";
import {Oas30Document, Oas30MediaType, Oas30RequestBodyContent, Oas30ResponseContent, Oas30Schema} from "oai-ts-core";
import {SimplifiedType} from "oai-ts-commands";
import {Oas30Example} from "oai-ts-core/src/models/3.0/example.model";
import {EditExampleEvent} from "../../../dialogs/edit-example.component";
import {AbstractBaseComponent} from "../../../common/base-component";
import {DocumentService} from "../../../../_services/document.service";

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

    @Input() content: Oas30ResponseContent | Oas30RequestBodyContent;
    @Input() document: Oas30Document;

    @Output() onNewMediaType: EventEmitter<string> = new EventEmitter<string>();
    @Output() onRemoveMediaType: EventEmitter<string> = new EventEmitter<string>();
    @Output() onMediaTypeChange: EventEmitter<MediaTypeChangeEvent> = new EventEmitter<MediaTypeChangeEvent>();
    @Output() onAddExample: EventEmitter<AddExampleEvent> = new EventEmitter<AddExampleEvent>();
    @Output() onDeleteExample: EventEmitter<DeleteExampleEvent> = new EventEmitter<DeleteExampleEvent>();
    @Output() onExampleSummaryChange: EventEmitter<ExamplePropertyChangeEvent> = new EventEmitter<ExamplePropertyChangeEvent>();
    @Output() onExampleDescriptionChange: EventEmitter<ExamplePropertyChangeEvent> = new EventEmitter<ExamplePropertyChangeEvent>();
    @Output() onExampleValueChange: EventEmitter<EditExampleEvent> = new EventEmitter<EditExampleEvent>();

    protected mediaTypeName: string;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService) {
        super(changeDetectorRef, documentService);
    }

    /**
     * Called when the page is initialized.
     */
    public ngOnInit(): void {
        super.ngOnInit();
        this.selectDefaultMediaType();
    }

    public selectDefaultMediaType(): void {
        this.mediaTypeName = null;
        if (this.content) {
            for (let key in this.content) {
                this.mediaTypeName = key;
                break;
            }
        }
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

    public selectMediaType(typeName: string): void {
        this.mediaTypeName = typeName;
    }

    public mediaType(): Oas30MediaType {
        if (!this.mediaTypeName) {
            this.selectDefaultMediaType();
        }
        return this.content[this.mediaTypeName];
    }

    public mediaTypeByName(name: string): Oas30MediaType {
        return this.content[name];
    }

    public mediaTypeSchema(): Oas30Schema {
        let mt: Oas30MediaType = this.mediaType();
        if (mt) {
            return mt.schema;
        }
        return null;
    }

    public mediaTypeType(): SimplifiedType {
        let mt: Oas30MediaType = this.mediaType();
        if (mt) {
            return SimplifiedType.fromSchema(mt.schema);
        }
        return null;
    }

    public mediaTypeExamples(): Oas30Example[] {
        return this.mediaType().getExamples();
    }

    public mediaTypeHasExamples(): boolean {
        return this.mediaTypeExamples().length > 0;
    }

    public addExample(exampleData: any): void {
        let event: AddExampleEvent = {
            mediaType: this.mediaType(),
            name: exampleData.name,
            value: exampleData.value
        };
        this.onAddExample.emit(event);
    }

    public changeExampleSummary(example: Oas30Example, summary: string): void {
        let event: ExamplePropertyChangeEvent = {
            example: example,
            value: summary
        };
        this.onExampleSummaryChange.emit(event);
    }

    public changeExampleDescription(example: Oas30Example, description: string): void {
        let event: ExamplePropertyChangeEvent = {
            example: example,
            value: description
        };
        this.onExampleDescriptionChange.emit(event);
    }

    public deleteExample(example: Oas30Example): void {
        let event: DeleteExampleEvent = {
            example: example
        };
        this.onDeleteExample.emit(event);
    }

    public editExample(event: EditExampleEvent): void {
        this.onExampleValueChange.emit(event);
    }

    public changeMediaTypeType(newType: SimplifiedType): void {
        this.onMediaTypeChange.emit({
            name: this.mediaTypeName,
            type: newType
        });
    }

    public addMediaType(mediaType: string): void {
        this.onNewMediaType.emit(mediaType);
        this.mediaTypeName = mediaType;
    }

    public removeMediaType(mtName: string): void {
        this.onRemoveMediaType.emit(mtName);
        if (mtName === this.mediaTypeName) {
            this.selectDefaultMediaType();
        }
    }

    public deleteAllMediaTypes(): void {
        // TODO fire a separate "delete all" command so that we delete all media types in a single undoable command
        this.mediaTypeNames().forEach( mtName => {
            this.onRemoveMediaType.emit(mtName);
        });
    }

    public schemaForExample(): Oas30Schema {
        let mtNames: string[] = Object.keys(this.content);
        if (mtNames && mtNames.length > 0) {
            let mt: Oas30MediaType = this.content[mtNames[0]];
            if (mt) {
                return mt.schema;
            }
        }
        return null;
    }

}
