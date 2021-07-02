/**
 * @license
 * Copyright 2018 Red Hat
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
import { ChangeDetectorRef, OnChanges, OnDestroy, OnInit, SimpleChanges, Directive } from "@angular/core";
import {DocumentService} from "../../_services/document.service";
import {SelectionService} from "../../_services/selection.service";
import {TopicSubscription} from "apicurio-ts-core";

@Directive()
export abstract class AbstractBaseComponent implements OnInit, OnChanges, OnDestroy {

    private _docSub: TopicSubscription<void>;

    protected constructor(protected __changeDetectorRef: ChangeDetectorRef, protected __documentService: DocumentService,
                          protected __selectionService: SelectionService, protected __skipDocumentChanges: boolean = false) {}

    ngOnChanges(changes: SimpleChanges): void {
        // Nothing to do at the base component level (yet?)
    }

    ngOnInit(): void {
        if (this.__skipDocumentChanges) {
            this._docSub = null;
        } else {
            this._docSub = this.__documentService.change().subscribe(() => {
                this.__changeDetectorRef.markForCheck();
                this.onDocumentChange();
            });
        }
    }

    ngOnDestroy(): void {
        if (this._docSub) {
            this._docSub.unsubscribe();
        }
    }

    protected onDocumentChange(): void {
        // Children should override this when necessary.
    }

}
