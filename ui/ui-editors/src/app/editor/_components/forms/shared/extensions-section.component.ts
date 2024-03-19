/**
 * @license
 * Copyright 2021 Red Hat
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
    Input, SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {CommandFactory, ExtensibleNode, Extension, ICommand, Library} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";
import {RenameEntityDialogComponent, RenameEntityEvent} from "../../dialogs/rename-entity.component";
import {ObjectUtils} from "apicurio-ts-core";
import {ModelUtils} from "../../../_util/model.util";
import {AddExtensionDialogComponent} from "../../dialogs/add-extension.component";


@Component({
    selector: "extensions-section",
    templateUrl: "extensions-section.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtensionsSectionComponent extends AbstractBaseComponent {

    @Input() parent: ExtensibleNode;

    @ViewChild("addExtensionDialog", { static: true }) addExtensionDialog: AddExtensionDialogComponent;
    @ViewChild("renameDialog", { static: true }) renameDialog: RenameEntityDialogComponent;

    public showSectionBody: boolean;

    private _extensions: Extension[];

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param commandService
     * @param selectionService
     */
    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected onDocumentChange(): void {
        this._extensions = null;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.showSectionBody = this.hasExtensions();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        this._extensions = null;
    }

    /**
     * Returns the list of extensions
     */
    public extensions(): Extension[] {
        if (this._extensions !== null) {
            return this._extensions;
        }

        let extensions: Extension[] = this.parent.getExtensions();
        if (ObjectUtils.isNullOrUndefined(extensions)) {
            extensions = [];
        }
        // Clone the array
        extensions = extensions.slice(0);
        // Sort it
        extensions.sort( (obj1, obj2) => {
            return obj1.name.toLowerCase().localeCompare(obj2.name.toLowerCase());
        });
        this._extensions = extensions;
        return extensions;
    }

    public extensionsNodePath(): string {
        return ModelUtils.nodeToPath(this.parent);
    }

    /**
     * Returns true if the node has at least one extension defined.
     */
    public hasExtensions(): boolean {
        let extensions: Extension[] = this.extensions();
        return extensions && extensions.length > 0;
    }

    /**
     * Called when the user clicks the trash icon to delete all the vendor extensions.
     */
    public deleteAllExtensions(): void {
        let command: ICommand = CommandFactory.createDeleteAllExtensionsCommand(this.parent);
        this.commandService.emit(command);
    }

    /**
     * Called to open the Add Extension dialog.
     */
    public openAddExtensionDialog(): void {
        this.addExtensionDialog.open(this.parent);
    }

    /**
     * Called when the user clicks 'Add' on the Add Extension modal dialog.
     * @param extension
     */
    public addExtension(extension: any): void {
        let command: ICommand = CommandFactory.createNewExtensionCommand(this.parent, extension.name, extension.value);
        this.commandService.emit(command);
        let path = Library.createNodePath(this.parent);
        path.appendSegment(extension.name, false);
        this.selectionService.select(path.toString());
    }

    /**
     * Called to open the Rename Extension dialog.
     */
    public openRenameExtensionDialog(extension: Extension): void {
        this.renameDialog.open(extension, extension.name, (name) => {
            return false;
        });
    }

    /**
     * Renames the extension.
     * @param event
     */
    public rename(event: RenameEntityEvent): void {
        window.alert("Not yet implemented!");
        // let extension: Extension = <any>event.entity;
        // let command: ICommand = CommandFactory.createRenameExtensionCommand(extension, event.newName);
        // this.commandService.emit(command);
    }

    /**
     * Deletes a single extension.
     * @param extension
     */
    public deleteExtension(extension: Extension): void {
        let command: ICommand = CommandFactory.createDeleteExtensionCommand(extension);
        this.commandService.emit(command);
    }

}
