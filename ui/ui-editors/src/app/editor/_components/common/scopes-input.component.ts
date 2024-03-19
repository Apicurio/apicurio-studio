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
import {Scope} from "../../_models/scope.model";

@Component({
    selector: "scopes-input",
    templateUrl: "scopes-input.component.html",
    styleUrls: [ "scopes-input.component.css" ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScopesInputComponent extends AbstractBaseComponent {

    @Input() scopes: Scope[];

    @Output() onChange: EventEmitter<Scope[]> = new EventEmitter<Scope[]>();

    private scopeIncrement: number;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
        this.scopeIncrement = 1;
    }

    /**
     * Called when the user clicks the "Add Scope" button.
     */
    public addScope(): void {
        let scopeName: string = "scope-" + this.scopeIncrement++;
        while (this.hasScope(scopeName)) {
            scopeName = "scope-" + this.scopeIncrement++;
        }
        this.scopes.push({
            name: scopeName,
            description: ""
        });
    }

    /**
     * Called to delete a scope.
     * @param scope
     */
    public deleteScope(scope: Scope): void {
        this.scopes.splice(this.scopes.indexOf(scope), 1);
    }

    /**
     * Returns true if the given scope name is present in the list of scopes.
     * @param scopeName
     */
    private hasScope(scopeName: string): boolean {
        for (let scope of this.scopes) {
            if (scope.name === scopeName) {
                return true;
            }
        }
        return false;
    }

}
