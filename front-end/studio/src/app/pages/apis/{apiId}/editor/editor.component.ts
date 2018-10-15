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
import {CommandService} from "./_services/command.service";
import {DocumentService} from "./_services/document.service";
import {ServerEditorComponent} from "./_components/editors/server-editor.component";
import {EditorsService, IEditorsProvider} from "./_services/editors.service";
import {ArrayUtils} from "./_util/object.util";
import {SecuritySchemeEditorComponent} from "./_components/editors/security-scheme-editor.component";
import {SecurityRequirementEditorComponent} from "./_components/editors/security-requirement-editor.component";
import {DataTypeEditorComponent} from "./_components/editors/data-type-editor.component";


@Component({
    moduleId: module.id,
    selector: "api-editor",
    templateUrl: "editor.component.html",
    styleUrls: ["editor.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class ApiEditorComponent implements OnChanges, OnInit, OnDestroy, IEditorsProvider {

    @Input() api: ApiDefinition;
    @Input() embedded: boolean;
    @Output() onCommandExecuted: EventEmitter<OtCommand> = new EventEmitter<OtCommand>();
    @Output() onSelectionChanged: EventEmitter<string> = new EventEmitter<string>();
    @Output() onValidationChanged: EventEmitter<OasValidationProblem[]> = new EventEmitter<OasValidationProblem[]>();
    @Output() onUndo: EventEmitter<OtCommand> = new EventEmitter<OtCommand>();
    @Output() onRedo: EventEmitter<OtCommand> = new EventEmitter<OtCommand>();

    private _library: OasLibraryUtils = new OasLibraryUtils();
    private _document: OasDocument = null;
    private _otEngine: OtEngine = null;
    _undoableCommandCount: number = 0;
    _redoableCommandCount: number = 0;

    theme: string = "light";

    private currentSelection: OasNodePath;
    private currentSelectionType: string;
    private currentSelectionNode: OasNode;
    public validationErrors: OasValidationProblem[] = [];

    private _selectionSubscription: Subscription;
    private _commandSubscription: Subscription;

    @ViewChild("master") master: EditorMasterComponent;
    @ViewChild("serverEditor") serverEditor: ServerEditorComponent;
    @ViewChild("securitySchemeEditor") securitySchemeEditor: SecuritySchemeEditorComponent;
    @ViewChild("securityRequirementEditor") securityRequirementEditor: SecurityRequirementEditorComponent;
    @ViewChild("dataTypeEditor") dataTypeEditor: DataTypeEditorComponent;

    formType: string;

    /**
     * Constructor.
     * @param selectionService
     * @param commandService
     * @param documentService
     */
    constructor(private selectionService: SelectionService, private commandService: CommandService,
                private documentService: DocumentService, private editorsService: EditorsService) {}

    public ngOnInit(): void {
        this.selectionService.reset();
        this.commandService.reset();
        this.documentService.reset();
        this.editorsService.setProvider(this);

        let me: ApiEditorComponent = this;
        this._selectionSubscription = this.selectionService.selection().subscribe( selectedPath => {
            if (selectedPath) {
                console.info("[ApiEditorComponent] Node selection detected (from the selection service)")
                me.onNodeSelected(selectedPath);
            }
        });
        this._commandSubscription = this.commandService.commands().subscribe( command => {
            if (command) {
                console.info("[ApiEditorComponent] Command execution detected (from the command service)")
                me.onCommand(command);
            }
        });

        // If we're in embedded mode, select the root now.
        if (this.embedded && this.api) {
            this.selectionService.selectRoot(this.document());
        }
    }

    public ngOnDestroy(): void {
        this._selectionSubscription.unsubscribe();
        this._commandSubscription.unsubscribe();
    }

    /**
     * Called when the @Input changes.
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        this._document = null;
        this._otEngine = null;
        this._undoableCommandCount = 0;
        this._redoableCommandCount = 0;
        if (this.document().getSpecVersion() === "2.0") {
            this.formType = "main_20";
        } else {
            this.formType = "main_30";
        }

        // Fire an event in the doc service indicating that there is a new document.
        this.documentService.emitDocument(this.document());
    }

    /**
     * Gets the OpenAPI spec as a document.
     */
    public document(): OasDocument {
        if (this._document === null && this.api) {
            try {
                this._document = this._library.createDocument(this.api.spec);
                console.info("[ApiEditorComponent] Loaded OAI content: ", this._document);
            } catch (e) {
                console.error(e);
                // If we can't process the document, then just create a new one
                this._document = this._library.createDocument("3.0.2");
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
            this._undoableCommandCount = 0;
            this._redoableCommandCount = 0;
        }
        return this._otEngine;
    }

    /**
     * Called whenever the user presses a key.
     * @param event
     */
    public onGlobalKeyDown(event: KeyboardEvent): void {
        // TODO skip any event that was sent to an input field (e.g. input, textarea, etc)
        if (ApiEditorComponent.isUndo(event)) {
            this.undoLastCommand();
        }
        if (ApiEditorComponent.isRedo(event)) {
            this.redoLastCommand();
        }
    }

    private static isUndo(event: KeyboardEvent): boolean {
        return (event.ctrlKey && event.key === 'z' && !event.metaKey && !event.altKey) ||
            (event.metaKey && event.key === 'z' && !event.ctrlKey && !event.altKey);  // macOS: cmd + z
    }

    private static isRedo(event: KeyboardEvent): boolean {
        return (event.ctrlKey && event.key === 'y' && !event.metaKey && !event.altKey) ||
            (event.metaKey && event.shiftKey && event.key === 'z' && !event.ctrlKey && !event.altKey); // macOS: cmd + shift + z
    }

    /**
     * Called when the user clicks the Undo button or uses the Ctrl-z hotkey.
     */
    public undoLastCommand(): void {
        if (this._undoableCommandCount === 0) {
            return;
        }
        console.info("[ApiEditorComponent] User wants to 'undo' the last command.");
        this.preDocumentChange();
        let cmd: OtCommand = this.otEngine().undoLastLocalCommand();
        // TODO if the command is "pending" we need to hold on to the "undo" event until we get the ACK for the command - then we can send the "undo" with the updated contentVersion
        if (cmd !== null) {
            this.postDocumentChange();

            this.onUndo.emit(cmd);
            this._undoableCommandCount--;
            this._redoableCommandCount++;
        }
    }

    /**
     * Called when the user clicks the Redo button or uses the Ctrl-y hotkey.
     */
    public redoLastCommand(): void {
        if (this._redoableCommandCount === 0) {
            return;
        }
        console.info("[ApiEditorComponent] User wants to 'redo' the last command.");
        this.preDocumentChange();
        let cmd: OtCommand = this.otEngine().redoLastLocalCommand();
        // TODO if the command is "pending" we need to hold on to the "undo" event until we get the ACK for the command - then we can send the "undo" with the updated contentVersion
        if (cmd !== null) {
            this.postDocumentChange();

            this.onRedo.emit(cmd);
            this._undoableCommandCount++;
            this._redoableCommandCount--;
        }
    }

    /**
     * Called when an editor component creates a command that should be executed.
     * @param command
     */
    protected onCommand(command: ICommand): void {
        let otCmd: OtCommand = new OtCommand();
        otCmd.command = command;
        otCmd.contentVersion = Date.now();

        this.preDocumentChange();
        this.otEngine().executeCommand(otCmd, true);

        this.onCommandExecuted.emit(otCmd);
        this.postDocumentChange();

        // If we're in embedded mode, immediately finalize the command (no collaboration server is present)
        if (this.embedded) {
            this.finalizeCommand({
                commandId: otCmd.contentVersion,
                contentVersion: otCmd.contentVersion
            });
        }

        this._undoableCommandCount++;
        this._redoableCommandCount = 0;
    }

    /**
     * Executes a command.  Called by the parent of this component when detecting that
     * another user has executed a command.  In other words, this command is *not*
     * performed by the local user.
     * @param command
     */
    public executeCommand(command: OtCommand): void {
        this.preDocumentChange();
        this.otEngine().executeCommand(command);
        this.postDocumentChange();
    }

    /**
     * Call this to undo a command.  Typically this is used to undo commands from
     * remote collaborators after receiving an async message from the server.
     * @param command
     */
    public undoCommand(command: OtCommand | number | string): void {
        if (command) {
            this.preDocumentChange();
            if (typeof command === "number") {
                this.otEngine().undo(command as number);
            } else if (typeof command === "string") {
                this.otEngine().undo(Number(command as string));
            } else {
                this.otEngine().undo(command.contentVersion);
            }
            this.postDocumentChange();
        }
    }

    /**
     * Call this to redo a command.  Typically this is used to undo commands from
     * remote collaborators after receiving an async message from the server.
     * @param command
     */
    public redoCommand(command: OtCommand | number): void {
        if (command) {
            this.preDocumentChange();
            if (typeof command === "number") {
                this.otEngine().redo(command as number);
            } else if (typeof command === "string") {
                this.otEngine().redo(Number(command as string));
            } else {
                this.otEngine().redo(command.contentVersion);
            }
            this.postDocumentChange();
        }
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

        this.updateFormDisplay(path);

        this.onSelectionChanged.emit(path.toString());
    }

    public updateFormDisplay(path: OasNodePath): void {
        let visitor: FormSelectionVisitor = new FormSelectionVisitor(this.document().is2xDocument() ? "20" : "30");
        OasVisitorUtil.visitPath(path, visitor, this.document());

        this.currentSelection = path;
        this.formType = visitor.formType();
        this.currentSelectionNode = visitor.selection();
        this.currentSelectionType = visitor.selectionType();
    }

    /**
     * Called to validate the model.
     */
    public validateModel(): void {
        let doc: OasDocument = this.document();
        let oldValidationErrors: OasValidationProblem[] = this.validationErrors;
        this.validationErrors = this._library.validate(doc, true);
        if (!ArrayUtils.equals(oldValidationErrors, this.validationErrors)) {
            this.onValidationChanged.emit(this.validationErrors);
        }
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

    public deselectPath(): void {
        this.master.deselectPath();
    }

    public deselectOperation(): void {
        this.master.deselectOperation();
    }

    public deselectDefinition(): void {
        this.master.deselectDefinition();
    }

    public preDocumentChange(): void {
        // Before changing the document, let's clear/reset the current selection
        this.selectionService.clearAllSelections(this.document());
    }

    public postDocumentChange(): void {
        // After changing the model, we need to ensure all selections are still valid
        this.selectionService.reselectAll(this.document());

        // After changing the model, we should re-validate it
        this.validateModel();

        // Update the form being displayed (this might change if the thing currently selected was deleted)
        this.updateFormDisplay(this.selectionService.currentSelection());

        // Fire a change event in the document service
        this.documentService.emitChange();
    }

    /**
     * Called to get the current value in the editor.
     * @return
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

    public getServerEditor(): ServerEditorComponent {
        return this.serverEditor;
    }

    public getSecuritySchemeEditor(): SecuritySchemeEditorComponent {
        return this.securitySchemeEditor;
    }

    public getSecurityRequirementEditor(): SecurityRequirementEditorComponent {
        return this.securityRequirementEditor;
    }

    public getDataTypeEditor(): DataTypeEditorComponent {
        return this.dataTypeEditor;
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
}
