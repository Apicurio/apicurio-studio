/**
 * @license
 * Copyright 2018 JBoss Inc
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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation
} from "@angular/core";
import {SimplifiedType} from "oai-ts-commands";
import {Oas20SchemaDefinition, Oas30SchemaDefinition, OasDocument, OasNode, OasVisitorUtil} from "oai-ts-core";
import {ObjectUtils} from "../../../_util/object.util";
import {DropDownOption} from "../../../../../../../components/common/drop-down.component";
import {FindSchemaDefinitionsVisitor} from "../../../_visitors/schema-definitions.visitor";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {CommandService} from "../../../_services/command.service";


@Component({
    moduleId: module.id,
    selector: "schema-type-editor",
    templateUrl: "schema-type-editor.component.html",
    styleUrls: [ "schema-type-editor.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaTypeEditorComponent extends AbstractBaseComponent {
    
    @Input() document: OasDocument;
    @Input() value: SimplifiedType;
    @Input() typeLabel: string = "Type";
    @Input() validationModel: OasNode;
    @Input() validationProperty: string;
    @Input() isParameter: boolean = false;
    @Output() onChange: EventEmitter<SimplifiedType> = new EventEmitter<SimplifiedType>();

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService) {
        super(changeDetectorRef, documentService);
    }

    public hasValidationModel(): boolean {
        return this.validationModel !== null && this.validationModel !== undefined;
    }

    public type(): string {
        if (!ObjectUtils.isNullOrUndefined(this.value)) {
            if (this.value.isEnum()) {
                return "enum";
            }
            return ObjectUtils.undefinedAsNull(this.value.type);
        }
        return null;
    }

    public typeOptions(): DropDownOption[] {
        let options: DropDownOption[] = [
            { value: "array", name: "Array" },
            { value: "enum", name: "Enum" },
            { divider: true },
            { value: "string", name: "String" },
            { value: "integer", name: "Integer" },
            { value: "boolean", name: "Boolean" },
            { value: "number", name: "Number" }
        ];

        if (!this.isParameter) {
            let refPrefix: string = "#/components/schemas/";
            if (this.document.is2xDocument()) {
                refPrefix = "#/definitions/";
            }

            let viz: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(null);
            OasVisitorUtil.visitTree(this.document, viz);
            let defs: (Oas20SchemaDefinition | Oas30SchemaDefinition)[] = viz.getSortedSchemaDefinitions();
            if (defs.length > 0) {
                options.push({divider: true});
                defs.forEach(def => {
                    let defName: string = (def.ownerDocument().is2xDocument()) ? (def as Oas20SchemaDefinition).definitionName() : (def as Oas30SchemaDefinition).name();
                    options.push({
                        value: refPrefix + defName,
                        name: defName
                    });
                });
            }
        }

        return options;
    }

    public typeOf(): string {
        if (this.value && this.value.of) {
            return ObjectUtils.undefinedAsNull(this.value.of.type);
        }
        return null;
    }

    public typeOfOptions(): DropDownOption[] {
        let options: DropDownOption[] = [
            { value: "string", name: "String" },
            { value: "integer", name: "Integer" },
            { value: "boolean", name: "Boolean" },
            { value: "number", name: "Number" }
        ];

        if (!this.isParameter) {
            let refPrefix: string = "#/components/schemas/";
            if (this.document.is2xDocument()) {
                refPrefix = "#/definitions/";
            }

            let viz: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(null);
            OasVisitorUtil.visitTree(this.document, viz);
            let defs: (Oas20SchemaDefinition | Oas30SchemaDefinition)[] = viz.getSortedSchemaDefinitions();
            if (defs.length > 0) {
                options.push({divider: true});
                defs.forEach(def => {
                    let defName: string = (def.ownerDocument().is2xDocument()) ? (def as Oas20SchemaDefinition).definitionName() : (def as Oas30SchemaDefinition).name();
                    options.push({
                        value: refPrefix + defName,
                        name: defName
                    });
                });
            }
        }

        return options;
    }

    public typeAs(): string {
        if (ObjectUtils.isNullOrUndefined(this.value)) {
            return null;
        }
        if (this.value.isArray() && this.value.of && this.value.of.isSimpleType()) {
            return ObjectUtils.undefinedAsNull(this.value.of.as);
        }
        if (this.value.isSimpleType()) {
            return ObjectUtils.undefinedAsNull(this.value.as);
        }
        return null;
    }

    public typeAsOptions(): DropDownOption[] {
        let options: DropDownOption[];
        let st: SimplifiedType = this.value;
        if (this.value && this.value.isArray() && this.value.of && this.value.of.isSimpleType()) {
            st = this.value.of;
        }
        if (st.type === "string") {
            options = [
                { value: null, name: "String" },
                { value: "byte", name: "Byte" },
                { value: "binary", name: "Binary" },
                { value: "date", name: "Date" },
                { value: "date-time", name: "DateTime" },
                { value: "password", name: "Password" }
            ];
        } else if (st.type === "integer") {
            options = [
                { value: null, name: "Integer" },
                { value: "int32", name: "32-Bit Integer" },
                { value: "int64", name: "64-Bit Integer" }
            ];
        } else if (st.type === "number") {
            options = [
                { value: null, name: "Number" },
                { value: "float", name: "Float" },
                { value: "double", name: "Double" }
            ];
        }
        return options;
    }

    public shouldShowFormattedAs(): boolean {
        let st: SimplifiedType = this.value;
        if (this.value && this.value.isArray() && this.value.of && this.value.of.isSimpleType()) {
            st = this.value.of;
        }
        return st && st.isSimpleType() && (st.type !== "boolean");
    }

    public shouldShowEnumEditor(): boolean {
        return this.value && this.value.isEnum();
    }

    public changeType(type: string): void {
        let nt: SimplifiedType = new SimplifiedType();
        if (type === "enum") {
            nt.type = null;
            nt.enum = [];
            nt.of = null;
            nt.as = null;
        } else {
            nt.type = type;
            nt.enum = null;
            nt.of = null;
            nt.as = null;
        }
        this.onChange.emit(nt);
    }

    public changeTypeEnum(value: string[]): void {
        let nt: SimplifiedType = new SimplifiedType();
        nt.type = null;
        nt.enum = value;
        nt.of = null;
        nt.as = null;
        this.onChange.emit(nt);
    }

    public changeTypeOf(typeOf: string): void {
        let nt: SimplifiedType = new SimplifiedType();
        nt.type = this.value.type;
        nt.of = new SimplifiedType();
        nt.of.type = typeOf;
        nt.as = null;
        this.onChange.emit(nt);
    }

    public changeTypeAs(typeAs: string): void {
        let nt: SimplifiedType = new SimplifiedType();
        nt.type = this.value.type;
        nt.enum = null;
        if (nt.isSimpleType()) {
            nt.of = null;
            nt.as = typeAs;
        }
        if (nt.isArray()) {
            nt.of = new SimplifiedType();
            nt.of.as = typeAs;
            if (this.value.of) {
                nt.of.type = this.value.of.type;
            }
        }
        this.onChange.emit(nt);
    }

    public isArray(): boolean {
        return this.value && this.value.type === "array";
    }
}
