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

import {Component, ViewEncapsulation, Input, Output, EventEmitter} from "@angular/core";
import {
    Oas20Document, Oas20Response
} from "oai-ts-core";
import {HttpCode, HttpCodeService} from "../../../_services/httpcode.service";
import {createDelete20ExampleCommand, createSetExampleCommand, ICommand, SimplifiedType} from "oai-ts-commands";
import {AbstractTypedItemComponent} from "./typed-item.component";
import {DropDownOption} from '../../../../../../../components/common/drop-down.component';
import {ObjectUtils} from "../../../_util/object.util";
import {EditExample20Event} from "../../dialogs/edit-example-20.component";


@Component({
    moduleId: module.id,
    selector: "response-row",
    templateUrl: "response-row.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ResponseRowComponent extends AbstractTypedItemComponent<SimplifiedType> {

    private static httpCodes: HttpCodeService = new HttpCodeService();

    @Input() document: Oas20Document;
    @Input() response: Oas20Response;

    @Output() onCommand: EventEmitter<ICommand> = new EventEmitter<ICommand>();

    public statusCodeLine(code: string): string {
        let httpCode: HttpCode = ResponseRowComponent.httpCodes.getCode(code);
        if (httpCode) {
            return httpCode.line;
        }
        return "";
    }

    public statusCodeType(code: string): string {
        if (code === "default") {
            return "";
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

    protected modelForEditing(): SimplifiedType {
        return SimplifiedType.fromSchema(this.response.schema);
    }

    protected modelForViewing(): SimplifiedType {
        return SimplifiedType.fromSchema(this.response.schema);
    }

    public typeOptions(): DropDownOption[] {
        let options: DropDownOption[] = super.typeOptions();

        if (this.document.definitions) {
            let co: DropDownOption[] = this.document.definitions.definitions().sort( (def1, def2) => {
                return def1.definitionName().toLocaleLowerCase().localeCompare(def2.definitionName().toLocaleLowerCase());
            }).map( def => {
                return {
                    value: "#/definitions/" + def.definitionName(),
                    name: def.definitionName()
                };
            });
            if (co && co.length > 0) {
                options.push({ divider: true });
                co.forEach( o => options.push(o) );
            }
        }

        return options;
    }

    public typeOfOptions(): DropDownOption[] {
        let options: DropDownOption[] = super.typeOfOptions();

        if (this.document.definitions) {
            let co: DropDownOption[] = this.document.definitions.definitions().sort( (def1, def2) => {
                return def1.definitionName().toLocaleLowerCase().localeCompare(def2.definitionName().toLocaleLowerCase());
            }).map( def => {
                return {
                    value: "#/definitions/" + def.definitionName(),
                    name: def.definitionName()
                };
            });
            if (co && co.length > 0) {
                options.push({ divider: true });
                co.forEach( o => options.push(o) );
            }
        }

        return options;
    }

    public hasExamples(): boolean {
        if (ObjectUtils.isNullOrUndefined(this.response.examples)) {
            return false;
        }
        return this.response.examples.exampleContentTypes().length > 0;
    }

    public exampleContentTypes(): string[] {
        return this.response.examples.exampleContentTypes();
    }

    public exampleValue(contentType: string): string {
        let evalue: any = this.response.examples.example(contentType);
        if (typeof evalue === "object") {
            evalue = JSON.stringify(evalue);
        }
        return evalue;
    }

    public deleteExample(contentType: string): void {
        let command: ICommand = createDelete20ExampleCommand(this.document, this.response, contentType);
        this.onCommand.emit(command);
    }

    public addExample(exampleData: any): void {
        let command: ICommand = createSetExampleCommand(this.document, this.response, exampleData.value, exampleData.contentType);
        this.onCommand.emit(command);
    }

    public editExample(event: EditExample20Event): void {
        let command: ICommand = createSetExampleCommand(this.document, this.response, event.value, event.contentType);
        this.onCommand.emit(command);
    }

}
