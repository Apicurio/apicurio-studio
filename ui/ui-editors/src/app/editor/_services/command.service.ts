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
import {ICommand} from "@apicurio/data-models";
import {Topic} from "apicurio-ts-core";

/**
 * A simple service that tracks the user's current command in the editor.  The command
 * is represented as a node path - a full path to a node in the data model.
 */
@Injectable()
export class CommandService {

    private _commands: Topic<ICommand>;

    constructor() {
        this.reset();
    }

    public emit(command: ICommand): void {
        this._commands.send(command);
    }

    public commands(): Topic<ICommand> {
        return this._commands;
    }

    public reset(): void {
        this._commands = new Topic();
    }

}
