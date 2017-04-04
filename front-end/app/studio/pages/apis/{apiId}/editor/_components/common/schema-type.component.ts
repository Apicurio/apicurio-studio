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

import {Component, Input} from "@angular/core";
import {SimplifiedType} from "../../_models/simplified-type.model";
import {ObjectUtils} from "../../_util/object.util";

@Component({
    moduleId: module.id,
    selector: "schema-type",
    templateUrl: "schema-type.component.html"
})
export class SchemaTypeComponent {

    @Input() type: SimplifiedType;

    public displayType(): string {
        if (ObjectUtils.isNullOrUndefined(this.type) || ObjectUtils.isNullOrUndefined(this.type.type)) {
            return "No Type";
        }
        if (this.type.isArray()) {
            if (this.type.of && this.type.of.as) {
                return "Array of: " + this.type.of.type + " as " + this.type.of.as;
            }
            if (this.type.of && this.type.of.isSimpleType()) {
                return "Array of: " + this.type.of.type;
            }
            if (this.type.of && this.type.of.isRef()) {
                return "Array of: " + this.type.of.type.substr(14);
            }
        }
        if (this.type.isSimpleType()) {
            if (this.type.as) {
                return this.type.type + " as " + this.type.as;
            } else {
                return this.type.type;
            }
        }
        if (this.type.isRef()) {
            return this.type.type.substr(14);
        }
        return "Unknown Type";
    }

    public hasType(): boolean {
        return !ObjectUtils.isNullOrUndefined(this.type.type);
    }

}
