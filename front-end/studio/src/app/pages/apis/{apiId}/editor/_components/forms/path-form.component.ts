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

import {Component, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {Oas20PathItem, Oas30PathItem, OasDocument, OasParameterBase, OasPathItem, OasPaths} from "oai-ts-core";
import {
    createAddPathItemCommand,
    createChangeParameterTypeCommand,
    createChangePropertyCommand,
    createDeleteParameterCommand,
    createDeletePathCommand,
    createNewPathCommand,
    createRenamePathItemCommand,
    createReplacePathItemCommand,
    ICommand,
    SimplifiedParameterType
} from "oai-ts-commands";
import {SourceFormComponent} from "./source-form.base";
import {ClonePathDialogComponent} from "../dialogs/clone-path.component";
import {AddPathDialogComponent} from "../dialogs/add-path.component";
import {RenamePathDialogComponent} from "../dialogs/rename-path.component";
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";
import {DocumentService} from "../../_services/document.service";


@Component({
    moduleId: module.id,
    selector: "path-form",
    templateUrl: "path-form.component.html",
    styleUrls: [ "path-form.component.css" ],
    encapsulation: ViewEncapsulation.None
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

    @ViewChild("clonePathDialog") clonePathDialog: ClonePathDialogComponent;
    @ViewChild("addPathDialog") addPathDialog: AddPathDialogComponent;
    @ViewChild("renamePathDialog") renamePathDialog: RenamePathDialogComponent;

    public constructor(protected selectionService: SelectionService, protected commandService: CommandService,
                       protected documentService: DocumentService) {
        super(selectionService, commandService, documentService);
    }

    protected createEmptyNodeForSource(): OasPathItem {
        return (<OasPaths>this.path.parent()).createPathItem(this.path.path());
    }

    protected createReplaceNodeCommand(node: OasPathItem): ICommand {
        return createReplacePathItemCommand(this.path.ownerDocument(), this.path as any, node as any);
    }

    public document(): OasDocument {
        return this.path.ownerDocument();
    }

    public delete(): void {
        let command: ICommand = createDeletePathCommand(this.path.ownerDocument(), this.path.path());
        this.commandService.emit(command);
    }

    public newPath(): void {
        this.addPathDialog.open(this.path.ownerDocument(), this.path.path());
    }

    public addPath(path: string): void {
        let command: ICommand = createNewPathCommand(this.path.ownerDocument(), path);
        this.commandService.emit(command);
    }

    public clone(modalData?: any): void {
        if (undefined === modalData || modalData === null) {
            this.clonePathDialog.open(this.path.ownerDocument(), this.path);
        } else {
            let pathItem: OasPathItem = modalData.object;
            console.info("[PathFormComponent] Clone path item: %s", modalData.path);
            let cloneSrcObj: any = this.oasLibrary().writeNode(pathItem);
            let command: ICommand = createAddPathItemCommand(this.path.ownerDocument(), modalData.path, cloneSrcObj);
            this.commandService.emit(command);
        }
    }

    public rename(modalData?: any): void {
        if (undefined === modalData || modalData === null) {
            this.renamePathDialog.open(this.path.ownerDocument(), this.path as Oas20PathItem | Oas30PathItem);
        } else {
            let path: OasPathItem = modalData.path;
            console.info("[PathFormComponent] Rename path item: %s", modalData.path);
            let oldName: string = path.path();
            console.info("[PathFormComponent] Rename definition to: %s", modalData.name);
            let command: ICommand = createRenamePathItemCommand(this.path.ownerDocument(), oldName, modalData.name, modalData.renameSubpaths);
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

    public parameters(paramType: string): OasParameterBase[] {
        if (!this.path.parameters) {
            return [];
        }
        let params: OasParameterBase[] = this.path.parameters;
        return params.filter( value => {
            return value.in === paramType;
        }).sort((param1, param2) => {
            return param1.name.localeCompare(param2.name);
        });
    }

    public changeParamDescription(param: OasParameterBase, newParamDescription: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.path.ownerDocument(), param, "description", newParamDescription);
        this.commandService.emit(command);
    }

    public changeParamType(param: OasParameterBase, newType: SimplifiedParameterType): void {
        let command: ICommand = createChangeParameterTypeCommand(this.path.ownerDocument(), param as any, newType);
        this.commandService.emit(command);
    }

    public deleteParam(parameter: OasParameterBase): void {
        let command: ICommand = createDeleteParameterCommand(this.path.ownerDocument(), parameter as any);
        this.commandService.emit(command);
    }

    public enableSourceMode(): void {
        this.sourceNode = this.path;
        super.enableSourceMode();
    }

}
