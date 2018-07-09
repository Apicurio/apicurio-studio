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

import {Component, HostListener, Inject, Input} from "@angular/core";
import {OasNode, OasValidationProblem, OasValidationProblemSeverity, OasVisitorUtil} from "oai-ts-core";
import {ProblemFinder} from "./validation-aggregate.component";
import {ProblemsService} from "../../_services/problems.service";

@Component({
    moduleId: module.id,
    selector: "validation-problem",
    templateUrl: "validation-problem.component.html"
})
export class ValidationProblemComponent {

    @Input() model: OasNode;
    @Input() property: string;
    @Input() code: string;
    @Input() shallow: boolean;
    @Input() debug: boolean;

    private _open: boolean = false;
    public left: string;
    public top: string;

    constructor(private problemsService: ProblemsService) {}

    @HostListener("document:click", ["$event"])
    public onDocumentClick(event: MouseEvent): void {
        if (this._open) {
            this.close();
            event.preventDefault();
            event.stopPropagation();
        }
    }

    public hasProblems(): boolean {
        if (!this.model) {
            return false;
        }
        if (this.debug) {
            console.info("PROBLEMS?  Model: ", this.model);
            console.info("            Prop: ", this.property);
            console.info("         Shallow: ", this.shallow);
            console.info("                : ", this.validationProblems());
        }
        return this.validationProblems().length > 0;
    }

    public validationProblems(): OasValidationProblem[] {
        let props: string[] = this.property ? [ this.property ] : null;
        let codes: string[] = this.code ? [ this.code ] : null;
        let finder: ProblemFinder = new ProblemFinder(props, codes);

        if (this.shallow) {
            OasVisitorUtil.visitNode(this.model, finder);
        } else {
            OasVisitorUtil.visitTree(this.model, finder);
        }

        return finder.getProblems();
    }

    public icon(): string {
        let problems: OasValidationProblem[] = this.validationProblems();
        let maxSeverity: OasValidationProblemSeverity = null;
        problems.forEach( problem => {
            if (maxSeverity === null || problem.severity > maxSeverity) {
                maxSeverity = problem.severity;
            }
        });
        switch (maxSeverity) {
            case OasValidationProblemSeverity.low:
                return "pficon-info";
            case OasValidationProblemSeverity.medium:
                return "pficon-warning-triangle-o";
            case OasValidationProblemSeverity.high:
                return "pficon-error-circle-o";
            default:
                return "";
        }
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
                return "";
        }
    }

    public summaryFor(problem: OasValidationProblem): string {
        return this.problemsService.summary(problem);
    }

    public open(event: MouseEvent): void {
        this.left = event.clientX + "px";
        this.top = event.clientY + "px";
        event.preventDefault();
        event.stopPropagation();
        this._open = true;
    }

    public close(): void {
        this._open = false;
    }

    public isOpen(): boolean {
        return this._open;
    }

    /**
     * Called whenever the user presses a key.
     * @param event
     */
    public onGlobalKeyDown(event: KeyboardEvent): void {
        if (event.key === "Escape"  && !event.metaKey && !event.altKey && !event.ctrlKey) {
            this.close();
        }
    }
}
