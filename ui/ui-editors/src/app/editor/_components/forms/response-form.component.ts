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
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {
    CombinedVisitorAdapter,
    CommandFactory,
    DocumentType,
    ICommand,
    Library,
    Oas20Document,
    Oas20Schema,
    Oas20ResponseDefinition,
    Oas30Document,
    Oas30Schema,
    Oas30ResponseDefinition,
    OasDocument,
    OasSchema,
    SimplifiedPropertyType,
    TraverserDirection,
    VisitorUtil, OasResponse, ReferenceUtil,
} from "@apicurio/data-models";

import {SourceFormComponent} from "./source-form.base";
import {CloneResponseDialogComponent} from "../dialogs/clone-response.component";
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";
import {DocumentService} from "../../_services/document.service";
import {IPropertyEditorHandler, PropertyData, PropertyEditorComponent} from "../editors/property-editor.component";
import {EditorsService} from "../../_services/editors.service";
import {ModelUtils} from "../../_util/model.util";
import {RenameEntityDialogComponent, RenameEntityEvent} from "../dialogs/rename-entity.component";
import Oas20PropertySchema = Oas20Schema.Oas20PropertySchema;
import Oas30PropertySchema = Oas30Schema.Oas30PropertySchema;
import { AbstractBaseComponent } from "../common/base-component";
import {CloneResponseDefinitionDialogComponent} from "../dialogs/clone-response-definition.component";
import {ApiCatalogService} from "../../_services/api-catalog.service";


@Component({
    selector: "response-form",
    templateUrl: "response-form.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponseFormComponent extends SourceFormComponent<OasResponse> {

    private _response: Oas20ResponseDefinition | Oas30ResponseDefinition;
    @Input()
    set response(response: Oas20ResponseDefinition | Oas30ResponseDefinition) {
        this._response = response;
        this.sourceNode = response;
        this.revertSource();
    }

    get response(): Oas20ResponseDefinition | Oas30ResponseDefinition {
        return this._response;
    }

    @ViewChild("cloneResponseDialog", { static: true }) cloneResponseDialog: CloneResponseDefinitionDialogComponent;
    @ViewChild("renameResponseDialog", { static: true }) renameResponseDialog: RenameEntityDialogComponent;

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param selectionService
     * @param commandService
     * @param documentService
     * @param editors
     * @param catalog
     */
    public constructor(protected changeDetectorRef: ChangeDetectorRef,
                       protected selectionService: SelectionService,
                       protected commandService: CommandService,
                       protected documentService: DocumentService,
                       private editors: EditorsService,
                       private catalog: ApiCatalogService) {
        super(changeDetectorRef, selectionService, commandService, documentService);
    }

    public responseName(): string {
        return this._response.getName();
    }

    is20Document(): boolean {
        let doc: OasDocument = <OasDocument>this.response.ownerDocument();
        return doc.is2xDocument();
    }

    is30Document(): boolean {
        let doc: OasDocument = <OasDocument>this.response.ownerDocument();
        return doc.is3xDocument();
    }

    protected createEmptyNodeForSource(): Oas20ResponseDefinition | Oas30ResponseDefinition {
        if (this.response.ownerDocument().getDocumentType() == DocumentType.openapi2) {
            return (this.response.ownerDocument() as Oas20Document).responses.createResponse(this.responseName());
        } else {
            return (this.response.ownerDocument() as Oas30Document).components.createResponseDefinition(this.responseName());
        }
    }

    protected createReplaceNodeCommand(node: Oas20ResponseDefinition | Oas30ResponseDefinition): ICommand {
        return CommandFactory.createReplaceResponseDefinitionCommand(this.response.ownerDocument().getDocumentType(), this.response, node);
        return null;
    }

    public delete(): void {
        console.info("[ResponseFormComponent] Deleting response.");
        let command: ICommand = CommandFactory.createDeleteResponseDefinitionCommand(this.response.ownerDocument().getDocumentType(),
            this.responseName());
        this.commandService.emit(command);
    }

    public clone(modalData?: any): void {
        if (undefined === modalData || modalData === null) {
            this.cloneResponseDialog.open(<OasDocument> this.response.ownerDocument(), this.response);
        } else {
            let response: Oas20ResponseDefinition | Oas30ResponseDefinition = modalData.response;
            console.info("[ResponseFormComponent] Clone response: %s", modalData.name);
            let cloneSrcObj: any = Library.writeNode(response);
            let command: ICommand = CommandFactory.createAddResponseDefinitionCommand(this.response.ownerDocument().getDocumentType(),
                modalData.name, cloneSrcObj);
            this.commandService.emit(command);
        }
    }

    public rename(event?: RenameEntityEvent): void {
        if (undefined === event || event === null) {
            let schemaDef: Oas20ResponseDefinition | Oas30ResponseDefinition = this.response;
            let name: string = this.responseName();
            let responseNames: string[] = [];
            let form: ResponseFormComponent = this;
            VisitorUtil.visitTree(this.response.ownerDocument(), new class extends CombinedVisitorAdapter {
                public visitResponseDefinition(node: Oas20ResponseDefinition | Oas30ResponseDefinition): void {
                    responseNames.push(form._responseName(node));
                }
            }, TraverserDirection.down);
            this.renameResponseDialog.open(schemaDef, name, newName => {
                return responseNames.indexOf(newName) !== -1;
            });
        } else {
            let oldName: string = this.responseName();
            console.info("[ResponseFormComponent] Rename response to: %s", event.newName);
            let command: ICommand = CommandFactory.createRenameResponseDefinitionCommand(this.response.ownerDocument().getDocumentType(),
                oldName, event.newName);
            this.commandService.emit(command);
            // TODO reselect the renamed response - we can fabricate the path and then fire a selection event.
        }
    }

    public enableSourceMode(): void {
        this.sourceNode = this.response;
        super.enableSourceMode();
    }

    /**
     * Figures out the response name.
     * @param response
     */
    protected _responseName(response: Oas20ResponseDefinition | Oas30ResponseDefinition): string {
        return response.getName();
    }

    isImported(): boolean {
        return this.response.$ref && !this.response.$ref.startsWith("#");
    }

    /**
     * When the response is an import, returns the content for the imported entity.
     */
    referenceContent(): string {
        if (this.response.$ref && this.response.$ref.indexOf("#") > 0) {
            let hashIdx: number = this.response.$ref.indexOf("#");
            let resourceUrl: string = this.response.$ref.substring(0, hashIdx);
            let content: any = this.catalog.lookup(resourceUrl);
            if (content) {
                    let fragment: string = this.response.$ref.substring(hashIdx+1);
                    content = ReferenceUtil.resolveFragmentFromJS(content, fragment);
                    if (content) {
                            return JSON.stringify(content, null, 3);
                        }
                }
        }
        return "Content not available.";
    }

    refLink(): string {
        if (this.response.$ref && this.response.$ref.startsWith("apicurio:")) {
            let currentUrl: string = window.location.href;
            let refId: string = this.getRefId();
            // Drop the /editor and /12345 (apiId) from the URL
                let prefix: string = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
            prefix = prefix.substring(0, prefix.lastIndexOf('/'));
            return prefix + "/" + refId;
        } else {
            return this.response.$ref;
        }
    }

    private getRefId(): string {
        let colonIdx: number = this.response.$ref.indexOf(':');
        let hashIdx: number = this.response.$ref.indexOf('#');
        return this.response.$ref.substring(colonIdx + 1, hashIdx);
    }

}
