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

import {Component, EventEmitter, HostListener, Input, Output, ViewChild, ViewEncapsulation} from "@angular/core";
import {ApiDefinition} from "../../../../models/api.model";
import {
    Oas20SchemaDefinition,
    Oas20Document, Oas20NodeVisitorAdapter,
    Oas20Operation,
    Oas20PathItem, Oas20ResponseDefinition,
    OasLibraryUtils,
    OasNode, OasTraverserDirection,
    OasValidationError, OasVisitorUtil
} from "oai-ts-core";
import {CommandsManager, ICommand} from "./_services/commands.manager";
import {NewPathCommand} from "./_commands/new-path.command";
import {NewDefinitionCommand} from "./_commands/new-definition.command";
import {AddPathDialogComponent} from "./_components/dialogs/add-path.component";
import {DeleteDefinitionSchemaCommand, DeleteNodeCommand, DeletePathCommand} from "./_commands/delete.command";
import {AllNodeVisitor} from "./_util/model.util";
import {ObjectUtils} from "./_util/object.util";
import {NodeSelectionEvent} from "./_components/forms/source-form.base";
import {CloneDefinitionDialogComponent} from "./_components/dialogs/clone-definition.component";
import {AddDefinitionCommand} from "./_commands/add-definition.command";
import {ClonePathDialogComponent} from "./_components/dialogs/clone-path.component";
import {AddPathItemCommand} from "./_commands/add-path.command";


@Component({
    moduleId: module.id,
    selector: "api-editor",
    templateUrl: "editor.component.html",
    styleUrls: ["editor.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class ApiEditorComponent {

    @Input() api: ApiDefinition;
    @Output() onDirty: EventEmitter<boolean> = new EventEmitter<boolean>();

    private _library: OasLibraryUtils = new OasLibraryUtils();
    private _document: Oas20Document = null;
    private _commands: CommandsManager = new CommandsManager();

    theme: string = "light";
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

    validationErrors: OasValidationError[] = [];
    validationPanelOpen = false;

    /**
     * Constructor.
     */
    constructor() {}

    /**
     * Gets the OpenAPI spec as a document.
     */
    public document(): Oas20Document {
        if (this._document === null) {
            this._document = <Oas20Document>this._library.createDocument(this.api.spec);
            this.validateModel();
        }
        return this._document;
    }

    /**
     * Returns an array of paths that match the filter criteria and are sorted alphabetically.
     * @return {any}
     */
    public paths(): Oas20PathItem[] {
        if (this.document().paths) {
            let items: Oas20PathItem[] = this.document().paths.pathItems() as Oas20PathItem[];
            return items.filter( pathItem => {
                if (this.acceptThroughFilter(pathItem.path())) {
                    return pathItem;
                } else {
                    return null;
                }
            }).sort( (pathItem1, pathItem2) => {
                return pathItem1.path().localeCompare(pathItem2.path());
            });
        } else {
            return [];
        }
    }

    /**
     * Returns the array of definitions, filtered by search criteria and sorted.
     * @return {any}
     */
    public definitions(): Oas20SchemaDefinition[] {
        if (this.document().definitions) {
            return this.document().definitions.definitions().filter( def => {
                if (this.acceptThroughFilter(def.definitionName())) {
                    return def;
                } else {
                    return null;
                }
            }).sort( (def1, def2) => {
                return def1.definitionName().localeCompare(def2.definitionName());
            });
        } else {
            return [];
        }
    }

    /**
     * Returns an array of responses filtered by the search criteria and sorted.
     * @return {any}
     */
    public responses(): Oas20ResponseDefinition[] {
        if (this.document().responses) {
            return this.document().responses.responses().filter( response => {
                if (this.acceptThroughFilter(response.name())) {
                    return response;
                } else {
                    return null;
                }
            }).sort( (response1, response2) => {
                return response1.name().localeCompare(response2.name());
            });
        } else {
            return [];
        }
    }

    /**
     * Validates the current selected item.  If it does not exist, we'll force-select
     * 'main' instead.
     */
    protected validateSelection(): void {
        if (this.selectedType === "path") {
            let pathItem: Oas20PathItem = this.selectedItem as Oas20PathItem;
            if (!this.isValidPathItem(pathItem)) {
                this.selectMain();
            }
        } else if (this.selectedType === "operation") {
            let operation: Oas20Operation = this.selectedItem as Oas20Operation;
            if (!this.isValidOperation(operation)) {
                this.selectMain();
            }
        } else if (this.selectedType === "definition") {
            let definition: Oas20SchemaDefinition = this.selectedItem as Oas20SchemaDefinition;
            if (!this.isValidDefinition(definition)) {
                this.selectMain();
            }
        } else if (this.selectedType === "response") {
            let response: Oas20ResponseDefinition = this.selectedItem as Oas20ResponseDefinition;
            if (!this.isValidResponse(response)) {
                this.selectMain();
            }
        } else if (this.selectedType === "problem") {
            if (!(this.validationErrors && this.validationErrors.indexOf(this.selectedItem) !== -1)) {
                this.selectMain();
            }
        }
    }

    protected isValidPathItem(pathItem: Oas20PathItem): boolean {
        if (ObjectUtils.isNullOrUndefined(pathItem)) {
            return false;
        }
        if (ObjectUtils.isNullOrUndefined(this.document().paths)) {
            return false;
        }
        let pi: any = this.document().paths.pathItem(pathItem.path());
        return pi === pathItem;
    }

    protected isValidOperation(operation: Oas20Operation): boolean {
        let pathItem: Oas20PathItem = operation.parent() as Oas20PathItem;

        if (ObjectUtils.isNullOrUndefined(operation)) {
            return false;
        }

        if (!this.isValidPathItem(pathItem)) {
            return false;
        }

        let pi: any = this.document().paths.pathItem(pathItem.path());
        let op: any = pi[operation.method()];

        return op === operation;
    }

    protected isValidDefinition(definition: Oas20SchemaDefinition): boolean {
        if (ObjectUtils.isNullOrUndefined(definition)) {
            return false;
        }
        if (ObjectUtils.isNullOrUndefined(this.document().definitions)) {
            return false;
        }
        let def: any = this.document().definitions.definition(definition.definitionName());
        return def === definition;
    }

    protected isValidResponse(response: Oas20ResponseDefinition): boolean {
        if (ObjectUtils.isNullOrUndefined(response)) {
            return false;
        }
        if (ObjectUtils.isNullOrUndefined(this.document().responses)) {
            return false;
        }
        let resp: any = this.document().responses.response(response.name());
        return resp === response;
    }

    /**
     * Called when the user selects the main/default element from the master area.
     */
    public selectMain(): void {
        this.selectedItem = null;
        this.selectedType = "main";
    }

    /**
     * Called when the user selects a path from the master area.
     * @param name
     */
    public selectPath(path: Oas20PathItem): void {
        this.selectedItem = path;
        this.selectedType = "path";
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
    public selectOperation(operation: Oas20Operation): void {
        // Possible de-select the operation if it's clicked on but already selected.
        if (this.selectedType === "operation" && this.selectedItem === operation) {
            this.selectPath(operation.parent() as Oas20PathItem);
        } else {
            this.selectedItem = operation;
            this.selectedType = "operation";
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
    }

    /**
     * Called when the user does something to cause the selection to change.
     * @param event
     */
    public selectNode(event: NodeSelectionEvent): void {
        this.selectedItem = event.node;
        this.selectedType = event.type;
    }

    /**
     * Called when the user selects a definition from the master area.
     * @param def
     */
    public selectDefinition(def: Oas20SchemaDefinition): void {
        this.selectedItem = def;
        this.selectedType = "definition";
    }

    /**
     * Called when the user selects a validation problem from the master
     * area.
     * @param problem
     */
    public selectProblem(problem: OasValidationError): void {
        this.selectedItem = problem;
        this.selectedType = "problem";
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
    public selectResponse(response: Oas20ResponseDefinition): void {
        this.selectedItem = response;
        this.selectedType = "response";
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
        // TODO skip any event that was sent to an input field (e.g. input, textarea, etc)
        if (event.ctrlKey && event.key === 'z' && !event.metaKey && !event.altKey) {
            console.info("[ApiEditorComponent] User wants to 'undo' the last command.");
            this._commands.undoLastCommand(this.document());
            if (this._commands.isEmpty()) {
                this.onDirty.emit(false);
            }
            this.validateSelection();
            this.validateModel();
        }
        if (event.ctrlKey && event.key === 'y' && !event.metaKey && !event.altKey) {
            console.info("[ApiEditorComponent] User wants to 'redo' the last command.");
            this._commands.redoLastCommand(this.document());
            this.onDirty.emit(true);
            this.validateSelection();
            this.validateModel();
        }
        if (event.key === "Escape"  && !event.metaKey && !event.altKey && !event.ctrlKey) {
            this.closeContextMenu();
        }
    }

    /**
     * Called when an editor component creates a command that should be executed.
     * @param command
     */
    public onCommand(command: ICommand): void {
        console.info("[ApiEditorComponent] Executing a command.");
        this._commands.executeCommand(command, this.document());
        this.onDirty.emit(true);

        // After changing the model, we should re-validate it
        this.validateModel();
    }

    /**
     * Called to return the currently selected path (if one is selected).  If not, returns "/".
     */
    public getCurrentPathSelection(): string {
        if (this.selectedType === "path" || this.selectedType === "operation") {
            return (this.selectedItem as Oas20PathItem).path();
        }
        return "/";
    }

    /**
     * Called when the user fills out the Add Path modal dialog and clicks Add.
     */
    public addPath(path: string): void {
        let command: ICommand = new NewPathCommand(path);
        this.onCommand(command);
        this.selectPath(this.document().paths.pathItem(path) as Oas20PathItem);
    }

    /**
     * Returns the currently selected path item.
     * @return {any}
     */
    public selectedPath(): Oas20PathItem {
        if (this.selectedType === "path") {
            return this.selectedItem as Oas20PathItem;
        } else {
            return null;
        }
    }

    /**
     * Returns the currently selected operation.
     */
    public selectedOperation(): Oas20Operation {
        if (this.selectedType === "operation") {
            return this.selectedItem as Oas20Operation;
        } else {
            return null;
        }
    }

    /**
     * Returns the currently selected definition.
     * @return {any}
     */
    public selectedDefinition(): Oas20SchemaDefinition {
        if (this.selectedType === "definition") {
            return this.selectedItem as Oas20SchemaDefinition;
        } else {
            return null;
        }
    }

    /**
     * Returns the currently selected definition.
     * @return {any}
     */
    public selectedProblem(): OasValidationError {
        if (this.selectedType === "problem") {
            return this.selectedItem as OasValidationError;
        } else {
            return null;
        }
    }

    /**
     * Called when the user clicks the "Go To Problem" button for a particular problem.
     */
    public goToProblem(): void {
        // 1. get the node path from the problem
        // 2. resolve to a node
        // 3. use a visitor to reverse-traverse until one of the following is found:
        //   3a. Path Item
        //   3b. Operation
        //   3c. Definition
        //   3d. Response (tbd)

        let problem: OasValidationError = this.selectedItem as OasValidationError;
        let node: OasNode = problem.nodePath.resolve(this.document());
        if (node === null) {
            return;
        }
        let selectionVisitor: SelectedItemVisitor = new SelectedItemVisitor();
        OasVisitorUtil.visitTree(node, selectionVisitor, OasTraverserDirection.up);
        this.selectedItem = selectionVisitor.selectedItem;
        this.selectedType = selectionVisitor.selectedType;
    }

    /**
     * Called to test whether the given resource path has an operation of the given type defined.
     * @param path
     * @param operation
     */
    public hasOperation(pathItem: Oas20PathItem, operation: string): boolean {
        let op: Oas20Operation = pathItem[operation];
        if (op !== null && op !== undefined) {
            return true;
        }
        return false;
    }

    /**
     * Returns true if the given path is the currently selected item *or* is the parent
     * of the currently selected item.
     * @param pathItem
     */
    public isPathSelected(pathItem: Oas20PathItem): boolean {
        return this.selectedItem && (this.selectedItem === pathItem || (this.selectedItem.parent && this.selectedItem.parent() === pathItem));
    }

    /**
     * Returns true if the given path is the current context menu item *or* is the parent
     * of the current context menu item.
     * @param pathItem
     * @return {any|boolean}
     */
    public isPathContexted(pathItem: Oas20PathItem): boolean {
        return this.contextMenuItem && (this.contextMenuItem === pathItem || (this.contextMenuItem.parent && this.contextMenuItem.parent() === pathItem));
    }


    /**
     * Returns true if the given path item has at least one operation.
     * @param pathItem
     * @return {boolean}
     */
    public hasAtLeastOneOperation(pathItem: Oas20PathItem): boolean {
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
        let command: ICommand = new NewDefinitionCommand(modalData.name, modalData.example);
        this.onCommand(command);
        this.selectDefinition(this.document().definitions.definition(modalData.name));
    }

    /**
     * Gets the current API information (content and meta-data) and
     * @return {ApiDefinition}
     */
    public getUpdatedApiDefinition(): ApiDefinition {
        let updatedApiDef: ApiDefinition = ApiDefinition.fromApi(this.api);
        if (this.document().info && this.document().info.title) {
            updatedApiDef.name = this.document().info.title;
        }
        if (this.document().info && this.document().info.description) {
            updatedApiDef.description = this.document().info.description;
        }
        updatedApiDef.spec = this._library.writeNode(this.document());
        updatedApiDef.version = this.api.version;
        updatedApiDef.modifiedOn = new Date();
        // TODO update the modifiedBy here with the currently logged-in user!
        //updatedApiDef.modifiedBy = "";
        return updatedApiDef;
    }

    /**
     * Called to reset the editor's internal state.
     */
    public reset(): void {
        this._document = null;
        this._commands.reset();
        this.onDirty.emit(false);
    }

    /**
     * Called when the user searches in the master area.
     * @param criteria
     */
    public filterAll(criteria: string): void {
        console.info("[ApiEditorComponent] Filtering master items: %s", criteria);
        this.filterCriteria = criteria;
        if (this.filterCriteria !== null) {
            this.filterCriteria = this.filterCriteria.toLowerCase();
        }
    }

    /**
     * Returns true if the given name is accepted by the current filter criteria.
     * @param name
     * @return {boolean}
     */
    private acceptThroughFilter(name: string): boolean {
        if (this.filterCriteria === null) {
            return true;
        }
        return name.toLowerCase().indexOf(this.filterCriteria) != -1;
    }

    /**
     * Called when the user right-clicks on a path.
     * @param event
     * @param pathItem
     */
    public showPathContextMenu(event: MouseEvent, pathItem: Oas20PathItem): void {
        event.preventDefault();
        event.stopPropagation();
        this.contextMenuPos.left = event.clientX + "px";
        this.contextMenuPos.top = event.clientY + "px";
        this.contextMenuType = "path";
        this.contextMenuItem = pathItem;
    }

    /**
     * Called when the user right-clicks on an operation.
     * @param event
     * @param pathName
     */
    public showOperationContextMenu(event: MouseEvent, operation: Oas20Operation): void {
        event.preventDefault();
        event.stopPropagation();
        this.contextMenuPos.left = event.clientX + "px";
        this.contextMenuPos.top = event.clientY + "px";
        this.contextMenuType = "operation";
        this.contextMenuItem = operation;
        this.document().paths
    }

    @HostListener("document:click", ["$event"])
    public onDocumentClick(event: MouseEvent): void {
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
        this.addPathDialog.open((this.contextMenuItem as Oas20PathItem).path());
        this.closeContextMenu();
    }

    /**
     * Called when the user clicks "Delete Path" in the context-menu for a path.
     */
    public deletePath(): void {
        let command: ICommand = new DeletePathCommand((this.contextMenuItem as Oas20PathItem).path());
        this.onCommand(command);
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
            this.clonePathDialog.open(this.contextMenuItem as Oas20PathItem);
        } else {
            let pathItem: Oas20PathItem = modalData.object;
            console.info("[ApiEditorComponent] Clone path item: %s", modalData.path);
            let cloneSrcObj: any = this._library.writeNode(pathItem);
            let command: ICommand = new AddPathItemCommand(modalData.path, cloneSrcObj);
            this.onCommand(command);
        }
    }

    /**
     * Called when the user clicks "Delete Operation" in the context-menu for a operation.
     */
    public deleteOperation(): void {
        let operation: Oas20Operation = this.contextMenuItem as Oas20Operation;
        let command: ICommand = new DeleteNodeCommand(operation.method(), operation.parent());
        this.onCommand(command);
        if (this.contextMenuItem === this.selectedItem) {
            this.selectPath((this.selectedItem as Oas20Operation).parent() as Oas20PathItem);
        }
        this.closeContextMenu();
    }

    /**
     * Called when the user right-clicks on a path.
     * @param event
     * @param definition
     */
    public showDefinitionContextMenu(event: MouseEvent, definition: Oas20SchemaDefinition): void {
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
        let command: ICommand = new DeleteDefinitionSchemaCommand((this.contextMenuItem as Oas20SchemaDefinition).definitionName());
        this.onCommand(command);
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
            this.cloneDefinitionDialog.open(this.contextMenuItem as Oas20SchemaDefinition);
        } else {
            let definition: Oas20SchemaDefinition = modalData.definition;
            console.info("[ApiEditorComponent] Clone definition: %s", modalData.name);
            let cloneSrcObj: any = this._library.writeNode(definition);
            let command: ICommand = new AddDefinitionCommand(modalData.name, cloneSrcObj);
            this.onCommand(command);
        }
    }

    /**
     * Called to validate the model.
     */
    public validateModel(): void {
        let doc: Oas20Document = this.document();
        let resetVisitor: ResetProblemsVisitor = new ResetProblemsVisitor();
        OasVisitorUtil.visitTree(doc, resetVisitor);
        this.validationErrors = this._library.validate(doc, true);
    }

    /**
     * Called to toggle the visibility of the validation panel (the section that
     * displays validation errors).
     */
    public toggleValidationPanel(): void {
        this.validationPanelOpen = !this.validationPanelOpen;
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

}

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

class ResetProblemsVisitor extends AllNodeVisitor {

    protected doVisitNode(node: OasNode): void {
        node.n_attribute("validation-errors", null);
    }

}

class SelectedItemVisitor extends Oas20NodeVisitorAdapter {
    public selectedItem: any = null;
    public selectedType: string = null;

    visitPathItem(node: Oas20PathItem): void {
        if (this.selectedType === null) {
            this.selectedItem = node;
            this.selectedType = "path";
        }
    }

    visitOperation(node: Oas20Operation): void {
        this.selectedType = "operation";
        this.selectedItem = node;
    }

    visitResponseDefinition(node: Oas20ResponseDefinition): void {
        this.selectedType = "response";
        this.selectedItem = node;
    }

    visitDefinitionSchema(node: Oas20SchemaDefinition): void {
        this.selectedType = "definition";
        this.selectedItem = node;
    }

}