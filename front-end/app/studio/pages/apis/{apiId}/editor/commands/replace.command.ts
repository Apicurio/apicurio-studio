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
import {
    OasDocument, Oas20Document, Oas20PathItem, OasNode, OasNodePath, Oas20Paths, Oas20Operation,
    Oas20Parameter, Oas20Response, Oas20Responses, Oas20Definitions, Oas20DefinitionSchema
} from "oai-ts-core";


/**
 * A command used to replace a definition schema with a newer version.
 */
export class ReplaceDefinitionSchemaCommand extends AbstractCommand implements ICommand {

    private _newDefinition: Oas20DefinitionSchema;
    private _oldDefinition: Oas20DefinitionSchema;

    constructor(definition: Oas20DefinitionSchema) {
        super();
        this._newDefinition = definition;
    }

    /**
     * Replaces the definition.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ReplaceDefinitionSchemaCommand] Executing.");
        this._oldDefinition = null;
        let doc: Oas20Document  = <Oas20Document>document;
        let definitions: Oas20Definitions = doc.definitions;
        if (this.isNullOrUndefined(definitions)) {
            return;
        }

        this._oldDefinition = definitions.removeDefinition(this._newDefinition.definitionName());
        definitions.addDefinition(this._newDefinition.definitionName(), this._newDefinition);
    }

    /**
     * Switch back!
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ReplaceDefinitionSchemaCommand] Reverting.");
        let doc: Oas20Document  = <Oas20Document>document;
        let definitions: Oas20Definitions = doc.definitions;
        if (this.isNullOrUndefined(definitions) || this.isNullOrUndefined(this._oldDefinition)) {
            return;
        }

        this._oldDefinition._parent = definitions;
        this._oldDefinition._ownerDocument = definitions.ownerDocument();
        definitions.removeDefinition(this._newDefinition.definitionName());
        definitions.addDefinition(this._oldDefinition.definitionName(), this._oldDefinition);
    }

}
