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
import {
    Node,
    Oas20SchemaDefinition,
    Oas30SchemaDefinition,
    OasDocument,
    SimplifiedType,
    TraverserDirection,
    VisitorUtil
} from "apicurio-data-models";
import {
    DIVIDER,
    DropDownOption,
    DropDownOptionValue as Value
} from "../../../../../../../components/common/drop-down.component";
import {FindSchemaDefinitionsVisitor} from "../../../_visitors/schema-definitions.visitor";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {CommandService} from "../../../_services/command.service";
import {SelectionService} from "../../../_services/selection.service";
import {ObjectUtils} from "apicurio-ts-core";


/**
 * Component to select a "SimplifiedType" value
 */
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
    @Input() validationModel: Node;
    @Input() validationProperty: string;

    /**
     * Is the component being used in "data type" definition?
     * i.e. should the dropdown contain references to data type schemas?
     */
    @Input() isParameter: boolean = false;

    /**
     * Emit the value when it is updated
     */
    @Output() onChange: EventEmitter<SimplifiedType> = new EventEmitter<SimplifiedType>();

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
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

    /**
     * Main options
     */
    public typeOptions(): DropDownOption[] {
        let options: DropDownOption[] = [
            new Value("Array", "array"),
            new Value("Enum", "enum"),
            DIVIDER,
            new Value("String", "string"),
            new Value("Integer", "integer"),
            new Value("Boolean", "boolean"),
            new Value("Number", "number")
        ];

        /**
         * Add schema definitions to the dropdown menu
         */
        if (!this.isParameter) {
            options = [...options, ...this.getSchemaDefinitionsOptions()]
        } else if(this.document.is2xDocument()) {
            options = [...options, DIVIDER, new Value("File", "file")]
        }

        return options;
    }

    public typeOf(): string {
        if (this.value && this.value.of) {
            return ObjectUtils.undefinedAsNull(this.value.of.type);
        }
        return null;
    }

    /**
     * Additional options when e.g. an array is selected,
     * to choose the type of the array elements
     */
    public typeOfOptions(): DropDownOption[] {
        let options: DropDownOption[] = [
            new Value("String", "string"),
            new Value("Integer", "integer"),
            new Value("Boolean", "boolean"),
            new Value("Number", "number")
        ];

        if (!this.isParameter) {
            options = [...options, ...this.getSchemaDefinitionsOptions()]
        }
        return options;
    }

    /**
     * Get additional options, when reference to "schema definition data type"
     * can be used
     */
    private getSchemaDefinitionsOptions(): DropDownOption[] {
        let options: DropDownOption[] = [];
        let refPrefix: string = "#/components/schemas/";
        if (this.document.is2xDocument()) {
            refPrefix = "#/definitions/";
        }

        let viz: FindSchemaDefinitionsVisitor = new FindSchemaDefinitionsVisitor(null);
        VisitorUtil.visitTree(this.document, viz, TraverserDirection.down);
        let defs: (Oas20SchemaDefinition | Oas30SchemaDefinition)[] = viz.getSortedSchemaDefinitions();
        if (defs.length > 0) {
            options.push(DIVIDER);
            defs.forEach(def => {
                let defName: string = def.getName();
                options.push(new Value(defName, refPrefix + defName));
            });
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
        if (this.value.isFileType()) {
            return ObjectUtils.undefinedAsNull(this.value);
        }
        return null;
    }

    /**
     * Specify a "sub-type" for some of the selected types,
     * e.g. int64 for an Integer
     */
    public typeAsOptions(): DropDownOption[] {
        let options: DropDownOption[];
        let st: SimplifiedType = this.value;
        if (this.value && this.value.isArray() && this.value.of && this.value.of.isSimpleType()) {
            st = this.value.of;
        }
        if (st.type === "string") {
            options = [
                new Value("String", null),
                new Value("Byte", "byte"),
                new Value("Binary", "binary"),
                new Value("Date", "date"),
                new Value("DateTime", "date-time"),
                new Value("Password", "password")
            ];
        } else if (st.type === "integer") {
            options = [
                new Value("Integer", null),
                new Value("32-Bit Integer", "int32"),
                new Value("64-Bit Integer", "int64")
            ];
        } else if (st.type === "number") {
            options = [
                new Value("Number", null),
                new Value("Float", "float"),
                new Value("Double", "double")
            ];
        }
        return options;
    }

    public shouldShowFormattedAs(): boolean {
        let st: SimplifiedType = this.value;
        if (this.value && this.value.isArray() && this.value.of && this.value.of.isSimpleType()) {
            st = this.value.of;
        }
        return st && st.isSimpleType() && !st.isEnum() && (st.type !== "boolean");
    }

    public shouldShowEnumEditor(): boolean {
        return this.value && this.value.isEnum();
    }

    public changeType(type: string): void {
        let nt: SimplifiedType = new SimplifiedType();
        if (type === "enum") {
            nt.type = "string";
            nt.enum_ = [];
            nt.of = null;
            nt.as = null;
        } else {
            nt.type = type;
            nt.enum_ = null;
            nt.of = null;
            nt.as = null;
        }
        this.onChange.emit(nt);
    }

    public changeTypeEnum(value: string[]): void {
        let nt: SimplifiedType = new SimplifiedType();
        nt.type = this.value.type;
        if (!nt.type) {
            nt.type = "string";
        }
        nt.enum_ = value;
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
        nt.enum_ = null;
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
