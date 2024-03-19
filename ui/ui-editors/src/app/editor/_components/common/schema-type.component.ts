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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from "@angular/core";
import {SimplifiedType} from "@apicurio/data-models";
import {AbstractBaseComponent} from "./base-component";
import {DocumentService} from "../../_services/document.service";
import {SelectionService} from "../../_services/selection.service";
import {ObjectUtils} from "apicurio-ts-core";

@Component({
    selector: "schema-type",
    templateUrl: "schema-type.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaTypeComponent extends AbstractBaseComponent {

    @Input() type: SimplifiedType;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    public displayType(): string {
        if (ObjectUtils.isNullOrUndefined(this.type)) {
            return "No Type";
        }
        if (this.type.isRef()) {
            return this.type.type.substr(this.type.type.lastIndexOf('/') + 1);
        } else if (this.type.isArray()) {
            if (this.type.of && this.type.of.as) {
                return "Array of: " + this.type.of.type + " as " + this.type.of.as;
            }
            if (this.type.of && this.type.of.isSimpleType()) {
                return "Array of: " + this.type.of.type;
            }
            if (this.type.of && this.type.of.isRef()) {
                return "Array of: " + this.type.of.type.substr(this.type.of.type.lastIndexOf('/') + 1);
            }
            return "Array";
        } else if (this.type.isEnum()) {
            return `Enum (${ this.type.enum_.length } items)`;
        } else if (this.type.isSimpleType()) {
            if (this.type.as) {
                return this.type.type + " as " + this.type.as;
            } else {
                return this.type.type;
            }
        } else {
            return "No Type";
        }
    }

    public hasType(): boolean {
        return !ObjectUtils.isNullOrUndefined(this.type) && (this.type.isRef() || this.type.isEnum() ||
            this.type.isSimpleType() || this.type.isArray());
    }

}
