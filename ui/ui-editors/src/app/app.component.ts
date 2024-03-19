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

import {Component, ViewChild} from "@angular/core";
import {LoggerService} from "./services/logger.service";
import {ConfigService} from "./services/config.service";
import {EditingInfo} from "./models/editingInfo.model";
import {EditorComponent} from "./components/editors/editor.component";
import {ApiDefinition} from "./editor/_models/api.model";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    title = "studio-editor";
    api: ApiDefinition;

    isShowLoading: boolean = true;
    isShowEditor: boolean = false;
    isShowError: boolean = false;

    config: EditingInfo;

    @ViewChild("openapiEditor") openapiEditor: EditorComponent | undefined;
    @ViewChild("asyncapiEditor") asyncapiEditor: EditorComponent | undefined;

    constructor(private logger: LoggerService, private configService: ConfigService) {
        configService.get().then(cfg => {
            this.config = cfg;
            this.initContent();
        }).catch(error => {
            this.logger.error("Failed to get editor configuration: %o", error);
        });
    }

    private initContent(): void {
        try {
            const content: any = JSON.parse(this.config.content.value);
            this.logger.info("[AppComponent] JSON content successfully parsed.");

            this.api = new ApiDefinition();
            this.api.createdBy = "user";
            this.api.createdOn = new Date();
            this.api.tags = [];
            this.api.description = "";
            this.api.id = "api-1";
            this.api.spec = content;
            this.api.type = "OpenAPI30";
            if (content && content.swagger && content.swagger === "2.0") {
                this.api.type = "OpenAPI20";
            }

            this.isShowLoading = false;
            this.isShowEditor = true;
        } catch (error) {
            this.logger.error("Error loading HTTP content: %o", error);
        }
    }

    private editor(): EditorComponent {
        return this.config.content.type === "OPENAPI" ? this.openapiEditor : this.asyncapiEditor;
    }

}
