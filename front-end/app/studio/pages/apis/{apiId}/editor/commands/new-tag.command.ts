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
import {OasDocument, Oas20Document, Oas20Operation, OasNodePath, Oas20Parameter, Oas20Tag} from "oai-ts-core";

/**
 * A command used to create a new tag.
 */
export class NewTagCommand extends AbstractCommand implements ICommand {

    private _tagName: string;
    private _tagDescription: string;
    private _created: boolean;

    /**
     * Constructor.
     */
    constructor(name: string, description?: string) {
        super();
        this._tagName = name;
        this._tagDescription = description;
    }

    /**
     * Creates a request body parameter for the operation.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[NewTagCommand] Executing.");

        this._created = false;

        let doc: Oas20Document = <Oas20Document> document;

        if (this.isNullOrUndefined(doc.tags)) {
            doc.tags = [];
        }

        let tag: Oas20Tag = this.findTag(doc, this._tagName);
        if (this.isNullOrUndefined(tag)) {
            doc.addTag(this._tagName, this._tagDescription);
            this._created = true;
        }
    }

    /**
     * Removes the previously created query param.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[NewTagCommand] Reverting.");
        if (!this._created) {
            return;
        }

        let doc: Oas20Document = <Oas20Document> document;
        let tag: Oas20Tag = this.findTag(doc, this._tagName);
        if (this.isNullOrUndefined(tag)) {
            return;
        }
        doc.tags.splice(doc.tags.indexOf(tag), 1);
    }

    /**
     * Finds a single tag by its name.  No way to do this but iterate through the
     * tags array.
     * @param doc
     * @param tagName
     * @return {any}
     */
    private findTag(doc: Oas20Document, tagName: string): Oas20Tag {
        for (let dt of doc.tags) {
            if (dt.name === tagName) {
                return dt;
            }
        }
        return null;
    }

}
