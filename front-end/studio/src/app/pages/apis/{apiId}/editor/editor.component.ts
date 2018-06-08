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
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {ApiDefinition} from "../../../../models/api.model";
import {
    Oas20SchemaDefinition,
    Oas30SchemaDefinition,
    OasCombinedVisitorAdapter,
    OasDocument,
    OasLibraryUtils,
    OasNode,
    OasNodePath,
    OasOperation,
    OasPathItem,
    OasValidationProblem,
    OasVisitorUtil
} from "oai-ts-core";
import {EditorMasterComponent} from "./_components/master.component";
import {ICommand, OtCommand, OtEngine} from "oai-ts-commands";
import {ApiDesignCommandAck} from "../../../../models/ack.model";
import {ApiEditorUser} from "../../../../models/editor-user.model";
import {SelectionService} from "./_services/selection.service";
import {Subscription} from "rxjs/Subscription";


@Component({
    moduleId: module.id,
    selector: "api-editor",
    templateUrl: "editor.component.html",
    styleUrls: ["editor.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class ApiEditorComponent implements OnChanges, OnInit, OnDestroy {

    @Input() api: ApiDefinition;
    @Output() onCommandExecuted: EventEmitter<OtCommand> = new EventEmitter<OtCommand>();
    @Output() onSelectionChanged: EventEmitter<string> = new EventEmitter<string>();

    private _library: OasLibraryUtils = new OasLibraryUtils();
    private _document: OasDocument = null;
    private _otEngine: OtEngine = null;

    theme: string = "light";

    private currentSelection: OasNodePath;
    private currentSelectionType: string;
    private currentSelectionNode: OasNode;
    public validationErrors: OasValidationProblem[] = [];

    private _selectionSubscription: Subscription;

    @ViewChild("master") master: EditorMasterComponent;

    formType: string;

    /**
     * Constructor.
     */
    constructor(private selectionService: SelectionService) {}

    public ngOnInit(): void {
        let me: ApiEditorComponent = this;
        this._selectionSubscription = this.selectionService.selection().subscribe( selectedPath => {
            me.onNodeSelected(selectedPath);
        });
    }

    public ngOnDestroy(): void {
        this._selectionSubscription.unsubscribe();
    }

    /**
     * Called when the @Input changes.
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        this._document = null;
        if (this.document().getSpecVersion() === "2.0") {
            this.formType = "main_20";
        } else {
            this.formType = "main_30";
        }
    }

    /**
     * Gets the OpenAPI spec as a document.
     */
    public document(): OasDocument {
        if (this._document === null) {
            try {
                this._document = this._library.createDocument(this.api.spec);
            } catch (e) {
                // If we can't process the document, then just create a new one
                this._document = this._library.createDocument("3.0.1");
            }
            this.validateModel();
        }
        return this._document;
    }

    /**
     * Lazy getter for the OtEngine.
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

        // After changing the model, we need to ensure all selections are still valid
        this.selectionService.select(this.selectionService.currentSelection(), this.document());

        // After changing the model, we should re-validate it
        this.validateModel();
    }

    /**
     * Executes a command.  Called by the parent of this component when detecting that
     * another user has executed a command.  In other words, this command is *not*
     * performed by the local user.
     * @param command
     */
    public executeCommand(command: OtCommand): void {
        console.info("[ApiEditorComponent] Executing a command.");
        this.otEngine().executeCommand(command);

        // After changing the model, we need to ensure all selections are still valid
        this.selectionService.select(this.selectionService.currentSelection(), this.document());

        // After changing the model, we should re-validate it
        this.validateModel();
    }

    /**
     * Finalizes a command.
     * @param ack
     */
    public finalizeCommand(ack: ApiDesignCommandAck): void {
        this.otEngine().finalizeCommand(ack.commandId, ack.contentVersion);
    }

    /**
     * Called to update the selection state of the given remote API editor (i.e. an active collaborator).
     * @param user
     * @param selection
     */
    public updateCollaboratorSelection(user: ApiEditorUser, selection: string): void {
        this.selectionService.setCollaboratorSelection(user, selection, this.document());
    }

    /**
     * Called when the user selects a node in some way.
     * @param path
     */
    public onNodeSelected(path: OasNodePath): void {
        console.info("[ApiEditorComponent] Selection changed to path: %s", path.toString());

        let visitor: FormSelectionVisitor = new FormSelectionVisitor(this.document().getSpecVersion() === "2.0" ? "20" : "30");
        OasVisitorUtil.visitPath(path, visitor, this.document());

        this.currentSelection = path;
        this.formType = visitor.formType();
        this.currentSelectionNode = visitor.selection();
        this.currentSelectionType = visitor.selectionType();

        this.onSelectionChanged.emit(path.toString());
    }

    /**
     * Called to validate the model.
     */
    public validateModel(): void {
        let doc: OasDocument = this.document();
        this.validationErrors = this._library.validate(doc, true);
    }

    /**
     * Returns the currently selected path item.
     * @return
     */
    public selectedPath(): OasPathItem {
        if (this.currentSelectionType === "path") {
            return this.currentSelectionNode as OasPathItem;
        } else {
            return null;
        }
    }

    /**
     * Returns the currently selected operation.
     */
    public selectedOperation(): OasOperation {
        if (this.currentSelectionType === "operation") {
            return this.currentSelectionNode as OasOperation;
        } else {
            return null;
        }
    }

    /**
     * Returns the currently selected definition.
     * @return
     */
    public selectedDefinition(): Oas20SchemaDefinition | Oas30SchemaDefinition {
        if (this.currentSelectionType === "definition") {
            return this.currentSelectionNode as Oas20SchemaDefinition;
        } else {
            return null;
        }
    }

    /**
     * Returns the currently selected definition.
     * @return
     */
    public selectedProblem(): OasValidationProblem {
        if (this.currentSelectionType === "problem") {
            return this.currentSelectionNode as OasValidationProblem;
        } else {
            return null;
        }
    }

    public deselectPath(): void {
        this.master.deselectPath();
    }

    public deselectOperation(): void {
        this.master.deselectOperation();
    }

    public deselectDefinition(): void {
        this.master.deselectDefinition();
    }

    /**
     * Called to get the current value in the editor.
     * @return {ApiDefinition}
     */
    public getValue(): ApiDefinition {
        let apiDef: ApiDefinition = new ApiDefinition();
        apiDef.id = this.api.id;
        apiDef.createdBy = this.api.createdBy;
        apiDef.createdOn = this.api.createdOn;
        apiDef.description = this.api.description;
        apiDef.name = this.api.name;
        apiDef.tags = this.api.tags;
        let doc: OasDocument = this.document();
        apiDef.spec = this._library.writeNode(doc);
        return apiDef;
    }

}


/**
 * Visitor used to determine what form should be displayed based on the selected node.
 */
export class FormSelectionVisitor extends OasCombinedVisitorAdapter {

    public _selectionType: string = "main";
    public _selectedNode: OasNode = null;

    constructor(private version: string) {
        super();
    }

    public selectionType(): string {
        return this._selectionType;
    }

    public formType(): string {
        return this._selectionType + "_" + this.version;
    }

    public selection(): OasNode {
        return this._selectedNode;
    }

    public visitPathItem(node: OasPathItem): void {
        this._selectedNode = node;
        this._selectionType = "path";
    }

    public visitOperation(node: OasOperation): void {
        this._selectedNode = node;
        this._selectionType = "operation";
    }

    public visitSchemaDefinition(node: Oas30SchemaDefinition | Oas30SchemaDefinition): void {
        this._selectedNode = node;
        this._selectionType = "definition";
    }

    public visitValidationProblem(node: OasValidationProblem): void {
        this._selectedNode = node;
        this._selectionType = "problem";
    }
}
