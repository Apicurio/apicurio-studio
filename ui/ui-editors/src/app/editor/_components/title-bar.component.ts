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
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    QueryList,
    ViewChildren,
    ViewEncapsulation
} from "@angular/core";
import {CommandFactory, Document, DocumentType, ICommand, ValidationProblem} from "@apicurio/data-models";
import {ModelUtils} from "../_util/model.util";
import {SelectionService} from "../_services/selection.service";
import {CommandService} from "../_services/command.service";
import {AbstractBaseComponent} from "./common/base-component";
import {DocumentService} from "../_services/document.service";
import {KeypressUtils} from "../_util/keypress.util";


/**
 * The component that models the editor's Title Bar.  The title bar shows the title of the
 * API (and allows the title to be edited).  It also shows the notification icon (the Bell icon)
 * which activates when there are validation problems detected.
 */
@Component({
    selector: "title-bar",
    templateUrl: "title-bar.component.html",
    styleUrls: [ "title-bar.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorTitleBarComponent extends AbstractBaseComponent implements AfterViewInit {

    @Input() document: Document;
    @Input() validationErrors: ValidationProblem[];
    @Input() undoableCommandCount: number;
    @Input() redoableCommandCount: number;
    @Output() onUndoClick: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onRedoClick: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onConfigureValidation: EventEmitter<void> = new EventEmitter<void>();

    filterCriteria: string = null;

    public showProblems: boolean = false;
    public editMode: boolean = false;

    public newTitle: string;

    @ViewChildren("newtitle") titleInput: QueryList<ElementRef>;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private selectionService: SelectionService, private commandService: CommandService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public ngAfterViewInit(): void {
        this.titleInput.changes.subscribe(changes => {
            if (changes.last) {
                setTimeout(() => {
                    changes.last.nativeElement.focus();
                    changes.last.nativeElement.select();
                }, 10);
            }
        });
    }

    public onInputKeypress(event: KeyboardEvent): void {
        if (KeypressUtils.isEscapeKey(event)) {
            this.cancel();
        }
    }

    public editTitle(): void {
        this.showProblems = false;
        if (this.document && this.document.info && this.document.info.title) {
            this.newTitle = this.document.info.title;
        } else {
            this.newTitle = "";
        }
        this.editMode = true;
    }

    public cancel(): void {
        this.editMode = false;
    }

    public save(): void {
        this.editMode = false;
        console.info("[EditorTitleBarComponent] User changed the title to: " + this.newTitle);
        let command: ICommand = CommandFactory.createChangeTitleCommand(this.newTitle);
        this.commandService.emit(command);
    }

    public isOAI30(): boolean {
        return this.document.getDocumentType() === DocumentType.openapi3;
    }

    public isAAI20(): boolean {
        return this.document.getDocumentType() === DocumentType.asyncapi2;
    }

    public isSwagger2(): boolean {
        return this.document.getDocumentType() === DocumentType.openapi2;
    }

    /**
     * Called when the user selects the main/default element from the master area.
     */
    public selectMain(): void {
        this.selectionService.selectRoot();
    }

    /**
     * Returns the classes that should be applied to the "main" selection item.
     */
    public mainClasses(): string {
        let classes: string[] = [];
        if (this.isMainSelected()) {
            classes.push("selected");
        }
        if (this.isOAI30()) {
            classes.push("oai30");
        }
        if (this.isSwagger2()) {
            classes.push("oai20");
        }
        if (this.isAAI20()) {
            classes.push("aai20");
        }
        if (this.showProblems) {
            classes.push("expanded");
        }
        return classes.join(' ');
    }

    /**
     * Returns true if the main node should be selected.
     */
    public isMainSelected(): boolean {
        return ModelUtils.isSelected(this.document);
    }

    /**
     * Called when the user clicks somewhere in the document.  Used to close the context
     * menu if it is open.
     */
    @HostListener("document:click", [])
    public onDocumentClick(): void {
    }

    /**
     * Returns the title of the API.
     */
    public title(): string {
        if (this.hasTitle()) {
            return this.document.info.title;
        }
        return "No API Title";
    }

    /**
     * Returns true if the API has a title.
     */
    public hasTitle(): boolean {
        if (this.document && this.document.info && this.document.info.title) {
            return true;
        }
        return false;
    }

    /**
     * Called when the user clicks the Bell icon to show the list of problems.
     */
    public toggleProblemDrawer(): void {
        this.showProblems = !this.showProblems;
    }

    /**
     * Returns true if there are problems to report.
     */
    private hasProblems(): boolean {
        return this.validationErrors && this.validationErrors.length > 0;
    }

    /**
     * Called to close the problem drawer.
     */
    public closeProblemDrawer(): void {
        this.showProblems = false;
    }
}
