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
import {LoggerService} from "../../services/logger.service";
import {EditorComponent} from "./editor.component";
import {WindowRef} from "../../services/window-ref.service";
import {ApiDefinition} from "../../editor/_models/api.model";
import {AaiEditorComponent} from "../../editor/aaieditor.component";


@Component({
    selector: "asyncapi-editor",
    templateUrl: "asyncapi-editor.component.html",
    styleUrls: ["asyncapi-editor.component.css"]
})
export class AsyncApiEditorComponent implements EditorComponent {

    // @ts-ignore
    @Input() api: ApiDefinition;

    @ViewChild("apiEditor") apiEditor: AaiEditorComponent | undefined;

    /**
     * Constructor.
     */
    constructor(private logger: LoggerService, private window: WindowRef) {
    }

    /**
     * Called whenever the API definition is changed by the user.
     */
    public documentChanged(): any {
        this.logger.info("[AsyncApiEditorComponent] Detected a document change");
        const newValue: ApiDefinition = this.apiEditor.getValue();
        const message: any = {
            type: "apicurio_onChange",
            data: {
                content: newValue.spec
            }
        };
        this.window.window.top.postMessage(message, "*");
    }

    public getValue(): string {
        const value: ApiDefinition = this.apiEditor.getValue();
        return JSON.stringify(value.spec, null, 4);
    }

}
