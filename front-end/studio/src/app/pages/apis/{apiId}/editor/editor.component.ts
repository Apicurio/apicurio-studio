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
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {ApiDefinition} from "../../../../models/api.model";
import {
    Oas20ResponseDefinition,
    Oas20SchemaDefinition,
    Oas30ResponseDefinition,
    Oas30SchemaDefinition,
    OasDocument,
    OasLibraryUtils,
    OasNode,
    OasOperation,
    OasPathItem,
    OasTraverserDirection,
    OasValidationError,
    OasVisitorUtil
} from "oai-ts-core";
import {EditorMasterComponent} from "./_components/master.component";
import {AbstractCombinedVisitorAdapter, AllNodeVisitor} from "./_visitors/base.visitor";
import {NodeSelectionEvent} from "./_events/node-selection.event";
import {ICommand, OtCommand, OtEngine} from "oai-ts-commands";
import {ApiDesignCommandAck} from "../../../../models/ack.model";
import {ApiEditorUser} from "../../../../models/editor-user.model";


@Component({
    moduleId: module.id,
    selector: "api-editor",
    templateUrl: "editor.component.html",
    styleUrls: ["editor.component.css", "editor.component.light.css", "editor.component.dark.css"],
    encapsulation: ViewEncapsulation.None
})
export class ApiEditorComponent implements OnChanges {

    @Input() api: ApiDefinition;
    @Output() onCommandExecuted: EventEmitter<OtCommand> = new EventEmitter<OtCommand>();
    @Output() onSelectionChanged: EventEmitter<string> = new EventEmitter<string>();

    private _library: OasLibraryUtils = new OasLibraryUtils();
    private _document: OasDocument = null;
    private _otEngine: OtEngine = null;

    theme: string = "light";

    private currentSelection: NodeSelectionEvent;
    public validationErrors: OasValidationError[] = [];

    @ViewChild("master") master: EditorMasterComponent;

    formType: string;

    /**
     * Constructor.
     */
    constructor() {}

    /**
     * Called when the @Input changes.
     * @param {SimpleChanges} changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        this._document = null;
        if (this.document().getSpecVersion() === "2.0") {
            this.formType = "main_20";
        } else {
            this.formType = "main_30";
        }
        console.info("****** just set the form type to: %s", this.formType);
    }

    /**
     * Gets the OpenAPI spec as a document.
     */
    public document(): OasDocument {
        if (this._document === null) {
            this._document = this._library.createDocument(this.api.spec);
            this.validateModel();
        }
        return this._document;
    }

    /**
     * Lazy getter for the OtEngine.
     * @return {OtEngine}
     */
    public otEngine(): OtEngine {
        if (this._otEngine === null) {
            this._otEngine = new OtEngine(this.document());
        }
        return this._otEngine;
    }

    /**
     * Called whenever the user presses a key.
     * @param event
     */
    public onGlobalKeyDown(event: KeyboardEvent): void {
        // TODO skip any event that was sent to an input field (e.g. input, textarea, etc)
        if (event.ctrlKey && event.key === 'z' && !event.metaKey && !event.altKey) {
            console.info("[ApiEditorComponent] User wants to 'undo' the last command (not implemented).");
            // this._commands.undoLastCommand(this.document());
            // this.master.validateSelection();
            // this.validateModel();
        }
        if (event.ctrlKey && event.key === 'y' && !event.metaKey && !event.altKey) {
            console.info("[ApiEditorComponent] User wants to 'redo' the last command (not implemented).");
            // this._commands.redoLastCommand(this.document());
            // this.master.validateSelection();
            // this.validateModel();
        }
    }

    /**
     * Called when an editor component creates a command that should be executed.
     * @param command
     */
    public onCommand(command: ICommand): void {
        let otCmd: OtCommand = new OtCommand();
        otCmd.command = command;
        otCmd.contentVersion = Date.now();
        this.otEngine().executeCommand(otCmd, true);
        this.onCommandExecuted.emit(otCmd);

        // After changing the model, we should re-validate it
        this.validateModel();
        // And also validate the current selection
        this.master.validateSelection();
    }

    /**
     * Executes a command.  Called by the parent of this component when detecting that
     * another user has executed a command.  In other words, this command is *not*
     * performed by the local user.
     * @param {ICommand} command
     */
    public executeCommand(command: OtCommand): void {
        console.info("[ApiEditorComponent] Executing a command.");
        this.otEngine().executeCommand(command);

        // After changing the model, we should re-validate it
        this.validateModel();
        // And also validate the current selection
        this.master.validateSelection();
    }

    /**
     * Finalizes a command.
     * @param {ApiDesignCommandAck} ack
     */
    public finalizeCommand(ack: ApiDesignCommandAck): void {
        this.otEngine().finalizeCommand(ack.commandId, ack.contentVersion);
    }

    /**
     * Called to update the selection state of the given remote API editor (i.e. an active collaborator).
     * @param {ApiEditorUser} user
     * @param {string} selection
     */
    public updateCollaboratorSelection(user: ApiEditorUser, selection: string): void {
        this.master.updateCollaboratorSelection(user, selection);
    }

    /**
     * Called when the user selects a node in some way.
     * @param {NodeSelectionEvent} event
     */
    public onNodeSelected(event: NodeSelectionEvent): void {
        console.info("[ApiEditorComponent] Selection changed.  %s node selected", event.type);
        this.currentSelection = event;

        this.formType = this.currentSelection.type + "_";
        if (this.document().getSpecVersion() === "2.0") {
            this.formType += "20";
        } else {
            this.formType += "30";
        }
        console.info("[ApiEditorComponent] Showing form: %s", this.formType);

        let selection: string = "";
        if (event.type != "problem" && event.node != null) {
            selection = this._library.createNodePath(event.node as OasNode).toString();
        }
        console.info("[ApiEditorComponent] Firing selection changed event: %s", selection);
        this.onSelectionChanged.emit(selection);
    }

    /**
     * Called to validate the model.
     */
    public validateModel(): void {
        let doc: OasDocument = this.document();
        let resetVisitor: ResetProblemsVisitor = new ResetProblemsVisitor();
        OasVisitorUtil.visitTree(doc, resetVisitor);

        if (doc.is2xDocument()) {
            this.validationErrors = this._library.validate(doc, true);
        } else if (doc.is3xDocument()) {
            // TODO also validate 3.0.x documents once the oai-ts-core library supports that
        }
    }

    /**
     * Returns the currently selected path item.
     * @return {OasPathItem}
     */
    public selectedPath(): OasPathItem {
        if (this.currentSelection.type === "path") {
            return this.currentSelection.node as OasPathItem;
        } else {
            return null;
        }
    }

    /**
     * Returns the currently selected operation.
     */
    public selectedOperation(): OasOperation {
        if (this.currentSelection.type === "operation") {
            return this.currentSelection.node as OasOperation;
        } else {
            return null;
        }
    }

    /**
     * Returns the currently selected definition.
     * @return {Oas20SchemaDefinition}
     */
    public selectedDefinition(): Oas20SchemaDefinition | Oas30SchemaDefinition {
        if (this.currentSelection.type === "definition") {
            return this.currentSelection.node as Oas20SchemaDefinition;
        } else {
            return null;
        }
    }

    /**
     * Returns the currently selected definition.
     * @return {OasValidationError}
     */
    public selectedProblem(): OasValidationError {
        if (this.currentSelection.type === "problem") {
            return this.currentSelection.node as OasValidationError;
        } else {
            return null;
        }
    }

    /**
     * Called when the user does something to cause the selection to change.
     * @param event
     */
    public selectNode(event: NodeSelectionEvent): void {
        this.master.selectNode(event);
    }

    /**
     * Deselects the currently selected definition.
     */
    public deselectDefinition(): void {
        console.info("[ApiEditorComponent] Deselecting the current definition (selecting main).");
        this.master.selectMain();
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

        let problem: OasValidationError = this.currentSelection.node as OasValidationError;
        let node: OasNode = problem.nodePath.resolve(this.document());
        if (node === null) {
            return;
        }
        let selectionVisitor: SelectedItemVisitor = new SelectedItemVisitor();
        OasVisitorUtil.visitTree(node, selectionVisitor, OasTraverserDirection.up);

        let event: NodeSelectionEvent = new NodeSelectionEvent(selectionVisitor.selectedItem, selectionVisitor.selectedType);
        this.master.selectNode(event);
    }

}


/**
 * Visitor used to clear out all the validation errors found in all nodes
 * in the model.
 */
class ResetProblemsVisitor extends AllNodeVisitor {

    protected doVisitNode(node: OasNode): void {
        node.n_attribute("validation-errors", null);
    }

}


/**
 * Visitor used to determine what type of thing is selected.  Visits the node OAS
 * and sets the selectedItem and selectedType.
 */
class SelectedItemVisitor extends AbstractCombinedVisitorAdapter {
    public selectedItem: any = null;
    public selectedType: string = null;

    visitPathItem(node: OasPathItem): void {
        if (this.selectedType === null) {
            this.selectedItem = node;
            this.selectedType = "path";
        }
    }

    visitOperation(node: OasOperation): void {
        this.selectedType = "operation";
        this.selectedItem = node;
    }

    visitResponseDefinition(node: Oas20ResponseDefinition|Oas30ResponseDefinition): void {
        this.selectedType = "response";
        this.selectedItem = node;
    }

    visitDefinitionSchema(node: Oas20SchemaDefinition|Oas30SchemaDefinition): void {
        this.selectedType = "definition";
        this.selectedItem = node;
    }
}

