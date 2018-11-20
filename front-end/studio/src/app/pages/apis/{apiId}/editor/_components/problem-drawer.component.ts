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
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation
} from "@angular/core";
import {OasValidationProblem, OasValidationProblemSeverity} from "oai-ts-core";
import {SelectionService} from "../_services/selection.service";
import {ProblemsService} from "../_services/problems.service";
import {AbstractBaseComponent} from "./common/base-component";
import {DocumentService} from "../_services/document.service";


/**
 * The component that models the list of problems found in the document.  This is only shown
 * when the user clicks the bell icon to drop down the list of problems.
 */
@Component({
    moduleId: module.id,
    selector: "problem-drawer",
    templateUrl: "problem-drawer.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorProblemDrawerComponent extends AbstractBaseComponent {

    @Input() validationErrors: OasValidationProblem[];
    @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private selectionService: SelectionService, private problemsService: ProblemsService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public hasProblems(): boolean {
        return this.validationErrors && this.validationErrors.length > 0;
    }

    public goTo(problem: OasValidationProblem): void {
        this.close.emit(true);
        this.selectionService.select(problem.nodePath, problem.ownerDocument());
    }

    public iconFor(problem: OasValidationProblem): string {
        switch (problem.severity) {
            case OasValidationProblemSeverity.low:
                return "pficon-info";
            case OasValidationProblemSeverity.medium:
                return "pficon-warning-triangle-o";
            case OasValidationProblemSeverity.high:
                return "pficon-error-circle-o";
            default:
                return "pficon-info";
        }
    }

    public summaryFor(problem: OasValidationProblem): string {
        return this.problemsService.summary(problem);
    }

    public explanationFor(problem: OasValidationProblem): string {
        return this.problemsService.explanation(problem);
    }

}
