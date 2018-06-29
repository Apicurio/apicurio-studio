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

import {Component, Input, ViewEncapsulation} from "@angular/core";
import {OasDocument} from "oai-ts-core";


@Component({
    moduleId: module.id,
    selector: "main-form",
    templateUrl: "main-form.component.html",
    encapsulation: ViewEncapsulation.None
})
export class MainFormComponent {

    @Input() document: OasDocument;

    /**
     * Returns true if the form is for an OpenAPI 3.x document.
     * @return
     */
    public is3xForm(): boolean {
        return this.document.is3xDocument();
    }
}
