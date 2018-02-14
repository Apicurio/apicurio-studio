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
import {DropDownOption} from "../../{apiId}/editor/_components/common/drop-down.component";


@Component({
    moduleId: module.id,
    selector: "importapi-form",
    templateUrl: "import-form.component.html",
    styleUrls: ["import-form.component.css"]
})
export class ImportApiFormComponent {

    @Output() onImportApi = new EventEmitter<ImportApi>();

    importType: string;
    textMode: string = "yaml";
    model: any;
    importingApi: boolean;
    dragging: boolean;
    error: string;

    /**
     * Constructor.
     * @param apis
     */
    constructor(@Inject(IApisService) private apis: IApisService) {
        this.importType = "from-url";
        this.model = {
            url: "",
            data: ""
        };
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
        if (this.model.url) {
            importApi.url = this.model.url;
        } else if (this.model.data) {
            importApi.data = btoa(this.model.data);
        }

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
        console.info("DROP DATA: %o", event.dataTransfer);
        this.dragging = false;
        event.preventDefault();

        let files: FileList = event.dataTransfer.files;
        let dropData: string = event.dataTransfer.getData("text");
        if (files && files.length == 1) {
            let isJson: boolean = files[0].type === "application/json";
            let isYaml: boolean = files[0].name.endsWith(".yaml") || files[0].name.endsWith(".yml");
            if (isJson || isYaml) {
                let reader: FileReader = new FileReader();
                reader.onload = (fileLoadedEvent) => {
                    let content: string = fileLoadedEvent.target["result"];
                    this.model.data = content;
                    this.model.url = null;
                    this.importType = "from-text";
                    this.textMode = "json";
                    if (isYaml) {
                        this.textMode = "yaml";
                    }
                };
                reader.readAsText(files[0]);
            }
        } else if (dropData && dropData.startsWith("http")) {
            this.model.url = dropData;
            this.model.data = null;
            this.importType = "from-url";
            if (this.model.url.indexOf("github.com") > 0 || this.model.url.indexOf("gitlab.com") || this.model.url.indexOf("bitbucket.org") > 0) {
                this.importType = "from-scs";
            }
        }
    }

    public onDragEnd(event: DragEvent): void {
        this.dragging = false;
    }

    public importTypeOptions(): DropDownOption[] {
        return [
            { name: "Import From URL", value: "from-url"},
            { name: "Import From Source Control", value: "from-scs"},
            { name: "Import From File/Clipboard", value: "from-text"}
        ];
    }

    public changeImportType(value: string): void {
        this.importType = value;
        this.model.url = null;
        this.model.data = null;
    }

    public urlPlaceholder(): string {
        if (this.importType === "from-url") {
            return "https://gist.githubusercontent.com/Tim/94445d/raw/5dba00/oai-import.json";
        } else {
            return "https://github.com/ORG/REPO/blob/master/path/to/open-api-doc.json";
        }
    }
}
