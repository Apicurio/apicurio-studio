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
    Oas20Document,
    Oas20PropertySchema,
    Oas20SchemaDefinition,
    Oas30Document,
    Oas30PropertySchema,
    Oas30SchemaDefinition,
    OasCombinedVisitorAdapter,
    OasSchema,
    OasVisitorUtil
} from "oai-ts-core";
import {
    createAddSchemaDefinitionCommand,
    createChangePropertyCommand,
    createChangePropertyTypeCommand,
    createDeleteAllPropertiesCommand,
    createDeletePropertyCommand,
    createDeleteSchemaDefinitionCommand,
    createNewSchemaPropertyCommand,
    createRenamePropertyCommand,
    createRenameSchemaDefinitionCommand,
    createReplaceSchemaDefinitionCommand,
    ICommand,
    SimplifiedPropertyType
} from "oai-ts-commands";

import {SourceFormComponent} from "./source-form.base";
import {CloneDefinitionDialogComponent} from "../dialogs/clone-definition.component";
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";
import {DocumentService} from "../../_services/document.service";
import {IPropertyEditorHandler, PropertyData, PropertyEditorComponent} from "../editors/property-editor.component";
import {EditorsService} from "../../_services/editors.service";
import {ModelUtils} from "../../_util/model.util";
import {RenameEntityDialogComponent, RenameEntityEvent} from "../dialogs/rename-entity.component";


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
        if (this.definition.ownerDocument().is2xDocument()) {
            return (this.definition.ownerDocument() as Oas20Document).definitions.createSchemaDefinition(this.definitionName());
        } else {
            return (this.definition.ownerDocument() as Oas30Document).components.createSchemaDefinition(this.definitionName());
        }
    }

    protected createReplaceNodeCommand(node: Oas20SchemaDefinition | Oas30SchemaDefinition): ICommand {
        return createReplaceSchemaDefinitionCommand(node.ownerDocument(), this.definition, node);
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
        this.definition.propertyNames().sort((left, right) => {
            return left.localeCompare(right);
        }).forEach(name => rval.push(this.definition.property(name)));

        return rval;
    }

    public propertiesNodePath(): string {
        return ModelUtils.nodeToPath(this.definition) + "/properties";
    }

    public changePropertyDescription(property: OasSchema, newDescription: string): void {
        let command: ICommand = createChangePropertyCommand<string>(property.ownerDocument(), property, "description", newDescription);
        this.commandService.emit(command);
    }

    public changePropertyType(property: OasSchema, newType: SimplifiedPropertyType): void {
        let command: ICommand = createChangePropertyTypeCommand(property.ownerDocument(), property as any, newType);
        this.commandService.emit(command);
    }

    public deleteProperty(property: OasSchema): void {
        let command: ICommand = createDeletePropertyCommand(property.ownerDocument(), property as any);
        this.commandService.emit(command);
    }

    public addSchemaProperty(data: PropertyData): void {
        let command: ICommand = createNewSchemaPropertyCommand(this.definition.ownerDocument(), this.definition,
            data.name, data.description, data.type);
        this.commandService.emit(command);
    }

    public deleteAllSchemaProperties(): void {
        let command: ICommand = createDeleteAllPropertiesCommand(this.definition.ownerDocument(), this.definition);
        this.commandService.emit(command);
    }

    public delete(): void {
        console.info("[DefinitionFormComponent] Deleting schema definition.");
        let command: ICommand = createDeleteSchemaDefinitionCommand(this.definition.ownerDocument(), this.definitionName());
        this.commandService.emit(command);
    }

    public clone(modalData?: any): void {
        if (undefined === modalData || modalData === null) {
            this.cloneDefinitionDialog.open(this.definition.ownerDocument(), this.definition);
        } else {
            let definition: Oas20SchemaDefinition | Oas30SchemaDefinition = modalData.definition;
            console.info("[DefinitionFormComponent] Clone definition: %s", modalData.name);
            let cloneSrcObj: any = this.oasLibrary().writeNode(definition);
            let command: ICommand = createAddSchemaDefinitionCommand(this.definition.ownerDocument(), modalData.name, cloneSrcObj);
            this.commandService.emit(command);
        }
    }

    public rename(event?: RenameEntityEvent): void {
        if (undefined === event || event === null) {
            let schemaDef: Oas20SchemaDefinition | Oas30SchemaDefinition = this.definition;
            let name: string = this.definitionName();
            let definitionNames: string[] = [];
            let form: DefinitionFormComponent = this;
            OasVisitorUtil.visitTree(this.definition.ownerDocument(), new class extends OasCombinedVisitorAdapter {
                public visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
                    definitionNames.push(form._definitionName(node));
                }
            });
            this.renameDefinitionDialog.open(schemaDef, name, newName => {
                return definitionNames.indexOf(newName) !== -1;
            });
        } else {
            let oldName: string = this.definitionName();
            console.info("[DefinitionFormComponent] Rename definition to: %s", event.newName);
            let command: ICommand = createRenameSchemaDefinitionCommand(this.definition.ownerDocument(), oldName, event.newName);
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
        if (schemaDef.ownerDocument().is2xDocument()) {
            return (<Oas20SchemaDefinition>schemaDef).definitionName();
        } else {
            return (<Oas30SchemaDefinition>schemaDef).name();
        }
    }

    /**
     * Opens the rename property dialog.
     * @param property
     */
    public openRenamePropertyDialog(property: OasSchema): void {
        let parent: OasSchema = <any>property.parent();
        let propertyNames: string[] = parent.getProperties().map( prop => { return (<Oas20PropertySchema>prop).propertyName(); });
        this.renamePropertyDialog.open(property, (<Oas20PropertySchema>property).propertyName(), newName => {
            return propertyNames.indexOf(newName) !== -1;
        });
    }

    /**
     * Renames the property.
     * @param event
     */
    public renameProperty(event: RenameEntityEvent): void {
        let property: Oas20PropertySchema | Oas30PropertySchema = <any>event.entity;
        let propertyName: string = property.propertyName();
        let parent: OasSchema = <any>property.parent();
        let command: ICommand = createRenamePropertyCommand(parent, propertyName, event.newName);
        this.commandService.emit(command);
    }

}
