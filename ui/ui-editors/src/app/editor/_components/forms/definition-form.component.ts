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
    CombinedVisitorAdapter,
    CommandFactory,
    DocumentType,
    ICommand,
    Library,
    Oas20Document,
    Oas20SchemaDefinition,
    Oas30Document,
    Oas30SchemaDefinition,
    OasDocument,
    OasSchema, ReferenceUtil,
    SimplifiedType,
    TraverserDirection,
    VisitorUtil,
} from "@apicurio/data-models";

import {SourceFormComponent} from "./source-form.base";
import {CloneDefinitionDialogComponent} from "../dialogs/clone-definition.component";
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";
import {DocumentService} from "../../_services/document.service";
import {EditorsService} from "../../_services/editors.service";
import {RenameEntityDialogComponent, RenameEntityEvent} from "../dialogs/rename-entity.component";
import {ApiCatalogService} from "../../_services/api-catalog.service";
import {DropDownOption, DropDownOptionValue} from "../common/drop-down.component";

const INHERITANCE_TYPES: DropDownOption[] = [
    new DropDownOptionValue("No inheritance", "none"),
    new DropDownOptionValue("AnyOf", "anyOf"),
    new DropDownOptionValue("AllOf", "allOf"),
    new DropDownOptionValue("OneOf", "oneOf")
];
const INHERITANCE_TYPES_20: DropDownOption[] = [
    new DropDownOptionValue("No inheritance", "none"),
    new DropDownOptionValue("AllOf", "allOf")
];


@Component({
    selector: "definition-form",
    templateUrl: "definition-form.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefinitionFormComponent extends SourceFormComponent<OasSchema> {

    private _stype: SimplifiedType = null;

    private _definition: Oas20SchemaDefinition | Oas30SchemaDefinition;
    @Input()
    set definition(definition: Oas20SchemaDefinition | Oas30SchemaDefinition) {
        this._definition = definition;
        this.sourceNode = definition;
        this._stype = null;
        this.revertSource();
    }

    get definition(): Oas20SchemaDefinition | Oas30SchemaDefinition {
        return this._definition;
    }

    @ViewChild("cloneDefinitionDialog", { static: true }) cloneDefinitionDialog: CloneDefinitionDialogComponent;
    @ViewChild("renameDefinitionDialog", { static: true }) renameDefinitionDialog: RenameEntityDialogComponent;

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param selectionService
     * @param commandService
     * @param documentService
     * @param editors
     * @param catalog
     */
    public constructor(protected changeDetectorRef: ChangeDetectorRef,
                       protected selectionService: SelectionService,
                       protected commandService: CommandService,
                       protected documentService: DocumentService,
                       private editors: EditorsService,
                       private catalog: ApiCatalogService) {
        super(changeDetectorRef, selectionService, commandService, documentService);
    }

    public definitionName(): string {
        return this._definitionName(this.definition);
    }

    isImported(): boolean {
        return this.definition.$ref && !this.definition.$ref.startsWith("#");
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

    public isObject(): boolean {
        return this.definition.type == "object" || this.definition.type == null || this.definition.type == undefined;
    }

    public simpleType(): SimplifiedType {
        if (this._stype === null) {
            this._stype = SimplifiedType.fromSchema(this.definition);
        }
        return this._stype;
    }

    protected onDocumentChange(): void {
        super.onDocumentChange();
        this._stype = null;
    }

    public changeSimpleType(newType: SimplifiedType): void {
        let nt: SimplifiedType = new SimplifiedType();
        nt.type = newType.type;
        nt.enum_ = newType.enum_;
        nt.of = newType.of;
        nt.as = newType.as;
        let command: ICommand = CommandFactory.createChangeSchemaTypeCommand(this.definition, nt);
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

    public inheritanceTypeOptions(): DropDownOption[] {
        if (this.definition.ownerDocument().getDocumentType() === DocumentType.openapi2) {
            return INHERITANCE_TYPES_20;
        }
        return INHERITANCE_TYPES;
    }

    public isInheritanceEnabled(): boolean {
        return this.inheritanceType() !== "none";
    }

    public setInheritanceType(newInheritanceType: string): void {
        console.info("[DefinitionFormComponent] Setting inheritance type to: ", newInheritanceType);
        let command: ICommand = CommandFactory.createChangeSchemaInheritanceCommand(this.definition, newInheritanceType);
        this.commandService.emit(command);
    }

    /**
     * When the definition is an import, returns the content for the imported entity.
     */
    referenceContent(): string {
        if (this.definition.$ref && this.definition.$ref.indexOf("#") > 0) {
            let hashIdx: number = this.definition.$ref.indexOf("#");
            let resourceUrl: string = this.definition.$ref.substring(0, hashIdx);
            let content: any = this.catalog.lookup(resourceUrl);
            if (content) {
                let fragment: string = this.definition.$ref.substring(hashIdx+1);
                content = ReferenceUtil.resolveFragmentFromJS(content, fragment);
                if (content) {
                    return JSON.stringify(content, null, 3);
                }
            }
        }
        return "Content not available.";
    }

    refLink(): string {
        if (this.definition.$ref && this.definition.$ref.startsWith("apicurio:")) {
            let currentUrl: string = window.location.href;
            let refId: string = this.getRefId();
            // Drop the /editor and /12345 (apiId) from the URL
            let prefix: string = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
            prefix = prefix.substring(0, prefix.lastIndexOf('/'));
            return prefix + "/" + refId;
        } else {
            return this.definition.$ref;
        }
    }

    private getRefId(): string {
        let colonIdx: number = this.definition.$ref.indexOf(':');
        let hashIdx: number = this.definition.$ref.indexOf('#');
        return this.definition.$ref.substring(colonIdx + 1, hashIdx);
    }

}
