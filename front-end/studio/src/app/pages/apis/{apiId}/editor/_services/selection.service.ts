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
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {ModelUtils} from "../_util/model.util";
import {OasAllNodeVisitor} from "oai-ts-core/src/visitors/visitor.base";
import {DocumentService} from "./document.service";


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

    private _selectionSubject: BehaviorSubject<string> = new BehaviorSubject("/");
    private _selection: Observable<string> = this._selectionSubject.asObservable();

    constructor(private documentService: DocumentService) {
        this.reset();
    }

    public currentSelection(): string {
        return this._selectionSubject.getValue();
    }

    public selection(): Observable<string> {
        return this._selection;
    }

    public simpleSelect(path: string): void {
        // Fire an event with the new selection path (only if the selection changed)
        this._selectionSubject.next(path);
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
        this._selectionSubject.next(path);
    }

    public selectNode(node: OasNode): void {
        this.select(this._library.createNodePath(node).toString());
    }

    public selectRoot(): void {
        this.select("/");
    }

    public reset(): void {
        this._selectionSubject = new BehaviorSubject("/");
        this._selection = this._selectionSubject.asObservable();
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
}
