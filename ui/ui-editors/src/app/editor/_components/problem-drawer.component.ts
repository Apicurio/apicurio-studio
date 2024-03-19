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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation
} from "@angular/core";
import {ValidationProblem, ValidationProblemSeverity} from "@apicurio/data-models";
import {SelectionService} from "../_services/selection.service";
import {ProblemsService} from "../_services/problems.service";
import {AbstractBaseComponent} from "./common/base-component";
import {DocumentService} from "../_services/document.service";
import {FeaturesService} from "../_services/features.service";


/**
 * The component that models the list of problems found in the document.  This is only shown
 * when the user clicks the bell icon to drop down the list of problems.
 */
@Component({
    selector: "problem-drawer",
    templateUrl: "problem-drawer.component.html",
    styleUrls: [ "problem-drawer.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorProblemDrawerComponent extends AbstractBaseComponent {

    @Input() validationErrors: ValidationProblem[];
    @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onConfigureValidation: EventEmitter<void> = new EventEmitter<void>();

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param selectionService
     * @param problemsService
     * @param features
     */
    constructor(changeDetectorRef: ChangeDetectorRef, documentService: DocumentService,
                selectionService: SelectionService, private problemsService: ProblemsService,
                private features: FeaturesService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public hasProblems(): boolean {
        return this.validationErrors && this.validationErrors.length > 0;
    }

    public goTo(problem: ValidationProblem): void {
        this.close.emit(true);
        let goToPath: string = problem.nodePath.toString();
        if (problem.property) {
            goToPath += "/" + problem.property;
        }
        this.__selectionService.select(goToPath);
        // Delay the highlighting of the path so that the UI has a chance to display
        // the correct components for the new selection (see above).
        setTimeout(() => {
            this.__selectionService.highlightPath(goToPath);
        }, 50);
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
                return "pficon-info";
        }
    }

    public summaryFor(problem: ValidationProblem): string {
        return this.problemsService.summary(problem);
    }

    public explanationFor(problem: ValidationProblem): string {
        return this.problemsService.explanation(problem);
    }

    public showValidationSettings(): boolean {
        return this.features.getFeatures().validationSettings;
    }

}
