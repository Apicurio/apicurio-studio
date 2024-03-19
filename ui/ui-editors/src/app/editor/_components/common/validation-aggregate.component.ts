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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input} from "@angular/core";
import {
    CombinedAllNodeVisitor,
    Node,
    TraverserDirection,
    ValidationProblem,
    ValidationProblemSeverity,
    VisitorUtil
} from "@apicurio/data-models";
import {ProblemsService} from "../../_services/problems.service";
import {DocumentService} from "../../_services/document.service";
import {AbstractBaseComponent} from "./base-component";
import {SelectionService} from "../../_services/selection.service";
import {ArrayUtils} from "apicurio-ts-core";
import {KeypressUtils} from "../../_util/keypress.util";

@Component({
    selector: "validation-aggregate",
    templateUrl: "validation-aggregate.component.html",
    styleUrls: [ "validation-aggregate.component.css" ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationAggregateComponent extends AbstractBaseComponent {

    protected _models: Node[];
    @Input()
    set models(models: Node[]) {
        if (!ArrayUtils.equals(models, this._models)) {
            this._problems = undefined;
            this._models = models;
        }
    }
    get models(): Node[] {
        return this._models;
    }
    @Input() properties: string[];
    @Input() codes: string[];
    @Input() shallow: boolean;
    @Input() debug: boolean;

    private _open: boolean = false;
    public left: string;
    public top: string;

    private _problems: ValidationProblem[] = undefined;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private problemsService: ProblemsService, private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected onDocumentChange(): void {
        this.log("Invalidating cache.");
        this._problems = undefined;
    }

    @HostListener("document:click", ["$event"])
    public onDocumentClick(event: MouseEvent): void {
        if (this._open) {
            this.close();
            event.preventDefault();
            event.stopPropagation();
        }
    }

    @HostListener("document:scroll", ["$event"])
    public onDocumentScroll(event: MouseEvent): void {
        this.onDocumentClick(event);
    }

    @HostListener("window:resize", ["$event"])
    public onWindowResize(event: MouseEvent): void {
        this.onDocumentClick(event);
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
        if (KeypressUtils.isEscapeKey(event)) {
            this.close();
        }
    }

    public hasProblems(): boolean {
        if (!this.models) {
            return false;
        }
        return this.matchingProblems().length > 0;
    }

    public matchingProblems(): ValidationProblem[] {
        if (!this.models) {
            return [];
        }

        // Find the relevant problems if not cached.
        if (this._problems === undefined) {
            this.log("Cache empty, finding matching problems.");
            let finder: ProblemFinder = new ProblemFinder(this.properties, this.codes);
            for (let model of this.models) {
                if (model !== null && model !== undefined) {
                    if (this.shallow) {
                        VisitorUtil.visitNode(model, finder);
                    } else {
                        VisitorUtil.visitTree(model, finder, TraverserDirection.down);
                    }
                }
            }
            this._problems = finder.getProblems();
        }

        return this._problems;
    }

    public iconFor(problem: ValidationProblem): string {
        switch (problem.severity) {
            case ValidationProblemSeverity.low:
                return "pficon-info";
            case ValidationProblemSeverity.medium:
                return "pficon-warning-triangle-o";
            case ValidationProblemSeverity.high:
                return "pficon-error-circle-o";
            default:
                return "";
        }
    }

    public summaryFor(problem: ValidationProblem): string {
        return this.problemsService.summary(problem);
    }

    public goTo(problem: ValidationProblem, event: MouseEvent): void {
        this.close();
        let goToPath: string = problem.nodePath.toString();
        if (problem.property) {
            goToPath += "/" + problem.property;
        }
        this.__selectionService.select(goToPath);
        // Delay the highlighting of the path so that the UI has a chance to display
        // the correct components for the new selection (see above).
        setTimeout( () => {
            this.__selectionService.highlightPath(goToPath);
        }, 50);
        event.preventDefault();
        event.stopPropagation();
    }

    protected log(message: string): void {
        if (this.debug) {
            console.info("[ValidationAggregateComponent] " + message);
        }
    }
}

export class ProblemFinder extends CombinedAllNodeVisitor {

    private problems: ValidationProblem[] = [];

    constructor(private properties: string[], private codes: string[]) {
        super();
    }

    public getProblems(): ValidationProblem[] {
        return this.problems;
    }

    visitNode(node: Node): void {
        node.getValidationProblems().forEach( problem => {
            if (this.accepts(problem)) {
                this.problems.push(problem);
            }
        });
    }

    private accepts(problem: ValidationProblem): boolean {
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
