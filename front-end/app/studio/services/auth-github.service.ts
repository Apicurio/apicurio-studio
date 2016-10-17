import {IAuthenticationService} from "./auth.service";
import {Http} from "@angular/http";
import {User} from "../models/user.model";
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


const AUTH_SESSION_STORAGE_KEY = "apiman.studio.github-auth.credentials";


class GithubAuthenticationCredentials {
    login: string;
    password: string;
}


/**
 * An implementation of the IAuthenticationService that uses BASIC authentication to
 * authenticate into github.  The app must get the credentials from the user via a
 * custom login form.  The credentials are then used whenever making API calls to
 * github.
 */
export class GithubAuthenticationService implements IAuthenticationService {

    private _authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public authenticated: Observable<boolean> = this._authenticated.asObservable();

    private _authenticatedUser: BehaviorSubject<User> = new BehaviorSubject(null);
    public authenticatedUser: Observable<User> = this._authenticatedUser.asObservable();

    /**
     * Constructor.
     * @param http
     */
    constructor(private http: Http) {}

    /**
     * Returns the observable for is/isnot authenticated.
     * @return {Observable<boolean>}
     */
    isAuthenticated(): Observable<boolean> {
        return this.authenticated;
    }

    /**
     * Returns an observable over the currently authenticated User (or null if not logged in).
     * @return {any}
     */
    getAuthenticatedUser(): Observable<User> {
        return this.authenticatedUser;
    }

    /**
     * Called to authenticate a user.  This implementation will use the provided credentials to
     * make an API call to Github to verify that the credentials are valid.  It is possible that
     * the credentials are correct but that the user has enabled two factor auth.  When this
     * happens, an appropriate exception will be thrown.
     * @param user
     * @param credential
     * @return {undefined}
     */
    login(user: string, credential: any): Promise<User> {
        console.info("[GithubAuthenticationService] logging in user %s", user);
        let rval: User = new User();
        this._authenticated.next(true);
        this._authenticatedUser.next(rval);
        return Promise.resolve(rval);
        //return Promise.reject<User>("Not yet implemented!");
    }

    /**
     * Called to log the user out.  In this case, we simply remove the credentials from the session
     * storage object and also reset the authenticated flag and the authenticatedUser.
     */
    logout(): void {
        this._authenticated.next(false);
        this._authenticatedUser.next(null);
    }

}
