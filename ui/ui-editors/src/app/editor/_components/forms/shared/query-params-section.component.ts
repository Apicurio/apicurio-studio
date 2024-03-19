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
    Oas20Operation,
    Oas20PathItem,
    Oas30Operation,
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
    selector: "query-params-section",
    templateUrl: "query-params-section.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryParamsSectionComponent extends AbstractBaseComponent {

    @Input() parent: Oas20Operation | Oas30Operation | Oas20PathItem | Oas30PathItem;
    @Input() path: OasPathItem;

    @ViewChild("renameDialog", { static: true }) renameDialog: RenameEntityDialogComponent;

    private _queryParameters: OasParameter[] = null;

    public showSectionBody: boolean;

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param commandService
     * @param documentService
     * @param editors
     * @param selectionService
     */
    constructor(private changeDetectorRef: ChangeDetectorRef, private commandService: CommandService,
                private documentService: DocumentService, private editors: EditorsService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected onDocumentChange(): void {
        this._queryParameters = null;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.showSectionBody = this.hasQueryParameters();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        this._queryParameters = null;
    }

    public isPathItem(): boolean {
        return this.parent === this.path;
    }

    public contextHelp(): string {
        if (this.isPathItem()) {
            return `
                Use this section to define HTTP Query Parameters for all of the Operations in this
                path.  These query parameters will apply to all operations and can be overridden
                (though not removed) at the operation level.`;
        } else {
            return `
                An operation may, optionally, allow additional options to be sent via URL query
                parameters.  This section allows you to document what query parameters are
                accepted/expected by this operation.`;
        }
    }

    public hasParameters(type: string): boolean {
        if (!this.parent.parameters) {
            return false;
        }
        return this.parent.parameters.filter((value) => {
            return value.in === type;
        }).length > 0;
    }

    public hasQueryParameters(): boolean {
        return this.parent.getParametersIn("query").length > 0 || this.path.getParametersIn("query").length > 0;
    }

    public parameters(paramType: string): OasParameter[] {
        let params: OasParameter[] = this.parent.getParametersIn(paramType);
        return params.sort((param1, param2) => {
            return param1.name.localeCompare(param2.name);
        });
    }

    public queryParameters(): OasParameter[] {
        if (this.isPathItem()) {
            return this.parameters("query");
        }

        if (this._queryParameters !== null) {
            return this._queryParameters;
        }

        let opParams: OasParameter[] = this.parameters("query");
        let piParams: OasParameter[] = this.path.getParametersIn("query");
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
        this._queryParameters = opParams.sort((param1, param2) => {
            return param1.name.localeCompare(param2.name);
        });
        return this._queryParameters;
    }

    public queryParameterPaths(): string[] {
        return this.parent.getParametersIn("query").map( param => {
            return ModelUtils.nodeToPath(param);
        });
    }

    public openAddQueryParamEditor(): void {
        let editor: ParameterEditorComponent = this.editors.getParameterEditor();
        editor.setParamType("query");
        let handler: IParameterEditorHandler = {
            onSave: (event) => {
                this.addQueryParam(event.data);
            },
            onCancel: () => {}
        };
        editor.open(handler, this.parent);
    }

    public deleteAllQueryParams(): void {
        let command: ICommand = CommandFactory.createDeleteAllParametersCommand(this.parent, "query");
        this.commandService.emit(command);
    }

    public deleteParam(parameter: OasParameter): void {
        let command: ICommand = CommandFactory.createDeleteParameterCommand(parameter);
        this.commandService.emit(command);
    }

    public addQueryParam(data: ParameterData): void {
        let command: ICommand = CommandFactory.createNewParamCommand(this.parent, data.name,
            "query", data.description, data.type, false);
        this.commandService.emit(command);

        let nodePath = Library.createNodePath(this.parent);
        let index: number = (this.parent as any).parameters.findIndex(p => p.name === data.name); // TODO hackish
        nodePath.appendSegment("parameters", false);
        nodePath.appendSegment(String(index), true);
    }

    /**
     * Opens the rename parameter dialog.
     * @param parameter
     */
    public openRenameDialog(parameter: OasParameter): void {
        let parent: IOasParameterParent = <any>parameter.parent();
        let paramNames: string[] = parent.getParametersIn("query").map( param => { return param.name; });
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
        let command: ICommand = CommandFactory.createRenameParameterCommand(parent, parameter.name, event.newName, "query");
        this.commandService.emit(command);
    }

}
