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
    Input, SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {Oas20Operation, Oas20Response, Oas30Operation, Oas30Response, OasResponse} from "oai-ts-core";
import {CommandService} from "../../../../_services/command.service";
import {EditorsService} from "../../../../_services/editors.service";
import {AddResponseDialogComponent} from "../../../dialogs/add-response.component";
import {
    createDeleteAllResponsesCommand,
    createDeleteResponseCommand,
    createNewResponseCommand,
    ICommand
} from "oai-ts-commands";
import {AbstractBaseComponent} from "../../../common/base-component";
import {DocumentService} from "../../../../_services/document.service";
import {SelectionService} from "../../../../_services/selection.service";
import {HttpCode, HttpCodeService} from "../../../../_services/httpcode.service";
import {ModelUtils} from "../../../../_util/model.util";


@Component({
    moduleId: module.id,
    selector: "responses-section",
    templateUrl: "responses-section.component.html",
    styleUrls: [ "responses-section.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsesSectionComponent extends AbstractBaseComponent {

    private static httpCodes: HttpCodeService = new HttpCodeService();

    @Input() operation: Oas20Operation | Oas30Operation;

    @ViewChild("addResponseDialog") public addResponseDialog: AddResponseDialogComponent;

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
        let responses: OasResponse[] = this.operation.responses.responses();
        if (responses && responses.length > 0) {
            this._responseTab = (responses[0] as Oas20Response | Oas30Response).statusCode();
        }
    }

    public is20Document(): boolean {
        return this.operation.ownerDocument().is2xDocument();
    }

    public is30Document(): boolean {
        return this.operation.ownerDocument().is3xDocument();
    }

    public openAddResponseModal(): void {
        this.addResponseDialog.open(this.operation, this.nextAvailableResponseCode());
    }

    public addResponse(statusCode: string): void {
        let command: ICommand = createNewResponseCommand(this.operation.ownerDocument(), this.operation, statusCode);
        this.commandService.emit(command);
        // FIXME fire a selection event here instead of simply setting the tab selection - doing this will let OTHER users know what we're looking at.
        this._responseTab = statusCode;
    }

    public deleteAllResponses(): void {
        let command: ICommand = createDeleteAllResponsesCommand(this.operation.ownerDocument(), this.operation);
        this.commandService.emit(command);
    }

    public responses(): (Oas20Response | Oas30Response)[] {
        if (!this.operation.responses) {
            return [];
        }
        let rval: (Oas20Response|Oas30Response)[] = [];
        for (let scode of this.operation.responses.responseStatusCodes()) {
            let response: Oas20Response | Oas30Response = this.operation.responses.response(scode) as Oas20Response | Oas30Response;
            rval.push(response);
        }
        return rval.sort((a, b) => {
            return a.statusCode().localeCompare(b.statusCode());
        });
    }

    public hasResponses(): boolean {
        if (!this.operation.responses) {
            return false;
        }
        if (this.operation.responses.responseStatusCodes().length === 0) {
            return false;
        }

        return true;
    }

    public deleteResponse(response: Oas20Response | Oas30Response): void {
        let command: ICommand = createDeleteResponseCommand(this.operation.ownerDocument(), response);
        this.commandService.emit(command);
        if (this.isTabActive(response)) {
            this.selectDefaultTab();
        }
    }

    public statusCodeLine(code: string): string {
        let httpCode: HttpCode = ResponsesSectionComponent.httpCodes.getCode(code);
        if (httpCode) {
            return httpCode.line;
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
        return response.statusCode() === this._responseTab;
    }

    public setTab(response: Oas20Response | Oas30Response): void {
        this._responseTab = response.statusCode();
    }

    public currentResponse(): Oas20Response | Oas30Response {
        if (this._responseTab) {
            return this.operation.responses.response(this._responseTab) as Oas20Response | Oas30Response;
        }
        return null;
    }

    public nextAvailableResponseCode(): string {
        if (this.operation.responses) {
            for (let httpCode of ResponsesSectionComponent.httpCodes.getCodes()) {
                let code: string = httpCode.code;
                if (code.indexOf("1") === 0) {
                    continue;
                }
                let response: any = this.operation.responses.response(code);
                if (!response) {
                    return code;
                }
            }
        }
        return "200";
    }

}
