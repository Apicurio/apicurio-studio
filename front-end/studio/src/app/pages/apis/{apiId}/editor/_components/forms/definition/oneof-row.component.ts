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
    EventEmitter, Input,
    Output,
    ViewEncapsulation
} from "@angular/core";
import {DropDownOption, DropDownOptionValue as Value} from '../../../../../../../components/common/drop-down.component';
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {AbstractRowComponent} from "../../common/item-row.abstract";
import {
    AaiDocument,
    AaiMessage,
    CommandFactory, DocumentType,
    ICommand,
    Oas20Schema,
    Oas30Schema, ReferenceUtil,
    SimplifiedParameterType,
    SimplifiedPropertyType, SimplifiedType
} from "apicurio-data-models";
import Oas20PropertySchema = Oas20Schema.Oas20PropertySchema;
import Oas30PropertySchema = Oas30Schema.Oas30PropertySchema;
import {newArray} from "@angular/compiler/src/util";

/**
 * @author vvilerio
 */
@Component({
    selector: "oneof-row",
    templateUrl: "oneof-row.component.html",
    styleUrls: ["oneof-row.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OneOfRowComponent extends AbstractRowComponent<AaiMessage, SimplifiedPropertyType> {

    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();
    @Input() oneOfName: string;

    _ptab: string = null;

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

    public isEditingOneOf(): boolean {
        return this.isEditingTab("oneOf");
    }

    public isOneOf(): boolean {
        return this.item._isOneOfMessage
    }

    public oneOf(item): string {
        return item.$ref;
    }

    public oneOfOptions(item): DropDownOption[] {
        var vals: Array<Value> = [];
        var doc: AaiDocument = (<AaiDocument>this.item.ownerDocument());
        doc.components.getMessagesList().filter(f => f.getName() !== this.deref(item).getName()).forEach(mess => {
            vals.push(new Value(mess.getName(), "#/component/messages/".concat(mess.getName())));
        })
        return vals;
    }

    public toggleOneOf(): void {
        this.toggleTab("oneOf");
    }

    public delete(): void {
        this.onDelete.emit();
    }

    public deref(message: AaiMessage){
        return ReferenceUtil.resolveFragmentFromJS(this.item.parent().ownerDocument(), message.$ref);
    }

    public displayOneOf(): string {
        return  "[".concat(this.item.$ref).concat("]");
    }

    public setNumValue(val: string, name: string): void {
        let command: ICommand = CommandFactory.createChangePropertyCommand<number>(this.item, name, Number(val));
        this.commandService.emit(command);
    }

    public changeOneOf(newValue: string): void {//TODO
        // this.model().required = newValue === "required";
        // let nt: SimplifiedPropertyType = SimplifiedPropertyType.fromPropertySchema(this.item);
        // nt.required = this.model().required;
        // let command: ICommand = CommandFactory.createChangePropertyTypeCommand(this.item, nt);
        // this.commandService.emit(command);
    }

    protected updateModel(): void {
        // this._model = SimplifiedPropertyType.fromPropertySchema(this.item);
    }

}
