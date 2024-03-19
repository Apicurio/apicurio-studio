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
import {OasDocument, Library, CommandFactory} from "@apicurio/data-models";
import {SourceFormComponent} from "./source-form.base";
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";
import {DocumentService} from "../../_services/document.service";
import {ICommand} from "@apicurio/data-models";
import {EditorsService} from "../../_services/editors.service";


@Component({
    selector: "main-form",
    templateUrl: "main-form.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainFormComponent extends SourceFormComponent<OasDocument> {

    _document: OasDocument;
    @Input()
    set document(doc: OasDocument) {
        this._document = doc;
        this.sourceNode = doc;
        this.revertSource();
    }
    get document(): OasDocument {
        return this._document;
    }

    public constructor(protected changeDetectorRef: ChangeDetectorRef,
                       protected selectionService: SelectionService,
                       protected commandService: CommandService,
                       protected documentService: DocumentService,
                       private editors: EditorsService) {
        super(changeDetectorRef, selectionService, commandService, documentService);
    }

    /**
     * Returns true if the form is for an OpenAPI 3.x document.
     */
    public is3xForm(): boolean {
        return this.document.is3xDocument();
    }

    protected createEmptyNodeForSource(): OasDocument {
        return <OasDocument> Library.createDocument(this.document.getDocumentType());
    }

    protected createReplaceNodeCommand(node: OasDocument): ICommand {
        return CommandFactory.createReplaceDocumentCommand(this.document, node);
    }

    public saveSource(): void {
        super.saveSource();
        this.sourceNode = this._document;
    }

}
