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

import {OtCommand} from "@apicurio/data-models";
import {VersionedAck} from "./_models/ack.model";
import {ApiEditorUser} from "./_models/editor-user.model";


export abstract class AbstractApiEditorComponent {

    public abstract executeCommand(command: OtCommand): void;
    public abstract undoCommand(command: OtCommand | number | string): void;
    public abstract redoCommand(command: OtCommand | number): void;
    public abstract finalizeCommand(ack: VersionedAck): void;
    public abstract updateCollaboratorSelection(user: ApiEditorUser, selection: string): void;
    public abstract select(path: string, highlight: boolean): void;

}
