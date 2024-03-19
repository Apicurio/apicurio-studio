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
import {Topic} from "apicurio-ts-core";
import {ApiEditorUser} from "../_models/editor-user.model";


class CollaboratorSelections {

    // Map of userId->string
    private selections: any = {};
    // Map of userId->ApiEditorUser
    private users: any = {};

    /**
     * Gets a user by ID.
     * @param userId
     */
    public getUser(userId: string): ApiEditorUser {
        return this.users[userId];
    }

    /**
     * Gets the current selection for the given collaborator.
     * @param user
     */
    public getSelection(user: ApiEditorUser): string {
        return this.selections[user.userId];
    }

    /**
     * Sets the selection for a given active collaborator.  Returns the user's previous selection.
     * @param user
     * @param selection
     */
    public setSelection(user: ApiEditorUser, selection: string): void {
        this.users[user.userId] = user;

        // Next, process the new selection
        if (selection) {
            this.selections[user.userId] = selection;
        } else {
            // If the selection is null, remove it (user has left the editing session)
            console.info(`[CollaboratorSelections] Selection for ${user.userId} is null, removing.`);
            delete this.selections[user.userId];
            delete this.users[user.userId];
        }
    }

    /**
     * Invokes the given function for every userId/selection pair.
     * @param func
     */
    public forEachSelection(func: (userId: string, path: string) => void): void {
        for (let key in this.selections) {
            let path: string = this.selections[key];
            func(key, path);
        }
    }

}


/**
 * A service that tracks (active) collaborators and collaborator selections.
 */
@Injectable()
export class CollaboratorService {

    private _collaboratorSelections: CollaboratorSelections = new CollaboratorSelections();

    private _collaboratorSelectionTopic: Topic<ApiEditorUser> = new Topic<ApiEditorUser>();

    constructor() {
        this.reset();
    }

    public collaboratorSelection(): Topic<ApiEditorUser> {
        return this._collaboratorSelectionTopic;
    }

    public currentCollaboratorSelection(user: ApiEditorUser): string {
        return this._collaboratorSelections.getSelection(user);
    }

    public setCollaboratorSelection(user: ApiEditorUser, selection: string): void {
        this._collaboratorSelections.setSelection(user, selection);
        this._collaboratorSelectionTopic.send(user);
    }

    public reset(): void {
        this._collaboratorSelections = new CollaboratorSelections();
    }

    public getCollaboratorsForPath(nodePath: string): ApiEditorUser[] {
        let collaborators: ApiEditorUser[] = [];
        this._collaboratorSelections.forEachSelection( (userId, path) => {
            if (path && path.indexOf(nodePath) === 0) {
                collaborators.push(this._collaboratorSelections.getUser(userId));
            }
        });
        return collaborators;
    }
}
