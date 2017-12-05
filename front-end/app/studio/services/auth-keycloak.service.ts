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
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {User} from "../models/user.model";
import {Http, Headers, RequestOptions} from "@angular/http";
import {ConfigService} from "./config.service";

/**
 * A version of the authentication service that uses keycloak.js to provide
 * authentication services.
 */
export class KeycloakAuthenticationService implements IAuthenticationService {

    private _authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public authenticated: Observable<boolean> = this._authenticated.asObservable();

    private _authenticatedUser: BehaviorSubject<User> = new BehaviorSubject(null);
    public authenticatedUser: Observable<User> = this._authenticatedUser.asObservable();

    private keycloak: any;

    /**
     * Constructor.
     * @param {Http} http
     * @param {ConfigService} config
     */
    constructor(private http: Http, private config: ConfigService) {
        this.keycloak = window["keycloak"];

        console.info("Token: %s", JSON.stringify(this.keycloak.tokenParsed, null, 2));
        console.info("ID Token: %s", JSON.stringify(this.keycloak.idTokenParsed, null, 2));
        console.info("Access Token: %s", this.keycloak.token);

        let user: User = new User();
        user.name = this.keycloak.tokenParsed.name;
        user.login = this.keycloak.tokenParsed.preferred_username;
        user.email = this.keycloak.tokenParsed.email;

        this._authenticated.next(true);
        this._authenticatedUser.next(user);

        // Periodically refresh
        // TODO run this outsize NgZone using zone.runOutsideAngular() : https://angular.io/api/core/NgZone
        setInterval(() => {
            this.keycloak.updateToken(30);
        }, 30000);
    }

    /**
     * Returns the observable for is/isnot authenticated.
     * @return {Observable<boolean>}
     */
    public isAuthenticated(): Observable<boolean> {
        return this.authenticated;
    }

    /**
     * Returns an observable over the currently authenticated User (or null if not logged in).
     * @return {any}
     */
    public getAuthenticatedUser(): Observable<User> {
        return this.authenticatedUser;
    }

    /**
     * Not supported.
     * @param user
     * @param credential
     */
    public login(user: string, credential: any): Promise<User> {
        throw new Error("Not supported.");
    }

    /**
     * Logout.
     */
    public logout(): void {
        this.keycloak.logout({ redirectUri: location.href });
    }

    /**
     * Called to inject authentication headers into a remote API call.
     * @param headers
     */
    public injectAuthHeaders(headers: Headers): void {
        let authHeader: string = "bearer " + this.keycloak.token;
        headers.set("Authorization", authHeader);
    }

    /**
     * Called to return the keycloak access token.
     * @return {string}
     */
    public getAuthenticationSecret(): string {
        return this.keycloak.token;
    }

}