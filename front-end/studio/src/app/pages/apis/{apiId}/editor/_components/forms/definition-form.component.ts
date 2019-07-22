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
    Input,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {
    CombinedVisitorAdapter,
    CommandFactory,
    DocumentType,
    ICommand,
    Library,
    Oas20Document,
    Oas20Schema,
    Oas20SchemaDefinition,
    Oas30Document,
    Oas30Schema,
    Oas30SchemaDefinition,
    OasDocument,
    OasSchema,
    SimplifiedPropertyType,
    TraverserDirection,
    VisitorUtil,
} from "apicurio-data-models";

import {SourceFormComponent} from "./source-form.base";
import {CloneDefinitionDialogComponent} from "../dialogs/clone-definition.component";
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";
import {DocumentService} from "../../_services/document.service";
import {IPropertyEditorHandler, PropertyData, PropertyEditorComponent} from "../editors/property-editor.component";
import {EditorsService} from "../../_services/editors.service";
import {ModelUtils} from "../../_util/model.util";
import {RenameEntityDialogComponent, RenameEntityEvent} from "../dialogs/rename-entity.component";
import Oas20PropertySchema = Oas20Schema.Oas20PropertySchema;
import Oas30PropertySchema = Oas30Schema.Oas30PropertySchema;
import { AbstractBaseComponent } from "../common/base-component";


@Component({
    moduleId: module.id,
    selector: "definition-form",
    templateUrl: "definition-form.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefinitionFormComponent extends SourceFormComponent<OasSchema> {

    private _definition: Oas20SchemaDefinition | Oas30SchemaDefinition;
    @Input()
    set definition(definition: Oas20SchemaDefinition | Oas30SchemaDefinition) {
        this._definition = definition;
        this.sourceNode = definition;
        this.revertSource();
    }

    get definition(): Oas20SchemaDefinition | Oas30SchemaDefinition {
        return this._definition;
    }

    @ViewChild("cloneDefinitionDialog") cloneDefinitionDialog: CloneDefinitionDialogComponent;
    @ViewChild("renameDefinitionDialog") renameDefinitionDialog: RenameEntityDialogComponent;
    @ViewChild("renamePropertyDialog") renamePropertyDialog: RenameEntityDialogComponent;

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param selectionService
     * @param commandService
     * @param documentService
     * @param editors
     */
    public constructor(protected changeDetectorRef: ChangeDetectorRef,
                       protected selectionService: SelectionService,
                       protected commandService: CommandService,
                       protected documentService: DocumentService,
                       private editors: EditorsService) {
        super(changeDetectorRef, selectionService, commandService, documentService);
    }

    public definitionName(): string {
        return this._definitionName(this.definition);
    }

    protected createEmptyNodeForSource(): Oas20SchemaDefinition | Oas30SchemaDefinition {
        if (this.definition.ownerDocument().getDocumentType() == DocumentType.openapi2) {
            return (this.definition.ownerDocument() as Oas20Document).definitions.createSchemaDefinition(this.definitionName());
        } else {
            return (this.definition.ownerDocument() as Oas30Document).components.createSchemaDefinition(this.definitionName());
        }
    }

    protected createReplaceNodeCommand(node: Oas20SchemaDefinition | Oas30SchemaDefinition): ICommand {
        return CommandFactory.createReplaceSchemaDefinitionCommand(this.definition.ownerDocument().getDocumentType(), this.definition, node);
    }

    public openAddSchemaPropertyEditor(): void {
        let editor: PropertyEditorComponent = this.editors.getPropertyEditor();
        let handler: IPropertyEditorHandler = {
            onSave: (event) => {
                this.addSchemaProperty(event.data);
            },
            onCancel: () => {}
        };
        editor.open(handler, this.definition);
    }

    public hasProperties(): boolean {
        return this.properties().length > 0;
    }

    public properties(): OasSchema[] {
        let rval: OasSchema[] = [];
        this.definition.getPropertyNames().sort((left, right) => {
            return left.localeCompare(right);
        }).forEach(name => rval.push(this.definition.getProperty(name)));

        return rval;
    }

    public propertiesNodePath(): string {
        return ModelUtils.nodeToPath(this.definition) + "/properties";
    }

    public changePropertyDescription(property: OasSchema, newDescription: string): void {
        let command: ICommand = CommandFactory.createChangePropertyCommand<string>(property, "description", newDescription);
        this.commandService.emit(command);
    }

    public changePropertyType(property: OasSchema, newType: SimplifiedPropertyType): void {
        let command: ICommand = CommandFactory.createChangePropertyTypeCommand(property as any, newType);
        this.commandService.emit(command);
    }

    public deleteProperty(property: OasSchema): void {
        let command: ICommand = CommandFactory.createDeletePropertyCommand(property as any);
        this.commandService.emit(command);
    }

    public addSchemaProperty(data: PropertyData): void {
        let command: ICommand = CommandFactory.createNewSchemaPropertyCommand(this.definition,
            data.name, data.description, data.type);
        this.commandService.emit(command);
        let path = Library.createNodePath(this.definition);
        path.appendSegment("properties", false);
        path.appendSegment(data.name, true);
        this.__selectionService.select(path.toString());
    }

    public deleteAllSchemaProperties(): void {
        let command: ICommand = CommandFactory.createDeleteAllPropertiesCommand(this.definition);
        this.commandService.emit(command);
    }

    public delete(): void {
        console.info("[DefinitionFormComponent] Deleting schema definition.");
        let command: ICommand = CommandFactory.createDeleteSchemaDefinitionCommand(this.definition.ownerDocument().getDocumentType(),
            this.definitionName());
        this.commandService.emit(command);
    }

    public clone(modalData?: any): void {
        if (undefined === modalData || modalData === null) {
            this.cloneDefinitionDialog.open(<OasDocument> this.definition.ownerDocument(), this.definition);
        } else {
            let definition: Oas20SchemaDefinition | Oas30SchemaDefinition = modalData.definition;
            console.info("[DefinitionFormComponent] Clone definition: %s", modalData.name);
            let cloneSrcObj: any = Library.writeNode(definition);
            let command: ICommand = CommandFactory.createAddSchemaDefinitionCommand(this.definition.ownerDocument().getDocumentType(),
                modalData.name, cloneSrcObj);
            this.commandService.emit(command);
        }
    }

    public rename(event?: RenameEntityEvent): void {
        if (undefined === event || event === null) {
            let schemaDef: Oas20SchemaDefinition | Oas30SchemaDefinition = this.definition;
            let name: string = this.definitionName();
            let definitionNames: string[] = [];
            let form: DefinitionFormComponent = this;
            VisitorUtil.visitTree(this.definition.ownerDocument(), new class extends CombinedVisitorAdapter {
                public visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
                    definitionNames.push(form._definitionName(node));
                }
            }, TraverserDirection.down);
            this.renameDefinitionDialog.open(schemaDef, name, newName => {
                return definitionNames.indexOf(newName) !== -1;
            });
        } else {
            let oldName: string = this.definitionName();
            console.info("[DefinitionFormComponent] Rename definition to: %s", event.newName);
            let command: ICommand = CommandFactory.createRenameSchemaDefinitionCommand(this.definition.ownerDocument().getDocumentType(),
                oldName, event.newName);
            this.commandService.emit(command);
            // TODO reselect the renamed definition - we can fabricate the path and then fire a selection event.
        }
    }

    public enableSourceMode(): void {
        this.sourceNode = this.definition;
        super.enableSourceMode();
    }

    /**
     * Figures out the definition name.
     * @param schemaDef
     */
    protected _definitionName(schemaDef: Oas20SchemaDefinition | Oas30SchemaDefinition): string {
        return schemaDef.getName();
    }

    /**
     * Opens the rename property dialog.
     * @param property
     */
    public openRenamePropertyDialog(property: OasSchema): void {
        let parent: OasSchema = <any>property.parent();
        let propertyNames: string[] = parent.getProperties().map( prop => { return (<Oas20PropertySchema>prop).getPropertyName(); });
        this.renamePropertyDialog.open(property, (<Oas20PropertySchema>property).getPropertyName(), newName => {
            return propertyNames.indexOf(newName) !== -1;
        });
    }

    /**
     * Renames the property.
     * @param event
     */
    public renameProperty(event: RenameEntityEvent): void {
        let property: Oas20PropertySchema | Oas30PropertySchema = <any>event.entity;
        let propertyName: string = property.getPropertyName();
        let parent: OasSchema = <any>property.parent();
        let command: ICommand = CommandFactory.createRenamePropertyCommand(parent, propertyName, event.newName);
        this.commandService.emit(command);
    }

}
