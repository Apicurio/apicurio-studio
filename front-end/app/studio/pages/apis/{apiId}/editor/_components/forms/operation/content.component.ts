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

import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from "@angular/core";
import {Oas30Document, Oas30MediaType, Oas30RequestBodyContent, Oas30ResponseContent} from "oai-ts-core";
import {SimplifiedType} from "oai-ts-commands";
import {DropDownOption} from "../../common/drop-down.component";
import {ObjectUtils} from "../../../_util/object.util";

export interface MediaTypeChangeEvent {
    name: string;
    type: SimplifiedType;
}


@Component({
    moduleId: module.id,
    selector: "content",
    templateUrl: "content.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ContentComponent implements OnInit {

    @Input() content: Oas30ResponseContent | Oas30RequestBodyContent;
    @Input() document: Oas30Document;

    @Output() onNewMediaType: EventEmitter<string> = new EventEmitter<string>();
    @Output() onRemoveMediaType: EventEmitter<string> = new EventEmitter<string>();
    @Output() onMediaTypeChange: EventEmitter<MediaTypeChangeEvent> = new EventEmitter<MediaTypeChangeEvent>();

    protected mediaTypeName: string;

    /**
     * Called when the page is initialized.
     */
    public ngOnInit(): void {
        this.selectDefaultMediaType();
    }

    public selectDefaultMediaType(): void {
        this.mediaTypeName = null;
        if (this.content) {
            for (let key in this.content) {
                this.mediaTypeName = key;
                break;
            }
        }
    }

    public hasMediaTypes(): boolean {
        if (this.content) {
            return Object.keys(this.content).length > 0;
        }
        return false;
    }

    public mediaTypeNames(): string[] {
        if (this.content) {
            return Object.keys(this.content);
        }
        return [];
    }

    public selectMediaType(typeName: string): void {
        this.mediaTypeName = typeName;
    }

    public mediaType(): Oas30MediaType {
        return this.content[this.mediaTypeName];
    }

    public mediaTypeType(): string {
        let mt: Oas30MediaType = this.mediaType();
        if (mt) {
            return SimplifiedType.fromSchema(mt.schema).type;
        }
        return null;
    }

    public mediaTypeTypeOf(): string {
        let mt: Oas30MediaType = this.mediaType();
        if (mt) {
            let st: SimplifiedType = SimplifiedType.fromSchema(mt.schema);
            if (st.of) {
                return st.of.type;
            }
        }
        return null;
    }

    public mediaTypeTypeAs(): string {
        let mt: Oas30MediaType = this.mediaType();
        if (mt) {
            let st: SimplifiedType = SimplifiedType.fromSchema(mt.schema);
            if (st.isArray() && st.of) {
                return st.of.as;
            }
            if (st.isSimpleType()) {
                return st.as;
            }
        }
        return null;
    }

    public mediaTypeTypeOptions(): DropDownOption[] {
        let options: DropDownOption[] = [
            { value: "array", name: "Array" },
            { divider: true },
            { value: "string", name: "String" },
            { value: "integer", name: "Integer" },
            { value: "boolean", name: "Boolean" },
            { value: "number", name: "Number" }
        ];

        if (this.document.components) {
            let co: DropDownOption[] = this.document.components.getSchemaDefinitions().sort( (def1, def2) => {
                return def1.name().toLocaleLowerCase().localeCompare(def2.name().toLocaleLowerCase());
            }).map( def => {
                return {
                    value: "#/components/schemas/" + def.name(),
                    name: def.name()
                };
            });
            if (co && co.length > 0) {
                options.push({ divider: true });
                co.forEach( o => options.push(o) );
            }
        }

        return options;
    }

    public mediaTypeTypeOfOptions(): DropDownOption[] {
        let options: DropDownOption[] = [
            { value: "string", name: "String" },
            { value: "integer", name: "Integer" },
            { value: "boolean", name: "Boolean" },
            { value: "number", name: "Number" }
        ];

        if (this.document.components) {
            let co: DropDownOption[] = this.document.components.getSchemaDefinitions().sort( (def1, def2) => {
                return def1.name().toLocaleLowerCase().localeCompare(def2.name().toLocaleLowerCase());
            }).map( def => {
                return {
                    value: "#/components/schemas/" + def.name(),
                    name: def.name()
                };
            });
            if (co && co.length > 0) {
                options.push({ divider: true });
                co.forEach( o => options.push(o) );
            }
        }

        return options;
    }

    public mediaTypeTypeAsOptions(): DropDownOption[] {
        let mt: Oas30MediaType = this.mediaType();
        if (ObjectUtils.isNullOrUndefined(mt)) {
            return [];
        }
        if (ObjectUtils.isNullOrUndefined(mt.schema)) {
            return [];
        }

        let options: DropDownOption[] = [];
        let st: SimplifiedType = SimplifiedType.fromSchema(mt.schema);
        if (st.isArray() && st.of && st.of.isSimpleType()) {
            st = st.of;
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

    public changeMediaTypeType(newType: string): void {
        let nt: SimplifiedType = new SimplifiedType();
        nt.type = newType;

        this.onMediaTypeChange.emit({
            name: this.mediaTypeName,
            type: nt
        });
    }

    public changeMediaTypeTypeOf(newOf: string): void {
        let mt: Oas30MediaType = this.mediaType();
        let newType: SimplifiedType = SimplifiedType.fromSchema(mt.schema);
        newType.of = new SimplifiedType();
        newType.of.type = newOf;
        newType.as = null;

        this.onMediaTypeChange.emit({
            name: this.mediaTypeName,
            type: newType
        });
    }

    public changeMediaTypeTypeAs(newAs: string): void {
        let mt: Oas30MediaType = this.mediaType();
        let newType: SimplifiedType = SimplifiedType.fromSchema(mt.schema);
        if (newType.isSimpleType()) {
            newType.as = newAs;
        }
        if (newType.isArray() && newType.of) {
            newType.of.as = newAs;
        }

        this.onMediaTypeChange.emit({
            name: this.mediaTypeName,
            type: newType
        });
    }

    public shouldShowMediaTypeTypeOf(): boolean {
        let mt: Oas30MediaType = this.mediaType();
        if (!mt) {
            return false;
        }
        let nt: SimplifiedType = SimplifiedType.fromSchema(mt.schema);
        return nt.isArray();
    }

    public shouldShowMediaTypeTypeAs(): boolean {
        let mt: Oas30MediaType = this.mediaType();
        if (!mt) {
            return false;
        }
        let nt: SimplifiedType = SimplifiedType.fromSchema(mt.schema);
        return (nt.isSimpleType() && nt.type !== "boolean") ||
            (nt.isArray() && nt.of && nt.of.isSimpleType() && nt.of.type !== "boolean");
    }

    public addMediaType(mediaType: string): void {
        this.onNewMediaType.emit(mediaType);
        this.mediaTypeName = mediaType;
    }

    public removeMediaType(mtName: string): void {
        this.onRemoveMediaType.emit(mtName);
        if (mtName === this.mediaTypeName) {
            this.selectDefaultMediaType();
        }
    }

    public deleteAllMediaTypes(): void {
        // TODO fire a separate "delete all" command so that we delete all media types in a single undoable command
        this.mediaTypeNames().forEach( mtName => {
            this.onRemoveMediaType.emit(mtName);
        });
    }

}
