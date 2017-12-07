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

import {InjectionToken} from "@angular/core";
import {Observable} from "rxjs/Observable";

import {User} from "../models/user.model";
import {Headers} from "@angular/http";


export interface IAuthenticationService {

    /**
     * A way for consumers to subscribe to the current authentication status of the user/app.
     */
    isAuthenticated(): Observable<boolean>;

    /**
     * Get the currently authenticated user.  May be null if the user is not currently authenticated.
     */
    getAuthenticatedUser(): Observable<User>;

    /**
     * Called to authenticate a user.
     * @param user
     * @param credential
     */
    login(user:string, credential:any): Promise<User>;

    /**
     * Called to log out the current user.
     */
    logout(): void;

    /**
     * Called to inject authentication headers into an API REST call.
     * @param headers
     */
    injectAuthHeaders(headers: Headers): void;

    /**
     * Called to return an authentication secret (e.g. the auth access token).
     * @return {string}
     */
    getAuthenticationSecret(): string;
}

export const IAuthenticationService = new InjectionToken("IAuthenticationService");
