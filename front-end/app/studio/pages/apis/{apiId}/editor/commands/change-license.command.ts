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

import {ICommand, AbstractCommand} from "../commands.manager";
import {OasDocument, Oas20Document, Oas20License} from "oai-ts-core";

/**
 * A command used to modify the license information of a document.
 */
export class ChangeLicenseCommand extends AbstractCommand implements ICommand {

    private _newLicenseName: string;
    private _newLicenseUrl: string;
    private _oldLicense: Oas20License;
    private _nullInfo: boolean;

    constructor(name: string, url: string) {
        super();
        this._newLicenseName = name;
        this._newLicenseUrl = url;
    }

    /**
     * Modifies the license.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeLicenseCommand] Executing.");
        this._oldLicense = null;
        this._nullInfo = false;

        let doc: Oas20Document = <Oas20Document> document;
        if (doc.info === undefined || doc.info === null) {
            this._nullInfo = true;
            doc.info = doc.createInfo();
            this._oldLicense = null;
        } else {
            this._oldLicense = doc.info.license;
        }
        doc.info.license = doc.info.createLicense();
        doc.info.license.name = this._newLicenseName;
        doc.info.license.url = this._newLicenseUrl;
    }

    /**
     * Resets the license back to the original value.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeLicenseCommand] Reverting.");
        let doc: Oas20Document = <Oas20Document> document;
        if (this._nullInfo) {
            doc.info = null;
        } else {
            this._oldLicense._parent = doc.info;
            this._oldLicense._ownerDocument = doc;
            doc.info.license = this._oldLicense;
        }
    }

}
