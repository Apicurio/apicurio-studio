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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from "@angular/core";
import {
    CommandFactory,
    ICommand,
    Library,
    Oas30Example, OasHeader,
    Oas30Response,
    SimplifiedType
} from "@apicurio/data-models";
import {AbstractBaseComponent} from "../../../common/base-component";
import {DocumentService} from "../../../../_services/document.service";
import {SelectionService} from "../../../../_services/selection.service";
import {CommandService} from "../../../../_services/command.service";

export interface HttpHeaderChangeEvent {
    name: string;
    header: SimplifiedType;
}

export interface AddExampleEvent {
    header: OasHeader;
    name: string;
    value: any;
}

export interface DeleteExampleEvent {
    example: Oas30Example;
}

export interface ExamplePropertyChangeEvent {
    example: Oas30Example;
    value: string;
}


@Component({
    selector: "httpHeaders",
    templateUrl: "http-headers.component.html",
    styleUrls: [ "http-headers.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HttpHeadersComponent extends AbstractBaseComponent {

    @Input() parent: Oas30Response;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private selectionService: SelectionService, private commandService: CommandService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public hasHttpHeaders(): boolean {
        return this.parent.getHeaders().length > 0;
    }

    public httpHeaderNames(): string[] {
        if (this.parent.headers) {
            return Object.keys(this.parent.headers);
        }
        return [];
    }

    public httpHeaders(): string[]{
        if(this.parent.headers){
            return Object.keys(this.parent.headers);
        }
        return [];
    }

    public httpHeaderByName(name: string): OasHeader {
        return this.parent.getHeader(name);
    }

    public addHttpHeader(httpHeader: string): void {
        let command: ICommand = CommandFactory.createNewHeaderCommand(this.parent, httpHeader);
        this.commandService.emit(command);
        let nodePath = Library.createNodePath(this.parent);
        nodePath.appendSegment("header", false);
        nodePath.appendSegment(httpHeader, true);
        this.selectionService.select(nodePath.toString());
    }

}
