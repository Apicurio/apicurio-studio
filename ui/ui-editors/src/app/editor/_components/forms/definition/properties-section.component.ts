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
    Component,
    Input,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {
    CommandFactory,
    ICommand, IPropertyParent,
    Library, Oas20Schema,
    Oas20SchemaDefinition, Oas30Schema,
    Oas30SchemaDefinition,
    OasSchema,
    Schema
} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {ModelUtils} from "../../../_util/model.util";
import {IPropertyEditorHandler, PropertyData, PropertyEditorComponent} from "../../editors/property-editor.component";
import {EditorsService} from "../../../_services/editors.service";
import {RenameEntityDialogComponent, RenameEntityEvent} from "../../dialogs/rename-entity.component";
import Oas20PropertySchema = Oas20Schema.Oas20PropertySchema;
import Oas30PropertySchema = Oas30Schema.Oas30PropertySchema;


@Component({
    selector: "properties-section",
    templateUrl: "properties-section.component.html",
    styleUrls: [ "properties-section.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertiesSectionComponent extends AbstractBaseComponent {

    @Input() definition: Oas20SchemaDefinition | Oas30SchemaDefinition;

    @ViewChild("renamePropertyDialog", { static: true }) renamePropertyDialog: RenameEntityDialogComponent;

    _pconfigOpen: boolean = false;

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param commandService
     * @param selectionService
     * @param editors
     */
    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService,
                private editors: EditorsService) {
        super(changeDetectorRef, documentService, selectionService);
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

    public togglePropertiesConfig(): void {
        this._pconfigOpen = !this._pconfigOpen;
    }

    public hasProperties(): boolean {
        return this.properties().length > 0;
    }

    public properties(): Schema[] {
        let rval: Schema[] = [];

        let sourceSchema: OasSchema = this.getPropertySourceSchema();
        sourceSchema.getPropertyNames().sort((left, right) => {
            return left.localeCompare(right);
        }).forEach(name => rval.push(sourceSchema.getProperty(name)));

        return rval;
    }

    public getPropertySourceSchema(): OasSchema {
        let pschema: OasSchema = this.definition;

        if (this.inheritanceType() != "none") {
            let schemas: OasSchema[] = this.definition[this.inheritanceType()];
            if (schemas) {
                schemas.forEach(schema => {
                    if (schema.properties) {
                        pschema = schema;
                    }
                });
            }
        }

        return pschema;
    }

    public propertiesNodePath(): string {
        return ModelUtils.nodeToPath(this.getPropertySourceSchema()) + "/properties";
    }

    public deleteProperty(property: Schema): void {
        let command: ICommand = CommandFactory.createDeletePropertyCommand(property as any);
        this.commandService.emit(command);
    }

    public addSchemaProperty(data: PropertyData): void {
        let pschema: OasSchema = this.getPropertySourceSchema();

        let command: ICommand = CommandFactory.createNewSchemaPropertyCommand(pschema,
            data.name, data.description, data.type);
        this.commandService.emit(command);
        let path = Library.createNodePath(pschema);
        path.appendSegment("properties", false);
        path.appendSegment(data.name, true);
        this.__selectionService.select(path.toString());
    }

    public deleteAllSchemaProperties(): void {
        let command: ICommand = CommandFactory.createDeleteAllPropertiesCommand(this.getPropertySourceSchema());
        this.commandService.emit(command);
    }

    public minProperties(): string {
        return this.definition.minProperties ? this.definition.minProperties.toString() : null;
    }

    public maxProperties(): string {
        return this.definition.maxProperties ? this.definition.maxProperties.toString() : null;
    }

    public setMinProps(value: string): void {
        this.setMinProperties(Number(value));
    }

    public setMaxProps(value: string): void {
        this.setMaxProperties(Number(value));
    }

    public setMinProperties(minProp: number): void {
        let command: ICommand = CommandFactory.createChangePropertyCommand<number>(this.getPropertySourceSchema(), "minProperties", minProp);
        this.commandService.emit(command);
    }

    public setMaxProperties(maxProp: number): void {
        let command: ICommand = CommandFactory.createChangePropertyCommand<number>(this.getPropertySourceSchema(), "maxProperties", maxProp);
        this.commandService.emit(command);
    }

    public additionalProperties(): boolean {
        if (typeof this.definition.additionalProperties === "boolean") {
            return (this.definition.additionalProperties as boolean);
        } else {
            return true;
        }
    }

    public setAdditionalProperties(value: boolean): void {
        let newVal: any = value ? null : false;
        let command: ICommand = CommandFactory.createChangePropertyCommand<number>(this.getPropertySourceSchema(), "additionalProperties", newVal);
        this.commandService.emit(command);
    }

    public inheritanceType(): string {
        if (this.definition.allOf) {
            return "allOf";
        }
        if (this.definition['anyOf']) {
            return "anyOf";
        }
        if (this.definition['oneOf']) {
            return "oneOf";
        }

        return "none";
    }

    /**
     * Opens the rename property dialog.
     * @param property
     */
    public openRenamePropertyDialog(property: Schema): void {
        let parent: IPropertyParent = <any>property.parent();
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
