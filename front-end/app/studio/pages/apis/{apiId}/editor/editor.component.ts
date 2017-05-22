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
    Oas20DefinitionSchema,
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
import {DeleteDefinitionSchemaCommand, DeletePathCommand} from "./_commands/delete.command";
import {AllNodeVisitor, ModelUtils} from "./_util/model.util";
import {ObjectUtils} from "./_util/object.util";


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
    subselectedItem: string = null;

    contextMenuItem: string = null;
    contextMenuType: string = null;
    contextMenuPos: any = {
        left: "0px",
        top: "0px"
    };

    @ViewChild("addPathDialog") addPathDialog: AddPathDialogComponent;

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
     * Returns an array of path names.
     * @return {any}
     */
    public pathNames(): string[] {
        if (this.document().paths) {
            return this.document().paths.pathItemNames().filter( name => {
                if (this.acceptThroughFilter(name)) {
                    return name;
                } else {
                    return null;
                }
            }).sort();
        } else {
            return [];
        }
    }

    /**
     * Returns an array of paths that match the filter criteria and are sorted alphabetically.
     * @return {any}
     */
    public paths(): Oas20PathItem[] {
        if (this.document().paths) {
            return this.document().paths.pathItems().filter( pathItem => {
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
     * Returns an array of definition names.
     * @return {any}
     */
    public definitionNames(): string[] {
        if (this.document().definitions) {
            return this.document().definitions.definitionNames().filter( name => {
                if (this.acceptThroughFilter(name)) {
                    return name;
                } else {
                    return null;
                }
            }).sort();
        } else {
            return [];
        }
    }

    /**
     * Returns an array of response names.
     * @return {any}
     */
    public responseNames(): string[] {
        if (this.document().responses) {
            return this.document().responses.responseNames().filter( name => {
                if (this.acceptThroughFilter(name)) {
                    return name;
                } else {
                    return null;
                }
            }).sort();
        } else {
            return [];
        }
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
        this.selectedItem = path.path();
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
     * @param pathName
     * @param opName
     */
    public selectOperation(path: Oas20PathItem, opName: string): void {
        console.info("Selected operation: %s :: %s", path.path(), opName);
        // Possible de-select the operation if it's clicked on but already selected.
        if (this.selectedType === "operation" && this.selectedItem === path.path() && this.subselectedItem === opName) {
            this.selectPath(path);
        } else {
            this.selectedType = "operation";
            this.selectedItem = path.path();
            this.subselectedItem = opName;
        }
    }

    /**
     * Called to deselect the currently selected operation.
     */
    public deselectOperation(): void {
        if (this.selectedType !== "operation") {
            return;
        }
        this.selectedType = "path";
        this.subselectedItem = null;
    }

    /**
     * Called when the user selects a definition from the master area.
     * @param name
     */
    public selectDefinition(name: string): void {
        this.selectedItem = name;
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
     * @param name
     */
    public selectResponse(name: string): void {
        this.selectedItem = name;
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
            this.validateModel();
        }
        if (event.ctrlKey && event.key === 'y' && !event.metaKey && !event.altKey) {
            console.info("[ApiEditorComponent] User wants to 'redo' the last command.");
            this._commands.redoLastCommand(this.document());
            this.onDirty.emit(true);
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
            return this.selectedItem;
        }
        return "/";
    }

    /**
     * Called when the user fills out the Add Path modal dialog and clicks Add.
     */
    public addPath(path: string): void {
        let command: ICommand = new NewPathCommand(path);
        this.onCommand(command);
        this.selectPath(this.document().paths.pathItem(path));
    }

    /**
     * Returns the currently selected path item.
     * @return {any}
     */
    public selectedPath(): Oas20PathItem {
        if (this.selectedType === "path") {
            return this.document().paths.pathItem(this.selectedItem);
        } else {
            return null;
        }
    }

    /**
     * Returns the currently selected operation.
     */
    public selectedOperation(): Oas20Operation {
        if (this.selectedType === "operation") {
            return this.document().paths.pathItem(this.selectedItem)[this.subselectedItem];
        } else {
            return null;
        }
    }

    /**
     * Returns the currently selected definition.
     * @return {any}
     */
    public selectedDefinition(): Oas20DefinitionSchema {
        if (this.selectedType === "definition") {
            return this.document().definitions.definition(this.selectedItem);
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
            return <OasValidationError>this.selectedItem;
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
        this.subselectedItem = selectionVisitor.subselectedItem;
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
        this.selectDefinition(modalData.name);
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
     * @param pathName
     */
    public showPathContextMenu(event: MouseEvent, pathName: string): void {
        event.preventDefault();
        event.stopPropagation();
        this.contextMenuPos.left = event.clientX + "px";
        this.contextMenuPos.top = event.clientY + "px";
        this.contextMenuType = "path";
        this.contextMenuItem = pathName;
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
        this.addPathDialog.open(this.contextMenuItem);
        this.closeContextMenu();
    }

    /**
     * Called when the user clicks "Delete Path" in the context-menu for a path.
     */
    public deletePath(): void {
        let command: ICommand = new DeletePathCommand(this.contextMenuItem);
        this.onCommand(command);
        if (this.contextMenuItem === this.selectedItem) {
            this.selectMain();
        }
        this.closeContextMenu();
    }

    /**
     * Called when the user right-clicks on a path.
     * @param event
     * @param pathName
     */
    public showDefinitionContextMenu(event: MouseEvent, definitionName: string): void {
        event.preventDefault();
        event.stopPropagation();
        this.contextMenuPos.left = event.clientX + "px";
        this.contextMenuPos.top = event.clientY + "px";
        this.contextMenuType = "definition";
        this.contextMenuItem = definitionName;
    }

    /**
     * Called when the user clicks the "Delete Definition" item in the context-menu for a definition.
     */
    public deleteDefinition(): void {
        let command: ICommand = new DeleteDefinitionSchemaCommand(this.contextMenuItem);
        this.onCommand(command);
        if (this.contextMenuItem === this.selectedItem) {
            this.selectMain();
        }
        this.closeContextMenu();
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
    public subselectedItem: string = null;

    visitPathItem(node: Oas20PathItem): void {
        this.selectedItem = node.path();
        if (this.selectedType === null) {
            this.selectedType = "path";
        }
    }

    visitOperation(node: Oas20Operation): void {
        this.selectedType = "operation";
        this.subselectedItem = node.method();
    }

    visitResponseDefinition(node: Oas20ResponseDefinition): void {
        this.selectedType = "response";
        this.selectedItem = node.name();
    }

    visitDefinitionSchema(node: Oas20DefinitionSchema): void {
        this.selectedType = "definition";
        this.selectedItem = node.definitionName();
    }

}