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
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {OasDocument} from "oai-ts-core";

/**
 * A service providing document related functionality, including the ability to
 * easily access the current document being edited and document related notifications
 * such as when it is changed.
 */
@Injectable()
export class DocumentService {

    private _currentDocument: OasDocument;
    private _documentSubject: BehaviorSubject<OasDocument>;
    private _document: Observable<OasDocument>;

    private _changeSubject: BehaviorSubject<void>;
    private _change: Observable<void>;

    constructor() {
        this.reset();
    }

    public emitDocument(document: OasDocument): void {
        this._currentDocument = document;
        this._documentSubject.next(document);
    }

    public document(): Observable<OasDocument> {
        return this._document;
    }

    public currentDocument(): OasDocument {
        return this._currentDocument;
    }

    public emitChange(): void {
        this._changeSubject.next(null);
    }

    public change(): Observable<void> {
        return this._change;
    }

    public reset(): void {
        this._currentDocument = null;
        this._documentSubject = new BehaviorSubject(null);
        this._document = this._documentSubject.asObservable();

        this._changeSubject = new BehaviorSubject(null);
        this._change = this._changeSubject.asObservable();
    }

}
