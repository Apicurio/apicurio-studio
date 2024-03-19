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
    AaiChannelItem,
    AaiOperation
} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {DocumentService} from "../../../_services/document.service";
import {ModelUtils} from "../../../_util/model.util";
import {SelectionService} from "../../../_services/selection.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {TopicSubscription} from "apicurio-ts-core";


@Component({
    selector: "channel-operations-section",
    templateUrl: "operations-section.component.html",
    styleUrls: [ "operations-section.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChannelOperationsSectionComponent extends AbstractBaseComponent {

    @Input() channel: AaiChannelItem;
    protected _nodePath: string;

    public tab: string;

    private _operations: AaiOperation[] = [];
    private _allOperations: AaiOperation[] = [];
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
        if (changes["channel"]) {
            this.refresh();
            this.setOperationTabFromSelection(this.__selectionService.currentSelection());
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this._selectionSubscription.unsubscribe();
    }

    public operations(): AaiOperation[] {
        return this._operations;
    }

    public collaborationPaths(): string[] {
        return this._collaborationPaths;
    }

    private refresh(): void {
        this._operations = this.channelOperations();
        this._allOperations = this.allChannelOperations();
        this._collaborationPaths = this.allCollaborationPaths();
        this._nodePath = ModelUtils.nodeToPath(this.channel);
    }

    private setOperationTabFromSelection(selection: string): void {
        console.info("[ChannelOperationsSectionComponent] Setting operation tab from selection: ", selection);
        this.tab = null;
        let tabs: string[] = [
            "publish", "subscribe"
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
        // a "SUBSCRIBE" operation, then choose that one.
        for (let operation of this._operations) {
            console.info("[ChannelOperationsSectionComponent] No operations selected, setting tab to: ", operation.getType());
            this.tab = operation.getType();
            this.__changeDetectorRef.markForCheck();
            return;
        }

        // If all else fails, just default to "SUBSCRIBE"
        this.tab = "subscribe";
        this.__changeDetectorRef.markForCheck();
    }

    private channelOperations(): AaiOperation[] {
        return this.allChannelOperations().filter( operation => operation !== null && operation !== undefined);
    }

    private allChannelOperations(): AaiOperation[] {
        let ops: AaiOperation[] = [
            this.channel.publish,
            this.channel.subscribe
        ];
        return ops;
    }

    private allCollaborationPaths(): string[] {
        let basePath: string = ModelUtils.nodeToPath(this.channel) + "/";
        let paths: string[] = [ "publish", "subscribe" ].map( method => {
            return basePath + method;
        });
        return paths;
    }

    public operation(): AaiOperation {
        if (this.tab) {
            return this.channel[this.tab];
        }
        return null;
    }

    public operationPath(operationType: string): string {
        return this._nodePath + "/" + operationType;
    }

    public isDefined(operationType: string): boolean {
        let operation: AaiOperation = this.channel[operationType] as AaiOperation;
        if (operation) {
            return true;
        }
        return false;
    }

    public isSelected(operation: AaiOperation): boolean {
        return ModelUtils.isSelected(operation);
    }

    public selectTab(operationType: string): void {
        this.__selectionService.select(this._nodePath + "/" + operationType);
    }

    public hasSelectedOperation(): boolean {
        return this.isDefined(this.tab);
    }

    public addOperation(): void {
        // Create the operation via a command.
        let command: ICommand = CommandFactory.createNewOperationCommand_Aai20(this.channel.getName(), this.tab);
        this.commandService.emit(command);
        // And then select the new operation we just created.
        this.__selectionService.select(ModelUtils.nodeToPath(this.channel) + "/" + this.tab);
    }

    public deleteOperation(operation: AaiOperation): void {
        if (!operation) {
            return;
        }
        let command: ICommand = CommandFactory.createDeleteOperationCommand_Aai20(operation.getType(),
            operation.parent() as AaiChannelItem);
        this.commandService.emit(command);
    }

    public deleteAllOperations(): void {
        let command: ICommand = CommandFactory.createDeleteAllOperationsCommand_Aai20(this.channel);
        this.commandService.emit(command);
    }

}
