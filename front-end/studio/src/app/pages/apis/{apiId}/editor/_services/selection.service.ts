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
import {ApiEditorUser} from "../../../../../models/editor-user.model";
import {OasAllNodeVisitor} from "oai-ts-core/src/visitors/visitor.base";


class CollaboratorSelectionVisitor extends OasAllNodeVisitor {

    private _modFunction: (user: ApiEditorUser, node: OasNode) => void;
    private _nodeStack: OasNode[] = [];

    constructor(private user: ApiEditorUser, clear: boolean = false) {
        super();
        this._modFunction = clear ? ModelUtils.clearCollaboratorSelection : ModelUtils.setCollaboratorSelection;
    }

    protected doVisitNode(node: OasNode): void {
        this._modFunction(this.user, node);
        this._nodeStack.push(node);
    }

    protected clearNodeStack(): void {
        for (let node of this._nodeStack) {
            ModelUtils.clearCollaboratorSelection(this.user, node);
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


class CollaboratorSelections {

    private selections: any = {};

    /**
     * Sets the selection for a given active collaborator.  Returns the user's previous selection.
     * @param user
     * @param selection
     * @return
     */
    public setSelection(user: ApiEditorUser, selection: string, document: OasDocument): void {
        // First, clear any previous selection the user may have had.
        let previousSelection: OasNodePath = this.selections[user.userId];
        if (previousSelection != null) {
            let visitor: CollaboratorSelectionVisitor = new CollaboratorSelectionVisitor(user, true);
            OasVisitorUtil.visitPath(previousSelection, visitor, document);
        }

        if (selection === null) {
            delete this.selections[user.userId];
            return;
        }

        // Next, process the new selection
        if (selection) {
            let newSelection: OasNodePath = new OasNodePath(selection);
            let visitor: CollaboratorSelectionVisitor = new CollaboratorSelectionVisitor(user);
            OasVisitorUtil.visitPath(newSelection, visitor, document);
            this.selections[user.userId] = newSelection;
        } else {
            console.info("[CollaboratorSelections] Selection is null, skipping.");
        }
    }

}


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

    private _selectionSubject: BehaviorSubject<OasNodePath> = new BehaviorSubject(new OasNodePath("/"));
    private _selection: Observable<OasNodePath> = this._selectionSubject.asObservable();
    private _collaboratorSelections: CollaboratorSelections = new CollaboratorSelections();

    public currentSelection(): OasNodePath {
        return this._selectionSubject.getValue();
    }

    public selection(): Observable<OasNodePath> {
        return this._selection;
    }

    public select(path: OasNodePath, document: OasDocument): void {
        // Clear previous selection
        let previousSelection: OasNodePath = this.currentSelection();
        if (previousSelection) {
            let visitor: MainSelectionVisitor = new MainSelectionVisitor(true);
            OasVisitorUtil.visitPath(previousSelection, visitor, document);
        }

        // Select the new thing
        let visitor: MainSelectionVisitor = new MainSelectionVisitor();
        OasVisitorUtil.visitPath(path, visitor, document);

        // Fire an event with the new selection path
        this._selectionSubject.next(path);
    }

    public selectNode(node: OasNode, document: OasDocument): void {
        this.select(this._library.createNodePath(node), document);
    }

    public selectRoot(document: OasDocument): void {
        this.select(new OasNodePath("/"), document);
    }

    public setCollaboratorSelection(user: ApiEditorUser, selection: string, document: OasDocument): void {
        this._collaboratorSelections.setSelection(user, selection, document);
    }

}
