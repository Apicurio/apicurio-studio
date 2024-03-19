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
    selector: "[server-url]",
    templateUrl: "server-url.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerUrlComponent extends AbstractBaseComponent {

    @Input() url: string;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public segments(): string[] {
        let segments: string[] = [];
        let i: number = 0;
        let sep: string = '{';
        while (i < this.url.length) {
            let from: number = i;
            let to: number = this.url.indexOf(sep, from + 1);
            if (to == -1) {
                to = this.url.length;
            } else {
                if (sep === '{') {
                    sep = '}';
                } else {
                    to++;
                    sep = '{';
                }
            }
            let segment: string = this.url.substring(from, to);
            segments.push(segment);
            i = to;
        }
        return segments;
    }

}
