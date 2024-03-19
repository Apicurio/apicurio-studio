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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation} from "@angular/core";
import {
    CommandFactory,
    ICommand,
    Library,
    Oas30Example, Oas30Header,
    Oas30Schema,
    SimplifiedType
} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {EditExampleEvent} from "../../dialogs/edit-example.component";
import {AbstractRowComponent} from "../../common/item-row.abstract";


@Component({
    selector: "header-row",
    templateUrl: "header-row.component.html",
    styleUrls: [ "header-row.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderRowComponent extends AbstractRowComponent<Oas30Header, SimplifiedType> {

    /**
     * Constructor.
     * @param changeDetectorRef
     * @param documentService
     * @param commandService
     * @param selectionService
     */
    constructor(changeDetectorRef: ChangeDetectorRef, documentService: DocumentService,
                private commandService: CommandService, selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected updateModel(): void {
        this._model = SimplifiedType.fromSchema(this.item.schema);
    }

    public isEditingExamples(): boolean {
        return this.isEditingTab("examples");
    }

    public isEditingHeader(): boolean {
        return this.isEditingTab("header");
    }

    public toggleExamples(): void {
        this.toggleTab("examples");
    }

    public toggleHeader(): void {
        this.toggleTab("header");
    }

    public delete(): void {
        console.info("[HeaderRowComponent] Deleting request body media type: " + this.item.getName());
        let command: ICommand = CommandFactory.createDeleteHeaderCommand(this.item);
        this.commandService.emit(command);
    }

    public displayExamples(): string {
        if (this.headerHasExamples()) {
            return `${this.headerExamples().length} example(s) defined.`;
        } else {
            return "No examples defined."
        }
    }

    public displayType(): SimplifiedType {
        return SimplifiedType.fromSchema(this.item.schema);
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
        nt.enum_ = newType.enum_;
        nt.of = newType.of;
        nt.as = newType.as;
        let command: ICommand = CommandFactory.createChangeHeaderTypeCommand(this.item, nt);
        this.commandService.emit(command);
        this._model = nt;
    }

    public headerExamples(): Oas30Example[] {
        return <any>this.item.getExamples();
    }

    public headerHasExamples(): boolean {
        return this.headerExamples().length > 0;
    }

    public addExample(exampleData: any): void {
        let command: ICommand = CommandFactory.createAddExampleCommand(this.item,
            exampleData.value, exampleData.name, null, null);
        this.commandService.emit(command);
        let nodePath = Library.createNodePath(this.item);
        nodePath.appendSegment("examples", false);
        this.__selectionService.select(nodePath.toString());
    }

    public changeExampleSummary(example: Oas30Example, summary: string): void {
    }

    public changeExampleDescription(example: Oas30Example, description: string): void {
    }

    public deleteExample(example: Oas30Example): void {
        console.info("[HeaderRowComponent] Deleting an example of a header.");
        let command: ICommand = CommandFactory.createDeleteExampleCommand(example);
        this.commandService.emit(command);
    }

    public deleteAllExamples(): void {
        let command: ICommand = CommandFactory.createDeleteAllExamplesCommand(this.item.getMediaType(this.item.getName()));
        this.commandService.emit(command);
    }

    public editExample(event: EditExampleEvent): void {
        console.info("[HeaderRowComponent] Changing the value of a Header example.");
        let command: ICommand = CommandFactory.createSetExampleCommand(this.item.ownerDocument().getDocumentType(), this.item,
            event.value, event.example.getName());
        this.commandService.emit(command);
    }

    public schemaForExample(): Oas30Schema {
        return this.item.schema;
    }
}
