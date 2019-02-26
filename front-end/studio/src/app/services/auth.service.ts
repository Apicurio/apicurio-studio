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

import {User} from "../models/user.model";
import {Topic} from "apicurio-ts-core";


export abstract class IAuthenticationService {

    /**
     * Topic to listen for changes to authentication status.
     */
    abstract authenticated(): Topic<boolean>;

    /**
     * A way for consumers to subscribe to the current authentication status of the user/app.
     */
    abstract isAuthenticated(): boolean;

    /**
     * Immediately gets the current authenticated user (if any).  Returns null if no user is
     * currently authenticated.
     * 
     */
    abstract getAuthenticatedUserNow(): User;

    /**
     * Called to authenticate a user.
     * @param user
     * @param credential
     */
    abstract login(user:string, credential:any): Promise<User>;

    /**
     * Called to log out the current user.
     */
    abstract logout(): void;

    /**
     * Called to inject authentication headers into an API REST call.
     * @param headers
     */
    abstract injectAuthHeaders(headers: {[header: string]: string}): void;

    /**
     * Called to return an authentication secret (e.g. the auth access token).
     * 
     */
    abstract getAuthenticationSecret(): string;
}
