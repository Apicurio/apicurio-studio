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

import {Component, EventEmitter, Output, Input} from "@angular/core";
import {Api} from "../../../models/api.model";


@Component({
    moduleId: module.id,
    selector: "apis-cards",
    templateUrl: "apis-cards.component.html",
    styleUrls: ["apis-cards.component.css"]
})
export class ApisCardsComponent {

    @Input() apis: Api[];
    @Input() selectedApis: Api[];
    @Output() onApiSelected: EventEmitter<Api> = new EventEmitter<Api>();
    @Output() onApiDeselected: EventEmitter<Api> = new EventEmitter<Api>();
    @Output() onTagSelected: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Constructor.
     */
    constructor() {}

    public toggleApiSelected(api: Api): void {
        if (this.isSelected(api)) {
            this.onApiDeselected.emit(api);
        } else {
            this.onApiSelected.emit(api);
        }
    }

    public isSelected(api: Api): boolean {
        return this.selectedApis.indexOf(api) != -1;
    }

    public selectTag(tag: string): void {
        this.onTagSelected.emit(tag);
    }

    public isOpenApi20(api: Api): boolean {
        return api.type === "OpenAPI20";
    }

    public isOpenApi30(api: Api): boolean {
        return api.type === "OpenAPI30";
    }

}
