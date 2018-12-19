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
    Input,
    SimpleChanges,
    ViewEncapsulation
} from "@angular/core";
import {
    createAddExampleCommand,
    createChangeMediaTypeTypeCommand, createDeleteExampleCommand, createDeleteMediaTypeCommand,
    createSetExampleCommand,
    ICommand,
    SimplifiedType
} from "oai-ts-commands";
import {Oas30Example, Oas30MediaType, Oas30Schema, OasDocument} from "oai-ts-core";
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {SelectionService} from "../../../_services/selection.service";
import {EditExampleEvent} from "../../dialogs/edit-example.component";


@Component({
    moduleId: module.id,
    selector: "media-type-row",
    templateUrl: "media-type-row.component.html",
    styleUrls: [ "media-type-row.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaTypeRowComponent extends AbstractBaseComponent {

    @Input() mediaType: Oas30MediaType;

    protected _editing: boolean = false;
    protected _tab: string = "type";
    protected _model: SimplifiedType = null;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected onDocumentChange(): void {
        this.updateModel();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (changes["mediaType"]) {
            this.updateModel();
        }
    }

    private updateModel(): void {
        this._model = SimplifiedType.fromSchema(this.mediaType.schema);
    }

    public model(): SimplifiedType {
        return this._model;
    }

    public document(): OasDocument {
        return this.mediaType.ownerDocument();
    }

    public isEditing(): boolean {
        return this._editing;
    }

    public isEditingExamples(): boolean {
        return this._editing && this._tab === "examples";
    }

    public isEditingType(): boolean {
        return this._editing && this._tab === "type";
    }

    public toggle(event: MouseEvent): void {
        if (event.target['localName'] !== "button" && event.target['localName'] !== "a") {
            this._editing = !this._editing;
        }
    }

    public toggleExamples(): void {
        if (this.isEditing() && this._tab === "examples") {
            this._editing = false;
        } else {
            this._editing = true;
            this._tab = "examples";
        }
    }

    public toggleType(): void {
        if (this.isEditing() && this._tab === "type") {
            this._editing = false;
        } else {
            this._editing = true;
            this._tab = "type";
        }
    }

    public delete(): void {
        console.info("[MediaTypeRowComponent] Deleting request body media type: " + this.mediaType.name());
        let command: ICommand = createDeleteMediaTypeCommand(this.mediaType.ownerDocument(), this.mediaType);
        this.commandService.emit(command);
    }

    public isValid(): boolean {
        return true;
    }

    public displayExamples(): string {
        if (this.mediaTypeHasExamples()) {
            return `${this.mediaTypeExamples().length} example(s) defined.`;
        } else {
            return "No examples defined."
        }
    }

    public displayType(): SimplifiedType {
        return SimplifiedType.fromSchema(this.mediaType.schema);
    }

    public exampleValue(example: Oas30Example): string {
        let evalue: any = example.value;
        if (typeof evalue === "object" || Array.isArray(evalue)) {
            evalue = JSON.stringify(evalue);
        }
        return evalue;
    }

    public changeType(newType: SimplifiedType): void {
        let nt: SimplifiedType = new SimplifiedType();
        nt.type = newType.type;
        nt.enum = newType.enum;
        nt.of = newType.of;
        nt.as = newType.as;
        let command: ICommand = createChangeMediaTypeTypeCommand(this.mediaType.ownerDocument(), this.mediaType, nt);
        this.commandService.emit(command);
        this._model = nt;
    }

    public mediaTypeExamples(): Oas30Example[] {
        return this.mediaType.getExamples();
    }

    public mediaTypeHasExamples(): boolean {
        return this.mediaTypeExamples().length > 0;
    }

    public addExample(exampleData: any): void {
        let command: ICommand = createAddExampleCommand(this.mediaType.ownerDocument(), this.mediaType,
            exampleData.value, exampleData.name);
        this.commandService.emit(command);
    }

    public changeExampleSummary(example: Oas30Example, summary: string): void {
    }

    public changeExampleDescription(example: Oas30Example, description: string): void {
    }

    public deleteExample(example: Oas30Example): void {
        console.info("[MediaTypeRowComponent] Deleting an example of a media type.");
        let command: ICommand = createDeleteExampleCommand(this.mediaType.ownerDocument(), example);
        this.commandService.emit(command);
    }

    public editExample(event: EditExampleEvent): void {
        console.info("[MediaTypeRowComponent] Changing the value of a Media Type example.");
        let command: ICommand = createSetExampleCommand(this.mediaType.ownerDocument(), this.mediaType,
            event.value, event.example.name());
        this.commandService.emit(command);
    }

    public schemaForExample(): Oas30Schema {
        return this.mediaType.schema;
    }

}
