import {IAuthenticationService} from "./auth.service";
import {Http, Headers, RequestOptions} from "@angular/http";
import {User} from "../models/user.model";
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

const GITHUB_API_ENDPOINT = "https://api.github.com";
const USER_SESSION_STORAGE_KEY = "apiman.studio.services.github-auth.user";
const CREDENTIALS_SESSION_STORAGE_KEY = "apiman.studio.services.github-auth.credentials";


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

    private githubCredentials: GithubAuthenticationCredentials;

    private _authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public authenticated: Observable<boolean> = this._authenticated.asObservable();

    private _authenticatedUser: BehaviorSubject<User> = new BehaviorSubject(null);
    public authenticatedUser: Observable<User> = this._authenticatedUser.asObservable();

    /**
     * Constructor.
     * @param http
     */
    constructor(private http: Http) {
        let s_user: string = sessionStorage.getItem(USER_SESSION_STORAGE_KEY);
        let s_creds: string = sessionStorage.getItem(CREDENTIALS_SESSION_STORAGE_KEY);
        if (s_user && s_creds) {
            let user: User = JSON.parse(s_user);
            this.githubCredentials = JSON.parse(s_creds);
            this._authenticated.next(true);
            this._authenticatedUser.next(user);
        }
    }

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
     * @param username
     * @param credential
     * @return {undefined}
     */
    login(username: string, credential: any): Promise<User> {
        console.info("[GithubAuthenticationService] logging in user %s", username);
        let url: string = GITHUB_API_ENDPOINT + "/user";
        let authHeader: string = "Basic " + btoa(username + ":" + credential);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': authHeader });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(url, options).map( response => {
            console.info("[GithubAuthenticationService] retrieved JSON data, mapping to User object");
            let user: User = new User();
            let jdata: any = response.json();
            user.id = jdata.id;
            user.avatar = jdata.avatar_url;
            user.email = jdata.email;
            user.name = jdata.name;
            user.username = jdata.login;
            return user;
        }).toPromise().then( user => {
            console.info("[GithubAuthenticationService] call to /user succeeded with user: %o", user);
            this._authenticated.next(true);
            this._authenticatedUser.next(user);

            // Store the credentials and user in session storage.  If the user reloads the page,
            // we will pull these out of session storage rather than require the user login again.
            this.githubCredentials = new GithubAuthenticationCredentials();
            this.githubCredentials.login = username;
            this.githubCredentials.password = credential;
            sessionStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(user));
            sessionStorage.setItem(CREDENTIALS_SESSION_STORAGE_KEY, JSON.stringify(this.githubCredentials));

            // Return the user.
            return user;
        }).catch( reason => {
            let errorMessage: string = reason.statusText;
            console.info("[GithubAuthenticationService] call to /user failed with: %o", reason);
            if (reason.status === 401) {
                errorMessage = reason.json().message;
            }
            return Promise.reject(errorMessage)
        });
    }

    /**
     * Called to log the user out.  In this case, we simply remove the credentials from the session
     * storage object and also reset the authenticated flag and the authenticatedUser.
     */
    logout(): void {
        sessionStorage.removeItem(USER_SESSION_STORAGE_KEY);
        sessionStorage.removeItem(CREDENTIALS_SESSION_STORAGE_KEY);
        location.reload(true);
    }

}
