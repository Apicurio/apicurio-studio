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
import {EditingInfo} from "../models/editingInfo.model";
import {LoggerService} from "./logger.service";
import {WindowRef} from "./window-ref.service";

/**
 * A service used to get access to the config information.
 */
@Injectable()
export class ConfigService {

    private resolve: any;
    private reject: any;

    constructor(private window: WindowRef, private logger: LoggerService) {
        this.logger.info("[ConfigService] Config service created.");
        this.window.window.onmessage = (evt: MessageEvent) => {
            this.logger.info("[ConfigService] OnMessage received: ", evt);
            if (evt.data && evt.data.type && evt.data.type === "apicurio-editingInfo") {
                const ei: EditingInfo = evt.data.data as EditingInfo;
                this.logger.info("[ConfigService] Editing Info received from parent frame: ", ei);
                this.resolve(ei);
            }
        };
    }

    public get(): Promise<EditingInfo> {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

}
