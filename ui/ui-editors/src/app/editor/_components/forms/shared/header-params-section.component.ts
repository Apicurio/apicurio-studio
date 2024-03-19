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
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {
    CommandFactory,
    ICommand,
    IOasParameterParent,
    Library,
    Node,
    Oas20Operation,
    Oas20Parameter,
    Oas20PathItem,
    Oas30Operation,
    Oas30Parameter,
    Oas30PathItem,
    OasOperation,
    OasParameter,
    OasPathItem
} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {EditorsService} from "../../../_services/editors.service";
import {
    IParameterEditorHandler,
    ParameterData,
    ParameterEditorComponent
} from "../../editors/parameter-editor.component";
import {AbstractBaseComponent} from "../../common/base-component";
import {SelectionService} from "../../../_services/selection.service";
import {ModelUtils} from "../../../_util/model.util";
import {RenameEntityDialogComponent, RenameEntityEvent} from "../../dialogs/rename-entity.component";

@Component({
    selector: "header-params-section",
    templateUrl: "header-params-section.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderParamsSectionComponent extends AbstractBaseComponent {

    @Input() parent: IOasParameterParent;
    @Input() path: OasPathItem;

    @ViewChild("renameDialog", { static: true }) renameDialog: RenameEntityDialogComponent;

    private _headerParameters: OasParameter[] = null;

    public showSectionBody: boolean;

    constructor(private changeDetectorRef: ChangeDetectorRef, private commandService: CommandService,
                private documentService: DocumentService, private editors: EditorsService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected onDocumentChange(): void {
        this._headerParameters = null;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.showSectionBody = this.hasHeaderParameters();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        this._headerParameters = null;
    }

    public isPathItem(): boolean {
        return this.parent === this.path;
    }

    public contextHelp(): string {
        if (this.isPathItem()) {
            return `
                Use this section to define HTTP Header Parameters for all of the Operations in this
                path.  These header parameters will apply to all operations and can be overridden
                (though not removed) at the operation level.`;
        } else {
            return `
                An operation may, optionally, allow additional options to be sent via HTTP header
                parameters.  This section allows you to document what header parameters are
                accepted/expected by this operation.`;
        }
    }

    public hasParameters(type: string): boolean {
        return this.parent.getParametersIn(type).length > 0
    }

    public hasHeaderParameters(): boolean {
        return this.parent.getParametersIn("header").length > 0 || this.path.getParametersIn("header").length > 0;
    }

    public parameters(paramType: string): OasParameter[] {
        let params: OasParameter[] = this.parent.getParametersIn(paramType);
        return params.sort((param1, param2) => {
            return param1.name.localeCompare(param2.name);
        });
    }

    public headerParameters(): OasParameter[] {
        if (this.isPathItem()) {
            return this.parameters("header");
        }

        if (this._headerParameters !== null) {
            return this._headerParameters;
        }

        let opParams: OasParameter[] = this.parameters("header");
        let piParams: OasParameter[] = this.path.getParametersIn("header");
        let hasOpParam = function(param: OasParameter): boolean {
            var found: boolean = false;
            opParams.forEach( opParam => {
                if (opParam.name === param.name) {
                    found = true;
                }
            });
            return found;
        };
        piParams.forEach( param => {
            if (!hasOpParam(param)) {
                let missingParam: OasParameter = this.parent.createParameter();
                Library.readNode(Library.writeNode(param), missingParam);
                missingParam.setAttribute("missing", true);
                opParams.push(missingParam);
            }
        });
        this._headerParameters = opParams.sort((param1, param2) => {
            return param1.name.localeCompare(param2.name);
        });
        return this._headerParameters;
    }

    public headerParameterPaths(): string[] {
        return this.parent.getParametersIn("header").map( param => {
            return ModelUtils.nodeToPath(param);
        });
    }

    public openAddHeaderParamEditor(): void {
        let editor: ParameterEditorComponent = this.editors.getParameterEditor();
        editor.setParamType("header");
        let handler: IParameterEditorHandler = {
            onSave: (event) => {
                this.addHeaderParam(event.data);
            },
            onCancel: () => {}
        };
        editor.open(handler, <OasPathItem | OasOperation> this.parent);
    }

    public deleteAllHeaderParams(): void {
        let command: ICommand = CommandFactory.createDeleteAllParametersCommand(this.parent, "header");
        this.commandService.emit(command);
    }

    public deleteParam(parameter: OasParameter): void {
        let command: ICommand = CommandFactory.createDeleteParameterCommand(parameter);
        this.commandService.emit(command);
    }

    public addHeaderParam(data: ParameterData): void {
        let command: ICommand = CommandFactory.createNewParamCommand(this.parent, data.name,
            "header", data.description, data.type, false);
        this.commandService.emit(command);
        let nodePath = Library.createNodePath((this.parent as any) as Node); // This should be OK for now, but still unsafe, TODO fix
        let index: number = this.parent.getParameters().findIndex(p => p.name === data.name); // TODO hackish
        nodePath.appendSegment("parameters", false);
        nodePath.appendSegment(String(index), true);
        this.__selectionService.select(nodePath.toString());
    }

    /**
     * Opens the rename parameter dialog.
     * @param parameter
     */
    public openRenameDialog(parameter: OasParameter): void {
        let parent: IOasParameterParent = <any>parameter.parent();
        let paramNames: string[] = parent.getParametersIn("header").map( param => { return param.name; });
        this.renameDialog.open(parameter, parameter.name, newName => {
            return paramNames.indexOf(newName) !== -1;
        });
    }

    /**
     * Renames the parameter.
     * @param event
     */
    public rename(event: RenameEntityEvent): void {
        let parameter: OasParameter = <any>event.entity;
        let parent: OasPathItem | OasOperation = <any>parameter.parent();
        let command: ICommand = CommandFactory.createRenameParameterCommand(parent, parameter.name, event.newName, "header");
        this.commandService.emit(command);
    }

}
