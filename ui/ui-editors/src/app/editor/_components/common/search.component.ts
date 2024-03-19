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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from "@angular/core";
import {AbstractBaseComponent} from "./base-component";
import {DocumentService} from "../../_services/document.service";
import {SelectionService} from "../../_services/selection.service";
import {Debouncer} from "apicurio-ts-core";

@Component({
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
    valueDebouncer: Debouncer<string> = new Debouncer<string>({ period: 200 }, value => {
        this.onSearch.emit(value);
    });

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param selectionService
     */
    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public changeValue(newValue: string): void {
        this.valueDebouncer.emit(newValue);
    }

    public clear(): void {
        this.value = null;
        this.onSearch.emit(null);
    }

    public hasValue(): boolean {
        return this.value && this.value.length > 0;
    }
}
