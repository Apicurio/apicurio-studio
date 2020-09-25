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
    Oas20SchemaDefinition,
    Oas30SchemaDefinition,
    AaiChannelItem,
    Aai20Document,
    Aai20Components,
    Aai20SchemaDefinition,
    TraverserDirection,
    VisitorUtil
} from "apicurio-data-models";
import {AddChannelDialogComponent} from "./dialogs/add-channel.component";
import {CloneDefinitionDialogComponent} from "./dialogs/clone-definition.component";
import {FindChannelItemsVisitor} from "../_visitors/channel-items.visitor";
import {FindAaiSchemaDefinitionsVisitor} from "../_visitors/schema-definitions.visitor";
import {ModelUtils} from "../_util/model.util";
import {SelectionService} from "../_services/selection.service";
import {CommandService} from "../_services/command.service";
import {EditorsService} from "../_services/editors.service";
import {DataTypeData, DataTypeEditorComponent, IDataTypeEditorHandler} from "./editors/data-type-editor.component";
import {RestResourceService} from "../_services/rest-resource.service";
import {AbstractBaseComponent} from "./common/base-component";
import {DocumentService} from "../_services/document.service";
import {RenameEntityDialogComponent, RenameEntityEvent} from "./dialogs/rename-entity.component";
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

    @ViewChild("addChannelDialog") addChannelDialog: AddChannelDialogComponent;

    @ViewChild("cloneDefinitionDialog") cloneDefinitionDialog: CloneDefinitionDialogComponent;
    @ViewChild("renameDefinitionDialog") renameDefinitionDialog: RenameEntityDialogComponent;

    filterCriteria: string = null;
    _channels: AaiChannelItem[];
    _defs: Aai20SchemaDefinition[];

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
        this._channels = null;
        this._defs = null;
    }

    public onChannelsKeypress(event: KeyboardEvent): void {
        if (KeypressUtils.isUpArrow(event) || KeypressUtils.isDownArrow(event)) {
            let channels: AaiChannelItem[] = this.channels();
            this.handleArrowKeypress(event, channels);
        }
    }

    public onDefinitionsKeypress(event: KeyboardEvent): void {
        if (KeypressUtils.isUpArrow(event) || KeypressUtils.isDownArrow(event)) {
            let definitions: Aai20SchemaDefinition[] = this.definitions();
            this.handleArrowKeypress(event, definitions);
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
     * Returns the array of definitions, filtered by search criteria and sorted.
     */
    public definitions(): Aai20SchemaDefinition[] {
        let viz: FindAaiSchemaDefinitionsVisitor = new FindAaiSchemaDefinitionsVisitor(this.filterCriteria);
        if (!this._defs) {
            this.document.components.getSchemaDefinitions().forEach( definition => {
                VisitorUtil.visitNode(definition, viz);
            })
            this._defs = viz.getSortedSchemaDefinitions();
        }
        return this._defs;
    }

    /**
     * Gets a definition by its name.
     * @param name
     */
    protected getDefinitionByName(name: string): Aai20SchemaDefinition {
        return this.document.components.getSchemaDefinition(name) as Aai20SchemaDefinition;
    }

    public definitionsPath(): string {
        return "/components/schemas";
    }

    /**
     * Called whenever the user presses a key.
     * @param event
     */
    public onGlobalKeyDown(event: KeyboardEvent): void {
        if (KeypressUtils.isEscapeKey(event)) {
            this.closeContextMenu();
        }
    }
    
    /**
     * Called to return the currently selected path (if one is selected).  If not, returns "/".
     */
    public getCurrentChannelSelection(): string {
        let currentSelection: string = this.__selectionService.currentSelection();
        let npath: NodePath = new NodePath(currentSelection);
        let node: Node = npath.resolve(this.document);
        let rval: string = "";
        if (node && node["_path"]) {
            rval = node["_path"] + "/";
        } else if (node && node.parent() && node.parent()["_path"]) {
            rval = node.parent()["_path"] + "/";
        }
        if (rval.endsWith("//")) {
            rval = rval.substring(0, rval.length - 1);
        }
        return rval;
    }

     /**
     * Called when the user fills out the Add Channel modal dialog and clicks Add.
     * @param channel
     */
    public addChannel(channel: string): void {
        let command: ICommand = CommandFactory.createNewChannelCommand(channel);
        this.commandService.emit(command);
        this.selectChannel(this.document.channels.get(channel) as AaiChannelItem);
    }

    /**
     * Called when the user clicks "Rename Channel" in the context-menu for a channel.
     */
    public renameChannel(modalData?: any): void {
        console.info("[AsyncApiEditorMasterComponent] Renaming path: ", modalData);
        if (undefined === modalData || modalData === null) {
            let channelItem: any = this.contextMenuSelection.resolve(this.document);
            //this.renamePathDialog.open(this.document, pathItem);
        } else {
            let channel: AaiChannelItem = modalData.channel;
            let oldName: string = channel.getName();
            console.info("[AsyncApiEditorMasterComponent] Rename definition to: %s", modalData.name);
            //let command: ICommand = CommandFactory.createRenamePathItemCommand(oldName, modalData.name, modalData.renameSubpaths);
            //his.commandService.emit(command);
        }
    }

    /**
     * Called when the user clicks "Clone Channel" in the context-menu for a channel.
     */
    public cloneChannel(): void {
    }

    /**
     * Called when the user clicks "Delete Channel" in the context-menu for a channel.
     */
    public deleteChannel(): void {
        let channelItem: AaiChannelItem = this.contextMenuSelection.resolve(this.document) as AaiChannelItem;
        let command: ICommand = CommandFactory.createDeletePathCommand(channelItem.getName());
        this.commandService.emit(command);
        this.closeContextMenu();
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
     * Called when the user fills out the Add Definition modal dialog and clicks Add.
     */
    public addDefinition(data: DataTypeData): void {
        console.info("[AsyncAPIEditorMasterComponent] Adding a definition: ", data);
        let example: any = (data.example === "") ? null : data.example;
        example = this.exampleAsObject(example);
        let command: ICommand = CommandFactory.createNewSchemaDefinitionCommand(this.document.getDocumentType(),
            data.name, example, data.description);
        this.commandService.emit(command);
        this.selectDefinition(this.getDefinitionByName(data.name));
    }

    /**
     * Called when the user clicks "Clone Definition" in the context-menu for a definition.
     */
    public cloneDefinition(modalData?: any): void {
        if (undefined === modalData || modalData === null) {
            let schemaDef: any = this.contextMenuSelection.resolve(this.document);
            this.cloneDefinitionDialog.open(this.document, schemaDef);
        } else {
            let definition: Node = modalData.definition;
            console.info("[AsyncApiEditorMasterComponent] Clone definition: %s", modalData.name);
            let cloneSrcObj: any = Library.writeNode(definition);
            let command: ICommand = CommandFactory.createAddSchemaDefinitionCommand(this.document.getDocumentType(),
                modalData.name, cloneSrcObj);
            this.commandService.emit(command);
        }
    }

    /**
     * Called when the user clicks "Rename Definition" in the context-menu for a schema definition.
     */
    public renameDefinition(event?: RenameEntityEvent): void {
        if (undefined === event || event === null) {
            let schemaDef: Aai20SchemaDefinition = <any>this.contextMenuSelection.resolve(this.document);
            let name: string = this.definitionName(schemaDef);
            let definitionNames: string[] = [];
            let master: AsyncApiEditorMasterComponent = this;
            VisitorUtil.visitTree(this.document, new class extends CombinedVisitorAdapter {
                public visitSchemaDefinition(node: Aai20SchemaDefinition): void {
                    definitionNames.push(master.definitionName(node));
                }
            }, TraverserDirection.down);
            this.renameDefinitionDialog.open(schemaDef, name, newName => {
                return definitionNames.indexOf(newName) !== -1;
            });
        } else {
            let definition: Aai20SchemaDefinition = <any>event.entity;
            let oldName: string = this.definitionName(definition);
            console.info("[AsyncApiEditorMasterComponent] Rename definition to: %s", event.newName);
            let command: ICommand = CommandFactory.createRenameSchemaDefinitionCommand(this.document.getDocumentType(),
                oldName, event.newName);
            this.commandService.emit(command);
        }
    }

    /**
     * Called when the user clicks "Delete Definition" in the context-menu for a schema definition.
     */
    public deleteDefinition(): void {
    }

    /**
     * Converts a JSON formatted string example to an object.
     * @param from
     */
    protected exampleAsObject(from: string): any {
        try {
            return JSON.parse(from);
        } catch (e) {
            return from;
        }
    }

    /**
     * Figures out the definition name.
     * @param schemaDef
     */
    protected definitionName(schemaDef: Aai20SchemaDefinition): string {
        return schemaDef.getName();
    }

    /**
     * Returns true if the given schema definition is valid and contained within the
     * current document.
     * @param definition
     * @return
     */
    protected isValidDefinition(definition: Aai20SchemaDefinition): boolean {
        if (ObjectUtils.isNullOrUndefined(definition)) {
            return false;
        }
        return this.definitions().indexOf(definition) !== -1;
    }

    /**
     * Called when the user selects the main/default element from the master area.
     */
    public selectMain(): void {
        this.__selectionService.selectRoot();
    }

    /**
     * Called when the user selects a path from the master area.
     * @param channel
     */
    public selectChannel(path: AaiChannelItem): void {
        this.__selectionService.selectNode(path);
    }

     /**
     * Called to deselect the currently selected channel.
     */
    public deselectChannel(): void {
        this.selectMain();
    }

    /**
     * Called when the user selects a definition from the master area.
     * @param def
     */
    public selectDefinition(def: Aai20SchemaDefinition): void {
        this.__selectionService.selectNode(def);
    }

    /**
     * Deselects the currently selected definition.
     */
    public deselectDefinition(): void {
        this.selectMain();
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
     * Called when the user right-clicks on a path.
     * @param event
     * @param pathItem
     */
    public showChannelContextMenu(event: MouseEvent, channelItem: AaiChannelItem): void {
        event.preventDefault();
        event.stopPropagation();
        this.contextMenuPos.left = event.clientX + "px";
        this.contextMenuPos.top = event.clientY + "px";
        this.contextMenuSelection = Library.createNodePath(channelItem);
        this.contextMenuType = "channel";
    }

    /**
     * Called when the user right-clicks on a data type.
     * @param event
     * @param definition
     */
    public showDefinitionContextMenu(event: MouseEvent, definition: Aai20SchemaDefinition): void {
        event.preventDefault();
        event.stopPropagation();
        this.contextMenuPos.left = event.clientX + "px";
        this.contextMenuPos.top = event.clientY + "px";
        this.contextMenuSelection = Library.createNodePath(definition);
        this.contextMenuType = "definition";
    }

    /**
     * Called when the user clicks somewhere in the document.  Used to close the context
     * menu if it is open.
     */
    @HostListener("document:click", ["$event"])
    public onDocumentClick(event: MouseEvent): void {
        // For FireFox (especially macOS), suppress the right click event 
        // to prevent it immediately closing the context menu just activated.
        if (event && event.which === 3) { 
            return; 
        }
        this.closeContextMenu();
    }

    /**
     * Closes the context menu.
     */
    private closeContextMenu(): void {
        this.contextMenuType = null;
        this.contextMenuSelection = null;
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

    /**
     * Returns the classes that should be applied to the schema definition in the master view.
     * @param node
     * @return
     */
    public definitionClasses(node: Node): string {
        return this.entityClasses(node);
    }

    /**
     * Opens the Add Definition Editor (full screen editor for adding a data type).
     */
    public openAddDefinitionEditor(): void {
        let dtEditor: DataTypeEditorComponent = this.editors.getDataTypeEditor();
        let handler: IDataTypeEditorHandler = {
            onSave: (event) => {
                this.addDefinition(event.data);
            },
            onCancel: () => { /* Do nothing on cancel... */ }
        };
        dtEditor.open(handler, this.document);
    }

    importsEnabled(): boolean {
        return this.features.getFeatures().componentImports;
    }

    importDataTypes(): void {
        this.onImportComponent.emit(ComponentType.schema);
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