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
    Aai20Schema, AaiComponents,
    AaiDocument,
    AaiMessage,
    AaiOperation,
    CommandFactory,
    ICommand,
    Library,
    ReferenceUtil,
    SimplifiedType
} from "@apicurio/data-models";
import {CommandService} from "../../../../_services/command.service";
import {DocumentService} from "../../../../_services/document.service";
import {AbstractBaseComponent} from "../../../common/base-component";
import {SelectionService} from "../../../../_services/selection.service";
import {EditExampleEvent} from "../../../dialogs/edit-aai-example.component";

@Component({
    selector: "payload-tab",
    templateUrl: "payload-tab.component.html",
    styleUrls: [ "payload-tab.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayloadTabComponent extends AbstractBaseComponent {

    @Input() message: AaiMessage;

    protected _model: SimplifiedType = null;
    protected editing: boolean = false;
    protected tab: string = "";

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
        private commandService: CommandService, private selectionService: SelectionService) {
            super(changeDetectorRef, documentService, selectionService);
    }

    public model(): SimplifiedType {
        return this._model;
    }
    public updateModel(): void {
        this._model = SimplifiedType.fromSchema(this.message.payload);
    }
    public document(): AaiDocument {
        return <AaiDocument> this.message.ownerDocument();
    }

    public toggleTab(tab: string): void {
        if (this.isEditing() && this.tab === tab) {
            this.editing = false;
        } else {
            this.editing = true;
            this.tab = tab;
        }
    }
    public isEditing(): boolean {
        return this.editing;
    }
    public isEditingTab(tab: string): boolean {
        return this.isEditing() && this.tab === tab;
    }

    public toggleType(): void {
        this.toggleTab("type");
    }
    public toggleExamples(): void {
        this.toggleTab("examples");
    }
    public isEditingType(): boolean {
        return this.isEditingTab("type");
    }
    public isEditingExamples(): boolean {
        return this.isEditingTab("examples");
    }

    public messageHasExamples(): boolean {
        return this.message.examples != null && this.message.examples.length > 0;
    }
    public messageExamples(): any[] {
        return this.message.examples;
    }

    public displayType(): SimplifiedType {
        return SimplifiedType.fromSchema(this.message.payload);
    }
    public displayExamples(): string {
        if (this.messageHasExamples()) {
            return `${this.messageExamples().length} example(s) defined.`;
        } else {
            return "No examples defined."
        }
    }

    public changeRefType(newType: SimplifiedType): void {
        let nt: SimplifiedType = new SimplifiedType();
        nt.type = newType.type;
        nt.enum_ = newType.enum_;
        nt.of = newType.of;
        nt.as = newType.as;

        let command: ICommand = CommandFactory.createChangePayloadRefCommand_Aai20$java_lang_String$io_apicurio_datamodels_asyncapi_models_AaiMessage(nt.type, this.message);
        this.commandService.emit(command);

        this._model = nt;
    }

    public schemaForExamplePayload(): Aai20Schema {
        if (this.message.payload && this.message.payload.$ref) {
            return ReferenceUtil.resolveRef(this.message.payload.$ref, this.message) as Aai20Schema;
        }
        return null;
    }
    public schemaForExampleHeaders(): Aai20Schema {
        if (this.message.headers && this.message.headers.$ref) {
            return ReferenceUtil.resolveRef(this.message.headers.$ref, this.message) as Aai20Schema;
        }
        return null;
    }

    public exampleName(example: any): string {
        return example.name as string;
    }
    public examplePayloadValue(example: any): string {
        let evalue: any = example.payload;
        if (typeof evalue === "object" || Array.isArray(evalue)) {
            evalue = JSON.stringify(evalue);
        }
        return evalue;
    }
    public exampleHeadersValue(example: any): string {
        let evalue: any = example.headers;
        if (typeof evalue === "object" || Array.isArray(evalue)) {
            evalue = JSON.stringify(evalue);
        }
        return evalue;
    }

    public addExample(exampleData: any): void {
        let example: any = {};
        example.name = exampleData.name;
        // Add payload if provided.
        if (exampleData.payloadValue != null) {
            example.payload = exampleData.payloadValue
        }
        // Add headers if provided.
        if (exampleData.headersValue != null) {
            example.headers = exampleData.headersValue;
        }
        let command: ICommand = CommandFactory.createAddMessageExampleCommand_Aai20(this.message.parent() as AaiOperation, example);
        this.commandService.emit(command);
        let nodePath = Library.createNodePath(this.message);
        nodePath.appendSegment("examples", false);
        this.__selectionService.select(nodePath.toString());
    }
    public editExample(event: EditExampleEvent): void {
        console.info("[PayloadTabComponent] Changing the value of a Message example.");
        /** Not implemented for the moment.
        let command: ICommand = CommandFactory.createSetExampleCommand(this.item.ownerDocument().getDocumentType(), this.item,
            event.value, event.example.getName());
        this.commandService.emit(command);
        */
    }
    public deleteExample(example: any): void {
        let command: ICommand = CommandFactory.createDeleteMessageExampleCommand_Aai20(this.message.parent() as AaiOperation, example);
        this.commandService.emit(command);
        let nodePath = Library.createNodePath(this.message);
        this.__selectionService.select(nodePath.toString());
    }

    public deleteAllExamples(): void {
        let command: ICommand = CommandFactory.createDeleteAllMessageExamplesCommand_Aai20(this.message.parent() as AaiOperation);
        this.commandService.emit(command);
    }
}
