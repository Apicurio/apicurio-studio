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

import {
    ConfigType,
    FeaturesConfig,
    GetTokenAuthConfig,
    InstancesConfig,
    KeycloakJsAuthConfig, NoneAuthConfig,
    RegistriesConfig
} from './config.type';
import {Service} from "../baseService";

const DEFAULT_CONFIG: ConfigType = {
    auth: {
        type: "none"
    },
    features: {},
    instances: {
        auth: {
            type: "none"
        }
    },
    registries: {
        auth: {
            type: "none"
        },
        static: [
            {
                id: "local",
                name: "local-registry",
                registryUrl: "http://localhost:8080/"
            }
        ]
    },
    ui: {
        contextPath: "/",
        navPrefixPath: "/"
    },
};

/**
 * A simple configuration service.  Reads information from a global "ApicurioConfig" variable
 * that is typically included via JSONP.
 */
export class ConfigService implements Service {
    private config: ConfigType;

    constructor() {
        const w: any = window;
        if (w.ApicurioConfig) {
            this.config = w.ApicurioConfig;
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

    public authConfig(): NoneAuthConfig | KeycloakJsAuthConfig {
        return this.config.auth;
    }

    public registriesConfig(): RegistriesConfig {
        return this.config.registries;
    }

    public instancesConfig(): InstancesConfig {
        return this.config.instances;
    }

    public features(): FeaturesConfig {
        const defaults: FeaturesConfig = {
            multiTenant: false
        };
        if (!this.config.features) {
            return defaults;
        }
        return {
            ...defaults,
            ...this.config.features
        };
    }

}
