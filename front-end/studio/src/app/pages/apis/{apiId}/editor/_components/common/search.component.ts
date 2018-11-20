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

import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {AbstractBaseComponent} from "./base-component";
import {DocumentService} from "../../_services/document.service";
import {CommandService} from "../../_services/command.service";
import {SelectionService} from "../../_services/selection.service";

@Component({
    moduleId: module.id,
    selector: "search",
    templateUrl: "search.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent extends AbstractBaseComponent {

    @Input() initialValue: string;
    @Input() placeholder: string;
    @Input() searchId: string;

    @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();

    value: string;
    private _valueObs: BehaviorSubject<string> = new BehaviorSubject(null);

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
        this._valueObs.debounceTime(200).subscribe( value => {
            this.onSearch.emit(value);
        });
    }

    public changeValue(newValue: string): void {
        this.value = newValue;
        this._valueObs.next(newValue);
    }

    public clear(): void {
        this.value = null;
        this.onSearch.emit(null);
    }

    public hasValue(): boolean {
        return this.value && this.value.length > 0;
    }
}
