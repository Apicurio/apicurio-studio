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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from "@angular/core";
import {AbstractBaseComponent} from "./base-component";
import {DocumentService} from "../../_services/document.service";
import {CommandService} from "../../_services/command.service";
import {SelectionService} from "../../_services/selection.service";


@Component({
    selector: "[path-item]",
    templateUrl: "path-item.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PathItemComponent extends AbstractBaseComponent {

    @Input() path: string;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public pathSegments(): string[] {
        let segments: string[] = [];
        this.path.split("{").forEach( (segment, idx) => {
            let endBraceIdx: number = segment.indexOf("}");
            if (idx === 0) {
                segments.push(segment);
            } else if (endBraceIdx === -1) {
                segments.push("{" + segment);
            } else if (endBraceIdx === (segment.length - 1)) {
                segments.push("{" + segment);
            } else {
                segments.push("{" + segment.substring(0, endBraceIdx + 1));
                segments.push(segment.substring(endBraceIdx + 1));
            }
        });
        return segments;
    }

}
