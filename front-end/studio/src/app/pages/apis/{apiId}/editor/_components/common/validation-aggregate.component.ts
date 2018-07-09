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

import {Component, HostListener, Input} from "@angular/core";
import {OasAllNodeVisitor, OasNode, OasValidationProblemSeverity, OasVisitorUtil} from "oai-ts-core";
import {OasValidationProblem} from "oai-ts-core/src/models/node.model";
import {ProblemsService} from "../../_services/problems.service";

@Component({
    moduleId: module.id,
    selector: "validation-aggregate",
    templateUrl: "validation-aggregate.component.html"
})
export class ValidationAggregateComponent {

    @Input() models: OasNode[];
    @Input() properties: string[];
    @Input() codes: string[];
    @Input() shallow: boolean;

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

    public hasProblems(): boolean {
        if (!this.models) {
            return false;
        }
        return this.matchingProblems().length > 0;
    }

    public matchingProblems(): OasValidationProblem[] {
        if (!this.models) {
            return [];
        }
        let finder: ProblemFinder = new ProblemFinder(this.properties, this.codes);
        for (let model of this.models) {
            if (model !== null && model !== undefined) {
                if (this.shallow) {
                    OasVisitorUtil.visitNode(model, finder);
                } else {
                    OasVisitorUtil.visitTree(model, finder);
                }
            }
        }
        return finder.getProblems();
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

}

export class ProblemFinder extends OasAllNodeVisitor {

    private problems: OasValidationProblem[] = [];
    
    constructor(private properties: string[], private codes: string[]) {
        super();
    }

    public getProblems(): OasValidationProblem[] {
        return this.problems;
    }

    protected doVisitNode(node: OasNode): void {
        node.validationProblems().forEach( problem => {
            if (this.accepts(problem)) {
                this.problems.push(problem);
            }
        });
    }

    private accepts(problem: OasValidationProblem): boolean {
        let accept: boolean = true;
        
        if (this.properties !== null && this.properties !== undefined && this.properties.length > 0) {
            accept = accept && this.properties.indexOf(problem.property) != -1;
        }

        if (this.codes !== null && this.codes !== undefined && this.codes.length > 0) {
            accept = accept && this.codes.indexOf(problem.errorCode) != -1;
        }
        
        return accept;
    }
}