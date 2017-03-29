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

import {Component, Inject, EventEmitter, Output} from "@angular/core";
import {IApisService} from "../../../../services/apis.service";
import {Api} from "../../../../models/api.model";


@Component({
    moduleId: module.id,
    selector: "addapi-form",
    templateUrl: "add-form.component.html",
    styleUrls: ["add-form.component.css"]
})
export class AddApiFormComponent {

    @Output() onAddApi = new EventEmitter<Api>();

    model: string;
    discoveringApi: boolean;
    addingApi: boolean;
    dragging: boolean;
    error: string;

    /**
     * Constructor.
     * @param apis
     */
    constructor(@Inject(IApisService) private apis: IApisService) {
        this.model = null;
        this.addingApi = false;
        this.dragging = false;
        this.error = null;
    }

    /**
     * Called when the user clicks the "Add API" submit button on the form.
     */
    public addApi(): void {
        this.error = null;
        this.discoveringApi = true;
        this.apis.discoverApi(this.model).then(api => {
            if (!api.name) {
                api.name = "Unknown API";
            }
            this.addingApi = true;
            this.onAddApi.emit(api);
        }).catch( reason => {
            this.discoveringApi = false;
            this.error = reason;
        });
        this.addingApi = true;
    }

    public onDragOver(event: DragEvent): void {
        if (!this.dragging) {
            this.dragging = true;
        }
        event.preventDefault();
    }

    public onDrop(event: DragEvent): void {
        let dropData: string = event.dataTransfer.getData("text");
        this.dragging = false;
        event.preventDefault();

        if (dropData && dropData.startsWith("http")) {
            this.model = dropData;
        }
    }

    public onDragEnd(event: DragEvent): void {
        this.dragging = false;
    }

}
