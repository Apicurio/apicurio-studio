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
import {OasValidationError} from "oai-ts-core";

@Component({
    moduleId: module.id,
    selector: "validation-icon",
    templateUrl: "validation-icon.component.html"
})
export class ValidationIconComponent {

    @Input() validationErrors: OasValidationError[] = [];
    @Output() onClick: EventEmitter<boolean> = new EventEmitter<boolean>();

    public message(): string {
        if (this.hasErrors()) {
            return "Found " + this.numErrors() + " validation problems."
        } else {
            return "No validation errors/warnings found.";
        }
    }

    public hasErrors(): boolean {
        return this.validationErrors.length > 0;
    }

    public numErrors(): number {
        return this.validationErrors.length;
    }

}
