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
import {Api} from "../../../../../models/api.model";


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
    private users: any = {};

    /**
     * Clears the current selection for a given user.
     * @param user
     * @param document
     */
    private clearUserSelection(user: ApiEditorUser, document: OasDocument): OasNodePath {
        let selection: OasNodePath = this.selections[user.userId];
        if (selection !== null && selection !== undefined) {
            let visitor: CollaboratorSelectionVisitor = new CollaboratorSelectionVisitor(user, true);
            OasVisitorUtil.visitPath(selection, visitor, document);
        }
        return selection;
    }

    /**
     * Sets the selection for a user.
     * @param user
     * @param selection
     * @param document
     */
    private setUserSelection(user: ApiEditorUser, selection: OasNodePath, document: OasDocument): void {
        let visitor: CollaboratorSelectionVisitor = new CollaboratorSelectionVisitor(user);
        OasVisitorUtil.visitPath(selection, visitor, document);
    }

    /**
     * Sets the selection for a given active collaborator.  Returns the user's previous selection.
     * @param user
     * @param selection
     */
    public setSelection(user: ApiEditorUser, selection: string, document: OasDocument): void {
        this.users[user.userId] = user;

        // First, clear any previous selection the user may have had.
        this.clearUserSelection(user, document);

        // Next, process the new selection
        if (selection) {
            let newSelection: OasNodePath = new OasNodePath(selection);
            this.setUserSelection(user, newSelection, document);
            this.selections[user.userId] = newSelection;
        } else {
            // If the selection is null, remove it (user has left the editing session)
            console.info(`[CollaboratorSelections] Selection for ${user.userId} is null, removing.`);
            delete this.selections[user.userId];
            delete this.users[user.userId];
        }
    }

    /**
     * Clears the selection for all users.
     * @param document
     */
    public clearAllSelections(document: OasDocument): void {
        for (let userId in this.selections) {
            let user: ApiEditorUser = this.users[userId];
            this.clearUserSelection(user, document);
        }
    }

    /**
     * Re-selects the current selection for each user.
     * @param document
     */
    public reselectAll(document: OasDocument): void {
        for (let userId in this.selections) {
            let user: ApiEditorUser = this.users[userId];
            let selection: OasNodePath = this.selections[userId];
            this.setUserSelection(user, selection, document);
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

    constructor() {
        this.reset();
    }

    public currentSelection(): OasNodePath {
        return this._selectionSubject.getValue();
    }

    public selection(): Observable<OasNodePath> {
        return this._selection;
    }

    public select(path: OasNodePath, document: OasDocument): void {
        // Clear previous selection
        this.clearCurrentSelection(document);

        // Select the new thing
        let visitor: MainSelectionVisitor = new MainSelectionVisitor();
        OasVisitorUtil.visitPath(path, visitor, document);

        // Fire an event with the new selection path (only if the selection changed)
        if (path.toString() !== this.currentSelection().toString()) {
            this._selectionSubject.next(path);
        }
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

    public reset(): void {
        this._selectionSubject = new BehaviorSubject(new OasNodePath("/"));
        this._selection = this._selectionSubject.asObservable();
        this._collaboratorSelections = new CollaboratorSelections();
    }

    public clearAllSelections(document: OasDocument): void {
        this.clearCurrentSelection(document);
        this._collaboratorSelections.clearAllSelections(document);
    }

    public reselectAll(document: OasDocument): void {
        this.select(this.currentSelection(), document);
        this._collaboratorSelections.reselectAll(document);
    }

    private clearCurrentSelection(document: OasDocument): void {
        let previousSelection: OasNodePath = this.currentSelection();
        if (previousSelection) {
            let visitor: MainSelectionVisitor = new MainSelectionVisitor(true);
            OasVisitorUtil.visitPath(previousSelection, visitor, document);
        }
    }
}
