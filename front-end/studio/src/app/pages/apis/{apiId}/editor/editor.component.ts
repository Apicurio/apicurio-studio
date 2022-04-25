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
    CombinedVisitorAdapter,
    CommandFactory,
    DocumentType,
    ICommand,
    IDefinition,
    IDocumentValidatorExtension,
    IReferenceResolver,
    IValidationSeverityRegistry,
    Library,
    ModelCloner,
    Node,
    NodePath,
    Oas20ResponseDefinition,
    Oas20SchemaDefinition,
    Oas30ResponseDefinition,
    Oas30SchemaDefinition,
    OasDocument,
    OasPathItem,
    OtCommand,
    OtEngine,
    ReferenceUtil,
    ValidationProblem
} from "@apicurio/data-models";
import {EditorMasterComponent} from "./_components/master.component";
import {VersionedAck} from "../../../../models/ack.model";
import {ApiEditorUser} from "../../../../models/editor-user.model";
import {SelectionService} from "./_services/selection.service";
import {CommandService} from "./_services/command.service";
import {DocumentService} from "./_services/document.service";
import {ServerEditorComponent} from "./_components/editors/server-editor.component";
import {EditorsService, IEditorsProvider} from "./_services/editors.service";
import {SecuritySchemeEditorComponent} from "./_components/editors/security-scheme-editor.component";
import {SecurityRequirementEditorComponent} from "./_components/editors/security-requirement-editor.component";
import {DataTypeEditorComponent} from "./_components/editors/data-type-editor.component";
import {ParameterEditorComponent} from "./_components/editors/parameter-editor.component";
import {PropertyEditorComponent} from "./_components/editors/property-editor.component";
import {ApiEditorComponentFeatures} from "./_models/features.model";
import {FeaturesService} from "./_services/features.service";
import {CollaboratorService} from "./_services/collaborator.service";
import {ArrayUtils, TopicSubscription} from "apicurio-ts-core";
import {ResponseEditorComponent} from "./_components/editors/response-editor.component";
import {AbstractApiEditorComponent} from "./editor.base";
import {ApiCatalogService} from "./_services/api-catalog.service";
import {ComponentType} from "./_models/component-type.model";
import {ImportedComponent} from "./_models/imported-component.model";
import {OperationTraitEditorComponent} from "./_components/editors/operationtrait-editor.component";
import {MessageTraitEditorComponent} from "./_components/editors/messagetrait-editor.component";
import {MessageEditorComponent} from "./_components/editors/message-editor.component";
import {AaiServerEditorComponent} from "./_components/editors/aaiserver-editor.component";
import { OneOfInMessageEditorComponent } from "./_components/editors/oneof-in-message-editor.component";


@Component({
    selector: "api-editor",
    templateUrl: "editor.component.html",
    styleUrls: ["editor.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class ApiEditorComponent extends AbstractApiEditorComponent implements OnChanges, OnInit, OnDestroy,
    IEditorsProvider, IReferenceResolver {

    @Input() api: ApiDefinition;
    @Input() embedded: boolean;
    @Input() features: ApiEditorComponentFeatures;
    @Input() validationRegistry: IValidationSeverityRegistry;
    @Input() contentFetcher: (externalReference: string) => Promise<any>;
    @Input() componentImporter: (componentType: ComponentType) => Promise<ImportedComponent[]>;
    @Input() validationExtensions: IDocumentValidatorExtension[] = [];

    @Output() onCommandExecuted: EventEmitter<OtCommand> = new EventEmitter<OtCommand>();
    @Output() onSelectionChanged: EventEmitter<string> = new EventEmitter<string>();
    @Output() onValidationChanged: EventEmitter<ValidationProblem[]> = new EventEmitter<ValidationProblem[]>();
    @Output() onUndo: EventEmitter<OtCommand> = new EventEmitter<OtCommand>();
    @Output() onRedo: EventEmitter<OtCommand> = new EventEmitter<OtCommand>();
    @Output() onConfigureValidation: EventEmitter<void> = new EventEmitter<void>();

    private _document: OasDocument = null;
    private _otEngine: OtEngine = null;
    _undoableCommandCount: number = 0;
    _redoableCommandCount: number = 0;

    theme: string = "light";

    private currentSelection: NodePath;
    private currentSelectionType: string;
    private currentSelectionNode: Node;
    public validationErrors: ValidationProblem[] = [];

    private _selectionSubscription: TopicSubscription<string>;
    private _commandSubscription: TopicSubscription<ICommand>;
    private _catalogSubscription: TopicSubscription<any>;

    @ViewChild("master", { static: true }) master: EditorMasterComponent;
    @ViewChild("serverEditor", { static: true }) serverEditor: ServerEditorComponent;
    @ViewChild("securitySchemeEditor", { static: true }) securitySchemeEditor: SecuritySchemeEditorComponent;
    @ViewChild("securityRequirementEditor", { static: true }) securityRequirementEditor: SecurityRequirementEditorComponent;
    @ViewChild("dataTypeEditor", { static: true }) dataTypeEditor: DataTypeEditorComponent;
    @ViewChild("responseEditor", { static: true }) responseEditor: ResponseEditorComponent;
    @ViewChild("parameterEditor", { static: true }) parameterEditor: ParameterEditorComponent;
    @ViewChild("propertyEditor", { static: true }) propertyEditor: PropertyEditorComponent;

    formType: string;

    /**
     * Constructor.
     * @param selectionService
     * @param commandService
     * @param documentService
     * @param editorsService
     * @param featuresService
     * @param collaboratorService
     * @param catalog
     */
    constructor(private selectionService: SelectionService, private commandService: CommandService,
                private documentService: DocumentService, private editorsService: EditorsService,
                private featuresService: FeaturesService, private collaboratorService: CollaboratorService,
                private catalog: ApiCatalogService) {
        super();

        Library.addReferenceResolver(this);
        console.debug("[ApiEditorComponent] Subscribing to API Catalog changes.");
        this._catalogSubscription = this.catalog.changes().subscribe(() => {
            console.debug("[ApiEditorComponent] Re-validating model due to API Catalog change.");
            // Re-validate whenever the contents of the API catalog change
            this.validateModel().then(() => {
                // Make sure any validation widgets refresh themselves
                this.documentService.emitChange();
            });
        });
    }

    /**
     * Called when the editor is initialized by angular.
     */
    public ngOnInit(): void {
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
    }

    /**
     * Called when angular destroys the editor component.
     */
    public ngOnDestroy(): void {
        this._selectionSubscription.unsubscribe();
        this._commandSubscription.unsubscribe();
        this._catalogSubscription.unsubscribe();
        Library.removeReferenceResolver(this);
    }

    /**
     * Called when the @Input changes.
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes["contentFetcher"]) {
            this.catalog.setFetcher(this.contentFetcher);
        }

        if (changes["api"]) {
            this.selectionService.reset();
            this.collaboratorService.reset();
            this.commandService.reset();
            this.documentService.reset();
            this.editorsService.setProvider(this);

            this._document = null;
            this._otEngine = null;
            this._undoableCommandCount = 0;
            this._redoableCommandCount = 0;
            if (this.document().getDocumentType() == DocumentType.openapi2) {
                this.formType = "main_20";
            } else {
                this.formType = "main_30";
            }

            // Fire an event in the doc service indicating that there is a new document.
            this.documentService.setDocument(this.document());
            this.selectionService.selectRoot();

            this.catalog.reset(this.document());
        }

        if (changes["features"]) {
            if (this.features) {
                this.featuresService.setFeatures(this.features);
            } else {
                this.featuresService.setFeatures(new ApiEditorComponentFeatures());
            }
        }

        if (changes["validationRegistry"]) {
            this.validateModel().then(() => this.documentService.emitChange());
        }
    }

    /**
     * Gets the OpenAPI spec as a document.
     */
    public document(): OasDocument {
        if (this._document === null && this.api) {
            try {
                if (typeof this.api.spec == "object") {
                    this._document = <OasDocument> Library.readDocument(this.api.spec);
                } else {
                    this._document = <OasDocument> Library.readDocumentFromJSONString(<string>this.api.spec);
                }
                console.info("[ApiEditorComponent] Loaded OAI content: ", this._document);
            } catch (e) {
                console.error(e);
                // If we can't process the document, then just create a new one
                this._document = <OasDocument> Library.createDocument(DocumentType.openapi3);
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
        console.info("[ApiEditorComponent] Selection changed to path: %s", path);

        this.updateFormDisplay(path);

        this.onSelectionChanged.emit(path);
    }

    /**
     * Called to update which form is displayed (the details view).
     * @param path
     */
    private updateFormDisplay(path: string): void {
        let npath: NodePath = new NodePath(path);
        let visitor: FormSelectionVisitor = new FormSelectionVisitor(this.document().is2xDocument() ? "20" : "30");
        npath.resolveWithVisitor(this.document(), visitor);

        this.currentSelection = npath;
        this.formType = visitor.formType();
        this.currentSelectionNode = visitor.selection();
        this.currentSelectionType = visitor.selectionType();
    }

    /**
     * Called to validate the model.
     */
    public async validateModel(): Promise<void> {
        try {
            let doc: OasDocument = this.document();
            let oldValidationErrors: ValidationProblem[] = this.validationErrors;
            this.validationErrors = await Library.validateDocument(doc, this.validationRegistry, this.validationExtensions);
            if (!ArrayUtils.equals(oldValidationErrors, this.validationErrors)) {
                this.onValidationChanged.emit(this.validationErrors);
            }
        } catch (e) {
            console.info("[ApiEditorComponent] Error validating model: ", e);
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
     * Returns the currently selected response.
     */
    public selectedResponse(): Oas20ResponseDefinition | Oas30ResponseDefinition {
        if (this.currentSelectionType === "response") {
            return this.currentSelectionNode as Oas20ResponseDefinition | Oas30ResponseDefinition;
        } else {
            return null;
        }
    }

    public deselectPath(): void {
        this.master.deselectPath();
    }

    public deselectDefinition(): void {
        this.master.deselectDefinition();
    }

    public deselectResponse(): void {
        this.master.deselectResponse();
    }

    public preDocumentChange(): void {
        // Before changing the document, let's clear/reset the current selection
        this.selectionService.clearAllSelections();
    }

    public postDocumentChange(): void {
        // After changing the model, we need to ensure all selections are still valid
        this.selectionService.reselectAll();

        // After changing the model, we should re-validate it
        this.validateModel().then(() => {
            // Update the form being displayed (this might change if the thing currently selected was deleted)
            this.updateFormDisplay(this.selectionService.currentSelection());

            // Potentially update the API catalog
            this.catalog.update(this.documentService.currentDocument());

            // Fire a change event in the document service
            this.documentService.emitChange();
        });
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
        apiDef.spec = Library.writeNode(doc);
        return apiDef;
    }

    /**
     * Call this to select some content in the open document by the content's node path.  If highlight
     * is true then the appropriate content section is also highlighted and scrolled into view.
     * @param path
     * @param highlight
     */
    public select(path: string, highlight: boolean = false): void {
        this.selectionService.select(path);
        if (highlight) {
            this.selectionService.highlightPath(path);
        }
    }

    /**
     * Resolves a $ref reference from a Document.  Uses the API catalog to resolve the external
     * content and, if found, selects the appropriate
     * @param reference
     * @param from
     */
    public resolveRef(reference: string, from: Node): Node {
        // Don't try to resolve internal refs, only external ones.
        if (reference && !reference.startsWith("#")) {
            console.info("[ApiEditorComponent] Resolving a reference: ", reference);
            let hashIdx: number = reference.indexOf("#");
            if (hashIdx == -1) {
                return null;
            }
            let resourceUrl: string = reference.substring(0, hashIdx);
            console.debug("[ApiEditorComponent] Resource URL: ", resourceUrl);
            let resourceContent: any = this.catalog.lookup(resourceUrl);
            if (!resourceContent) {
                // Content not available in API catalog.  Return null.
                return null;
            }
            console.debug("[ApiEditorComponent] FOUND some content for URL: ", resourceUrl);
            let fragment: string = reference.substr(hashIdx + 1);
            console.debug("[ApiEditorComponent] Fragment: ", fragment);
            let cnode: any = ReferenceUtil.resolveFragmentFromJS(resourceContent, fragment);

            // If we resolved a js object (not null) then convert it to a data model (Node)
            if (cnode) {
                console.debug("[ApiEditorComponent] Found a cnode (cloning): ", cnode);
                let emptyClone: any = ModelCloner.createEmptyClone(from);
                return Library.readNode(cnode, emptyClone);
            } else {
                console.warn("[ApiEditorComponent] No node found at fragment.");
                return null;
            }
        }
        return null;
    }

    public getServerEditor(): ServerEditorComponent {
        return this.serverEditor;
    }

    public getAaiServerEditor(): AaiServerEditorComponent {
        return null;
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

    public getResponseEditor(): ResponseEditorComponent {
        return this.responseEditor;
    }

    public getParameterEditor(): ParameterEditorComponent {
        return this.parameterEditor;
    }

    public getPropertyEditor(): PropertyEditorComponent {
        return this.propertyEditor;
    }

    public getOperationTraitEditor(): OperationTraitEditorComponent {
        return null;
    }

    public getMessageTraitEditor(): MessageTraitEditorComponent {
        return null;
    }

    public getMessageEditor(): MessageEditorComponent {
        return null;
    }


    getOneOfInMessageEditor(): OneOfInMessageEditorComponent {
        return null;
    }

    importComponent(type: ComponentType) {
        if (this.componentImporter) {
            this.componentImporter(type).then(imports => {
                let commands: ICommand[] = [];

                imports.forEach(imp => {
                    console.info("[ApiEditorComponent] Importing component: ", imp.name);
                    // TODO check for name collisions
                    let name: string = imp.name;
                    let fromRef: any = {$ref: imp.$ref};
                    if (imp.type === ComponentType.schema) {
                        commands.push(CommandFactory.createAddSchemaDefinitionCommand(this.document().getDocumentType(), name, fromRef));
                    } else if (type === ComponentType.response) {
                        commands.push(CommandFactory.createAddResponseDefinitionCommand(this.document().getDocumentType(), name, fromRef));
                    }
                });

                if (commands != null && commands.length == 1) {
                    console.info("[ApiEditorComponent] Importing a single component.");
                    this.commandService.emit(commands[0]);
                } else if (commands != null && commands.length > 1) {
                    console.info("[ApiEditorComponent] Importing multiple components. :: ", commands.length);
                    let aggregateInfo: any = {
                        type: type,
                        numComponents: commands.length
                    };
                    this.commandService.emit(CommandFactory.createAggregateCommand("ImportedComponents", aggregateInfo, commands));
                }
            }).catch(error => {
                // FIXME what to do if we get an error???
            });
        }
    }
}


/**
 * Visitor used to determine what form should be displayed based on the selected node.
 */
export class FormSelectionVisitor extends CombinedVisitorAdapter {

    public _selectionType: string = "main";
    public _selectedNode: Node = null;

    constructor(private version: string) {
        super();
    }

    public selectionType(): string {
        return this._selectionType;
    }

    public formType(): string {
        return this._selectionType + "_" + this.version;
    }

    public selection(): Node {
        return this._selectedNode;
    }

    public visitPathItem(node: OasPathItem): void {
        this._selectedNode = node;
        this._selectionType = "path";
    }

    public visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
        this._selectedNode = node;
        this._selectionType = "definition";
    }

    public visitResponseDefinition(node: IDefinition): void {
        this._selectedNode = node as any;
        this._selectionType = "response";
    }
}
