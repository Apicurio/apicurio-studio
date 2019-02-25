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


import {Injectable} from "@angular/core";
import {
    Oas20SchemaDefinition,
    Oas30SchemaDefinition,
    OasDocument,
    OasLibraryUtils,
    OasNode,
    OasNodePath,
    OasPathItem,
    OasValidationProblem,
    OasVisitorUtil
} from "oai-ts-core";
import {ModelUtils} from "../_util/model.util";
import {OasAllNodeVisitor} from "oai-ts-core/src/visitors/visitor.base";
import {DocumentService} from "./document.service";
import {Topic} from "../_util/messaging";


class MainSelectionVisitor extends OasAllNodeVisitor {

    private _modFunction: (node: OasNode) => void;
    private _nodeStack: OasNode[] = [];

    constructor(clear: boolean = false) {
        super();
        this._modFunction = clear ? ModelUtils.clearSelection : ModelUtils.setSelection;
    }

    protected doVisitNode(node: OasNode): void {
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

    public visitValidationProblem(node: OasValidationProblem): void {
        this.clearNodeStack();
        super.visitValidationProblem(node);
    }
}


/**
 * A simple service that tracks the user's current selection in the editor.  The selection
 * is represented as a node path - a full path to a node in the data model.
 */
@Injectable()
export class SelectionService {

    private _library: OasLibraryUtils = new OasLibraryUtils();

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
        let doc: OasDocument = this.documentService.currentDocument();
        let visitor: MainSelectionVisitor = new MainSelectionVisitor();
        let npath: OasNodePath = new OasNodePath(path);
        OasVisitorUtil.visitPath(npath, visitor, doc);

        // Fire an event with the new selection path
        this._selectionTopic.send(path);
    }

    public selectNode(node: OasNode): void {
        this.select(this._library.createNodePath(node).toString());
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
            let doc: OasDocument = this.documentService.currentDocument();
            if (doc) {
                let visitor: MainSelectionVisitor = new MainSelectionVisitor(true);
                let npath: OasNodePath = new OasNodePath(previousSelection);
                OasVisitorUtil.visitPath(npath, visitor, doc);
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
