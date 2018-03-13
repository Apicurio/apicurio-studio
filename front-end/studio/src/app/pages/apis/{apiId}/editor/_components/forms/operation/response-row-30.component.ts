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

import {Component, EventEmitter, Input, Output, ViewEncapsulation} from "@angular/core";
import {HttpCode, HttpCodeService} from "../../../_services/httpcode.service";
import {Oas30Document, Oas30Response} from "oai-ts-core";
import {
    AddExampleEvent, DeleteExampleEvent, ExamplePropertyChangeEvent,
    MediaTypeChangeEvent
} from "./content.component";
import {EditExampleEvent} from "../../dialogs/edit-example.component";


@Component({
    moduleId: module.id,
    selector: "response-row-30",
    templateUrl: "response-row-30.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ResponseRow30Component {

    private static httpCodes: HttpCodeService = new HttpCodeService();

    @Input() document: Oas30Document;
    @Input() response: Oas30Response;

    @Output() onDescriptionChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() onCreateMediaType: EventEmitter<string> = new EventEmitter<string>();
    @Output() onDeleteMediaType: EventEmitter<string> = new EventEmitter<string>();
    @Output() onMediaTypeChange: EventEmitter<MediaTypeChangeEvent> = new EventEmitter<MediaTypeChangeEvent>();
    @Output() onAddExample: EventEmitter<AddExampleEvent> = new EventEmitter<AddExampleEvent>();
    @Output() onDeleteExample: EventEmitter<DeleteExampleEvent> = new EventEmitter<DeleteExampleEvent>();
    @Output() onChangeExampleSummary: EventEmitter<ExamplePropertyChangeEvent> = new EventEmitter<ExamplePropertyChangeEvent>();
    @Output() onChangeExampleDescription: EventEmitter<ExamplePropertyChangeEvent> = new EventEmitter<ExamplePropertyChangeEvent>();
    @Output() onChangeExampleValue: EventEmitter<EditExampleEvent> = new EventEmitter<EditExampleEvent>();
    @Output() onDelete: EventEmitter<boolean> = new EventEmitter<boolean>();

    protected _editing: boolean = false;

    public statusCodeLine(code: string): string {
        let httpCode: HttpCode = ResponseRow30Component.httpCodes.getCode(code);
        if (httpCode) {
            return httpCode.line;
        }
        return "";
    }

    public statusCodeType(code: string): string {
        if (code === "default") {
            return "";
        }

        var icode: number = parseInt(code);
        if (icode >= 200 && icode < 300) {
            return "success";
        }

        if (icode >= 300 && icode < 400) {
            return "redirect";
        }

        if (icode >= 400 && icode < 500) {
            return "problem";
        }

        if (icode >= 500 && icode < 600) {
            return "error";
        }

        return "";
    }

    public isEditing(): boolean {
        return this._editing;
    }

    public edit(): void {
        this._editing = true;
    }

    public ok(): void {
        this._editing = false;
    }

    public cancel(): void {
        this._editing = false;
    }

    public delete(): void {
        this.onDelete.emit(true);
    }

    public isValid(): boolean {
        return true;
    }

    public responseTypeInfo(): string {
        if (!this.response.content) {
            return "No response media types defined.";
        }
        let numMediaTypes: number = Object.keys(this.response.content).length;
        if (numMediaTypes === 0) {
            return "No response media types defined.";
        }

        if (numMediaTypes === 1) {
            return "Media Type: " + this.response.getMediaTypes()[0].name();
        }

        return "" + numMediaTypes + " response media types supported.";
    }

    public setDescription(description: string): void {
        this.onDescriptionChange.emit(description);
    }

    public createResponseMediaType(mediaType: string): void {
        this.onCreateMediaType.emit(mediaType);
    }

    public deleteResponseMediaType(mediaType: string): void {
        this.onDeleteMediaType.emit(mediaType);
    }

    public changeResponseMediaType(event: MediaTypeChangeEvent): void {
        this.onMediaTypeChange.emit(event);
    }

    public addMediaTypeExample(event: AddExampleEvent): void {
        this.onAddExample.emit(event);
    }

    public deleteMediaTypeExample(event: DeleteExampleEvent): void {
        this.onDeleteExample.emit(event);
    }

    public changeMediaTypeExampleSummary(event: ExamplePropertyChangeEvent): void {
        this.onChangeExampleSummary.emit(event);
    }

    public changeMediaTypeExampleDescription(event: ExamplePropertyChangeEvent): void {
        this.onChangeExampleDescription.emit(event);
    }

    public changeMediaTypeExampleValue(event: EditExampleEvent): void {
        this.onChangeExampleValue.emit(event);
    }

    public onGlobalKeyDown(event: KeyboardEvent): void {
        if (event.key === "Escape"  && !event.metaKey && !event.altKey && !event.ctrlKey) {
            this.cancel();
        }
    }

}
