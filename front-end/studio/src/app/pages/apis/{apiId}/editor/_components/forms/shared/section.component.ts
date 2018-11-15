/**
 * @license
 * Copyright 2018 JBoss Inc
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

import {OasNode} from "oai-ts-core";
import {Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation} from "@angular/core";


@Component({
    moduleId: module.id,
    selector: "section",
    templateUrl: "section.component.html",
    styleUrls: ["section.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class SectionComponent implements OnInit, OnDestroy, OnChanges {

    private static allVisibleSections: SectionComponent[] = [];

    @Input() type: string;
    @Input() label: string;
    @Input() expanded: boolean = true;
    @Input() counterItems: any[];
    @Input() contextHelp: string;

    @Input() validationModels: OasNode[];
    @Input() validationShallow: boolean;
    @Input() validationProperties: string[];

    @Input() inForm: boolean = true;

    ngOnInit(): void {
        if (this.inForm) {
            SectionComponent.allVisibleSections.push(this);
        }
    }

    ngOnDestroy(): void {
        let idx: number = SectionComponent.allVisibleSections.indexOf(this);
        if (idx !== -1) {
            SectionComponent.allVisibleSections.splice(idx, 1);
        }
    }

    ngOnChanges(): void {
    }

    public hasCounter(): boolean {
        return this.counterItems !== null && this.counterItems !== undefined;
    }

    public hasValidationAggregate(): boolean {
        return this.validationModels !== null && this.validationModels !== undefined;
    }

    public toggleExpansion(): void {
        this.expanded = !this.expanded;
    }

    public onDoubleClick(event: MouseEvent): void {
        if (this.inForm) {
            this.expanded = true;
            let me: SectionComponent = this;
            SectionComponent.allVisibleSections.forEach( section => {
                if (section !== me) {
                    section.collapse();
                }
            });
            event.preventDefault();
            event.stopPropagation();
        }
    }

    public collapse(): void {
        this.expanded = false;
    }

}
