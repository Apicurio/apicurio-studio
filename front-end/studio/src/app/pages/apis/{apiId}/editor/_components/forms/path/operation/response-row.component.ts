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
    SimpleChanges,
    ViewEncapsulation
} from "@angular/core";
import {Oas20Response, OasDocument} from "oai-ts-core";
import {
    createChangePropertyCommand,
    createChangeResponseTypeCommand,
    createDelete20ExampleCommand,
    createSetExampleCommand,
    ICommand,
    SimplifiedType
} from "oai-ts-commands";
import {HttpCode, HttpCodeService} from "../../../../_services/httpcode.service";
import {CommandService} from "../../../../_services/command.service";
import {DocumentService} from "../../../../_services/document.service";
import {ObjectUtils} from "../../../../_util/object.util";
import {EditExample20Event} from "../../../dialogs/edit-example-20.component";
import {AbstractBaseComponent} from "../../../common/base-component";


@Component({
    moduleId: module.id,
    selector: "response-row",
    templateUrl: "response-row.component.html",
    styleUrls: [ "response-row.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponseRowComponent extends AbstractBaseComponent {

    private static httpCodes: HttpCodeService = new HttpCodeService();

    @Input() response: Oas20Response;

    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();

    protected _editing: boolean = false;
    protected _tab: string = "description";
    protected _model: SimplifiedType = null;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService) {
        super(changeDetectorRef, documentService);
    }

    protected onDocumentChange(): void {
        this._model = SimplifiedType.fromSchema(this.response.schema);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (changes["response"]) {
            this._model = SimplifiedType.fromSchema(this.response.schema);
        }
    }

    public model(): SimplifiedType {
        return this._model;
    }

    public document(): OasDocument {
        return this.response.ownerDocument();
    }

    public isParameter(): boolean {
        return false;
    }

    public statusCodeLine(code: string): string {
        let httpCode: HttpCode = ResponseRowComponent.httpCodes.getCode(code);
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

    public hasExamples(): boolean {
        if (ObjectUtils.isNullOrUndefined(this.response.examples)) {
            return false;
        }
        return this.response.examples.exampleContentTypes().length > 0;
    }

    public exampleContentTypes(): string[] {
        return this.response.examples.exampleContentTypes();
    }

    public exampleValue(contentType: string): string {
        let evalue: any = this.response.examples.example(contentType);
        if (typeof evalue === "object") {
            evalue = JSON.stringify(evalue);
        }
        return evalue;
    }

    public delete(): void {
        this.onDelete.emit();
    }

    public isValid(): boolean {
        return true;
    }

    public displayType(): SimplifiedType {
        return SimplifiedType.fromSchema(this.response.schema);
    }

    public rename(): void {
        // TODO implement this!
        alert("Not yet implemented!");
    }

    public changeType(newType: SimplifiedType): void {
        let nt: SimplifiedType = new SimplifiedType();
        nt.type = newType.type;
        nt.enum = newType.enum;
        nt.of = newType.of;
        nt.as = newType.as;
        let command: ICommand = createChangeResponseTypeCommand(this.document(), this.response, nt);
        this.commandService.emit(command);
        this._model = nt;
    }

    public setDescription(description: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.document(), this.response, "description", description);
        this.commandService.emit(command);
    }

    public deleteExample(contentType: string): void {
        let command: ICommand = createDelete20ExampleCommand(this.document(), this.response, contentType);
        this.commandService.emit(command);
    }

    public addExample(exampleData: any): void {
        let command: ICommand = createSetExampleCommand(this.document(), this.response, exampleData.value, exampleData.contentType);
        this.commandService.emit(command);
    }

    public editExample(event: EditExample20Event): void {
        let command: ICommand = createSetExampleCommand(this.document(), this.response, event.value, event.contentType);
        this.commandService.emit(command);
    }

}
