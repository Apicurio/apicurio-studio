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

import {IAuthenticationService} from "./auth.service";
import {ConfigService} from "./config.service";
import {TokenAuthenticationService} from "./auth-token.service";
import {OIDCDirectGrantAuthenticationService} from "./auth-oidc.service";
import {KeycloakAuthenticationService} from "./auth-keycloak.service";
import {HttpClient} from "@angular/common/http";


export function AuthenticationServiceFactory(http: HttpClient, config: ConfigService): IAuthenticationService {
    if (config.authType() === "keycloakjs") {
        console.info("[AuthenticationServiceFactory] Creating keycloak.js auth service.");
        return new KeycloakAuthenticationService(http, config);
    } else if (config.authType() === "token") {
        console.info("[AuthenticationServiceFactory] Creating token auth service.");
        return new TokenAuthenticationService(http, config);
    } else if (config.authType() === "oidc-direct-grant") {
        console.info("[AuthenticationServiceFactory] Creating OIDC Direct Grant auth service.");
        return new OIDCDirectGrantAuthenticationService(http, config);
    } else {
        console.error("[AuthenticationServiceFactory] Unsupported auth type: %s", config.authType());
        return null;
    }
};


export let AuthenticationServiceProvider =
{
    provide: IAuthenticationService,
    useFactory: AuthenticationServiceFactory,
    deps: [HttpClient, ConfigService]
};
