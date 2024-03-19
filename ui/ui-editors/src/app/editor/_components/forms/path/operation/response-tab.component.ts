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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    SimpleChanges,
    ViewEncapsulation
} from "@angular/core";
import {CommandFactory, DocumentType, ICommand, Library, NodePath, Oas20Response, OasDocument, SimplifiedType} from "@apicurio/data-models";
import {CommandService} from "../../../../_services/command.service";
import {DocumentService} from "../../../../_services/document.service";
import {EditExample20Event} from "../../../dialogs/edit-example-20.component";
import {AbstractBaseComponent} from "../../../common/base-component";
import {SelectionService} from "../../../../_services/selection.service";
import {ObjectUtils} from "apicurio-ts-core";


@Component({
    selector: "response-tab",
    templateUrl: "response-tab.component.html",
    styleUrls: [ "response-tab.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponseTabComponent extends AbstractBaseComponent {

    @Input() response: Oas20Response;

    protected _model: SimplifiedType = null;

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
        return <OasDocument> this.response.ownerDocument();
    }

    public hasExamples(): boolean {
        if (ObjectUtils.isNullOrUndefined(this.response.examples)) {
            return false;
        }
        return this.response.examples.getExampleContentTypes().length > 0;
    }

    public exampleContentTypes(): string[] {
        return this.response.examples.getExampleContentTypes();
    }

    public exampleDisplayValue(contentType: string): string {
        let evalue: any = this.response.examples.getExample(contentType);
        if (typeof evalue === "object" || Array.isArray(evalue)) {
            evalue = JSON.stringify(evalue);
        }
        return evalue;
    }

    public exampleValue(contentType: string): string {
        let evalue: any = this.response.examples.getExample(contentType);
        return evalue;
    }

    public displayType(): SimplifiedType {
        return SimplifiedType.fromSchema(this.response.schema);
    }

    public changeType(newType: SimplifiedType): void {
        let nt: SimplifiedType = new SimplifiedType();
        nt.type = newType.type;
        nt.enum_ = newType.enum_;
        nt.of = newType.of;
        nt.as = newType.as;
        let command: ICommand = CommandFactory.createChangeResponseTypeCommand(this.response, nt);
        this.commandService.emit(command);
        this._model = nt;
    }

    public setDescription(description: string): void {
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(this.response, "description",
            description);
        this.commandService.emit(command);
    }

    public deleteExample(contentType: string): void {
        let command: ICommand = CommandFactory.createDelete20ExampleCommand(this.response, contentType);
        this.commandService.emit(command);
    }

    public addExample(exampleData: any): void {
        let command: ICommand = CommandFactory.createSetExampleCommand(this.document().getDocumentType(), this.response,
            exampleData.value, exampleData.contentType);
        this.commandService.emit(command);
        let nodePath = Library.createNodePath(this.response);
        nodePath.appendSegment("examples", false);
        this.selectionService.select(nodePath.toString());
    }

    public editExample(event: EditExample20Event): void {
        let command: ICommand = CommandFactory.createSetExampleCommand(this.document().getDocumentType(), this.response,
            event.value, event.contentType);
        this.commandService.emit(command);
        let nodePath = Library.createNodePath(this.response);
        nodePath.appendSegment("examples", false);
        this.selectionService.select(nodePath.toString());
    }

}
