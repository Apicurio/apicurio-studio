/**
 * @license
 * Copyright 2021 Red Hat
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

import {ConfigType, FeaturesConfig, GetTokenAuthConfig, KeycloakJsAuthConfig} from './config.type';
import {Service} from "../baseService";

const DEFAULT_CONFIG: ConfigType = {
    api: {
        url: "http://localhost:8080/apis/studio/v1"
    },
    auth: {
        type: "none"
    },
    features: {
        breadcrumbs: true
    },
    ui: {
        contextPath: "/",
        navPrefixPath: "/"
    },
};

/**
 * A simple configuration service.  Reads information from a global "MASStudioConfig" variable
 * that is typically included via JSONP.
 */
export class ConfigService implements Service {
    private config: ConfigType;

    constructor() {
        const w: any = window;
        if (w.ApiStudioConfig) {
            this.config = w.ApiStudioConfig;
            // tslint:disable-next-line:no-console
            console.info("[ConfigService] Found app config.");
        } else {
            // tslint:disable-next-line:no-console
            console.warn("[ConfigService] App config not found! (using default)");
            this.config = DEFAULT_CONFIG;
        }
    }

    public init(): void {
        // Nothing to init (done in c'tor)
    }

    public updateConfig(config: ConfigType): void {
        this.config = config;
    }

    public apiUrl(): string|null {
        if (!this.config.api) {
            return null;
        }
        return this.config.api.url;
    }

    public uiContextPath(): string|undefined {
        if (!this.config.ui || !this.config.ui.contextPath) {
            return "/";
        }
        return this.config.ui.contextPath;
    }

    public uiNavPrefixPath(): string|undefined {
        if (!this.config.ui || !this.config.ui.navPrefixPath) {
            return "";
        }
        if (this.config.ui.navPrefixPath.endsWith("/")) {
            this.config.ui.navPrefixPath = this.config.ui.navPrefixPath.substr(0, this.config.ui.navPrefixPath.length - 1);
        }
        return this.config.ui.navPrefixPath;
    }

    public features(): FeaturesConfig {
        const defaults: FeaturesConfig = {
            breadcrumbs: true
        };
        if (!this.config.features) {
            return defaults;
        }
        return {
            ...defaults,
            ...this.config.features
        };
    }

    public featureBreadcrumbs(): boolean {
        return this.features().breadcrumbs || false;
    }

    public authType(): string {
        if (!this.config.auth || !this.config.auth.type) {
            return "";
        }
        return this.config.auth.type;
    }

    public authOptions(): any {
        if (this.config.auth) {
            const auth: KeycloakJsAuthConfig = this.config.auth as KeycloakJsAuthConfig;
            return auth.options;
        }
        return {};
    }

    public authGetToken(): () => Promise<string> {
        if (this.config.auth) {
            const auth: GetTokenAuthConfig = this.config.auth as GetTokenAuthConfig;
            return auth.getToken;
        }
        return () => {
            // tslint:disable-next-line:no-console
            console.error("[ConfigService] Missing: 'getToken' from auth config.");
            return Promise.resolve("");
        };
    }

    public principals() {
        return this.config.principals;
    }

    public featureMultiTenant(): boolean {
        return this.features().multiTenant || false;
    }
}
