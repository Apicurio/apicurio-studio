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
    private _allOperations: OasOperation[] = [];
    private _collaborationPaths: string[] = [];
    private _selectionSubscription: Subscription;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        //this.setOperationTabFromSelection(this.__selectionService.currentSelection());

        this._selectionSubscription = this.__selectionService.selection().subscribe( selection => {
            this.setOperationTabFromSelection(selection);
        });
    }

    protected onDocumentChange(): void {
        this.refresh();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["path"]) {
            this.refresh();
            this.setOperationTabFromSelection(this.__selectionService.currentSelection());
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this._selectionSubscription.unsubscribe();
    }

    public operations(): OasOperation[] {
        return this._operations;
    }

    public collaborationPaths(): string[] {
        return this._collaborationPaths;
    }

    private refresh(): void {
        this._operations = this.pathOperations();
        this._allOperations = this.allPathOperations();
        this._collaborationPaths = this.allCollaborationPaths();
    }

    private setOperationTabFromSelection(selection: string): void {
        console.info("[OperationsSectionComponent] Selection operation tab from selection: ", selection);
        this.tab = null;
        for (let operation of this._operations) {
            if (this.isSelected(operation)) {
                this.tab = operation.method();
                return;
            }
        }

        for (let operation of this._operations) {
            console.info("[OperationsSectionComponent] No operations selected, setting tab to: ", operation.method());
            this.tab = operation.method();
            return;
        }

        this.tab = "get";
    }

    private pathOperations(): OasOperation[] {
        return this.allPathOperations().filter( operation => operation !== null && operation !== undefined);
    }

    private allPathOperations(): OasOperation[] {
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

    private allCollaborationPaths(): string[] {
        let basePath: string = ModelUtils.nodeToPath(this.path) + "/";
        let paths: string[] = [ "get", "put", "post", "delete", "options", "head", "patch", "trace" ].map( method => {
            return basePath + method;
        });
        return paths;
    }

    public operation(): OasOperation {
        if (this.tab) {
            return this.path[this.tab];
        }
        return null;
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
            this.__selectionService.selectNode(operation);
        } else {
            this.__selectionService.simpleSelect(ModelUtils.nodeToPath(this.path) + "/" + method);
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
