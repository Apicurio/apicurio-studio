/**
 * @license
 * Copyright 2021 Red Hat
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
    Input,
    Output,
    ViewEncapsulation
} from "@angular/core";
import {CommandFactory, ExtensibleNode, Extension, ICommand} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {AbstractRowComponent} from "../../common/item-row.abstract";


@Component({
    selector: "extension-row",
    templateUrl: "extension-row.component.html",
    styleUrls: ["extension-row.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtensionRowComponent extends AbstractRowComponent<Extension, string> {

    @Input() parent: ExtensibleNode;

    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();
    @Output() onRename: EventEmitter<void> = new EventEmitter<void>();

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
        // No internal model for this row impl
    }

    public name(): string {
        return this.item.name;
    }

    public value(): any {
        return this.item.value;
    }

    public valueAsString(): string {
        if (typeof this.item.value === "object") {
            return JSON.stringify(this.value(), null, 3);
        } else {
            return JSON.stringify(this.value());
        }
    }

    public hasValue(): boolean {
        return this.item.value ? true : false;
    }

    public toggle(): void {
        this.toggleTab("extension");
    }

    public delete(): void {
        this.onDelete.emit();
    }

    public renameExtension(): void {
        this.onRename.emit();
    }

    public setValue(value: string): void {
        try {
            let parsedValue: any = JSON.parse(value);
            let command: ICommand = CommandFactory.createSetExtensionCommand(this.parent, this.item.name, parsedValue);
            this.commandService.emit(command);
        } catch (e) {
            // TODO what to do here?  Log it!
        }
    }

}
