/**
 * @license
 * Copyright 2019 JBoss Inc
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
    ViewEncapsulation
} from "@angular/core";
import {ApiDefinition} from "../../../../models/api.model";
import {
    AaiDocument,
    CombinedVisitorAdapter, CommandFactory,
    DocumentType,
    ICommand,
    IDefinition,
    IValidationSeverityRegistry,
    Library,
    Node,
    Oas30SchemaDefinition,
    OasPathItem,
    OtCommand,
    OtEngine,
    ValidationProblem
} from "apicurio-data-models";
import {VersionedAck} from "../../../../models/ack.model";
import {ApiEditorUser} from "../../../../models/editor-user.model";
import {SelectionService} from "./_services/selection.service";
import {CommandService} from "./_services/command.service";
import {DocumentService} from "./_services/document.service";
import {EditorsService} from "./_services/editors.service";
import {ApiEditorComponentFeatures} from "./_models/features.model";
import {FeaturesService} from "./_services/features.service";
import {CollaboratorService} from "./_services/collaborator.service";
import {ArrayUtils, TopicSubscription} from "apicurio-ts-core";
import {AbstractApiEditorComponent} from "./editor.base";
import {CodeEditorMode, CodeEditorTheme} from "../../../../components/common/code-editor.component";
import * as YAML from 'js-yaml';


@Component({
    moduleId: module.id,
    selector: "async-api-editor",
    templateUrl: "aaieditor.component.html",
    styleUrls: ["aaieditor.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class AsyncApiEditorComponent extends AbstractApiEditorComponent implements OnChanges, OnInit, OnDestroy {

    @Input() api: ApiDefinition;
    @Input() embedded: boolean;
    @Input() features: ApiEditorComponentFeatures;
    @Input() validationRegistry: IValidationSeverityRegistry;

    @Output() onCommandExecuted: EventEmitter<OtCommand> = new EventEmitter<OtCommand>();
    @Output() onSelectionChanged: EventEmitter<string> = new EventEmitter<string>();
    @Output() onValidationChanged: EventEmitter<ValidationProblem[]> = new EventEmitter<ValidationProblem[]>();
    @Output() onUndo: EventEmitter<OtCommand> = new EventEmitter<OtCommand>();
    @Output() onRedo: EventEmitter<OtCommand> = new EventEmitter<OtCommand>();
    @Output() onConfigureValidation: EventEmitter<void> = new EventEmitter<void>();

    private _document: AaiDocument = null;
    private _otEngine: OtEngine = null;
    _undoableCommandCount: number = 0;
    _redoableCommandCount: number = 0;

    sourceOriginal: string = "";
    sourceValue: string = "";
    sourceIsValid: boolean = true;

    public validationErrors: ValidationProblem[] = [];

    private _selectionSubscription: TopicSubscription<string>;
    private _commandSubscription: TopicSubscription<ICommand>;

    /**
     * Constructor.
     * @param selectionService
     * @param commandService
     * @param documentService
     * @param editorsService
     * @param featuresService
     * @param collaboratorService
     */
    constructor(private selectionService: SelectionService, private commandService: CommandService,
                private documentService: DocumentService, private editorsService: EditorsService,
                private featuresService: FeaturesService, private collaboratorService: CollaboratorService) { super(); }

    /**
     * Called when the editor is initialized by angular.
     */
    public ngOnInit(): void {
        let me: AsyncApiEditorComponent = this;
        this._selectionSubscription = this.selectionService.selection().subscribe( selectedPath => {
            if (selectedPath) {
                console.info("[AsyncApiEditorComponent] Node selection detected (from the selection service)")
                me.onNodeSelected(selectedPath);
            }
        });
        this._commandSubscription = this.commandService.commands().subscribe( command => {
            if (command) {
                console.info("[AsyncApiEditorComponent] Command execution detected (from the command service)")
                me.onCommand(command);
            }
        });
    }

    /**
     * Called when angular destroys the editor component.
     */
    public ngOnDestroy(): void {
        this._selectionSubscription.unsubscribe();
        this._commandSubscription.unsubscribe();
    }

    /**
     * Called when the @Input changes.
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes["api"]) {
            this.selectionService.reset();
            this.collaboratorService.reset();
            this.commandService.reset();
            this.documentService.reset();

            this._document = null;
            this._otEngine = null;
            this._undoableCommandCount = 0;
            this._redoableCommandCount = 0;

            // Fire an event in the doc service indicating that there is a new document.
            this.documentService.setDocument(this.document());
            this.selectionService.selectRoot();
        }

        if (changes["features"]) {
            if (this.features) {
                this.featuresService.setFeatures(this.features);
            } else {
                this.featuresService.setFeatures(new ApiEditorComponentFeatures());
            }
        }

        if (changes["validationRegistry"]) {
            this.validateModel();
            this.documentService.emitChange();
        }
    }

    sourceTheme(): CodeEditorTheme {
        return CodeEditorTheme.Light;
    }

    sourceMode(): CodeEditorMode {
        return CodeEditorMode.YAML;
    }

    isDirty(): boolean {
        return this.sourceOriginal != this.sourceValue;
    }

    /**
     * Gets the spec as a document.
     */
    public document(): AaiDocument {
        if (this._document === null && this.api) {
            try {
                if (typeof this.api.spec == "object") {
                    this._document = <AaiDocument> Library.readDocument(this.api.spec);
                } else {
                    this._document = <AaiDocument> Library.readDocumentFromJSONString(<string>this.api.spec);
                }
                console.info("[AsyncApiEditorComponent] Loaded AAI content: ", this._document);
            } catch (e) {
                console.error(e);
                // If we can't process the document, then just create a new one
                this._document = <AaiDocument> Library.createDocument(DocumentType.asyncapi2);
            }
            this.validateModel();
            let sourceJs: any = Library.writeNode(this._document);
            this.sourceValue = YAML.safeDump(sourceJs, {
                indent: 4,
                lineWidth: 110,
                noRefs: true
            });
            this.sourceOriginal = this.sourceValue;
            this.sourceIsValid = true;
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
    }

    /**
     * Called when the user clicks the Undo button or uses the Ctrl-z hotkey.
     */
    public undoLastCommand(): void {
        if (this._undoableCommandCount === 0) {
            return;
        }
        console.info("[AsyncApiEditorComponent] User wants to 'undo' the last command.");
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
        console.info("[AsyncApiEditorComponent] User wants to 'redo' the last command.");
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
                contentVersion: otCmd.contentVersion,
                ackType: "command"
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
        this.otEngine().executeCommand(command, false);
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
    public finalizeCommand(ack: VersionedAck): void {
        this.otEngine().finalizeCommand(ack.commandId, ack.contentVersion);
    }

    /**
     * Called to update the selection state of the given remote API editor (i.e. an active collaborator).
     * @param user
     * @param selection
     */
    public updateCollaboratorSelection(user: ApiEditorUser, selection: string): void {
        this.collaboratorService.setCollaboratorSelection(user, selection);
    }

    /**
     * Called when the user selects a node in some way.
     * @param path
     */
    public onNodeSelected(path: string): void {
        console.info("[AsyncApiEditorComponent] Selection changed to path: %s", path);

        this.onSelectionChanged.emit(path);
    }

    /**
     * Called to validate the model.
     */
    public validateModel(): void {
        try {
            let doc: AaiDocument = this.document();
            let oldValidationErrors: ValidationProblem[] = this.validationErrors;
            this.validationErrors = Library.validate(doc, this.validationRegistry);
            if (!ArrayUtils.equals(oldValidationErrors, this.validationErrors)) {
                this.onValidationChanged.emit(this.validationErrors);
            }
        } catch (e) {
            console.info("[AsyncApiEditorComponent] Error validating model: ", e);
        }
    }

    public preDocumentChange(): void {
        // Before changing the document, let's clear/reset the current selection
        this.selectionService.clearAllSelections();
    }

    public postDocumentChange(): void {
        // After changing the model, we need to ensure all selections are still valid
        this.selectionService.reselectAll();

        // After changing the model, we should re-validate it
        this.validateModel();

        // Set the current state
        this.sourceOriginal = this.sourceValue;
        this.sourceIsValid = true;

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
        let doc: AaiDocument = this.document();
        apiDef.spec = Library.writeNode(doc);
        return apiDef;
    }

    public select(path: string, highlight: boolean = true): void {
        // TODO what to do here?  ignore for now
    }

    /**
     * Called when the user clicks save.
     */
    public saveSource(): void {
        console.info("[AsyncAPI Editor] Saving source code changes");
        try {
            let doc: AaiDocument = this.document();
            let newJs: any = YAML.safeLoad(this.sourceValue);
            let newDoc: AaiDocument = Library.readDocument(newJs) as AaiDocument;
            let command: ICommand = CommandFactory.createReplaceDocumentCommand(doc, newDoc);
            this.commandService.emit(command);
        } catch (e) {
            console.warn("[AsyncAPI Editor] Error saving source changes: ", e);
        }
    }

    /**
     * Called when the user clicks revert.
     */
    public revertSource(): void {
        console.info("[AsyncAPI Editor] Reverting source code changes");
        this.sourceValue = this.sourceOriginal;
    }

    /**
     * Validates that the current source text is valid.
     */
    public validate(): void {
        try {
            YAML.safeLoad(this.sourceValue);
            this.sourceIsValid = true;
        } catch (e) {
            this.sourceIsValid = false;
        }
    }

}
