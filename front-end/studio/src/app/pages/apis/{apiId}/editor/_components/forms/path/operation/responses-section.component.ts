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

import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation} from "@angular/core";
import {Oas20Operation, Oas20Response, Oas30Operation, Oas30Response} from "oai-ts-core";
import {CommandService} from "../../../../_services/command.service";
import {EditorsService} from "../../../../_services/editors.service";
import {AddResponseDialogComponent} from "../../../dialogs/add-response.component";
import {
    createDeleteAllResponsesCommand,
    createDeleteResponseCommand,
    createNewResponseCommand,
    ICommand
} from "oai-ts-commands";


@Component({
    moduleId: module.id,
    selector: "responses-section",
    templateUrl: "responses-section.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ResponsesSectionComponent implements OnInit, OnChanges {

    @Input() operation: Oas20Operation | Oas30Operation;

    @ViewChild("addResponseDialog") public addResponseDialog: AddResponseDialogComponent;

    constructor(private commandService: CommandService, private editors: EditorsService) {}

    public ngOnInit(): void {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["operation"]) {
        }
    }

    public is20Document(): boolean {
        return this.operation.ownerDocument().is2xDocument();
    }

    public is30Document(): boolean {
        return this.operation.ownerDocument().is3xDocument();
    }

    public openAddResponseModal(): void {
        this.addResponseDialog.open(this.operation,"200");
    }

    public addResponse(statusCode: string): void {
        let command: ICommand = createNewResponseCommand(this.operation.ownerDocument(), this.operation, statusCode);
        this.commandService.emit(command);
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

    public deleteResponse(response: Oas20Response): void {
        let command: ICommand = createDeleteResponseCommand(this.operation.ownerDocument(), response);
        this.commandService.emit(command);
    }

}
