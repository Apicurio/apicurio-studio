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

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {OasValidationProblem, OasValidationProblemSeverity} from "oai-ts-core";
import {SelectionService} from "../_services/selection.service";


/**
 * The component that models the list of problems found in the document.  This is only shown
 * when the user clicks the bell icon to drop down the list of problems.
 */
@Component({
    moduleId: module.id,
    selector: "problem-drawer",
    templateUrl: "problem-drawer.component.html"
})
export class EditorProblemDrawerComponent implements OnInit, OnDestroy {

    @Input() validationErrors: OasValidationProblem[];
    @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private selectionService: SelectionService) {
    }

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
    }

    public hasProblems(): boolean {
        return this.validationErrors && this.validationErrors.length > 0;
    }

    public high(): OasValidationProblemSeverity {
        return OasValidationProblemSeverity.high;
    }

    public medium(): OasValidationProblemSeverity {
        return OasValidationProblemSeverity.medium;
    }

    public low(): OasValidationProblemSeverity {
        return OasValidationProblemSeverity.low;
    }

    public goTo(problem: OasValidationProblem): void {
        this.close.emit(true);
        this.selectionService.select(problem.nodePath, problem.ownerDocument());
    }
}
