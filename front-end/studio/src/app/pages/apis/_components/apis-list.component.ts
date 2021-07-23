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

import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Api} from "../../../models/api.model";


@Component({
    selector: "apis-list",
    templateUrl: "apis-list.component.html",
    styleUrls: ["apis-list.component.css"]
})
export class ApisListComponent {

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

    public isAsyncApi20(api: Api): boolean {
        return api.type === "AsyncAPI20";
    }

    public isGraphQL(api: Api): boolean {
        return api.type === "GraphQL";
    }

    public apiIconTitle(api: Api): string {
        if (api.type === "OpenAPI20") {
            return "OpenAPI 2.0";
        } else if (api.type === "OpenAPI30") {
            return "OpenAPI 3.0.x";
        } else if (api.type === "AsyncAPI20") {
            return "AsyncAPI 2.0.x";
        } else if (api.type === "GraphQL") {
            return "GraphQL";
        }
    }

}
