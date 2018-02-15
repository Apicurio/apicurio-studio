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
import {ConfigService} from "./config.service";
import {HttpClient, HttpResponse} from "@angular/common/http";


export class OIDCDirectGrantAccessToken {
    public access_token: string;
    public expires_in: number;
    public refresh_expires_in: number;
    public token_type: "bearer";
    public session_state: string;
}


/**
 * A version of the authentication service that uses OpenID Connect Direct
 * Grant to obtain an access token.
 */
export class OIDCDirectGrantAuthenticationService implements IAuthenticationService {

    private _authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public authenticated: Observable<boolean> = this._authenticated.asObservable();

    private _authenticatedUser: BehaviorSubject<User> = new BehaviorSubject(null);
    public authenticatedUser: Observable<User> = this._authenticatedUser.asObservable();

    private accessToken: OIDCDirectGrantAccessToken;

    /**
     * Constructor.
     * @param http
     * @param config
     */
    constructor(private http: HttpClient, private config: ConfigService) {
        console.info("[OIDCDirectGrantAuthenticationService] C'tor");
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
     * Returns the currently authenticated user.
     * @return {User}
     */
    public getAuthenticatedUserNow(): User {
        return this._authenticatedUser.getValue();
    }

    /**
     * Not supported.
     * @param user
     * @param credential
     */
    public login(user: string, credential: any): Promise<User> {
        let authData: any = this.config.authData();

        let authTokenUrl: string = authData.auth_url;
        let headers: any = { "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" };
        let options: any = {
            observe: "response",
            headers: headers
        };
        let body: any = "grant_type=" + authData.grant_type + "&client_id=" + authData.client_id + "&username=" +
            user + "&password=" + credential;

        console.info("[OIDCDirectGrantAuthenticationService] Getting an access token from: %s", authTokenUrl);

        return this.http.post(authTokenUrl, body, options).map( event => {
            let response: HttpResponse<OIDCDirectGrantAccessToken> = <any>event as HttpResponse<OIDCDirectGrantAccessToken>;
            console.info("[OIDCDirectGrantAuthenticationService] Received access token.");
            let token: OIDCDirectGrantAccessToken = response.body;
            this.accessToken = token;
            let user: User = this.toUser(token);
            return user;
        }).toPromise().then( user => {
            this._authenticated.next(true);
            this._authenticatedUser.next(user);
            return Promise.resolve<User>(user);
        }).catch( reason => {
            console.error("[OIDCDirectGrantAuthenticationService] Failed to obtain access token: %o", reason);
            let errorMessage: string = reason.statusText;
            if (reason.status === 401) {
                errorMessage = reason.json().message;
            }
            return Promise.reject<User>(errorMessage)
        });
    }

    /**
     * Logout.
     */
    public logout(): void {
        location.reload(true);
    }

    /**
     * Called to inject authentication headers into a remote API call.
     * @param headers
     */
    public injectAuthHeaders(headers: {[header: string]: string}): void {
        let authHeader: string = "bearer " + this.accessToken.access_token;
        headers["Authorization"] = authHeader;
    }

    /**
     * Extracts user information from the access token.
     * @param {OIDCDirectGrantAccessToken} token
     * @return {User}
     */
    protected toUser(token: OIDCDirectGrantAccessToken): User {
        let tokenData: any = this.parseToken(token.access_token);
        let user: User = new User();
        user.login = tokenData["preferred_username"];
        user.email = tokenData["email"];
        user.name = tokenData["name"];
        return user;
    }

    /**
     * Parses the access token into a js object.  The access token is a base64 encoded JWT.
     * @param {string} token
     * @return {any}
     */
    protected parseToken(token: string): any {
        token = token.split(".")[1];
        token = token.replace(/-/g, '+');
        token = token.replace(/_/g, '/');
        let raw: string = atob(token);
        let obj: any = JSON.parse(raw);
        return obj;
    }

    /**
     * Called to return the access token.
     * @return {string}
     */
    public getAuthenticationSecret(): string {
        return this.accessToken.access_token;
    }

}