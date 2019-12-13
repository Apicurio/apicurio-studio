/**
 * @license
 * Copyright 2019 JBoss Inc
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
    EventEmitter,
    Output,
    ViewEncapsulation
} from "@angular/core";
import {DropDownOption, DropDownOptionValue as Value} from '../../../../../../../components/common/drop-down.component';
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {AbstractRowComponent} from "../../common/item-row.abstract";
import {
    CommandFactory,
    ICommand,
    Oas20Schema,
    Oas30Schema, OasSchema,
    SimplifiedParameterType,
    SimplifiedPropertyType, SimplifiedType
} from "apicurio-data-models";
import Oas20PropertySchema = Oas20Schema.Oas20PropertySchema;
import Oas30PropertySchema = Oas30Schema.Oas30PropertySchema;


@Component({
    moduleId: module.id,
    selector: "schema-row",
    templateUrl: "schema-row.component.html",
    styleUrls: [ "schema-row.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaRowComponent extends AbstractRowComponent<OasSchema, any> {

    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param commandService
     * @param selectionService
     */
    constructor(changeDetectorRef: ChangeDetectorRef, documentService: DocumentService,
                private commandService: CommandService, selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected updateModel(): void {
    }

    displayName(): string {
        // TODO need something here
        return this.item.$ref;
    }

    public delete(): void {
        this.onDelete.emit();
    }

}
