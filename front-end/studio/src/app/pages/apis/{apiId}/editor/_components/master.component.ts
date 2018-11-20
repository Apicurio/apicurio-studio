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
    HostListener,
    Input,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {
    Oas20Document,
    Oas20PathItem,
    Oas20ResponseDefinition,
    Oas20SchemaDefinition,
    Oas30Document,
    Oas30PathItem,
    Oas30ResponseDefinition,
    Oas30SchemaDefinition,
    OasAllNodeVisitor,
    OasDocument,
    OasLibraryUtils,
    OasNode,
    OasNodePath,
    OasPathItem,
    OasVisitorUtil
} from "oai-ts-core";
import {AddPathDialogComponent} from "./dialogs/add-path.component";
import {ClonePathDialogComponent} from "./dialogs/clone-path.component";
import {CloneDefinitionDialogComponent} from "./dialogs/clone-definition.component";
import {FindPathItemsVisitor} from "../_visitors/path-items.visitor";
import {FindSchemaDefinitionsVisitor} from "../_visitors/schema-definitions.visitor";
import {KeypressUtils, ObjectUtils} from "../_util/object.util";
import {
    createAddPathItemCommand,
    createAddSchemaDefinitionCommand,
    createDeletePathCommand,
    createDeleteSchemaDefinitionCommand,
    createNewPathCommand,
    createNewSchemaDefinitionCommand,
    createRenamePathItemCommand,
    createRenameSchemaDefinitionCommand,
    ICommand
} from "oai-ts-commands";
import {ModelUtils} from "../_util/model.util";
import {ApiEditorUser} from "../../../../../models/editor-user.model";
import {RenameDefinitionDialogComponent} from "./dialogs/rename-definition.component";
import {SelectionService} from "../_services/selection.service";
import {Subscription} from "rxjs/Subscription";
import {CommandService} from "../_services/command.service";
import {EditorsService} from "../_services/editors.service";
import {DataTypeData, DataTypeEditorComponent, IDataTypeEditorHandler} from "./editors/data-type-editor.component";
import {AggregateCommand, createAggregateCommand} from "oai-ts-commands/src/commands/aggregate.command";
import {RestResourceService} from "../_services/rest-resource.service";
import {RenamePathDialogComponent} from "./dialogs/rename-path.component";
import {AbstractBaseComponent} from "./common/base-component";
import {DocumentService} from "../_services/document.service";


/**
 * The component that models the master view of the API editor.  This is the
 * left-hand side of the editor, which lists things like Paths and Definitions.
 * Users will select an item in this master panel which will result in a form
 * being displayed in the detail panel.
 */
@Component({
    moduleId: module.id,
    selector: "master",
    templateUrl: "master.component.html",
    styleUrls: [ "master.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorMasterComponent extends AbstractBaseComponent {

    @Input() document: OasDocument;

    private _library: OasLibraryUtils = new OasLibraryUtils();

    selectionSubscription: Subscription;

    contextMenuSelection: OasNodePath = null;
    contextMenuType: string = null;
    contextMenuPos: any = {
        left: "0px",
        top: "0px"
    };

    @ViewChild("addPathDialog") addPathDialog: AddPathDialogComponent;
    @ViewChild("clonePathDialog") clonePathDialog: ClonePathDialogComponent;
    @ViewChild("cloneDefinitionDialog") cloneDefinitionDialog: CloneDefinitionDialogComponent;
    @ViewChild("renameDefinitionDialog") renameDefinitionDialog: RenameDefinitionDialogComponent;
    @ViewChild("renamePathDialog") renamePathDialog: RenamePathDialogComponent;

    filterCriteria: string = null;
    _paths: OasPathItem[];
    _defs: (Oas20SchemaDefinition | Oas30SchemaDefinition)[];

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private selectionService: SelectionService, private commandService: CommandService,
                private editors: EditorsService, private restResourceService: RestResourceService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.selectionSubscription = this.selectionService.selection().subscribe( () => {});
        this.selectionService.selectRoot(this.document);
    }

    protected onDocumentChange(): void {
        this._paths = null;
        this._defs = null;
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.selectionSubscription.unsubscribe();
    }

    public onPathsKeypress(event: KeyboardEvent): void {
        console.info("+++++++++++ keyboard event: ", event);
        if (KeypressUtils.isUpArrow(event) || KeypressUtils.isDownArrow(event)) {
            let paths: OasPathItem[] = this.paths();
            this.handleArrowKeypress(event, paths);
        }
    }

    public onDefinitionsKeypress(event: KeyboardEvent): void {
        if (KeypressUtils.isUpArrow(event) || KeypressUtils.isDownArrow(event)) {
            let definitions: (Oas20SchemaDefinition | Oas30SchemaDefinition)[] = this.definitions();
            this.handleArrowKeypress(event, definitions);
        }
    }

    protected handleArrowKeypress(event: KeyboardEvent, items: OasNode[]): void {
        console.info("[EditorMasterComponent] Up/Down arrow detected.");
        let selectedIdx: number = -1;
        items.forEach( (item, idx) => {
            if (ModelUtils.isSelected(item)) {
                selectedIdx = idx;
            }
        });

        console.info("[EditorMasterComponent] Current selection index: ", selectedIdx);

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

        console.info("[EditorMasterComponent] New Selection Index: ", selectedIdx);

        let newSelection: OasNode = items[selectedIdx];
        this.selectionService.selectNode(newSelection, this.document);
    }

    /**
     * Returns an array of paths that match the filter criteria and are sorted alphabetically.
     */
    public paths(): OasPathItem[] {
        if (!this._paths) {
            let viz: FindPathItemsVisitor = new FindPathItemsVisitor(this.filterCriteria);
            if (this.document && this.document.paths) {
                this.document.paths.pathItems().forEach(pathItem => {
                    OasVisitorUtil.visitNode(pathItem, viz);
                });
            }
            this._paths = viz.getSortedPathItems();
        }
        return this._paths;
    }

    /**
     * Returns the array of definitions, filtered by search criteria and sorted.
     */
    public definitions(): (Oas20SchemaDefinition | Oas30SchemaDefinition)[] {
        let viz: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(this.filterCriteria);
        if (this.document) {
            if (this.document.is2xDocument() && (this.document as Oas20Document).definitions) {
                (this.document as Oas20Document).definitions.definitions().forEach( definition => {
                    OasVisitorUtil.visitNode(definition, viz);
                })
            } else if (this.document.is3xDocument() && (this.document as Oas30Document).components) {
                (this.document as Oas30Document).components.getSchemaDefinitions().forEach( definition => {
                    OasVisitorUtil.visitNode(definition, viz);
                })
            }
        }
        return viz.getSortedSchemaDefinitions();
    }

    /**
     * Returns an array of responses filtered by the search criteria and sorted.
     */
    public responses(): (Oas20ResponseDefinition | Oas30ResponseDefinition)[] {
        return [];
        // if (this.document.responses) {
        //     return this.document.responses.responses().filter( response => {
        //         if (this.acceptThroughFilter(response.name())) {
        //             return response;
        //         } else {
        //             return null;
        //         }
        //     }).sort( (response1, response2) => {
        //         return response1.name().localeCompare(response2.name());
        //     });
        // } else {
        //     return [];
        // }
    }

    /**
     * Returns true if the given item is a valid path in the current document.
     * @param pathItem
     */
    protected isValidPathItem(pathItem: OasPathItem): boolean {
        if (ObjectUtils.isNullOrUndefined(pathItem)) {
            return false;
        }
        if (ObjectUtils.isNullOrUndefined(this.document.paths)) {
            return false;
        }
        let pi: any = this.document.paths.pathItem(pathItem.path());
        return pi === pathItem;
    }

    /**
     * Returns true if the given schema definition is valid and contained within the
     * current document.
     * @param definition
     * @return
     */
    protected isValidDefinition(definition: Oas20SchemaDefinition | Oas30SchemaDefinition): boolean {
        if (ObjectUtils.isNullOrUndefined(definition)) {
            return false;
        }
        return this.definitions().indexOf(definition) !== -1;
    }

    /**
     * Returns true if the given response is valid and contained within the
     * current document.
     * @param response
     * @return
     */
    protected isValidResponse(response: Oas20ResponseDefinition | Oas30ResponseDefinition): boolean {
        if (ObjectUtils.isNullOrUndefined(response)) {
            return false;
        }
        return this.responses().indexOf(response) !== -1;
    }

    /**
     * Called when the user selects the main/default element from the master area.
     */
    public selectMain(): void {
        this.selectionService.selectRoot(this.document);
    }

    /**
     * Called when the user selects a path from the master area.
     * @param path
     */
    public selectPath(path: OasPathItem): void {
        this.selectionService.selectNode(path, this.document);
    }

    /**
     * Called to deselect the currently selected path.
     */
    public deselectPath(): void {
        this.selectMain();
    }

    /**
     * Called when the user selects a definition from the master area.
     * @param def
     */
    public selectDefinition(def: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
        this.selectionService.selectNode(def, this.document);
    }

    /**
     * Deselects the currently selected definition.
     */
    public deselectDefinition(): void {
        this.selectMain();
    }

    /**
     * Called when the user selects a response from the master area.
     * @param response
     */
    public selectResponse(response: Oas20ResponseDefinition | Oas30ResponseDefinition): void {
        this.selectionService.selectNode(response, this.document);
    }

    /**
     * Deselects the currently selected response.
     */
    public deselectResponse(): void {
        this.selectMain();
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
    public getCurrentPathSelection(): string {
        let node: OasNode = this.selectionService.currentSelection().resolve(this.document);
        let rval: string = "/";
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
     * Returns the selection style to use for the given (potentially selected) node.
     * @param item
     * @return
     */
    public collaboratorSelectionClasses(item: OasNode): string {
        if (item) {
            let user: ApiEditorUser = ModelUtils.isSelectedByCollaborator(item);
            if (user != null && user.attributes["id"]) {
                return user.attributes["id"];
            }
        }
        return "";
    }

    /**
     * Called when the user fills out the Add Path modal dialog and clicks Add.
     * @param path
     */
    public addPath(path: string): void {
        let command: ICommand = createNewPathCommand(this.document, path);
        this.commandService.emit(command);
        this.selectPath(this.document.paths.pathItem(path) as OasPathItem);
    }

    /**
     * Returns true if the given node is the currently selected item *or* is the parent
     * of the currently selected item.
     * @param node
     * @return
     */
    public isSelected(node: OasNode): boolean {
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
    public isContexted(node: OasNode): boolean {
        if (this.contextMenuSelection === null) {
            return false;
        }
        return this.contextMenuSelection.contains(node);
    }

    /**
     * Called when the user fills out the Add Definition modal dialog and clicks Add.
     */
    public addDefinition(data: DataTypeData): void {
        console.info("[EditorMasterComponent] Adding a definition: ", data);
        if (data.template === "resource") {
            let commands: ICommand[] = [];
            // First, create the "new schema def" command
            let example: string = (data.example === "") ? null : data.example;
            let newSchemaCmd: ICommand = createNewSchemaDefinitionCommand(this.document, data.name, example, data.description);
            commands.push(newSchemaCmd);
            // Next, add the "REST Resource" commands to the list
            this.restResourceService.generateRESTResourceCommands(data.name, this.document).forEach( cmd => commands.push(cmd));
            // Now create an aggregate command for them all and emit that
            let info: any = {
                dataType: data.name
            };
            let command: AggregateCommand = createAggregateCommand("CreateRESTResource", info, commands);
            this.commandService.emit(command);
        } else {
            let example: string = (data.example === "") ? null : data.example;
            let command: ICommand = createNewSchemaDefinitionCommand(this.document, data.name, example, data.description);
            this.commandService.emit(command);
        }
        this.selectDefinition(this.getDefinitionByName(data.name));
    }

    /**
     * Gets a definition by its name.
     * @param name
     * @return
     */
    protected getDefinitionByName(name: string): Oas20SchemaDefinition | Oas30SchemaDefinition {
        if (this.document.getSpecVersion() === "2.0") {
            return (this.document as Oas20Document).definitions.definition(name);
        } else {
            return (this.document as Oas30Document).components.getSchemaDefinition(name);
        }
    }

    /**
     * Called when the user searches in the master area.
     * @param criteria
     */
    public filterAll(criteria: string): void {
        console.info("[EditorMasterComponent] Filtering master items: %s", criteria);
        this.filterCriteria = criteria;
        if (this.filterCriteria !== null) {
            this.filterCriteria = this.filterCriteria.toLowerCase();
        }
        this._paths = null;
        this._defs = null;
    }

    /**
     * Called when the user right-clicks on a path.
     * @param event
     * @param pathItem
     */
    public showPathContextMenu(event: MouseEvent, pathItem: OasPathItem): void {
        event.preventDefault();
        event.stopPropagation();
        this.contextMenuPos.left = event.clientX + "px";
        this.contextMenuPos.top = event.clientY + "px";
        this.contextMenuSelection = this._library.createNodePath(pathItem);
        this.contextMenuType = "path";
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
     * Called when the user clicks "New Path" in the context-menu for a path.
     */
    public newPath(): void {
        let pathItem: OasPathItem = this.contextMenuSelection.resolve(this.document) as OasPathItem;
        this.addPathDialog.open(this.document, pathItem.path());
        this.closeContextMenu();
    }

    /**
     * Called when the user clicks "Delete Path" in the context-menu for a path.
     */
    public deletePath(): void {
        let pathItem: OasPathItem = this.contextMenuSelection.resolve(this.document) as OasPathItem;
        let command: ICommand = createDeletePathCommand(this.document, pathItem.path());
        this.commandService.emit(command);
        this.closeContextMenu();
    }

    /**
     * Called when the user clicks "Clone Path" in the context-menu for a path item.
     */
    public clonePath(modalData?: any): void {
        if (undefined === modalData || modalData === null) {
            let pathItem: OasPathItem = this.contextMenuSelection.resolve(this.document) as OasPathItem;
            this.clonePathDialog.open(this.document, pathItem);
        } else {
            let pathItem: OasPathItem = modalData.object;
            console.info("[EditorMasterComponent] Clone path item: %s", modalData.path);
            let cloneSrcObj: any = this._library.writeNode(pathItem);
            let command: ICommand = createAddPathItemCommand(this.document, modalData.path, cloneSrcObj);
            this.commandService.emit(command);
        }
    }

    /**
     * Called when the user right-clicks on a path.
     * @param event
     * @param definition
     */
    public showDefinitionContextMenu(event: MouseEvent, definition: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
        event.preventDefault();
        event.stopPropagation();
        this.contextMenuPos.left = event.clientX + "px";
        this.contextMenuPos.top = event.clientY + "px";
        this.contextMenuSelection = this._library.createNodePath(definition);
        this.contextMenuType = "definition";
    }

    /**
     * Called when the user clicks the "Delete Definition" item in the context-menu for a definition.
     */
    public deleteDefinition(): void {
        let schemaDefName: string = null;
        if (this.document.getSpecVersion() === "2.0") {
            let schemaDef: Oas20SchemaDefinition = this.contextMenuSelection.resolve(this.document) as Oas20SchemaDefinition;
            schemaDefName = schemaDef.definitionName();
        } else {
            let schemaDef: Oas30SchemaDefinition = this.contextMenuSelection.resolve(this.document) as Oas30SchemaDefinition;
            schemaDefName = schemaDef.name();
        }
        let command: ICommand = createDeleteSchemaDefinitionCommand(this.document, schemaDefName);
        this.commandService.emit(command);
        this.closeContextMenu();
    }

    /**
     * Called when the user clicks "Clone Definition" in the context-menu for a definition.
     */
    public cloneDefinition(modalData?: any): void {
        if (undefined === modalData || modalData === null) {
            let schemaDef: any = this.contextMenuSelection.resolve(this.document);
            this.cloneDefinitionDialog.open(this.document, schemaDef);
        } else {
            let definition: OasNode = modalData.definition;
            console.info("[EditorMasterComponent] Clone definition: %s", modalData.name);
            let cloneSrcObj: any = this._library.writeNode(definition);
            let command: ICommand = createAddSchemaDefinitionCommand(this.document, modalData.name, cloneSrcObj);
            this.commandService.emit(command);
        }
    }

    /**
     * Called when the user clicks "Rename Definition" in the context-menu for a schema definition.
     */
    public renameDefinition(modalData?: any): void {
        if (undefined === modalData || modalData === null) {
            let schemaDef: any = this.contextMenuSelection.resolve(this.document);
            this.renameDefinitionDialog.open(this.document, schemaDef);
        } else {
            let definition: Oas20SchemaDefinition | Oas30SchemaDefinition = modalData.definition;
            let oldName: string = definition["_definitionName"];
            if (!oldName) {
                oldName = definition["_name"];
            }
            console.info("[EditorMasterComponent] Rename definition to: %s", modalData.name);
            let command: ICommand = createRenameSchemaDefinitionCommand(this.document, oldName, modalData.name);
            this.commandService.emit(command);
        }
    }

    /**
     * Called when the user clicks "Rename Definition" in the context-menu for a schema definition.
     */
    public renamePath(modalData?: any): void {
        console.info("[EditorMasterComponent] Renaming path: ", modalData);
        if (undefined === modalData || modalData === null) {
            let pathItem: any = this.contextMenuSelection.resolve(this.document);
            this.renamePathDialog.open(this.document, pathItem);
        } else {
            let path: Oas20PathItem | Oas30PathItem = modalData.path;
            let oldName: string = path.path();
            console.info("[EditorMasterComponent] Rename definition to: %s", modalData.name);
            let command: ICommand = createRenamePathItemCommand(this.document, oldName, modalData.name, modalData.renameSubpaths);
            this.commandService.emit(command);
        }
    }

    /**
     * Called to determine whether there is a validation problem associated with the given
     * node (either directly on the node or any descendant node).
     * @param node
     */
    public hasValidationProblem(node: OasNode): boolean {
        let viz: HasProblemVisitor = new HasProblemVisitor();
        OasVisitorUtil.visitTree(node, viz);
        return viz.problemsFound;
    }

    /**
     * Returns the classes that should be applied to the path item in the master view.
     * @param node
     * @return
     */
    public pathClasses(node: OasPathItem): string {
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
        return classes.join(' ') + " " + this.collaboratorSelectionClasses(node);
    }

    /**
     * Returns the classes that should be applied to the schema definition in the master view.
     * @param node
     * @return
     */
    public definitionClasses(node: OasNode): string {
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
        return classes.join(' ') + " " + this.collaboratorSelectionClasses(node);
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
}


/**
 * Visitor used to search through the data model for validation problems.
 */
class HasProblemVisitor extends OasAllNodeVisitor {

    public problemsFound: boolean = false;

    protected doVisitNode(node: OasNode): void {
        if (node._validationProblems.length > 0) {
            this.problemsFound = true;
        }
    }

}
