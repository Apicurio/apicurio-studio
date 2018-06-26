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
import {Component, EventEmitter, Input, Output, ViewEncapsulation} from "@angular/core";
import {OasValidationProblem} from "oai-ts-core";
import {ProblemsService} from "../../_services/problems.service";
import {ICommand} from "oai-ts-commands";
import {SelectionService} from "../../_services/selection.service";


@Component({
    moduleId: module.id,
    selector: "problem-form",
    templateUrl: "problem-form.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ProblemFormComponent  {

    @Input() problem: OasValidationProblem;

    constructor(private problems: ProblemsService, private selectionService: SelectionService) {}

    explanation(): string {
        return this.problems.explanation(this.problem);
    }

    goToProblem(): void {
        this.selectionService.select(this.problem.nodePath, this.problem.ownerDocument());
    }

}
