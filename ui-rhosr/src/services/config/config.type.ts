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
import {RegistryInstance} from "../../models";

// tslint:disable-next-line:no-empty-interface
export interface FeaturesConfig {
    multiTenant?: boolean;
}

export interface RegistriesConfig {
    static?: RegistryInstance[];
    apiUrl?: string;
    auth: KeycloakJsAuthConfig | NoneAuthConfig | GetTokenAuthConfig;
}

export interface InstancesConfig {
    auth: KeycloakJsAuthConfig | NoneAuthConfig | GetTokenAuthConfig;
}

export interface UiConfig {
    contextPath?: string;
    navPrefixPath?: string;
}

export interface AuthConfig {
    type: string;
}

// Used when `type=keycloakjs`
export interface KeycloakJsAuthConfig extends AuthConfig {
    type: 'keycloakjs';
    options?: any;
}

// Used when `type=none`
// tslint:disable-next-line:no-empty-interface
export interface NoneAuthConfig extends AuthConfig {
    type: 'none';
}

// Used when `type=gettoken`
export interface GetTokenAuthConfig extends AuthConfig {
    type: 'gettoken';
    getToken: () => Promise<string>;
}

export interface ConfigType {
    auth: KeycloakJsAuthConfig | NoneAuthConfig;
    registries: RegistriesConfig;
    instances: InstancesConfig;
    features?: FeaturesConfig;
    ui: UiConfig;
}
