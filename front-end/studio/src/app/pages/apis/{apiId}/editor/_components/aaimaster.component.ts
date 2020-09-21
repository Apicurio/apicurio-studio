/**
 * @license
 * Copyright 2020s JBoss Inc
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
    Component, EventEmitter,
    HostListener,
    Input, Output,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {
    CombinedAllNodeVisitor,
    CombinedVisitorAdapter,
    CommandFactory,
    DocumentType,
    ICommand, IDefinition,
    Library,
    Node,
    NodePath,
    AaiChannelItem,
    Aai20Document,
    TraverserDirection,
    VisitorUtil
} from "apicurio-data-models";
import {FindChannelItemsVisitor} from "../_visitors/channel-items.visitor";
import {ModelUtils} from "../_util/model.util";
import {SelectionService} from "../_services/selection.service";
import {CommandService} from "../_services/command.service";
import {EditorsService} from "../_services/editors.service";
import {RestResourceService} from "../_services/rest-resource.service";
import {AbstractBaseComponent} from "./common/base-component";
import {DocumentService} from "../_services/document.service";
import {KeypressUtils} from "../_util/keypress.util";
import {ObjectUtils} from "apicurio-ts-core";
import {FeaturesService} from "../_services/features.service";
import {ComponentType} from "../_models/component-type.model";


/**
 * The component that models the master view of the API editor.  This is the
 * left-hand side of the editor, which lists things like Paths and Definitions.
 * Users will select an item in this master panel which will result in a form
 * being displayed in the detail panel.
*/
@Component({
    moduleId: module.id,
    selector: "aaimaster",
    templateUrl: "aaimaster.component.html",
    styleUrls: [ "aaimaster.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsyncApiEditorMasterComponent extends AbstractBaseComponent {

    @Input() document: Aai20Document;

    @Output() onImportComponent: EventEmitter<ComponentType> = new EventEmitter<ComponentType>();

    contextMenuSelection: NodePath = null;
    contextMenuType: string = null;
    contextMenuPos: any = {
        left: "0px",
        top: "0px"
    };

    filterCriteria: string = null;
    _channels: AaiChannelItem[];

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param selectionService
     * @param commandService
     * @param editors
     * @param restResourceService
     * @param features
     */
    constructor(changeDetectorRef: ChangeDetectorRef, documentService: DocumentService,
            selectionService: SelectionService, private commandService: CommandService,
            private editors: EditorsService, private restResourceService: RestResourceService,
            private features: FeaturesService) {
    super(changeDetectorRef, documentService, selectionService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    protected onDocumentChange(): void {

    }

    public onChannelsKeypress(event: KeyboardEvent): void {
        if (KeypressUtils.isUpArrow(event) || KeypressUtils.isDownArrow(event)) {
            let channels: AaiChannelItem[] = this.channels();
            this.handleArrowKeypress(event, channels);
        }
    }

    protected handleArrowKeypress(event: KeyboardEvent, items: Node[]): void {
        console.info("[AsyncApiEditorMasterComponent] Up/Down arrow detected.");
        let selectedIdx: number = -1;
        items.forEach( (item, idx) => {
            if (ModelUtils.isSelected(item)) {
                selectedIdx = idx;
            }
        });

        console.info("[AsyncApiEditorMasterComponent] Current selection index: ", selectedIdx);

        // Do nothing if we have no selection and the user hits the UP arrow
        if (selectedIdx == -1 && KeypressUtils.isUpArrow(event)) {
            selectedIdx = items.length;
        }

        if (KeypressUtils.isDownArrow(event)) {
            selectedIdx++;
        } else {
            selectedIdx--;
        }
        if (selectedIdx < 0) {
            selectedIdx = 0;
        }
        if (selectedIdx >= items.length) {
            selectedIdx = items.length - 1;
        }

        console.info("[AsyncApiEditorMasterComponent] New Selection Index: ", selectedIdx);

        let newSelection: Node = items[selectedIdx];
        this.__selectionService.selectNode(newSelection);
    }

    /**
     * Returns an array of paths that match the filter criteria and are sorted alphabetically.
     */
    public channels(): AaiChannelItem[] {
        if (!this._channels) {
            let viz: FindChannelItemsVisitor = new FindChannelItemsVisitor(this.filterCriteria);
            if (this.document && this.document.channels) {
                this.document.getChannels().forEach(channelItem => {
                    VisitorUtil.visitNode(channelItem, viz);
                });
            }
            this._channels = viz.getSortedChannelItems();
        }
        return this._channels;
    }

    /**
     * Returns true if the given item is a valid channel in the current document.
     * @param channelItem
     */
    protected isValidChannelItem(channelItem: AaiChannelItem): boolean {
        if (ObjectUtils.isNullOrUndefined(channelItem)) {
            return false;
        }
        if (ObjectUtils.isNullOrUndefined(this.document.channels)) {
            return false;
        }
        let pi: any = this.document.channels.getPathItem(channelItem.getName());
        return pi === channelItem;
    }

    /**
     * Returns true if the given node is the currently selected item *or* is the parent
     * of the currently selected item.
     * @param node
     * @return
     */
    public isSelected(node: Node): boolean {
        return ModelUtils.isSelected(node);
    }

    /**
     * Returns true if the main node should be selected.
     * @return
     */
    public isMainSelected(): boolean {
        return ModelUtils.isSelected(this.document);
    }

    /**
     * Returns true if the given node is the current context menu item.
     * @param node
     * @return
     */
    public isContexted(node: Node): boolean {
        if (this.contextMenuSelection === null) {
            return false;
        }
        return this.contextMenuSelection.contains(node);
    }

    /**
     * Called to determine whether there is a validation problem associated with the given
     * node (either directly on the node or any descendant node).
     * @param node
     */
    public hasValidationProblem(node: Node): boolean {
        let viz: HasProblemVisitor = new HasProblemVisitor();
        VisitorUtil.visitTree(node, viz, TraverserDirection.down);
        return viz.problemsFound;
    }

    public entityClasses(node: Node): string {
        let classes: string[] = [];
        if (this.hasValidationProblem(node)) {
            classes.push("problem-marker");
        }
        if (this.isContexted(node)) {
            classes.push("contexted");
        }
        if (this.isSelected(node)) {
            classes.push("selected");
        }
        return classes.join(' ');
    }

    /**
     * Returns the classes that should be applied to the channel item in the master view.
     * @param node
     * @return
     */
    public channelClasses(node: AaiChannelItem): string {
        return this.entityClasses(node);
    }
}

/**
 * Visitor used to search through the data model for validation problems.
 */
class HasProblemVisitor extends CombinedAllNodeVisitor {

    public problemsFound: boolean = false;

    visitNode(node: Node): void {
        if (node._validationProblems.length > 0) {
            this.problemsFound = true;
        }
    }

}