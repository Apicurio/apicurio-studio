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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    SimpleChanges,
    ViewEncapsulation
} from "@angular/core";
import {
    CommandFactory,
    ICommand,
    Oas20PathItem,
    Oas30PathItem,
    OasDocument,
    OasOperation,
    OasPathItem
} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {ModelUtils} from "../../../_util/model.util";
import {SelectionService} from "../../../_services/selection.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {TopicSubscription} from "apicurio-ts-core";


@Component({
    selector: "operations-section",
    templateUrl: "operations-section.component.html",
    styleUrls: [ "operations-section.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationsSectionComponent extends AbstractBaseComponent {

    @Input() path: Oas30PathItem | Oas20PathItem;
    protected _nodePath: string;

    public tab: string;

    private _operations: OasOperation[] = [];
    private _allOperations: OasOperation[] = [];
    private _collaborationPaths: string[] = [];
    private _selectionSubscription: TopicSubscription<string>;

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

    public ngOnInit(): void {
        super.ngOnInit();

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

    public is20Document(): boolean {
        return (<OasDocument> this.path.ownerDocument()).is2xDocument();
    }

    public is3xDocument(): boolean {
        return (<OasDocument> this.operation().ownerDocument()).is3xDocument();
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
        this._nodePath = ModelUtils.nodeToPath(this.path);
    }

    private setOperationTabFromSelection(selection: string): void {
        console.info("[OperationsSectionComponent] Setting operation tab from selection: ", selection);
        this.tab = null;
        let tabs: string[] = [
            "get", "put", "post", "delete", "options", "head", "patch", "trace"
        ];

        // Choose a tab based on the selection
        for (let t of tabs) {
            let tpath: string = this._nodePath + "/" + t;
            if (selection.indexOf(tpath) === 0) {
                this.tab = t;
                this.__changeDetectorRef.markForCheck();
                return;
            }
        }

        // Choose a tab based on the availability of actual operations.  I.e. if the path only has
        // a "PUT" operation, then choose that one.
        for (let operation of this._operations) {
            console.info("[OperationsSectionComponent] No operations selected, setting tab to: ", operation.getMethod());
            this.tab = operation.getMethod();
            this.__changeDetectorRef.markForCheck();
            return;
        }

        // If all else fails, just default to "GET"
        this.tab = "get";
        this.__changeDetectorRef.markForCheck();
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

    public operationPath(method: string): string {
        return this._nodePath + "/" + method;
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
        this.__selectionService.select(this._nodePath + "/" + method);
    }

    public hasSelectedOperation(): boolean {
        return this.isDefined(this.tab);
    }

    public addOperation(): void {
        // Create the operation via a command.
        let command: ICommand = CommandFactory.createNewOperationCommand(this.path.getPath(), this.tab);
        this.commandService.emit(command);
        // !!!
        // And then select the new operation we just created.
        this.__selectionService.select(ModelUtils.nodeToPath(this.path) + "/" + this.tab);
    }

    public deleteOperation(operation: OasOperation): void {
        if (!operation) {
            return;
        }
        let command: ICommand = CommandFactory.createDeleteOperationCommand(operation.getMethod(),
            operation.parent() as OasPathItem);
        this.commandService.emit(command);
    }

    public deleteAllOperations(): void {
        let command: ICommand = CommandFactory.createDeleteAllOperationsCommand(this.path);
        this.commandService.emit(command);
    }

}
