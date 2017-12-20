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

import {Component, EventEmitter, Inject, Output} from "@angular/core";
import {IApisService} from "../../../../services/apis.service";
import {ImportApi} from "../../../../models/import-api.model";


@Component({
    moduleId: module.id,
    selector: "importapi-form",
    templateUrl: "import-form.component.html",
    styleUrls: ["import-form.component.css"]
})
export class ImportApiFormComponent {

    @Output() onImportApi = new EventEmitter<ImportApi>();

    model: string;
    importingApi: boolean;
    dragging: boolean;
    error: string;

    /**
     * Constructor.
     * @param apis
     */
    constructor(@Inject(IApisService) private apis: IApisService) {
        this.model = null;
        this.importingApi = false;
        this.dragging = false;
        this.error = null;
    }

    /**
     * Called when the user clicks the "Import API" submit button on the form.
     */
    public importApi(): void {
        this.error = null;

        let importApi: ImportApi = new ImportApi();
        importApi.url = this.model;

        this.importingApi = true;
        this.onImportApi.emit(importApi);
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
