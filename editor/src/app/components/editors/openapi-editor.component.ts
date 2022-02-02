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

import {Component, Input, ViewChild} from "@angular/core";
import {ApiDefinition, ApiEditorComponent} from "apicurio-design-studio";
import {LoggerService} from "../../services/logger.service";
import {EditorComponent} from "./editor.component";


@Component({
    selector: "openapi-editor",
    templateUrl: "openapi-editor.component.html",
    styleUrls: ["openapi-editor.component.css"]
})
export class OpenApiEditorComponent implements EditorComponent {

    // @ts-ignore
    @Input() api: ApiDefinition;

    @ViewChild("apiEditor") apiEditor: ApiEditorComponent | undefined;

    /**
     * Constructor.
     */
    constructor(private logger: LoggerService) {
    }

    /**
     * Called whenever the API definition is changed by the user.
     */
    public documentChanged(): any {
        this.logger.info("[OpenApiEditorComponent] Detected a document change, scheduling disaster recovery persistence");
    }

    public getValue(): string {
        const value: ApiDefinition = this.apiEditor.getValue();
        return JSON.stringify(value.spec, null, 4);
    }

}
