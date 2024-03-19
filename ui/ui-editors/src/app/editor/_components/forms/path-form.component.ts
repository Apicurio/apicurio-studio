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
    CommandFactory,
    ICommand,
    Library,
    Oas20PathItem,
    Oas30PathItem,
    OasDocument,
    OasParameter,
    OasPathItem,
    OasPaths,
    SimplifiedParameterType
} from "@apicurio/data-models";
import {SourceFormComponent} from "./source-form.base";
import {ClonePathDialogComponent} from "../dialogs/clone-path.component";
import {AddPathDialogComponent} from "../dialogs/add-path.component";
import {RenamePathDialogComponent} from "../dialogs/rename-path.component";
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";
import {DocumentService} from "../../_services/document.service";
import {EditorsService} from "../../_services/editors.service";
// import {SectionComponent} from "./shared/section.component";
import {AbstractBaseComponent} from "../common/base-component";


@Component({
    selector: "path-form",
    templateUrl: "path-form.component.html",
    styleUrls: [ "path-form.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PathFormComponent extends SourceFormComponent<OasPathItem> {

    protected _path: OasPathItem;
    @Input()
    set path(path: OasPathItem) {
        this._path = path;
        this.sourceNode = path;
        this.revertSource();
    }
    get path(): OasPathItem {
        return this._path;
    }

    @ViewChild("clonePathDialog", { static: true }) clonePathDialog: ClonePathDialogComponent;
    @ViewChild("addPathDialog", { static: true }) addPathDialog: AddPathDialogComponent;
    @ViewChild("renamePathDialog", { static: true }) renamePathDialog: RenamePathDialogComponent;

    public constructor(protected changeDetectorRef: ChangeDetectorRef,
                       protected selectionService: SelectionService,
                       protected commandService: CommandService,
                       protected documentService: DocumentService,
                       private editors: EditorsService) {
        super(changeDetectorRef, selectionService, commandService, documentService);
    }

    protected createEmptyNodeForSource(): OasPathItem {
        return (<OasPaths>this.path.parent()).createPathItem(this.path.getPath());
    }

    protected createReplaceNodeCommand(node: OasPathItem): ICommand {
        return CommandFactory.createReplacePathItemCommand(this.path, node);
    }

    public document(): OasDocument {
        return <OasDocument>this.path.ownerDocument();
    }

    public is3xDocument(): boolean {
        return (<OasDocument>this.path.ownerDocument()).is3xDocument();
    }

    public delete(): void {
        let command: ICommand = CommandFactory.createDeletePathCommand(this.path.getPath());
        this.commandService.emit(command);
    }

    public newPath(): void {
        this.addPathDialog.open(<OasDocument>this.path.ownerDocument(), this.path.getPath());
    }

    public addPath(path: string): void {
        let command: ICommand = CommandFactory.createNewPathCommand(path);
        this.commandService.emit(command);
        let nodePath = Library.createNodePath(this.path.ownerDocument());
        nodePath.appendSegment("paths", false);
        nodePath.appendSegment(path, true);
        this.selectionService.select(nodePath.toString());
    }

    public clone(modalData?: any): void {
        if (undefined === modalData || modalData === null) {
            this.clonePathDialog.open(<OasDocument>this.path.ownerDocument(), this.path);
        } else {
            let pathItem: OasPathItem = modalData.object;
            console.info("[PathFormComponent] Clone path item: %s", modalData.path);
            let cloneSrcObj: any = Library.writeNode(pathItem);
            let command: ICommand = CommandFactory.createAddPathItemCommand(modalData.path, cloneSrcObj);
            this.commandService.emit(command);
            let nodePath = Library.createNodePath(this.path.ownerDocument());
            nodePath.appendSegment("paths", false);
            nodePath.appendSegment(modalData.path, true);
            this.selectionService.select(nodePath.toString());
        }
    }

    public rename(modalData?: any): void {
        if (undefined === modalData || modalData === null) {
            this.renamePathDialog.open(<OasDocument>this.path.ownerDocument(), this.path as Oas20PathItem | Oas30PathItem);
        } else {
            let path: OasPathItem = modalData.path;
            console.info("[PathFormComponent] Rename path item: %s", modalData.path);
            let oldName: string = path.getPath();
            console.info("[PathFormComponent] Rename definition to: %s", modalData.name);
            let command: ICommand = CommandFactory.createRenamePathItemCommand(oldName, modalData.name, modalData.renameSubpaths);
            this.commandService.emit(command);
        }
    }

    public hasParameters(type: string): boolean {
        if (!this.path.parameters) {
            return false;
        }
        return this.path.parameters.filter((value) => {
                return value.in === type;
            }).length > 0;
    }

    public parameters(paramType: string): OasParameter[] {
        if (!this.path.parameters) {
            return [];
        }
        let params: OasParameter[] = this.path.parameters;
        return params.filter( value => {
            return value.in === paramType;
        }).sort((param1, param2) => {
            return param1.name.localeCompare(param2.name);
        });
    }

    public changeParamDescription(param: OasParameter, newParamDescription: string): void {
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(param, "description", newParamDescription);
        this.commandService.emit(command);
    }

    public changeParamType(param: OasParameter, newType: SimplifiedParameterType): void {
        let command: ICommand = CommandFactory.createChangeParameterTypeCommand(this.path.ownerDocument().getDocumentType(),
            param as any, newType);
        this.commandService.emit(command);
    }

    public deleteParam(parameter: OasParameter): void {
        let command: ICommand = CommandFactory.createDeleteParameterCommand(parameter);
        this.commandService.emit(command);
    }

    public enableSourceMode(): void {
        this.sourceNode = this.path;
        super.enableSourceMode();
    }

}
