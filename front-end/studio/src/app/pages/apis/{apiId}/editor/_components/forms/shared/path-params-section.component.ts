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
    OasCombinedVisitorAdapter,
    OasLibraryUtils,
    OasOperation,
    OasParameterBase,
    OasPathItem
} from "oai-ts-core";
import {ModelUtils as OaiModelUtils} from "oai-ts-commands";
import {CommandService} from "../../../_services/command.service";
import {createDeleteParameterCommand, createNewParamCommand, ICommand} from "oai-ts-commands";
import {DocumentService} from "../../../_services/document.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {SelectionService} from "../../../_services/selection.service";


@Component({
    moduleId: module.id,
    selector: "path-params-section",
    templateUrl: "path-params-section.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PathParamsSectionComponent extends AbstractBaseComponent {

    @Input() parent: Oas20Operation | Oas30Operation | Oas20PathItem | Oas30PathItem;
    @Input() path: OasPathItem;

    private _pathParameters: (Oas30Parameter | Oas20Parameter)[] = null;
    private _library: OasLibraryUtils = new OasLibraryUtils();

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
        return this.path.path().indexOf("{") !== -1;
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
            OaiModelUtils.detectPathParamNames(this.path.path()).forEach( paramName => {
                names[paramName] = "detected";
            });
            this.parent.getParameters("path").forEach( param => {
                names[param.name] = "present";
            });

            this._pathParameters = [];
            for (let pname in names) {
                this._pathParameters.push(this.pathParam(pname));
            }
        }
        return this._pathParameters;
    }

    public pathParam(paramName: string): Oas30Parameter | Oas20Parameter {
        let param: Oas20Parameter | Oas30Parameter = this.parent.parameter("path", paramName) as Oas30Parameter | Oas20Parameter;

        if (param === null) {
            let missingParam: Oas30Parameter | Oas20Parameter = this.parent.createParameter() as Oas30Parameter | Oas20Parameter;
            missingParam.in = "path";
            missingParam.name = paramName;
            missingParam.required = true;
            let overriddenParam: OasParameterBase = this.getOverriddenParam(missingParam);
            if (overriddenParam) {
                this._library.readNode(this._library.writeNode(overriddenParam), missingParam);
            }
            missingParam.n_attribute("missing", true);
            param = missingParam;
        }

        return param;
    }

    public deleteParam(parameter: Oas30Parameter): void {
        let command: ICommand = createDeleteParameterCommand(this.parent.ownerDocument(), parameter);
        this.commandService.emit(command);
    }

    public createPathParam(paramName: string): void {
        let command: ICommand = createNewParamCommand(this.parent.ownerDocument(), this.parent, paramName, "path");
        this.commandService.emit(command);
    }

    public getOverriddenParam(param: OasParameterBase): OasParameterBase {
        let viz: DetectOverrideVisitor = new DetectOverrideVisitor(param);
        param.parent().accept(viz);
        return viz.overriddenParam;
    }

}

class DetectOverrideVisitor extends OasCombinedVisitorAdapter {

    public overriddenParam: OasParameterBase = null;

    constructor(private param: OasParameterBase) {
        super();
    }

    public visitOperation(node: OasOperation): void {
        this.overriddenParam = (<OasPathItem>node.parent()).parameter(this.param.in, this.param.name) as OasParameterBase;
    }

}
