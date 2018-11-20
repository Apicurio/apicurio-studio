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
    SimpleChanges,
    ViewEncapsulation
} from "@angular/core";
import {Oas30PathItem, OasNodePath, OasOperation, OasPathItem} from "oai-ts-core";
import {CommandService} from "../../../_services/command.service";
import {Subscription} from "rxjs";
import {DocumentService} from "../../../_services/document.service";
import {ModelUtils} from "../../../_util/model.util";
import {SelectionService} from "../../../_services/selection.service";
import {
    createDeleteAllOperationsCommand,
    createDeleteOperationCommand,
    createNewOperationCommand,
    ICommand
} from "oai-ts-commands";
import {AbstractBaseComponent} from "../../common/base-component";


@Component({
    moduleId: module.id,
    selector: "operations-section",
    templateUrl: "operations-section.component.html",
    styleUrls: [ "operations-section.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationsSectionComponent extends AbstractBaseComponent {

    @Input() path: Oas30PathItem;

    public tab: string;

    private _operations: OasOperation[] = [];
    private _selectionSubscription: Subscription;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        console.info("[OperationsSectionComponent] ngOnInit() - set tab");
        this.setOperationTabFromSelection(this.selectionService.currentSelection());

        this._selectionSubscription = this.selectionService.selection().subscribe( selection => {
            let path: OasNodePath = selection;
            console.info("[OperationsSectionComponent] SELECTION CHANGED! - set tab");
            this.setOperationTabFromSelection(path);
        });
    }

    protected onDocumentChange(): void {
        // TODO handle change to the document
    }

    public ngOnChanges(changes: SimpleChanges): void {
        // TODO the input has changed!
        //this.setOperationTabFromSelection(this.selectionService.currentSelection());
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this._selectionSubscription.unsubscribe();
    }

    private setOperationTabFromSelection(selection: OasNodePath): void {
        console.info("[OperationsSectionComponent] Selection operation tab from selection: ", selection);
        this.tab = null;
        for (let operation of this.operations()) {
            console.info("[OperationsSectionComponent] Checking operation: ", operation.method());
            if (this.isSelected(operation)) {
                console.info("[OperationsSectionComponent] Operation selected: ", operation.method());
                this.tab = operation.method();
                return;
            }
        }

        for (let operation of this.operations()) {
            console.info("[OperationsSectionComponent] No operations selected, setting tab to: ", operation.method());
            this.tab = operation.method();
            return;
        }

        this.tab = "get";
    }

    public operations(): OasOperation[] {
        return this.allOperations().filter( operation => operation !== null && operation !== undefined);
    }

    public operation(): OasOperation {
        if (this.tab) {
            return this.path[this.tab];
        }
        return null;
    }

    public allOperations(): OasOperation[] {
        let ops: OasOperation[] = [
            this.path.get,
            this.path.put,
            this.path.post,
            this.path.delete,
            this.path.options,
            this.path.head,
            this.path.patch,
            this.path["trace"]
        ];
        return ops;
    }

    public isDefined(method: string): boolean {
        let operation: OasOperation = this.path[method] as OasOperation;
        if (operation) {
            return true;
        }
        return false;
    }

    public isSelected(operation: OasOperation): boolean {
        return ModelUtils.isSelected(operation);
    }

    public selectTab(method: string): void {
        this.tab = method;
        if (this.isDefined(method)) {
            let operation: OasOperation = this.path[method] as OasOperation;
            this.selectionService.selectNode(operation, operation.ownerDocument());
        }
    }

    public hasSelectedOperation(): boolean {
        return this.isDefined(this.tab);
    }

    public addOperation(): void {
        let command: ICommand = createNewOperationCommand(this.path.ownerDocument(), this.path.path(), this.tab);
        this.commandService.emit(command);
    }

    public deleteOperation(operation: OasOperation): void {
        if (!operation) {
            return;
        }
        let command: ICommand = createDeleteOperationCommand(operation.ownerDocument(), operation.method(),
            operation.parent() as OasPathItem);
        this.commandService.emit(command);
    }

    public deleteAllOperations(): void {
        let command: ICommand = createDeleteAllOperationsCommand(this.path);
        this.commandService.emit(command);
    }

}
