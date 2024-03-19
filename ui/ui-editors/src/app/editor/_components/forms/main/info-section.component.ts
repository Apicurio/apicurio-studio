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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from "@angular/core";
import {CommandFactory, ICommand, Library, Oas20Document, OasDocument, OasInfo} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";


@Component({
    selector: "info-section",
    templateUrl: "info-section.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoSectionComponent extends AbstractBaseComponent {

    @Input() document: OasDocument;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public info(): OasInfo {
        return this.document.info;
    }

    /**
     * returns the version.
     */
    public version(): string {
        if (this.info()) {
            return this.info().version;
        } else {
            return null;
        }
    }

    /**
     * returns the description.
     */
    public description(): string {
        if (this.info()) {
            return this.info().description;
        } else {
            return null;
        }
    }

    /**
     * Called when the user changes the version.
     * @param newVersion
     */
    public onVersionChange(newVersion: string): void {
        console.info("[InfoSectionComponent] User changed the version to: ", newVersion);
        let command: ICommand = CommandFactory.createChangeVersionCommand(newVersion);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the description.
     * @param newDescription
     */
    public onDescriptionChange(newDescription: string): void {
        console.info("[InfoSectionComponent] User changed the description.");
        let command: ICommand = CommandFactory.createChangeDescriptionCommand(newDescription);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the "consumes".
     * @param newValue
     */
    public onConsumesChange(newValue: string[]): void {
        console.info("[InfoSectionComponent] User changed the consumes to: ", newValue);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string[]>(this.document, "consumes", newValue);
        this.commandService.emit(command);
    }

    /**
     * Called when the user changes the "produces".
     * @param newValue
     */
    public onProducesChange(newValue: string[]): void {
        console.info("[InfoSectionComponent] User changed the produces to: ", newValue);
        let command: ICommand = CommandFactory.createChangePropertyCommand<string[]>(this.document, "produces", newValue);
        this.commandService.emit(command);
        let path = Library.createNodePath(this.document);
        path.appendSegment("produces", false);
        this.selectionService.select(path.toString());
    }

    public consumes(): string[] {
        return (this.document as Oas20Document).consumes;
    }

    public produces(): string[] {
        return (this.document as Oas20Document).produces;
    }

}
