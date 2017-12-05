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

import {OasDocument} from "oai-ts-core";
import {ICommand} from "oai-ts-commands";

/**
 * A manager class used to track commands, apply them to documents, undo previous commands,
 * etc.
 */
export class CommandsManager {

    private _commandStack: ICommand[] = [];
    private _undoneCommands: ICommand[] = [];

    /**
     * Executes the given command and pushes it onto the command stack (for later undo/redo operations).
     * @param command
     * @param document
     */
    public executeCommand(command: ICommand, document: OasDocument): void {
        this._commandStack.push(command);
        command.execute(document);
        this._undoneCommands = [];
    }

    /**
     * Executes 'undo' on the most recent command, reverting the document to a previous state.
     * @param document
     * @return {boolean}
     */
    public undoLastCommand(document: OasDocument): boolean {
        if (this._commandStack.length > 0) {
            let command: ICommand = this._commandStack.pop();
            command.undo(document);
            this._undoneCommands.push(command);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Re-executes the most recent "undone" command, pushing that command back onto the command stack.
     * @param document
     * @return {boolean}
     */
    public redoLastCommand(document: OasDocument): boolean {
        if (this._undoneCommands.length > 0) {
            let command: ICommand = this._undoneCommands.pop();
            command.execute(document);
            this._commandStack.push(command);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns true if the command stack is empty.
     * @return {boolean}
     */
    public isEmpty(): boolean {
        return this._commandStack.length === 0;
    }

}