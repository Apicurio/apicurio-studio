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

let DEFAULT_CONFIG: any = {
    mode: "dev",
    auth: {
        type: "keycloakjs"
    },
    apis: {
        type: "hub",
        hubUrl: "http://localhost:8080/api-hub",
        editingUrl: "http://localhost:8080/api-editing",
        spectralApiUrl: "http://localhost:8080/spectral-api",
    },
    ui: {
        uiUrl: "http://localhost:8080/studio/",
        channelNameValidation: "([^\\x00-\\x20\\x7f\"'%<>\\\\^`{|}]|%[0-9A-Fa-f]{2}|{[+#./;?&=,!@|]?((\\w|%[0-9A-Fa-f]{2})(\\.?(\\w|%[0-9A-Fa-f]{2}))*(:[1-9]\\d{0,3}|\\*)?)(,((\\w|%[0-9A-Fa-f]{2})(\\.?(\\w|%[0-9A-Fa-f]{2}))*(:[1-9]\\d{0,3}|\\*)?))*})*",
    },
    features: {
        "microcks": true,
        "graphql": true,
        "asyncapi": true,
        "spectralValidation": false
    }
};


/**
 * A simple configuration service.  Reads information from a global "ApicurioStudioConfig" variable
 * that is typically included via JSONP.
 */
@Injectable()
export class ConfigService {

    private config: any;

    constructor() {
        let w: any = window;
        if (w["ApicurioStudioConfig"]) {
            this.config = w["ApicurioStudioConfig"];
            console.info("[ConfigService] Found app config.");
        } else {
            console.error("[ConfigService] App config not found!");
            this.config = DEFAULT_CONFIG;
        }
    }

    public authType(): string {
        if (!this.config.auth) {
            return null;
        }
        return this.config.auth.type;
    }

    public authToken(): string {
        if (!this.config.auth) {
            return null;
        }
        return this.config.auth.token;
    }

    public authRefreshPeriod(): number {
        if (!this.config.auth) {
            return null;
        }
        return this.config.auth.tokenRefreshPeriod;
    }

    public authData(): any {
        if (!this.config.auth) {
            return null;
        }
        return this.config.auth.data;
    }

    public logoutUrl(): string {
        if (!this.config.auth) {
            return null;
        }
        return this.config.auth.logoutUrl;
    }

    public user(): User {
        return <any>this.config.user;
    }

    public apisType(): string {
        if (!this.config.apis) {
            return null;
        }
        return this.config.apis.type;
    }

    public hubUrl(): string {
        if (!this.config.apis) {
            return null;
        }
        return this.config.apis.hubUrl;
    }

    public editingUrl(): string {
        if (!this.config.apis) {
            return null;
        }
        return this.config.apis.editingUrl;
    }

    public spectralApiUrl(): string {
        if (!this.config.apis) {
            return null;
        }
        return this.config.apis.spectralApiUrl;
    }

    public isMicrocksEnabled(): boolean {
        if (!this.config.features) {
            return false;
        }
        return this.config.features.microcks;
    }

    public isAsyncAPIEnabled(): boolean {
        if (!this.config.features) {
            return true;
        }
        return this.config.features.asyncapi;
    }

    public isGraphQLEnabled(): boolean {
        if (!this.config.features) {
            return false;
        }
        return this.config.features.graphql;
    }

    public isSpectralValidationEnabled(): boolean {
        return !!this.config.features?.spectralValidation;
    }

    public uiUrl(): string {
        if (!this.config.ui || !this.config.ui.url) {
            return "";
        }
        return this.config.ui.url;
    }

    public isShareWithEveryoneEnabled(): boolean {
        if (!this.config.features) {
            return false;
        }
        return this.config.features.shareWithEveryone;
    }

    public channelNameValidation() :string {
        if ( !this.config.ui || !this.config.ui.channelNameValidation || !this.config.ui.channelNameValidation) {
            return "";
        }
        return this.config.ui.channelNameValidation;
    }
}
