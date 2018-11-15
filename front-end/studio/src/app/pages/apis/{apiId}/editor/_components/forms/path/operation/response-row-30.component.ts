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
import {Oas30Document, Oas30MediaType, Oas30Response} from "oai-ts-core";
import {
    AddExampleEvent, DeleteExampleEvent, ExamplePropertyChangeEvent,
    MediaTypeChangeEvent
} from "./content.component";
import {
    createAddExampleCommand,
    createChangeMediaTypeTypeCommand,
    createChangePropertyCommand, createDeleteExampleCommand, createDeleteMediaTypeCommand, createNewMediaTypeCommand,
    createSetExampleCommand,
    ICommand
} from "oai-ts-commands";
import {HttpCode, HttpCodeService} from "../../../../_services/httpcode.service";
import {CommandService} from "../../../../_services/command.service";
import {EditExampleEvent} from "../../../dialogs/edit-example.component";


@Component({
    moduleId: module.id,
    selector: "response-row-30",
    templateUrl: "response-row-30.component.html",
    styleUrls: ["response-row-30.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class ResponseRow30Component {

    private static httpCodes: HttpCodeService = new HttpCodeService();

    @Input() document: Oas30Document;
    @Input() response: Oas30Response;

    @Output() onDelete: EventEmitter<boolean> = new EventEmitter<boolean>();

    protected _editing: boolean = false;
    protected _tab: string = "description";

    constructor(private commandService: CommandService) {}

    public statusCodeLine(code: string): string {
        let httpCode: HttpCode = ResponseRow30Component.httpCodes.getCode(code);
        if (httpCode) {
            return httpCode.line;
        }
        return "";
    }

    public hasDescription(): boolean {
        if (this.response.description) {
            return true;
        } else {
            return false;
        }
    }

    public description(): string {
        return this.response.description
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

    public isEditingDescription(): boolean {
        return this._editing && this._tab === "description";
    }

    public isEditingSummary(): boolean {
        return this._editing && this._tab === "summary";
    }

    public toggle(event: MouseEvent): void {
        if (event.target['localName'] !== "button" && event.target['localName'] !== "a") {
            this._editing = !this._editing;
        }
    }

    public toggleDescription(): void {
        if (this.isEditing() && this._tab === "description") {
            this._editing = false;
        } else {
            this._editing = true;
            this._tab = "description";
        }
    }

    public toggleSummary(): void {
        if (this.isEditing() && this._tab === "summary") {
            this._editing = false;
        } else {
            this._editing = true;
            this._tab = "summary";
        }
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

    public renameResponse(): void {
        alert("Not yet implemented.");
    }

    public isValid(): boolean {
        return true;
    }

    public hasResponseTypeInfo(): boolean {
        if (!this.response.content) {
            return false;
        }
        let numMediaTypes: number = Object.keys(this.response.content).length;
        if (numMediaTypes === 0) {
            return false;
        }
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
        let command: ICommand = createChangePropertyCommand<string>(this.document, this.response, "description", description);
        this.commandService.emit(command);
    }

    public createResponseMediaType(mediaType: string): void {
        let command: ICommand = createNewMediaTypeCommand(this.document, this.response, mediaType);
        this.commandService.emit(command);
    }

    public deleteResponseMediaType(mediaType: string): void {
        let mt: Oas30MediaType = this.response.getMediaType(mediaType);
        let command: ICommand = createDeleteMediaTypeCommand(this.document, mt);
        this.commandService.emit(command);
    }

    public changeResponseMediaType(event: MediaTypeChangeEvent): void {
        let mt: Oas30MediaType = this.response.getMediaType(event.name);
        let command: ICommand = createChangeMediaTypeTypeCommand(this.document, mt, event.type);
        this.commandService.emit(command);
    }

    public addMediaTypeExample(event: AddExampleEvent): void {
        let mt: Oas30MediaType = event.mediaType;
        let command: ICommand = createAddExampleCommand(this.document, mt, event.value, event.name);
        this.commandService.emit(command);
    }

    public deleteMediaTypeExample(event: DeleteExampleEvent): void {
        let command: ICommand = createDeleteExampleCommand(this.document, event.example);
        this.commandService.emit(command);
    }

    public changeMediaTypeExampleSummary(event: ExamplePropertyChangeEvent): void {
        let command: ICommand = createChangePropertyCommand<string>(this.document, event.example, "summary", event.value);
        this.commandService.emit(command);
    }

    public changeMediaTypeExampleDescription(event: ExamplePropertyChangeEvent): void {
        let command: ICommand = createChangePropertyCommand<string>(this.document, event.example, "description", event.value);
        this.commandService.emit(command);
    }

    public changeMediaTypeExampleValue(event: EditExampleEvent): void {
        let mt: Oas30MediaType = event.example.parent() as Oas30MediaType;
        let command: ICommand = createSetExampleCommand(this.document, mt, event.value, event.example.name());
        this.commandService.emit(command);
    }

    public onGlobalKeyDown(event: KeyboardEvent): void {
        if (event.key === "Escape"  && !event.metaKey && !event.altKey && !event.ctrlKey) {
            this.cancel();
        }
    }

}
