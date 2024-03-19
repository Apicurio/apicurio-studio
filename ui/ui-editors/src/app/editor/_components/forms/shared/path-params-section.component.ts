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
import {
    Oas20Operation,
    Oas20Parameter,
    Oas20PathItem,
    Oas30Operation,
    Oas30Parameter,
    Oas30PathItem,
    CombinedVisitorAdapter,
    Library,
    OasOperation,
    OasPathItem,
    ICommand, OasParameter, CommandFactory
} from "@apicurio/data-models";
import {ModelUtils as OaiModelUtils} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {SelectionService} from "../../../_services/selection.service";
import {ModelUtils} from "../../../_util/model.util";


@Component({
    selector: "path-params-section",
    templateUrl: "path-params-section.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PathParamsSectionComponent extends AbstractBaseComponent {

    @Input() parent: Oas20Operation | Oas30Operation | Oas20PathItem | Oas30PathItem;
    @Input() path: OasPathItem;

    private _pathParameters: (Oas30Parameter | Oas20Parameter)[] = null;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected onDocumentChange(): void {
        this._pathParameters = null;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        this._pathParameters = null;
    }

    public canHavePathParams(): boolean {
        return this.path.getPath().indexOf("{") !== -1;
    }

    public isPathItem(): boolean {
        return this.parent === this.path;
    }

    public contextHelp(): string {
        if (this.isPathItem()) {
            return `
                This section is visible because this path has at least one dynamic path parameter.
                Here you can configure information about the path parameter, such as its description
                and type.  This information will be inherited by all operations in the path (but can
                optionally be overridden by each respective operation).`;
        } else {
            return `
                This section is visible because the path/endpoint this operation belongs to has dynamic
                parameters. Configure the parameters' descriptions and types below.`

        }
    }

    public pathParameters(): (Oas30Parameter | Oas20Parameter)[] {
        if (this._pathParameters === null) {
            let names: any = {};
            OaiModelUtils.detectPathParamNames(this.path.getPath()).forEach( paramName => {
                names[paramName] = "detected";
            });
            this.parent.getParametersIn("path").forEach( param => {
                names[param.name] = "present";
            });

            this._pathParameters = [];
            for (let pname in names) {
                this._pathParameters.push(this.pathParam(pname));
            }
        }
        return this._pathParameters;
    }

    public pathParameterPaths(): string[] {
        return this.parent.getParametersIn("path").map( param => {
            return ModelUtils.nodeToPath(param);
        });
    }

    public pathParam(paramName: string): Oas30Parameter | Oas20Parameter {
        let param: Oas20Parameter | Oas30Parameter = this.parent.getParameter("path", paramName) as Oas30Parameter | Oas20Parameter;

        if (param === null) {
            let missingParam: Oas30Parameter | Oas20Parameter = this.parent.createParameter() as Oas30Parameter | Oas20Parameter;
            missingParam.in = "path";
            missingParam.name = paramName;
            missingParam.required = true;
            let overriddenParam: OasParameter = this.getOverriddenParam(missingParam);
            if (overriddenParam) {
                Library.readNode(Library.writeNode(overriddenParam), missingParam);
            }
            missingParam.setAttribute("missing", true);
            param = missingParam;
        }

        return param;
    }

    public deleteParam(parameter: Oas30Parameter): void {
        let command: ICommand = CommandFactory.createDeleteParameterCommand(parameter);
        this.commandService.emit(command);
    }

    public createPathParam(paramName: string): void {
        let command: ICommand = CommandFactory.createNewParamCommand(this.parent, paramName, "path",
            null, null, false);
        this.commandService.emit(command);

        let nodePath = Library.createNodePath(this.parent);
        let index: number = (this.parent as any).parameters.findIndex(p => p.name === paramName);
        nodePath.appendSegment("parameters", false);
        nodePath.appendSegment(String(index), true);
    }

    public getOverriddenParam(param: OasParameter): OasParameter {
        let viz: DetectOverrideVisitor = new DetectOverrideVisitor(param);
        param.parent().accept(viz);
        return viz.overriddenParam;
    }

}

class DetectOverrideVisitor extends CombinedVisitorAdapter {

    public overriddenParam: OasParameter = null;

    constructor(private param: OasParameter) {
        super();
    }

    public visitOperation(node: OasOperation): void {
        this.overriddenParam = (<OasPathItem>node.parent()).getParameter(this.param.in, this.param.name) as OasParameter;
    }

}
