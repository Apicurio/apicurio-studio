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
import {Http, Headers, RequestOptions} from "@angular/http";
import {User} from "../models/user.model";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {AbstractGithubService} from "./github";

const USER_LOCAL_STORAGE_KEY = "apicurio.studio.services.github-auth.user";
const PAT_LOCAL_STORAGE_KEY = "apicurio.studio.services.github-auth.pat";
const OLD_PATS_LOCAL_STORAGE_KEY = "apicurio.studio.services.github-auth.old-pats";


class GithubPersonalAccessToken {
    id: number;
    url: string;
    token: string;
    // hashed_token: string;
    // note: string;
    // created_at: Date;
    // updated_at: Date;
    // scopes: any;
    // fingerprint: string;
}

export class GithubAuthenticationCredentials {
    login: string;
    password: string;
    twoFactorToken: string;
}


/**
 * An implementation of the IAuthenticationService that uses BASIC authentication to
 * authenticate into github.  The app must get the credentials from the user via a
 * custom login form.  The credentials are then used whenever making API calls to
 * github.
 */
export class GithubAuthenticationService extends AbstractGithubService implements IAuthenticationService {

    private githubCredentials: GithubAuthenticationCredentials;
    private personalAccessToken: GithubPersonalAccessToken;

    private _authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public authenticated: Observable<boolean> = this._authenticated.asObservable();

    private _authenticatedUser: BehaviorSubject<User> = new BehaviorSubject(null);
    public authenticatedUser: Observable<User> = this._authenticatedUser.asObservable();

    /**
     * Constructor.
     * @param http
     */
    constructor(private http: Http) {
        super();
        let s_user: string = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
        let s_pat: string = localStorage.getItem(PAT_LOCAL_STORAGE_KEY);
        if (s_user && s_pat) {
            let user: User = JSON.parse(s_user);
            if (!user.name) {
                user.name = user.login;
            }
            let pat: GithubPersonalAccessToken = JSON.parse(s_pat);

            this.personalAccessToken = pat;
            this._authenticated.next(true);
            this._authenticatedUser.next(user);

            this.verifyAuthenticatedUser();
        }

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
     * Called to authenticate a user.  This implementation will use the provided credentials to
     * make an API call to Github to verify that the credentials are valid.  It is possible that
     * the credentials are correct but that the user has enabled two factor auth.  When this
     * happens, an appropriate exception will be thrown.
     * @param username
     * @param credential
     * @return {undefined}
     */
    public login(username: string, credential: any): Promise<User> {
        console.info("[GithubAuthenticationService] logging in user %s", username);
        let loginName: string = username;
        let password: string;
        let twoFactorToken: string;

        if (credential instanceof GithubAuthenticationCredentials) {
            password = credential.password;
            twoFactorToken = credential.twoFactorToken;
        } else {
            password = credential;
        }

        let basicAuthHeader: string = "Basic " + btoa(loginName + ":" + password);
        let url: string = this.endpoint("/authorizations");
        let headers: Headers = new Headers({"Content-Type": "application/json", "Authorization": basicAuthHeader});
        if (twoFactorToken) {
            headers.append("X-GitHub-OTP", twoFactorToken);
        }
        let options = new RequestOptions({headers: headers});

        return this.http.post(url, {
                "scopes": [
                    "user:email", "repo", "gist", "read:org"
                ],
                "note": "Apicurio Studio (" + new Date().toLocaleDateString() + "@" + new Date().toLocaleTimeString() + ")"
            }, options
        ).map(response => {
            let pat: GithubPersonalAccessToken = response.json();
            console.info("[GithubAuthenticationService] Authorization token obtained: %o", pat);
            return pat;
        }).toPromise().then( pat => {
            this.cleanOldPATs(headers);
            this.personalAccessToken = pat;
            localStorage.setItem(PAT_LOCAL_STORAGE_KEY, JSON.stringify(pat));
            let tokenAuthHeader: string = "token " + pat.token;
            return this.fetchAuthenticatedUser(tokenAuthHeader).then(user => {
                console.info("[GithubAuthenticationService] call to /user succeeded with user: %o", user);
                this._authenticated.next(true);
                this._authenticatedUser.next(user);

                localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
                return user;
            });
        }).catch(reason => {
            let errorMessage: string = reason.statusText;
            console.info("[GithubAuthenticationService] call to /user failed with: %o", reason);
            if (reason.status === 401) {
                errorMessage = reason.json().message;
            }
            return Promise.reject<User>(errorMessage)
        });
    }

    /**
     * Secret login using only the GitHub PAT (manually created).
     * @param pat
     */
    public loginPAT(pat: string): Promise<User> {
        console.info("[GithubAuthenticationService] logging in using manual PAT.");

        let tokenAuthHeader: string = "token " + pat;
        return this.fetchAuthenticatedUser(tokenAuthHeader).then(user => {
            console.info("[GithubAuthenticationService] call to /user succeeded with user: %o", user);
            this._authenticated.next(true);
            this._authenticatedUser.next(user);

            // A fake PAT using the info we have.
            this.personalAccessToken = {
                id: -1,
                url: null,
                token: pat
            };
            localStorage.setItem(PAT_LOCAL_STORAGE_KEY, JSON.stringify(pat));

            localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
            return user;
        }).catch(reason => {
            let errorMessage: string = reason.statusText;
            console.info("[GithubAuthenticationService] call to /user failed with: %o", reason);
            if (reason.status === 401) {
                errorMessage = reason.json().message;
            }
            return Promise.reject<User>(errorMessage)
        });
    }

        /**
     * Called to log the user out.  In this case, we simply remove the credentials from the session
     * storage object and also reset the authenticated flag and the authenticatedUser.
     */
    public logout(): void {
        localStorage.removeItem(PAT_LOCAL_STORAGE_KEY);
        localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
        if (this.personalAccessToken) {
            let val: string = localStorage.getItem(OLD_PATS_LOCAL_STORAGE_KEY);
            let oldPATs: number[] = [];
            if (val) {
                let oldPATs: number[] = JSON.parse(val);
            }
            oldPATs.push(this.personalAccessToken.id);
            localStorage.setItem(OLD_PATS_LOCAL_STORAGE_KEY, JSON.stringify(oldPATs));
        }
        location.reload(true);
    }

    /**
     * Injects the authentication header into the given headers object.
     * @param headers
     */
    public injectAuthHeaders(headers: Headers): void {
        let authHeader: string;
        if (this.personalAccessToken) {
            authHeader = "token " + this.personalAccessToken.token;
        } else {
            authHeader = "Basic " + btoa(this.githubCredentials.login + ":" + this.githubCredentials.password);
        }
        headers.set("Authorization", authHeader);
    }

    /**
     * Dynamically fetch information about the authenticated user.
     * @param authHeader
     */
    private fetchAuthenticatedUser(authHeader: string): Promise<User> {
        let url: string = this.endpoint("/user");
        let headers = new Headers({"Content-Type": "application/json", "Authorization": authHeader});
        let options = new RequestOptions({headers: headers});

        console.info("[GithubAuthenticationService] Fetching authenticated user information.");

        return this.http.get(url, options).map(response => {
            console.info("[GithubAuthenticationService] retrieved JSON data, mapping to User object");
            let user: User = new User();
            let jdata: any = response.json();
            user.id = jdata.id;
            user.avatar = jdata.avatar_url;
            user.email = jdata.email;
            user.name = jdata.name;
            user.login = jdata.login;
            if (!user.name) {
                user.name = user.login;
            }
            return user;
        }).toPromise();
    }

    /**
     * Deletes the PAT from github.  This is only done on a logout.  A PAT can also be deleted
     * manually via the github UI.
     * @param tokenId id of the PAT to delete
     * @param headers HTTP request headers to use when accessing the github API
     * @return {Promise<void>}
     */
    private deletePersonalAccessToken(tokenId: number, headers: Headers): Promise<number> {
        console.info("[GithubAuthenticationService] Deleting PAT: %o", this.personalAccessToken);
        let url: string = this.endpoint("/authorizations/:id", {
            id: tokenId
        });
        let options = new RequestOptions({headers: headers});

        return this.http.delete(url, options).map(() => {
            return tokenId;
        }).toPromise();
    }

    /**
     * Asynchronously verifies that the user is authenticated via a personal access token.  This will
     * simply try to fetch the user's personal information.  If the request fails, then we'll mark the
     * user as *not* authenticated.  That should trigger a re-login the next time the user navigates
     * to any page in the UI.
     */
    private verifyAuthenticatedUser(): void {
        let tokenAuthHeader: string = "token " + this.personalAccessToken.token;
        this.fetchAuthenticatedUser(tokenAuthHeader).then( user => {
            this._authenticated.next(true);
            this._authenticatedUser.next(user);
        }).catch( reason => {
            console.log("[GithubAuthenticationService] Failed to verify PAT authentication: %o", reason);
            if (reason.status === 401) {
                localStorage.removeItem(PAT_LOCAL_STORAGE_KEY);
                localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
                location.reload(true);
            }
        });
    }

    /**
     * Asynchronously delete all old (stale) personal access tokens from github.  We know about old
     * PATs because we save them in localStorage every time we log out.
     * @headers the HTTP headers to use when making requests to the github API (contains auth info)
     */
    private cleanOldPATs(headers: Headers): void {
        let val: string = localStorage.getItem(OLD_PATS_LOCAL_STORAGE_KEY);
        if (val) {
            let oldPATs: number[] = JSON.parse(val);
            for (let oldPAT of oldPATs) {
                this.deletePersonalAccessToken(oldPAT, headers).then(tokenId => {
                    this.removeOldPATFromLocalStorage(tokenId);
                });
            }
        }
    }

    /**
     * Removes the given PAT token id from the list of stale (need to be deleted) PATs saved
     * in local storage.
     * @param tokenId
     */
    private removeOldPATFromLocalStorage(tokenId: number): void {
        let val: string = localStorage.getItem(OLD_PATS_LOCAL_STORAGE_KEY);
        if (val) {
            let oldPATs: number[] = JSON.parse(val);
            let idx: number = oldPATs.indexOf(tokenId);
            if (idx != -1) {
                oldPATs.splice(idx, 1);
            }
            localStorage.setItem(OLD_PATS_LOCAL_STORAGE_KEY, JSON.stringify(oldPATs));
        }
    }

}
