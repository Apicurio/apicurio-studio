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
import {Injectable} from "@angular/core";
import {Document} from "@apicurio/data-models";
import {Topic} from "apicurio-ts-core";

/**
 * A service providing document related functionality, including the ability to
 * easily access the current document being edited and document related notifications
 * such as when it is changed.
 */
@Injectable()
export class DocumentService {

    private _document: Document;
    private _change: Topic<void>;

    constructor() {
        this.reset();
    }

    public setDocument(document: Document): void {
        this._document = document;
    }

    public currentDocument(): Document {
        return this._document;
    }

    public emitChange(): void {
        this._change.send(null);
    }

    public change(): Topic<void> {
        return this._change;
    }

    public reset(): void {
        this._document = null;
        this._change = new Topic<void>();
    }

}
