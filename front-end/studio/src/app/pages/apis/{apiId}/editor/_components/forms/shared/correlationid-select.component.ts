/**
 * @license
 * Copyright 2021 JBoss Inc
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
    ViewEncapsulation
} from "@angular/core";
import {
    AaiDocument,
    AaiMessageBase,
    CommandFactory,
    ICommand,
    SimplifiedType
} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {SelectionService} from "../../../_services/selection.service";
import {DropDownOption, DropDownOptionValue} from "../../../../../../../components/common/drop-down.component";

@Component({
    selector: "correlationid-select",
    templateUrl: "correlationid-select.component.html",
    styleUrls: [ "correlationid-select.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorrelationIdSelectComponent extends AbstractBaseComponent {

    @Input() message: AaiMessageBase;
    
    refSelected: string;
    protected editing: boolean = false;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }
    
    ngOnInit() {
        super.ngOnInit();
        const parts = this.message.correlationId?.$ref?.split("/");
        this.refSelected = parts && parts[parts.length - 1];
    }

    public document(): AaiDocument {
        return <AaiDocument> this.message.ownerDocument();
    }
    
    public toggleEditing() {
        this.editing = !this.editing;
    }
    
    public isEditing(): boolean {
        return this.editing;
    }

    public displayType(): SimplifiedType {
        let type: SimplifiedType = new SimplifiedType();
        if (this.message.correlationId && this.message.correlationId.$ref) {
            type.type = this.message.correlationId.$ref;
        }
        return type;
    }

    public changeRefType(newRefName: string): void {
        const newRef = "#/components/correlationIds/" + newRefName
        let command: ICommand = CommandFactory.createChangeCorrelationIdRefCommand(newRef, this.message);
        this.commandService.emit(command);
        this.refSelected = newRefName;
    }

    public correlationIdOptions() : DropDownOption[]  {
        return this.document()
            .components
            .getCorrelationIdsList()
            .map(it => new DropDownOptionValue(it.getName(), it.getName()));
    }
}