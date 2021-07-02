/**
 * @license
 * Copyright 2019 JBoss Inc
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
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from "@angular/core";
import * as marked from "./markdown-summary.component";


@Component({
    selector: "tag-list",
    templateUrl: "tag-list.component.html",
    styleUrls: ["tag-list.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class TagListComponent implements OnChanges {

    @Input() tags: string[];
    @Input() maxWidth: number = 80;
    @Output() public tagSelected = new EventEmitter<string>();

    visibleTags: string[];
    overflowTags: string[];
    showMore: boolean = false;

    /**
     * Constructor.
     */
    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["tags"] || changes["maxWidth"]) {
            this.visibleTags = [];
            this.overflowTags = [];
            if (this.tags) {
                let totalSize: number = 0;
                this.tags.forEach( tag => {
                    if (totalSize < this.maxWidth) {
                        this.visibleTags.push(tag);
                        totalSize += tag.length;
                    } else {
                        this.overflowTags.push(tag);
                    }
                });
            }
        }
    }

    public hasOverflow(): boolean {
        return this.overflowTags && this.overflowTags.length > 0;
    }

    public fireTagSelected(tag: string, event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();
        this.showMore = false;
        this.tagSelected.emit(tag);
    }

    @HostListener("document:click", ["$event"])
    public onDocumentClick(event: MouseEvent): void {
        this.showMore = false;
    }

    toggleAllTags(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.showMore = !this.showMore;
    }
}
