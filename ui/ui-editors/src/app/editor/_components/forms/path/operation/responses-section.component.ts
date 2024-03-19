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
    CommandFactory, Constants,
    ICommand,
    Library,
    Oas20Operation,
    Oas20Response,
    Oas30Operation,
    Oas30Response,
    OasDocument,
    OasResponse
} from "@apicurio/data-models";
import {CommandService} from "../../../../_services/command.service";
import {EditorsService} from "../../../../_services/editors.service";
import {AddResponseDialogComponent, AddResponseDialogData} from "../../../dialogs/add-response.component";
import {CloneResponseDialogComponent} from "../../../dialogs/clone-response.component";
import {AbstractBaseComponent} from "../../../common/base-component";
import {DocumentService} from "../../../../_services/document.service";
import {SelectionService} from "../../../../_services/selection.service";
import {HttpCode, HttpCodeService} from "../../../../_services/httpcode.service";
import {ModelUtils} from "../../../../_util/model.util";


@Component({
    selector: "responses-section",
    templateUrl: "responses-section.component.html",
    styleUrls: [ "responses-section.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsesSectionComponent extends AbstractBaseComponent {

    @Input() operation: Oas20Operation | Oas30Operation;

    @ViewChild("addResponseDialog", { static: true }) public addResponseDialog: AddResponseDialogComponent;
    @ViewChild("cloneResponseDialog", { static: true }) public cloneResponseDialog: CloneResponseDialogComponent;

    private _responseTab: string;

    /**
     * Constructor.
     * @param changeDetectorRef
     * @param documentService
     * @param commandService
     * @param editors
     * @param selectionService
     */
    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private editors: EditorsService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (this.operation && this.operation.responses) {
            this.selectDefaultTab();
        }
    }

    public responsesPath(): string {
        return ModelUtils.nodeToPath(this.operation) + "/responses";
    }

    public selectDefaultTab(): void {
        let responses: OasResponse[] = this.operation.responses.getResponses();
        if (responses && responses.length > 0) {
            this._responseTab = (responses[0] as Oas20Response | Oas30Response).getStatusCode();
        }
    }

    public is20Document(): boolean {
        return (<OasDocument>this.operation.ownerDocument()).is2xDocument();
    }

    public is30Document(): boolean {
        return (<OasDocument>this.operation.ownerDocument()).is3xDocument();
    }

    public openAddResponseModal(): void {
        this.addResponseDialog.open(this.operation, this.nextAvailableResponseCode());
    }

    public openCloneResponseModal(currentResponse: (Oas20Response | Oas30Response)): void {
        this.cloneResponseDialog.open(this.operation, this.nextAvailableResponseCode());
    }

    public addResponse(data: AddResponseDialogData): void {
        let nodePath = Library.createNodePath(this.operation);
        nodePath.appendSegment(Constants.PROP_RESPONSES);
        nodePath.appendSegment(data.code.toString(), true);

        // Add the response - aggregate command if we're adding a $ref, otherwise not.
        if (data.ref && data.ref.length > 0) {
            let command: ICommand = CommandFactory.createAggregateCommand("NewResponseWithRef", { "$ref": data.ref }, [
                CommandFactory.createNewResponseCommand(this.operation, data.code, null),
                CommandFactory.createSetPropertyCommand(nodePath, Constants.PROP_$REF, data.ref)
            ]);
            this.commandService.emit(command);
        } else {
            let command: ICommand = CommandFactory.createNewResponseCommand(this.operation, data.code, null);
            this.commandService.emit(command);
        }

        // Select the newly created response.
        this.selectionService.select(nodePath.toString());
        this._responseTab = data.code;
    }

    public cloneResponse(statusCode: string): void {
        const selectedStatusCode = this._responseTab;
        const originalResponse = this.operation.responses.getResponse(selectedStatusCode);
        let command: ICommand = CommandFactory.createNewResponseCommand(this.operation, statusCode, originalResponse);
        this.commandService.emit(command);
        let nodePath = Library.createNodePath(this.operation);
        nodePath.appendSegment(statusCode, true);
        this.selectionService.select(nodePath.toString());
    }

    public deleteAllResponses(): void {
        let command: ICommand = CommandFactory.createDeleteAllResponsesCommand(this.operation);
        this.commandService.emit(command);
    }

    public responses(): (Oas20Response | Oas30Response)[] {
        if (!this.operation.responses) {
            return [];
        }
        let rval: (Oas20Response|Oas30Response)[] = [];
        for (let scode of this.operation.responses.getResponseStatusCodes()) {
            let response: Oas20Response | Oas30Response = this.operation.responses.getResponse(scode) as Oas20Response | Oas30Response;
            rval.push(response);
        }
        return rval.sort((a, b) => {
            return a.getStatusCode().localeCompare(b.getStatusCode());
        });
    }

    public hasResponses(): boolean {
        if (!this.operation.responses) {
            return false;
        }
        if (this.operation.responses.getResponseStatusCodes().length === 0) {
            return false;
        }

        return true;
    }

    public deleteResponse(response: Oas20Response | Oas30Response): void {
        let command: ICommand = CommandFactory.createDeleteResponseCommand(response);
        this.commandService.emit(command);
        if (this.isTabActive(response)) {
            this.selectDefaultTab();
        }
    }

    public statusCodeLine(code: string): string {
        let httpCode: HttpCode = HttpCodeService.getCode(code);
        if (httpCode) {
            return httpCode.getName();
        }
        return "";
    }

    public statusCodeType(code: string): string {
        if (code === "default") {
            return "default";
        }

        var icode: number = parseInt(code);
        if (icode >= 200 && icode < 300) {
            return "success";
        }

        if (icode >= 300 && icode < 400) {
            return "redirect";
        }

        if (icode >= 400 && icode < 500) {
            return "problem";
        }

        if (icode >= 500 && icode < 600) {
            return "error";
        }

        return "";
    }

    public isTabActive(response: Oas20Response | Oas30Response): boolean {
        return response.getStatusCode() === this._responseTab;
    }

    public setTab(response: Oas20Response | Oas30Response): void {
        this._responseTab = response.getStatusCode();
    }

    public currentResponse(): Oas20Response | Oas30Response {
        if (this._responseTab) {
            return this.operation.responses.getResponse(this._responseTab) as Oas20Response | Oas30Response;
        }
        return null;
    }

    public nextAvailableResponseCode(): string {
        if (this.operation.responses) {
            for (let httpCode of HttpCodeService.getCommonlyUsedHttpCodeList()) {
                let code: string = httpCode.getCode().toString();
                if (code.indexOf("1") === 0) {
                    continue;
                }
                let response: any = this.operation.responses.getResponse(code);
                if (!response) {
                    return code;
                }
            }
        }
        return "200";
    }

}
