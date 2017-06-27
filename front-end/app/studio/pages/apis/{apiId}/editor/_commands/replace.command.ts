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
import {
    OasDocument, Oas20Document, Oas20PathItem, OasNode, Oas20Paths, Oas20Operation,
    Oas20Definitions, Oas20SchemaDefinition
} from "oai-ts-core";


/**
 * A command used to replace a path item with a newer version.
 */
abstract class AbstractReplaceNodeCommand<T extends OasNode> extends AbstractCommand implements ICommand {

    private _newNode: T;
    private _oldNode: T;

    constructor(old: T, replacement: T) {
        super();
        this._oldNode = old;
        this._newNode = replacement;
    }

    /**
     * Replaces the node.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[AbstractReplaceNodeCommand] Executing.");
        let doc: Oas20Document = <Oas20Document>document;

        this.removeNode(doc, this._oldNode);
        this.addNode(doc, this._newNode);
    }

    /**
     * Switch back!
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[AbstractReplaceNodeCommand] Reverting.");
        let doc: Oas20Document  = <Oas20Document>document;
        if (this.isNullOrUndefined(this._oldNode)) {
            return;
        }

        this._oldNode._parent = this._newNode._parent;
        this._oldNode._ownerDocument = this._newNode._ownerDocument;

        this.removeNode(doc, this._newNode);
        this.addNode(doc, this._oldNode);
    }

    protected abstract removeNode(doc: Oas20Document, node: T): void;

    protected abstract addNode(doc: Oas20Document, node: T): void;
}


/**
 * A command used to replace a definition schema with a newer version.
 */
export class ReplaceDefinitionSchemaCommand extends AbstractReplaceNodeCommand<Oas20SchemaDefinition> implements ICommand {

    /**
     * Remove the given node.
     * @param doc
     * @param node
     */
    protected removeNode(doc: Oas20Document, node: Oas20SchemaDefinition): void {
        let definitions: Oas20Definitions = doc.definitions;
        definitions.removeDefinition(node.definitionName());
    }

    /**
     * Adds the node to the document.
     * @param doc
     * @param node
     */
    protected addNode(doc: Oas20Document, node: Oas20SchemaDefinition): void {
        let definitions: Oas20Definitions = doc.definitions;
        definitions.addDefinition(node.definitionName(), node);
    }

}


/**
 * A command used to replace a path item with a newer version.
 */
export class ReplacePathItemCommand extends AbstractReplaceNodeCommand<Oas20PathItem> implements ICommand {

    /**
     * Remove the given node.
     * @param doc
     * @param node
     */
    protected removeNode(doc: Oas20Document, node: Oas20PathItem): void {
        let paths: Oas20Paths = <Oas20Paths>node.parent();
        paths.removePathItem(node.path());
    }

    /**
     * Adds the node to the document.
     * @param doc
     * @param node
     */
    protected addNode(doc: Oas20Document, node: Oas20PathItem): void {
        let paths: Oas20Paths = doc.paths as Oas20Paths;
        paths.addPathItem(node.path(), node);
    }

}


/**
 * A command used to replace an operation with a newer version.
 */
export class ReplaceOperationCommand extends AbstractReplaceNodeCommand<Oas20Operation> implements ICommand {

    /**
     * Remove the given node.
     * @param doc
     * @param node
     */
    protected removeNode(doc: Oas20Document, node: Oas20Operation): void {
        let path: Oas20PathItem = <Oas20PathItem>node.parent();
        path[node.method()] = null;
    }

    /**
     * Adds the node to the document.
     * @param doc
     * @param node
     */
    protected addNode(doc: Oas20Document, node: Oas20Operation): void {
        let path: Oas20PathItem = <Oas20PathItem>node.parent();
        path[node.method()] = node;
    }

}
