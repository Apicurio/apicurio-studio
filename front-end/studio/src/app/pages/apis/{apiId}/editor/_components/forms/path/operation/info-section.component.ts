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
    Input,
    QueryList,
    ViewChildren,
    ViewEncapsulation
} from "@angular/core";
import {Oas20Document, Oas20Operation, Oas30Operation} from "oai-ts-core";
import {createChangePropertyCommand, ICommand} from "oai-ts-commands";
import {InlineArrayEditorComponent} from "../../../common/inline-array-editor.component";
import {CommandService} from "../../../../_services/command.service";
import {AbstractBaseComponent} from "../../../common/base-component";
import {DocumentService} from "../../../../_services/document.service";


@Component({
    moduleId: module.id,
    selector: "operation-info-section",
    templateUrl: "info-section.component.html",
    styleUrls: [ "info-section.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationInfoSectionComponent extends AbstractBaseComponent {

    @Input() operation: Oas20Operation | Oas30Operation;
    @ViewChildren("consumesEditor") consumesEditor: QueryList<InlineArrayEditorComponent>;
    @ViewChildren("producesEditor") producesEditor: QueryList<InlineArrayEditorComponent>;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService) {
        super(changeDetectorRef, documentService);
    }

    /**
     * Called when the user changes the summary.
     * @param newSummary
     */
    public changeSummary(newSummary: string): void {
        console.info("[InfoSectionComponent] User changed the summary.");
        let command: ICommand = createChangePropertyCommand(this.operation.ownerDocument(), this.operation, "summary", newSummary);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the description.
     * @param newDescription
     */
    public changeDescription(newDescription: string): void {
        console.info("[InfoSectionComponent] User changed the description.");
        let command: ICommand = createChangePropertyCommand(this.operation.ownerDocument(), this.operation, "description", newDescription);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the operationId.
     * @param newOperationId
     */
    public changeOperationId(newOperationId: string): void {
        console.info("[InfoSectionComponent] User changed the operationId.");
        let command: ICommand = createChangePropertyCommand(this.operation.ownerDocument(), this.operation, "operationId", newOperationId);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the tags.
     * @param newTags
     */
    public changeTags(newTags: string[]): void {
        console.info("[InfoSectionComponent] User changed the tags.");
        let command: ICommand = createChangePropertyCommand(this.operation.ownerDocument(), this.operation, "tags", newTags);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the "consumes".
     * @param newValue
     */
    public onConsumesChange(newValue: string[]): void {
        console.info("[InfoSectionComponent] User changed the consumes to: ", newValue);
        if (newValue && newValue.length === 0) {
            newValue = null;
        }
        let command: ICommand = createChangePropertyCommand<string[]>(this.operation.ownerDocument(), this.operation, "consumes", newValue);
        this.commandService.emit(command);
    }

    /**
     * Called when the user closes the consumes editor without making changes.
     */
    public onConsumesClose(): void {
        let consumes: string[] = (this.operation as Oas20Operation).consumes;
        if (consumes && consumes.length === 0) {
            (this.operation as Oas20Operation).consumes = null
        }
    }

    /**
     * Called when the user changes the "produces".
     * @param newValue
     */
    public onProducesChange(newValue: string[]): void {
        console.info("[InfoSectionComponent] User changed the produces to: ", newValue);
        if (newValue && newValue.length === 0) {
            newValue = null;
        }
        let command: ICommand = createChangePropertyCommand<string[]>(this.operation.ownerDocument(), this.operation, "produces", newValue);
        this.commandService.emit(command);
    }

    /**
     * Called when the user closes the produces editor without making changes.
     */
    public onProducesClose(): void {
        let produces: string[] = (this.operation as Oas20Operation).produces;
        if (produces && produces.length === 0) {
            (this.operation as Oas20Operation).produces = null
        }
    }

    public consumes(): string[] {
        return (this.operation as Oas20Operation).consumes;
    }

    public produces(): string[] {
        return (this.operation as Oas20Operation).produces;
    }

    public hasGlobalConsumes(): boolean {
        let globalConsumes: string[] = (this.operation.ownerDocument() as Oas20Document).consumes;
        if (globalConsumes !== null && globalConsumes !== undefined && globalConsumes.length > 0) {
            return true;
        }
        return false;
    }

    public hasLocalConsumes(): boolean {
        let consumes: string[] = this.consumes();
        return consumes && consumes.length > 0;
    }

    public hasLocalProduces(): boolean {
        let produces: string[] = this.produces();
        return produces && produces.length > 0;
    }

    public showInheritedConsumes(): boolean {
        let consumes: string[] = (this.operation as Oas20Operation).consumes;
        if (consumes !== null && consumes !== undefined) {
            return false;
        }

        return this.hasGlobalConsumes();
    }

    public inheritedConsumes(): string[] {
        let consumes: string[] = (this.operation.ownerDocument() as Oas20Document).consumes;
        return consumes;
    }

    public hasGlobalProduces(): boolean {
        let globalProduces: string[] = (this.operation.ownerDocument() as Oas20Document).produces;
        if (globalProduces !== null && globalProduces !== undefined && globalProduces.length > 0) {
            return true;
        }
        return false;
    }

    public showInheritedProduces(): boolean {
        let produces: string[] = (this.operation as Oas20Operation).produces;
        if (produces !== null && produces !== undefined) {
            return false;
        }

        return this.hasGlobalProduces();
    }

    public inheritedProduces(): string[] {
        let produces: string[] = (this.operation.ownerDocument() as Oas20Document).produces;
        return produces;
    }

    public overrideConsumes(): void {
        (this.operation as Oas20Operation).consumes = [];
        setTimeout(() => {
            this.consumesEditor.last.onStartEditing();
        }, 50);
    }

    public overrideProduces(): void {
        (this.operation as Oas20Operation).produces = [];
        setTimeout(() => {
            this.producesEditor.last.onStartEditing();
        }, 50);
    }

    public tagDefs(): ()=>string[] {
        return ()=> {
            if (this.operation.ownerDocument().tags && this.operation.ownerDocument().tags.length > 0) {
                let tagDefs: string[] = this.operation.ownerDocument().tags.map(tagDef => tagDef.name);
                tagDefs.sort();
                return tagDefs;
            } else {
                return [];
            }
        }
    }

}
