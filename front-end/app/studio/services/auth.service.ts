import {OpaqueToken} from "@angular/core";
import {Observable} from 'rxjs/Observable';

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
}

export const IAuthenticationService = new OpaqueToken("IAuthenticationService");
