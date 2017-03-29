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

import {ICommand, AbstractCommand} from "../_services/commands.manager";
import {OasDocument, Oas20Document} from "oai-ts-core";

/**
 * A command used to modify the description of a document.
 */
export class ChangeDescriptionCommand extends AbstractCommand implements ICommand {

    private _newDescription: string;
    private _oldDescription: string;
    private _nullInfo: boolean;

    constructor(newDescription: string) {
        super();
        this._newDescription = newDescription;
    }

    /**
     * Modifies the description of the document.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeDescriptionCommand] Executing.");
        let doc: Oas20Document = <Oas20Document> document;
        if (doc.info === undefined || doc.info === null) {
            doc.info = doc.createInfo();
            this._nullInfo = true;
            this._oldDescription = null;
        } else {
            this._oldDescription = doc.info.description;
        }
        doc.info.description = this._newDescription;
    }

    /**
     * Resets the description back to a previous version.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeDescriptionCommand] Reverting.");
        let doc: Oas20Document = <Oas20Document> document;
        if (this._nullInfo) {
            doc.info = null;
        } else {
            doc.info.description = this._oldDescription;
        }
    }

}
