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

import {Component, Input, ViewEncapsulation} from "@angular/core";
import {
    Oas20Operation,
    Oas20Parameter,
    Oas20PathItem,
    Oas30Operation,
    Oas30Parameter,
    Oas30PathItem, OasCombinedVisitorAdapter, OasLibraryUtils, OasOperation, OasParameterBase,
    OasPathItem
} from "oai-ts-core";
import {CommandService} from "../../../_services/command.service";
import {ModelUtils} from "../../../_util/model.util";
import {
    createChangeParameterTypeCommand,
    createChangePropertyCommand,
    createDeleteParameterCommand,
    createNewParamCommand,
    ICommand,
    SimplifiedParameterType
} from "oai-ts-commands";
import {DocumentService} from "../../../_services/document.service";
import {Subscription} from "rxjs/Subscription";


@Component({
    moduleId: module.id,
    selector: "path-params-section",
    templateUrl: "path-params-section.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PathParamsSectionComponent {

    @Input() parent: Oas20Operation | Oas30Operation | Oas20PathItem | Oas30PathItem;
    _path: OasPathItem;
    @Input()
    set path(path: OasPathItem) {
        if (this._path !== path) {
            this._path = path;
            this._pathParameters = null;
        }
    }
    get path(): OasPathItem {
        return this._path;
    }

    private _pathParameters: (Oas30Parameter | Oas20Parameter)[] = null;
    private _changeSubscription: Subscription;
    private _library: OasLibraryUtils = new OasLibraryUtils();

    /**
     * C'tor.
     * @param commandService
     * @param documentService
     */
    constructor(private commandService: CommandService, private documentService: DocumentService) {}

    /**
     * Called when the component is initialized.
     */
    public ngOnInit(): void {
        this._changeSubscription = this.documentService.change().skip(1).subscribe( () => {
            this._pathParameters = null;
        });
    }

    /**
     * Called when the component is destroyed.
     */
    public ngOnDestroy(): void {
        this._changeSubscription.unsubscribe();
    }

    public canHavePathParams(): boolean {
        return this.path.path().indexOf("{") !== -1;
    }

    public isPathItem(): boolean {
        return this.parent === this.path;
    }

    public pathParameters(): (Oas30Parameter | Oas20Parameter)[] {
        if (this._pathParameters === null) {
            let names: any = {};
            ModelUtils.detectPathParamNames(this.path.path()).forEach( paramName => {
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

    public changeParamDescription(param: Oas30Parameter, newParamDescription: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.parent.ownerDocument(), param, "description", newParamDescription);
        this.commandService.emit(command);
    }

    public changeParamType(param: Oas30Parameter, newType: SimplifiedParameterType): void {
        let command: ICommand = createChangeParameterTypeCommand(this.parent.ownerDocument(), param, newType);
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
