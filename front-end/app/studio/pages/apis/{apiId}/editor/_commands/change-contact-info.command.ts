/**
 * @contact
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/contacts/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {ICommand, AbstractCommand} from "../_services/commands.manager";
import {OasDocument, Oas20Document, Oas20License, Oas20Contact} from "oai-ts-core";

/**
 * A command used to modify the contact information of a document.
 */
export class ChangeContactCommand extends AbstractCommand implements ICommand {

    private _newContact: Oas20Contact;
    private _oldContact: Oas20Contact;
    private _nullInfo: boolean;

    constructor(contact: Oas20Contact) {
        super();
        this._newContact = contact;
    }

    /**
     * Modifies the contact info.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeContactCommand] Executing.");
        this._oldContact = null;
        this._nullInfo = false;

        let doc: Oas20Document = <Oas20Document> document;
        if (doc.info === undefined || doc.info === null) {
            this._nullInfo = true;
            doc.info = doc.createInfo();
            this._oldContact = null;
        } else {
            this._oldContact = doc.info.contact;
        }
        doc.info.contact = this._newContact;
        doc.info.contact._parent = doc.info;
        doc.info.contact._ownerDocument = doc;
    }

    /**
     * Resets the contact back to the original value.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeContactCommand] Reverting.");
        let doc: Oas20Document = <Oas20Document> document;
        if (this._nullInfo) {
            doc.info = null;
        } else if (this._oldContact) {
            this._oldContact._parent = doc.info;
            this._oldContact._ownerDocument = doc;
            doc.info.contact = this._oldContact;
        }
    }

}
