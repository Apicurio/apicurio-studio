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
import {
    CombinedAllNodeVisitor,
    Library,
    Node,
    NodePath,
    Oas20SchemaDefinition,
    Oas30SchemaDefinition,
    Document,
    OasPathItem,
    ValidationProblem, IDefinition
} from "@apicurio/data-models";
import {ModelUtils} from "../_util/model.util";
import {DocumentService} from "./document.service";
import {Topic} from "apicurio-ts-core";


class MainSelectionVisitor extends CombinedAllNodeVisitor {

    private _modFunction: (node: Node) => void;
    private _nodeStack: Node[] = [];

    constructor(clear: boolean = false) {
        super();
        this._modFunction = clear ? ModelUtils.clearSelection : ModelUtils.setSelection;
    }

    visitNode(node: Node): void {
        this._modFunction(node);
        this._nodeStack.push(node);
    }

    protected clearNodeStack(): void {
        for (let node of this._nodeStack) {
            ModelUtils.clearSelection(node);
        }
    }

    public visitPathItem(node: OasPathItem): void {
        this.clearNodeStack();
        super.visitPathItem(node);
    }

    public visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
        this.clearNodeStack();
        super.visitSchemaDefinition(node);
    }

    public visitResponseDefinition(node: IDefinition): void {
        this.clearNodeStack();
        super.visitSchemaDefinition(node);
    }

}


/**
 * A simple service that tracks the user's current selection in the editor.  The selection
 * is represented as a node path - a full path to a node in the data model.
 */
@Injectable()
export class SelectionService {

    private _selectionTopic: Topic<string>;
    private _highlightTopic: Topic<string>;

    /**
     * C'tor.
     * @param documentService
     */
    constructor(private documentService: DocumentService) {
        this.reset();
    }

    public currentSelection(): string {
        return this._selectionTopic.getValue();
    }

    public selection(): Topic<string> {
        return this._selectionTopic;
    }

    public simpleSelect(path: string): void {
        // Fire an event with the new selection path (only if the selection changed)
        this._selectionTopic.send(path);
    }

    public select(path: string): void {
        // Clear previous selection
        this.clearCurrentSelection();

        // Select the new thing
        let doc: Document = this.documentService.currentDocument();
        let visitor: MainSelectionVisitor = new MainSelectionVisitor();
        let npath: NodePath = new NodePath(path);
        npath.resolveWithVisitor(doc, visitor);

        // Fire an event with the new selection path
        this._selectionTopic.send(path);
    }

    public selectNode(node: Node): void {
        this.select(Library.createNodePath(node).toString());
    }

    public selectRoot(): void {
        this.select("/");
    }

    public reset(): void {
        this._selectionTopic = new Topic<string>({
            distinctUntilChanged: true
        });
        this._highlightTopic = new Topic<string>();
    }

    public clearAllSelections(): void {
        this.clearCurrentSelection();
    }

    public reselectAll(): void {
        this.select(this.currentSelection());
    }

    private clearCurrentSelection(): void {
        let previousSelection: string = this.currentSelection();
        if (previousSelection) {
            let doc: Document = this.documentService.currentDocument();
            if (doc) {
                let visitor: MainSelectionVisitor = new MainSelectionVisitor(true);
                let npath: NodePath = new NodePath(previousSelection);
                npath.resolveWithVisitor(doc, visitor);
            }
        }
    }

    public highlightPath(path: string): void {
        console.info("[SelectionService] Highlighting selection/path: ", path);
        this._highlightTopic.send(path);
    }

    public highlight(): Topic<string> {
        return this._highlightTopic;
    }
}
