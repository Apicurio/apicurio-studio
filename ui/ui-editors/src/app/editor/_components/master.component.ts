/**
 * @license
 * Copyright 2022 Red Hat
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
    Oas20Document,
    Oas20PathItem,
    Oas20ResponseDefinition,
    Oas20SchemaDefinition,
    Oas30Document,
    Oas30PathItem,
    Oas30ResponseDefinition,
    Oas30SchemaDefinition,
    OasDocument,
    OasPathItem,
    TraverserDirection,
    VisitorUtil
} from "@apicurio/data-models";
import {AddPathDialogComponent} from "./dialogs/add-path.component";
import {ClonePathDialogComponent} from "./dialogs/clone-path.component";
import {CloneDefinitionDialogComponent} from "./dialogs/clone-definition.component";
import {FindPathItemsVisitor} from "../_visitors/path-items.visitor";
import {FindSchemaDefinitionsVisitor} from "../_visitors/schema-definitions.visitor";
import {ModelUtils} from "../_util/model.util";
import {SelectionService} from "../_services/selection.service";
import {CommandService} from "../_services/command.service";
import {EditorsService} from "../_services/editors.service";
import {DataTypeData, DataTypeEditorComponent, IDataTypeEditorHandler} from "./editors/data-type-editor.component";
import {RestResourceService} from "../_services/rest-resource.service";
import {RenamePathDialogComponent} from "./dialogs/rename-path.component";
import {AbstractBaseComponent} from "./common/base-component";
import {DocumentService} from "../_services/document.service";
import {RenameEntityDialogComponent, RenameEntityEvent} from "./dialogs/rename-entity.component";
import {KeypressUtils} from "../_util/keypress.util";
import {ObjectUtils} from "apicurio-ts-core";
import {IResponseEditorHandler, ResponseData, ResponseEditorComponent} from "./editors/response-editor.component";
import {FindResponseDefinitionsVisitor} from "../_visitors/response-definitions.visitor";
import {CloneResponseDefinitionDialogComponent} from "./dialogs/clone-response-definition.component";
import {FeaturesService} from "../_services/features.service";
import {ComponentType} from "../_models/component-type.model";


/**
 * The component that models the master view of the API editor.  This is the
 * left-hand side of the editor, which lists things like Paths and Definitions.
 * Users will select an item in this master panel which will result in a form
 * being displayed in the detail panel.
 */
@Component({
    selector: "master",
    templateUrl: "master.component.html",
    styleUrls: [ "master.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorMasterComponent extends AbstractBaseComponent {

    @Input() document: OasDocument;

    @Output() onImportComponent: EventEmitter<ComponentType> = new EventEmitter<ComponentType>();

    contextMenuSelection: NodePath = null;
    contextMenuType: string = null;
    contextMenuPos: any = {
        left: "0px",
        top: "0px"
    };

    @ViewChild("addPathDialog", { static: true }) addPathDialog: AddPathDialogComponent;
    @ViewChild("clonePathDialog", { static: true }) clonePathDialog: ClonePathDialogComponent;
    @ViewChild("renamePathDialog", { static: true }) renamePathDialog: RenamePathDialogComponent;

    @ViewChild("cloneDefinitionDialog", { static: true }) cloneDefinitionDialog: CloneDefinitionDialogComponent;
    @ViewChild("renameDefinitionDialog", { static: true }) renameDefinitionDialog: RenameEntityDialogComponent;

    @ViewChild("cloneResponseDialog", { static: true }) cloneResponseDialog: CloneResponseDefinitionDialogComponent;
    @ViewChild("renameResponseDialog", { static: true }) renameResponseDialog: RenameEntityDialogComponent;

    filterCriteria: string = null;
    _paths: OasPathItem[];
    _defs: (Oas20SchemaDefinition | Oas30SchemaDefinition)[];
    _responses: (Oas20ResponseDefinition | Oas30ResponseDefinition)[];

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
        this._paths = null;
        this._defs = null;
        this._responses = null;
    }

    public onPathsKeypress(event: KeyboardEvent): void {
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

    public onResponsesKeypress(event: KeyboardEvent): void {
        if (KeypressUtils.isUpArrow(event) || KeypressUtils.isDownArrow(event)) {
            let responses: (Oas20ResponseDefinition | Oas30ResponseDefinition)[] = this.responses();
            this.handleArrowKeypress(event, responses);
        }
    }

    protected handleArrowKeypress(event: KeyboardEvent, items: Node[]): void {
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

        let newSelection: Node = items[selectedIdx];
        this.__selectionService.selectNode(newSelection);
    }

    /**
     * Returns an array of paths that match the filter criteria and are sorted alphabetically.
     */
    public paths(): OasPathItem[] {
        if (!this._paths) {
            let viz: FindPathItemsVisitor = new FindPathItemsVisitor(this.filterCriteria);
            if (this.document && this.document.paths) {
                this.document.paths.getPathItems().forEach(pathItem => {
                    VisitorUtil.visitNode(pathItem, viz);
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
        if (!this._defs) {
            if (this.document.is2xDocument() && (this.document as Oas20Document).definitions) {
                (this.document as Oas20Document).definitions.getDefinitions().forEach( definition => {
                    VisitorUtil.visitNode(definition, viz);
                })
            } else if (this.document.is3xDocument() && (this.document as Oas30Document).components) {
                (this.document as Oas30Document).components.getSchemaDefinitions().forEach( definition => {
                    VisitorUtil.visitNode(definition, viz);
                })
            }
            this._defs = viz.getSortedSchemaDefinitions();
        }
        return this._defs;
    }

    public definitionsPath(): string {
        if (this.document && this.document.is2xDocument()) {
            return "/definitions";
        } else {
            return "/components/schemas";
        }
    }

    /**
     * Returns an array of responses filtered by the search criteria and sorted.
     */
    public responses(): (Oas20ResponseDefinition | Oas30ResponseDefinition)[] {
        let viz: FindResponseDefinitionsVisitor = new FindResponseDefinitionsVisitor(this.filterCriteria);
        if (!this._responses) {
            if (this.document.is2xDocument() && (this.document as Oas20Document).responses) {
                (this.document as Oas20Document).responses.getResponses().forEach( response => {
                    VisitorUtil.visitNode(response, viz);
                })
            } else if (this.document.is3xDocument() && (this.document as Oas30Document).components) {
                (this.document as Oas30Document).components.getResponseDefinitions().forEach( response => {
                    VisitorUtil.visitNode(response, viz);
                })
            }
            this._responses = viz.getSortedResponseDefinitions();
        }
        return this._responses;
    }

    public responsesPath(): string {
        if (this.document && this.document.is2xDocument()) {
            return "/responses";
        } else {
            return "/components/responses";
        }
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
        let pi: any = this.document.paths.getPathItem(pathItem.getPath());
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
        this.__selectionService.selectRoot();
    }

    /**
     * Called when the user selects a path from the master area.
     * @param path
     */
    public selectPath(path: OasPathItem): void {
        this.__selectionService.selectNode(path);
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
        this.__selectionService.selectNode(def);
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
        this.__selectionService.selectNode(response);
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
        let currentSelection: string = this.__selectionService.currentSelection();
        let npath: NodePath = new NodePath(currentSelection);
        let node: Node = npath.resolve(this.document);
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
     * Called when the user fills out the Add Path modal dialog and clicks Add.
     * @param path
     */
    public addPath(path: string): void {
        let command: ICommand = CommandFactory.createNewPathCommand(path);
        this.commandService.emit(command);
        this.selectPath(this.document.paths.getPathItem(path) as OasPathItem);
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
     * Called when the user fills out the Add Definition modal dialog and clicks Add.
     */
    public addDefinition(data: DataTypeData): void {
        console.info("[EditorMasterComponent] Adding a definition: ", data);
        if (data.template === "resource") {
            let commands: ICommand[] = [];
            // First, create the "new schema def" command
            let example: any = (data.example === "") ? null : data.example;
            example = this.exampleAsObject(example);
            let newSchemaCmd: ICommand = CommandFactory.createNewSchemaDefinitionCommand(this.document.getDocumentType(),
                data.name, example, data.description);
            commands.push(newSchemaCmd);
            // Next, add the "REST Resource" commands to the list
            this.restResourceService.generateRESTResourceCommands(data.name, this.document).forEach( cmd => commands.push(cmd));
            // Now create an aggregate command for them all and emit that
            let info: any = {
                dataType: data.name
            };
            let command: ICommand = CommandFactory.createAggregateCommand("CreateRESTResource", info, commands);
            this.commandService.emit(command);
        } else {
            let example: any = (data.example === "") ? null : data.example;
            example = this.exampleAsObject(example);
            let command: ICommand = CommandFactory.createNewSchemaDefinitionCommand(this.document.getDocumentType(),
                data.name, example, data.description);
            this.commandService.emit(command);
        }
        this.selectDefinition(this.getDefinitionByName(data.name));
    }

    /**
     * Called when the user fills out the Add Response editor and clicks Add.
     */
    public addResponse(data: ResponseData): void {
        console.info("[EditorMasterComponent] Adding a response: ", data);
        let command: ICommand = CommandFactory.createNewResponseDefinitionCommand(this.document.getDocumentType(),
            data.name, data.description);
        this.commandService.emit(command);
        this.selectResponse(this.getResponseByName(data.name));
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
     * Gets a definition by its name.
     * @param name
     */
    protected getDefinitionByName(name: string): Oas20SchemaDefinition | Oas30SchemaDefinition {
        if (this.document.getDocumentType() == DocumentType.openapi2) {
            return (this.document as Oas20Document).definitions.getDefinition(name);
        } else {
            return (this.document as Oas30Document).components.getSchemaDefinition(name);
        }
    }

    /**
     * Gets a response by its name.
     * @param name
     */
    protected getResponseByName(name: string): Oas20ResponseDefinition | Oas30ResponseDefinition {
        if (this.document.getDocumentType() == DocumentType.openapi2) {
            return (this.document as Oas20Document).responses.getResponse(name);
        } else {
            return (this.document as Oas30Document).components.getResponseDefinition(name);
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
        this._responses = null;
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
        this.contextMenuSelection = Library.createNodePath(pathItem);
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
        this.addPathDialog.open(this.document, pathItem.getPath());
        this.closeContextMenu();
    }

    /**
     * Called when the user clicks "Delete Path" in the context-menu for a path.
     */
    public deletePath(): void {
        let pathItem: OasPathItem = this.contextMenuSelection.resolve(this.document) as OasPathItem;
        let command: ICommand = CommandFactory.createDeletePathCommand(pathItem.getPath());
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
            let cloneSrcObj: any = Library.writeNode(pathItem);
            let command: ICommand = CommandFactory.createAddPathItemCommand(modalData.path, cloneSrcObj);
            this.commandService.emit(command);
        }
    }

    /**
     * Called when the user right-clicks on a data type.
     * @param event
     * @param definition
     */
    public showDefinitionContextMenu(event: MouseEvent, definition: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
        event.preventDefault();
        event.stopPropagation();
        this.contextMenuPos.left = event.clientX + "px";
        this.contextMenuPos.top = event.clientY + "px";
        this.contextMenuSelection = Library.createNodePath(definition);
        this.contextMenuType = "definition";
    }

    /**
     * Called when the user right-clicks on a response.
     * @param event
     * @param definition
     */
    public showResponseContextMenu(event: MouseEvent, definition: Oas20ResponseDefinition | Oas30ResponseDefinition): void {
        event.preventDefault();
        event.stopPropagation();
        this.contextMenuPos.left = event.clientX + "px";
        this.contextMenuPos.top = event.clientY + "px";
        this.contextMenuSelection = Library.createNodePath(definition);
        this.contextMenuType = "response";
    }

    /**
     * Called when the user clicks the "Delete Definition" item in the context-menu for a definition.
     */
    public deleteDefinition(): void {
        let schemaDef: IDefinition = this.contextMenuSelection.resolve(this.document) as any;
        let schemaDefName: string = schemaDef.getName();
        let command: ICommand = CommandFactory.createDeleteSchemaDefinitionCommand(this.document.getDocumentType(), schemaDefName);
        this.commandService.emit(command);
        this.closeContextMenu();
    }

    /**
     * Called when the user clicks the "Delete Response" item in the context-menu for a response.
     */
    public deleteResponse(): void {
        let def: IDefinition = this.contextMenuSelection.resolve(this.document) as any;
        let defName: string = def.getName();
        let command: ICommand = CommandFactory.createDeleteResponseDefinitionCommand(this.document.getDocumentType(), defName);
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
            let definition: Node = modalData.definition;
            console.info("[EditorMasterComponent] Clone definition: %s", modalData.name);
            let cloneSrcObj: any = Library.writeNode(definition);
            let command: ICommand = CommandFactory.createAddSchemaDefinitionCommand(this.document.getDocumentType(),
                modalData.name, cloneSrcObj);
            this.commandService.emit(command);
        }
    }

    /**
     * Called when the user clicks "Clone Response" in the context-menu for a response.
     */
    public cloneResponse(modalData?: any): void {
        console.info("[EditorMasterComponent] Cloning response definition: ", modalData);
        if (undefined === modalData || modalData === null) {
            let responseDef: any = this.contextMenuSelection.resolve(this.document);
            this.cloneResponseDialog.open(this.document, responseDef);
        } else {
            let definition: Node = modalData.definition;
            console.info("[EditorMasterComponent] Clone response def: %s", modalData.name);
            let cloneSrcObj: any = Library.writeNode(definition);
            let command: ICommand = CommandFactory.createAddResponseDefinitionCommand(this.document.getDocumentType(),
                modalData.name, cloneSrcObj);
            this.commandService.emit(command);
        }
    }

    /**
     * Called when the user clicks "Rename Definition" in the context-menu for a schema definition.
     */
    public renameDefinition(event?: RenameEntityEvent): void {
        if (undefined === event || event === null) {
            let schemaDef: Oas20SchemaDefinition | Oas30SchemaDefinition = <any>this.contextMenuSelection.resolve(this.document);
            let name: string = this.definitionName(schemaDef);
            let definitionNames: string[] = [];
            let master: EditorMasterComponent = this;
            VisitorUtil.visitTree(this.document, new class extends CombinedVisitorAdapter {
                public visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
                    definitionNames.push(master.definitionName(node));
                }
            }, TraverserDirection.down);
            this.renameDefinitionDialog.open(schemaDef, name, newName => {
                return definitionNames.indexOf(newName) !== -1;
            });
        } else {
            let definition: Oas20SchemaDefinition | Oas30SchemaDefinition = <any>event.entity;
            let oldName: string = this.definitionName(definition);
            console.info("[EditorMasterComponent] Rename definition to: %s", event.newName);
            let command: ICommand = CommandFactory.createRenameSchemaDefinitionCommand(this.document.getDocumentType(),
                oldName, event.newName);
            this.commandService.emit(command);
        }
    }

    /**
     * Called when the user clicks "Rename Response" in the context-menu for a response.
     */
    public renameResponse(event?: RenameEntityEvent): void {
        console.info("[EditorMasterComponent] Renaming response: ", event);
        if (undefined === event || event === null) {
            let responseDef: Oas20ResponseDefinition | Oas30ResponseDefinition = <any>this.contextMenuSelection.resolve(this.document);
            let name: string = responseDef.getName();
            let definitionNames: string[] = [];
            let master: EditorMasterComponent = this;
            VisitorUtil.visitTree(this.document, new class extends CombinedVisitorAdapter {
                public visitResponseDefinition(node: Oas20ResponseDefinition | Oas30ResponseDefinition): void {
                    definitionNames.push(node.getName());
                }
            }, TraverserDirection.down);
            this.renameResponseDialog.open(responseDef, name, newName => {
                return definitionNames.indexOf(newName) !== -1;
            });
        } else {
            let definition: Oas20ResponseDefinition | Oas30ResponseDefinition = <any>event.entity;
            let oldName: string = definition.getName();
            console.info("[EditorMasterComponent] Rename response definition to: %s", event.newName);
            let command: ICommand = CommandFactory.createRenameResponseDefinitionCommand(this.document.getDocumentType(),
                oldName, event.newName);
            this.commandService.emit(command);

            // TODO select the newly renamed response def
        }
    }

    /**
     * Figures out the definition name.
     * @param schemaDef
     */
    protected definitionName(schemaDef: Oas20SchemaDefinition | Oas30SchemaDefinition): string {
        return schemaDef.getName();
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
            let oldName: string = path.getPath();
            console.info("[EditorMasterComponent] Rename definition to: %s", modalData.name);
            let command: ICommand = CommandFactory.createRenamePathItemCommand(oldName, modalData.name, modalData.renameSubpaths);
            this.commandService.emit(command);
        }
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
     * Returns the classes that should be applied to the path item in the master view.
     * @param node
     * @return
     */
    public pathClasses(node: OasPathItem): string {
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
     * Returns the classes that should be applied to the response definition in the master view.
     * @param node
     * @return
     */
    public responseClasses(node: Node): string {
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

    /**
     * Opens the Add Response Editor (full screen editor for adding a response).
     */
    public openAddResponseEditor(): void {
        let respEditor: ResponseEditorComponent = this.editors.getResponseEditor();
        let handler: IResponseEditorHandler = {
            onSave: (event) => {
                this.addResponse(event.data);
            },
            onCancel: () => { /* Do nothing on cancel... */ }
        };
        respEditor.open(handler, this.document);
    }

    /**
     * Gets the node path for the given data model node.
     * @param node
     */
    public asNodePath(node: Node): string {
        return ModelUtils.nodeToPath(node);
    }

    shouldShowValidationAggregate(): boolean {
        return (this.paths().length + this.definitions().length) < 40;
    }

    importsEnabled(): boolean {
        return this.features.getFeatures().componentImports;
    }

    importDataTypes(): void {
        this.onImportComponent.emit(ComponentType.schema);
    }

    importResponses(): void {
        this.onImportComponent.emit(ComponentType.response);
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
