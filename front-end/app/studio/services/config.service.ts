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
import {User} from "../models/user.model";

/**
 * An abstract base class for services that need to make API calls to Github.
 */
@Injectable()
export class ConfigService {

    private config: any;

    constructor() {
        if (window["ApicurioStudioConfig"]) {
            this.config = window["ApicurioStudioConfig"];
            console.info("[ConfigService] Found app config.");
        } else {
            console.info("[ConfigService] App config not found.");
            this.config = {
                auth: {
                    type: "local"
                }
            };
        }
    }

    public authType(): string {
        return this.config.auth.type;
    }

    public authToken(): string {
        return this.config.auth.token;
    }

    public logoutUrl(): string {
        return this.config.auth.logoutUrl;
    }

    public user(): User {
        return <any>this.config.user;
    }
}