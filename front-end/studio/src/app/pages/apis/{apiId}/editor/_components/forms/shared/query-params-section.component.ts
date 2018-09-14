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

import {Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {
    Oas20Operation,
    Oas20Parameter,
    Oas20PathItem,
    Oas30Operation,
    Oas30Parameter,
    Oas30PathItem,
    OasLibraryUtils,
    OasPathItem
} from "oai-ts-core";
import {CommandService} from "../../../_services/command.service";
import {AddQueryParamDialogComponent} from "../../dialogs/add-query-param.component";
import {
    createDeleteAllParametersCommand,
    createDeleteParameterCommand,
    createNewParamCommand,
    ICommand
} from "oai-ts-commands";
import {Subscription} from "rxjs/Subscription";
import {DocumentService} from "../../../_services/document.service";


@Component({
    moduleId: module.id,
    selector: "query-params-section",
    templateUrl: "query-params-section.component.html",
    encapsulation: ViewEncapsulation.None
})
export class QueryParamsSectionComponent implements OnInit, OnDestroy {

    @Input() parent: Oas20Operation | Oas30Operation | Oas20PathItem | Oas30PathItem;
    @Input() path: OasPathItem;

    @ViewChild("addQueryParamDialog") public addQueryParamDialog: AddQueryParamDialogComponent;

    private _queryParameters: (Oas30Parameter | Oas20Parameter)[] = null;
    private _docSub: Subscription;
    private _library: OasLibraryUtils = new OasLibraryUtils();

    constructor(private commandService: CommandService, private documentService: DocumentService) {}

    public ngOnInit(): void {
        this._docSub = this.documentService.change().subscribe( () => {
            this._queryParameters = null;
        });
    }

    public ngOnDestroy(): void {
        this._docSub.unsubscribe();
    }

    public isPathItem(): boolean {
        return this.parent === this.path;
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
        return this.parent.getParameters("query").length > 0 || this.path.getParameters("query").length > 0;
    }

    public parameters(paramType: string): (Oas30Parameter | Oas20Parameter)[] {
        let params: (Oas30Parameter | Oas20Parameter)[] = this.parent.getParameters(paramType) as (Oas30Parameter | Oas20Parameter)[];
        return params.sort((param1, param2) => {
            return param1.name.localeCompare(param2.name);
        });
    }

    public queryParameters(): (Oas30Parameter | Oas20Parameter)[] {
        if (this.isPathItem()) {
            return this.parameters("query");
        }

        if (this._queryParameters !== null) {
            return this._queryParameters;
        }

        let opParams: (Oas30Parameter | Oas20Parameter)[] = this.parameters("query");
        let piParams: (Oas30Parameter | Oas20Parameter)[] = this.path.getParameters("query") as (Oas30Parameter | Oas20Parameter)[];
        let hasOpParam = function(param: Oas30Parameter | Oas20Parameter): boolean {
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
                let missingParam: Oas30Parameter | Oas20Parameter = this.parent.createParameter();
                this._library.readNode(this._library.writeNode(param), missingParam);
                missingParam.n_attribute("missing", true);
                opParams.push(missingParam);
            }
        });
        this._queryParameters = opParams.sort((param1, param2) => {
            return param1.name.localeCompare(param2.name);
        });
        return this._queryParameters;
    }

    public openAddQueryParamModal(): void {
        this.addQueryParamDialog.open();
    }

    public deleteAllQueryParams(): void {
        let command: ICommand = createDeleteAllParametersCommand(this.parent.ownerDocument(), this.parent, "query");
        this.commandService.emit(command);
    }

    public deleteParam(parameter: Oas30Parameter | Oas20Parameter): void {
        let command: ICommand = createDeleteParameterCommand(this.parent.ownerDocument(), parameter);
        this.commandService.emit(command);
    }

    public addQueryParam(name: string): void {
        let command: ICommand = createNewParamCommand(this.parent.ownerDocument(), this.parent, name, "query");
        this.commandService.emit(command);
    }

}
