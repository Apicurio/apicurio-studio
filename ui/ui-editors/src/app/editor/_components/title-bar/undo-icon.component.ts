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
import {AbstractBaseComponent} from "../common/base-component";
import {DocumentService} from "../../_services/document.service";
import {CommandService} from "../../_services/command.service";
import {SelectionService} from "../../_services/selection.service";

@Component({
    selector: "undo-icon",
    templateUrl: "undo-icon.component.html",
    styleUrls: ["undo-icon.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UndoIconComponent extends AbstractBaseComponent {

    @Input() commandStackCount: number;
    @Output() onClick: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public isUndoable(): boolean {
        return this.commandStackCount > 0;
    }
}
