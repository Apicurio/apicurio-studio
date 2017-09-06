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

import {Component, EventEmitter, HostListener, Input, Output, ViewChild} from "@angular/core";
import {
    Oas20Document,
    Oas20ResponseDefinition, Oas20Schema,
    Oas20SchemaDefinition,
    Oas30Document,
    Oas30ResponseDefinition,
    Oas30SchemaDefinition,
    OasDocument,
    OasLibraryUtils,
    OasNode,
    OasOperation,
    OasPathItem,
    OasValidationError,
    OasVisitorUtil
} from "oai-ts-core";
import {AddPathDialogComponent} from "./dialogs/add-path.component";
import {ClonePathDialogComponent} from "./dialogs/clone-path.component";
import {CloneDefinitionDialogComponent} from "./dialogs/clone-definition.component";
import {FindPathItemsVisitor} from "../_visitors/path-items.visitor";
import {FindSchemaDefinitionsVisitor} from "../_visitors/schema-definitions.visitor";
import {ObjectUtils} from "../_util/object.util";
import {ICommand} from "../_services/commands.manager";
import {AllNodeVisitor} from "../_visitors/base.visitor";
import {NodeSelectionEvent} from "../_events/node-selection.event";
import {
    createAddPathItemCommand,
    createAddSchemaDefinitionCommand,
    createDeleteNodeCommand,
    createDeletePathCommand,
    createDeleteSchemaDefinitionCommand,
    createNewPathCommand,
    createNewSchemaDefinitionCommand
} from "oai-ts-commands";


/**
 * The component that models the master view of the API editor.  This is the
 * left-hand side of the editor, which lists things like Paths and Definitions.
 * Users will select an item in this master panel which will result in a form
 * being displayed in the detail panel.
 */
@Component({
    moduleId: module.id,
    selector: "master",
    templateUrl: "master.component.html"
})
export class EditorMasterComponent {

    @Input() document: OasDocument;
    @Input() validationErrors: OasValidationError[];
    @Output() onCommand: EventEmitter<ICommand> = new EventEmitter<ICommand>();
    @Output() onNodeSelected: EventEmitter<NodeSelectionEvent> = new EventEmitter<NodeSelectionEvent>();

    private _library: OasLibraryUtils = new OasLibraryUtils();

    selectedItem: any = null;
    selectedType: string = "main";

    contextMenuItem: any = null;
    contextMenuType: string = null;
    contextMenuPos: any = {
        left: "0px",
        top: "0px"
    };

    @ViewChild("addPathDialog") addPathDialog: AddPathDialogComponent;
    @ViewChild("clonePathDialog") clonePathDialog: ClonePathDialogComponent;
    @ViewChild("cloneDefinitionDialog") cloneDefinitionDialog: CloneDefinitionDialogComponent;

    filterCriteria: string = null;

    validationPanelOpen = false;

    public isOAI30(): boolean {
        return this.document.getSpecVersion().indexOf("3.0") === 0;
    }

    public isSwagger2(): boolean {
        return this.document.getSpecVersion() === "2.0";
    }

    /**
     * Returns an array of paths that match the filter criteria and are sorted alphabetically.
     * @return {OasPathItem[]}
     */
    public paths(): OasPathItem[] {
        let viz: FindPathItemsVisitor = new FindPathItemsVisitor(this.filterCriteria);
        OasVisitorUtil.visitTree(this.document, viz);
        return viz.getSortedPathItems();
    }

    /**
     * Returns the array of definitions, filtered by search criteria and sorted.
     * @return {(Oas20SchemaDefinition | Oas30SchemaDefinition)[]}
     */
    public definitions(): (Oas20SchemaDefinition | Oas30SchemaDefinition)[] {
        let viz: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(this.filterCriteria);
        OasVisitorUtil.visitTree(this.document, viz);
        return viz.getSortedSchemaDefinitions();
    }

    /**
     * Returns an array of responses filtered by the search criteria and sorted.
     * @return {(Oas20ResponseDefinition | Oas30ResponseDefinition)[]}
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
     * Validates the current selected item.  If it does not exist, we'll force-select
     * 'main' instead.
     */
    public validateSelection(): void {
        if (this.selectedType === "path") {
            let pathItem: OasPathItem = this.selectedItem as OasPathItem;
            if (!this.isValidPathItem(pathItem)) {
                this.selectMain();
            }
        } else if (this.selectedType === "operation") {
            let operation: OasOperation = this.selectedItem as OasOperation;
            if (!this.isValidOperation(operation)) {
                this.selectMain();
            }
        } else if (this.selectedType === "definition") {
            let definition: Oas20SchemaDefinition | Oas30SchemaDefinition = this.selectedItem;
            if (!this.isValidDefinition(definition)) {
                this.selectMain();
            }
        } else if (this.selectedType === "response") {
            let response: Oas20ResponseDefinition | Oas30ResponseDefinition = this.selectedItem;
            if (!this.isValidResponse(response)) {
                this.selectMain();
            }
        } else if (this.selectedType === "problem") {
            if (!(this.validationErrors && this.validationErrors.indexOf(this.selectedItem) !== -1)) {
                this.selectMain();
            }
        }
    }

    /**
     * Returns true if the given item is a valid path in the current document.
     * @param {OasPathItem} pathItem
     * @return {boolean}
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
     * Returns true if the given operation is a valid operation contained within the
     * current document.
     * @param {OasOperation} operation
     * @return {boolean}
     */
    protected isValidOperation(operation: OasOperation): boolean {
        let pathItem: OasPathItem = operation.parent() as OasPathItem;

        if (ObjectUtils.isNullOrUndefined(operation)) {
            return false;
        }

        if (!this.isValidPathItem(pathItem)) {
            return false;
        }

        let pi: any = this.document.paths.pathItem(pathItem.path());
        let op: any = pi[operation.method()];

        return op === operation;
    }

    /**
     * Returns true if the given schema definition is valid and contained within the
     * current document.
     * @param {Oas20SchemaDefinition | Oas30SchemaDefinition} definition
     * @return {boolean}
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
     * @param {Oas20ResponseDefinition | Oas30ResponseDefinition} response
     * @return {boolean}
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
        this.selectedItem = null;
        this.selectedType = "main";
        this.fireNodeSelectedEvent();
    }

    /**
     * Called when the user selects a path from the master area.
     * @param {OasPathItem} path
     */
    public selectPath(path: OasPathItem): void {
        this.selectedItem = path;
        this.selectedType = "path";
        this.fireNodeSelectedEvent();
    }

    /**
     * Called to deselect the currently selected path.
     */
    public deselectPath(): void {
        this.selectMain();
    }

    /**
     * Called when the user clicks an operation.
     * @param operation
     */
    public selectOperation(operation: OasOperation): void {
        // Possible de-select the operation if it's clicked on but already selected.
        if (this.selectedType === "operation" && this.selectedItem === operation) {
            this.selectPath(operation.parent() as OasPathItem);
        } else {
            this.selectedItem = operation;
            this.selectedType = "operation";
            this.fireNodeSelectedEvent();
        }
    }

    /**
     * Called to deselect the currently selected operation.
     */
    public deselectOperation(): void {
        if (this.selectedType !== "operation") {
            return;
        }
        this.selectedItem = this.selectedItem.parent();
        this.selectedType = "path";
        this.fireNodeSelectedEvent();
    }

    /**
     * Called when the user does something to cause the selection to change.
     * @param event
     */
    public selectNode(event: NodeSelectionEvent): void {
        this.selectedItem = event.node;
        this.selectedType = event.type;
        this.fireNodeSelectedEvent();
    }

    /**
     * Called when the user selects a definition from the master area.
     * @param def
     */
    public selectDefinition(def: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
        this.selectedItem = def;
        this.selectedType = "definition";
        this.fireNodeSelectedEvent();
    }

    /**
     * Called when the user selects a validation problem from the master
     * area.
     * @param problem
     */
    public selectProblem(problem: OasValidationError): void {
        this.selectedItem = problem;
        this.selectedType = "problem";
        this.fireNodeSelectedEvent();
    }

    /**
     * Deselects the currently selected definition.
     */
    public deselectDefinition(): void {
        console.info("[EditorMasterComponent] Deselecting the current definition (selecting main).");
        this.selectMain();
    }

    /**
     * Called when the user selects a response from the master area.
     * @param {Oas20ResponseDefinition | Oas30ResponseDefinition} response
     */
    public selectResponse(response: Oas20ResponseDefinition | Oas30ResponseDefinition): void {
        this.selectedItem = response;
        this.selectedType = "response";
        this.fireNodeSelectedEvent();
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
        if (event.key === "Escape"  && !event.metaKey && !event.altKey && !event.ctrlKey) {
            this.closeContextMenu();
        }
    }

    /**
     * Called to return the currently selected path (if one is selected).  If not, returns "/".
     */
    public getCurrentPathSelection(): string {
        if (this.selectedType === "path") {
            return (this.selectedItem as OasPathItem).path();
        }
        if (this.selectedType === "operation") {
            return ((this.selectedItem as OasOperation).parent() as OasPathItem).path();
        }
        return "/";
    }

    /**
     * Called when the user fills out the Add Path modal dialog and clicks Add.
     * @param {string} path
     */
    public addPath(path: string): void {
        let command: ICommand = createNewPathCommand(this.document, path);
        this.onCommand.emit(command);
        this.selectPath(this.document.paths.pathItem(path) as OasPathItem);
    }

    /**
     * Called to test whether the given resource path has an operation of the given type defined.
     * @param {OasPathItem} pathItem
     * @param {string} operation
     * @return {boolean}
     */
    public hasOperation(pathItem: OasPathItem, operation: string): boolean {
        let op: OasOperation = pathItem[operation];
        return !ObjectUtils.isNullOrUndefined(op);
    }

    /**
     * Returns true if the given path is the currently selected item *or* is the parent
     * of the currently selected item.
     * @param {OasPathItem} pathItem
     * @return {boolean}
     */
    public isPathSelected(pathItem: OasPathItem): boolean {
        return this.selectedItem && (this.selectedItem === pathItem || (this.selectedItem.parent && this.selectedItem.parent() === pathItem));
    }

    /**
     * Returns true if the given path is the current context menu item *or* is the parent
     * of the current context menu item.
     * @param {OasPathItem} pathItem
     * @return {boolean}
     */
    public isPathContexted(pathItem: OasPathItem): boolean {
        return this.contextMenuItem && (this.contextMenuItem === pathItem || (this.contextMenuItem.parent && this.contextMenuItem.parent() === pathItem));
    }

    /**
     * Returns true if the given path item has at least one operation.
     * @param {OasPathItem} pathItem
     * @return {boolean}
     */
    public hasAtLeastOneOperation(pathItem: OasPathItem): boolean {
        if (pathItem) {
            if (pathItem.get) {
                return true;
            }
            if (pathItem.put) {
                return true;
            }
            if (pathItem.post) {
                return true;
            }
            if (pathItem.delete) {
                return true;
            }
            if (pathItem.options) {
                return true;
            }
            if (pathItem.head) {
                return true;
            }
            if (pathItem.patch) {
                return true;
            }
        }
        return false;
    }

    /**
     * Called when the user fills out the Add Definition modal dialog and clicks Add.
     */
    public addDefinition(modalData: any): void {
        let example: string = (modalData.example === "") ? null : modalData.example;
        let command: ICommand = createNewSchemaDefinitionCommand(this.document, modalData.name, example);
        this.onCommand.emit(command);
        this.selectDefinition(this.getDefinitionByName(modalData.name));
    }

    /**
     * Gets a definition by its name.
     * @param {string} name
     * @return {Oas20SchemaDefinition | Oas30SchemaDefinition}
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
        this.contextMenuType = "path";
        this.contextMenuItem = pathItem;
    }

    /**
     * Called when the user right-clicks on an operation.
     * @param {MouseEvent} event
     * @param {OasOperation} operation
     */
    public showOperationContextMenu(event: MouseEvent, operation: OasOperation): void {
        event.preventDefault();
        event.stopPropagation();
        this.contextMenuPos.left = event.clientX + "px";
        this.contextMenuPos.top = event.clientY + "px";
        this.contextMenuType = "operation";
        this.contextMenuItem = operation;
    }

    /**
     * Called when the user clicks somewhere in the document.  Used to close the context
     * menu if it is open.
     */
    @HostListener("document:click", ["$event"])
    public onDocumentClick(): void {
        this.closeContextMenu();
    }

    /**
     * Closes the context menu.
     */
    private closeContextMenu(): void {
        this.contextMenuItem = null;
        this.contextMenuType = null;
    }

    /**
     * Called when the user clicks "New Path" in the context-menu for a path.
     */
    public newPath(): void {
        this.addPathDialog.open((this.contextMenuItem as OasPathItem).path());
        this.closeContextMenu();
    }

    /**
     * Called when the user clicks "Delete Path" in the context-menu for a path.
     */
    public deletePath(): void {
        let command: ICommand = createDeletePathCommand(this.document, (this.contextMenuItem as OasPathItem).path());
        this.onCommand.emit(command);
        if (this.contextMenuItem === this.selectedItem) {
            this.selectMain();
        }
        this.closeContextMenu();
    }

    /**
     * Called when the user clicks "Clone Path" in the context-menu for a path item.
     */
    public clonePath(modalData?: any): void {
        if (undefined === modalData || modalData === null) {
            this.clonePathDialog.open(this.contextMenuItem as OasPathItem);
        } else {
            let pathItem: OasPathItem = modalData.object;
            console.info("[EditorMasterComponent] Clone path item: %s", modalData.path);
            let cloneSrcObj: any = this._library.writeNode(pathItem);
            let command: ICommand = createAddPathItemCommand(this.document, modalData.path, cloneSrcObj);
            this.onCommand.emit(command);
        }
    }

    /**
     * Called when the user clicks "Delete Operation" in the context-menu for a operation.
     */
    public deleteOperation(): void {
        let operation: OasOperation = this.contextMenuItem as OasOperation;
        let command: ICommand = createDeleteNodeCommand(this.document, operation.method(), operation.parent());
        this.onCommand.emit(command);
        if (this.contextMenuItem === this.selectedItem) {
            this.selectPath((this.selectedItem as OasOperation).parent() as OasPathItem);
        }
        this.closeContextMenu();
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
        this.contextMenuType = "definition";
        this.contextMenuItem = definition;
    }

    /**
     * Called when the user clicks the "Delete Definition" item in the context-menu for a definition.
     */
    public deleteDefinition(): void {
        let schemaDefName: string = null;
        if (this.document.getSpecVersion() === "2.0") {
            schemaDefName = (this.contextMenuItem as Oas20SchemaDefinition).definitionName();
        } else {
            schemaDefName = (this.contextMenuItem as Oas30SchemaDefinition).name();
        }
        let command: ICommand = createDeleteSchemaDefinitionCommand(this.document, schemaDefName);
        this.onCommand.emit(command);
        if (this.contextMenuItem === this.selectedItem) {
            this.selectMain();
        }
        this.closeContextMenu();
    }

    /**
     * Called when the user clicks "Clone Definition" in the context-menu for a definition.
     */
    public cloneDefinition(modalData?: any): void {
        if (undefined === modalData || modalData === null) {
            this.cloneDefinitionDialog.open(this.contextMenuItem as any);
        } else {
            let definition: OasNode = modalData.definition;
            console.info("[EditorMasterComponent] Clone definition: %s", modalData.name);
            let cloneSrcObj: any = this._library.writeNode(definition);
            let command: ICommand = createAddSchemaDefinitionCommand(this.document, modalData.name, cloneSrcObj);
            this.onCommand.emit(command);
        }
    }

    /**
     * Called to toggle the visibility of the validation panel (the section that
     * displays validation errors).
     */
    public toggleValidationPanel(): void {
        this.validationPanelOpen = !this.validationPanelOpen;
    }

    /**
     * Returns the name of the definition.
     * @param {Oas20SchemaDefinition | Oas30SchemaDefinition} definition
     * @return {string}
     */
    public definitionName(definition: Oas20SchemaDefinition | Oas30SchemaDefinition): string {
        return definition.ownerDocument().getSpecVersion() === "2.0" ?
            (definition as Oas20SchemaDefinition).definitionName() :
            (definition as Oas30SchemaDefinition).name();
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
     * Called to fire a "selection changed" event.
     */
    private fireNodeSelectedEvent() {
        let event: NodeSelectionEvent = new NodeSelectionEvent(this.selectedItem, this.selectedType);
        this.onNodeSelected.emit(event);
    }
}


/**
 * Visitor used to search through the entire data model for validation problems.
 */
class HasProblemVisitor extends AllNodeVisitor {

    public problemsFound: boolean = false;

    protected doVisitNode(node: OasNode): void {
        let errors: OasValidationError[] = node.n_attribute("validation-errors");
        if (!ObjectUtils.isNullOrUndefined(errors)) {
            if (errors.length > 0) {
                this.problemsFound = true;
            }
        }
    }

}
