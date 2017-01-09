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

import {Component, EventEmitter, Output, Input} from '@angular/core';
import {ApiDefinition} from "../../../../models/api.model";
import {Oas20Document, OasLibraryUtils} from "oai-ts-core";


@Component({
    moduleId: module.id,
    selector: 'api-editor',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.css']
})
export class ApiEditorComponent {

    @Input() api: ApiDefinition;
    @Output() onDirty: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onSave: EventEmitter<any> = new EventEmitter<any>();

    private _library: OasLibraryUtils = new OasLibraryUtils();
    private _document: Oas20Document = null;

    theme: string = "light";

    /**
     * Constructor.
     */
    constructor() {}

    /**
     * Gets the OpenAPI spec as a document.
     */
    public document(): Oas20Document {
        if (this._document === null) {
            this._document = <Oas20Document>this._library.createDocument(this.api.spec);
        }
        return this._document;
    }

}
