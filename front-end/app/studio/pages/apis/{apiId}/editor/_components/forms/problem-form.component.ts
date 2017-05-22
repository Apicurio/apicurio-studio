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
import {OasValidationError} from "oai-ts-core";
import {ICommand} from "../../_services/commands.manager";
import {ProblemsService} from "../../_services/problems.service";


@Component({
    moduleId: module.id,
    selector: "problem-form",
    templateUrl: "problem-form.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ProblemFormComponent  {

    private static problems: ProblemsService = new ProblemsService();

    @Input() problem: OasValidationError;
    @Output() onCommand: EventEmitter<ICommand> = new EventEmitter<ICommand>();
    @Output() onGoToProblem: EventEmitter<boolean> = new EventEmitter<boolean>();

    explanation(): string {
        return ProblemFormComponent.problems.explanation(this.problem);
    }

    goToProblem(): void {
        this.onGoToProblem.emit(true);
    }

}
