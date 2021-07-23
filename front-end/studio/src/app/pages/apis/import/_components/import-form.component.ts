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
import {ApisService} from "../../../../services/apis.service";
import {ImportApi} from "../../../../models/import-api.model";
import {DropDownOption, DropDownOptionValue as Value} from '../../../../components/common/drop-down.component';
import {CodeEditorMode, CodeEditorTheme} from "../../../../components/common/code-editor.component";
import {Base64} from "js-base64";


@Component({
    selector: "importapi-form",
    templateUrl: "import-form.component.html",
    styleUrls: ["import-form.component.css"]
})
export class ImportApiFormComponent {

    @Input() importing: boolean;
    @Output() onImportApi = new EventEmitter<ImportApi>();

    importType: string;
    textMode: CodeEditorMode = CodeEditorMode.YAML;
    textTheme: CodeEditorTheme = CodeEditorTheme.Light;
    model: any;
    dragging: boolean;
    error: string;

    /**
     * Constructor.
     * @param apis
     */
    constructor(private apis: ApisService) {
        this.importType = "from-url";
        this.model = {
            url: "",
            data: ""
        };
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
            try {
                importApi.data = Base64.encode(this.model.data);
            } catch (e) {
                console.error(e);
            }
        }

        this.onImportApi.emit(importApi);
    }

    public onDragOver(event: DragEvent): void {
        if (!this.dragging) {
            this.dragging = true;
        }
        event.preventDefault();
    }

    public onDrop(event: DragEvent): void {
        this.dragging = false;
        event.preventDefault();

        console.info("[ImportApiFormComponent] Processing dropped content.");
        let files: FileList = event.dataTransfer.files;
        let dropData: string = event.dataTransfer.getData("text");
        if (files && files.length == 1) {
            console.info("[ImportApiFormComponent] File was dropped.");
            let isJson: boolean = files[0].type === "application/json";
            let isYaml: boolean = files[0].name.endsWith(".yaml") || files[0].name.endsWith(".yml");
            if (isJson || isYaml) {
                console.info("[ImportApiFormComponent] JSON/YAML file detected, reading now.");
                let reader: FileReader = new FileReader();
                reader.onload = (fileLoadedEvent) => {
                    console.info("[ImportApiFormComponent] JSON/YAML file read.");
                    let content = fileLoadedEvent.target["result"] as string; // guaranteed to be string as `readAsText` is used bellow
                    this.model.data = content;
                    this.model.url = null;
                    this.importType = "from-text";
                    this.textMode = CodeEditorMode.JSON;
                    if (isYaml) {
                        this.textMode = CodeEditorMode.YAML;
                    }
                    console.info("[ImportApiFormComponent] File read complete!");
                };
                reader.readAsText(files[0]);
            } else {
                console.info("[ImportApiFormComponent] *** Dropped file was not JSON or YAML. ***");
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
            new Value("Import From URL", "from-url"),
            new Value("Import From Source Control", "from-scs"),
            new Value("Import From File/Clipboard", "from-text")
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
