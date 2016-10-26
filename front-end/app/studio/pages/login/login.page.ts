import {Component, OnInit, Inject} from '@angular/core';
import {IAuthenticationService} from "../../services/auth.service";
import {Router} from "@angular/router";

const REMEMBER_USERNAME_KEY = "apiman.studio.pages.login.remember-username";
const SAVED_USERNAME_KEY    = "apiman.studio.pages.login.username";

/**
 * The Login Page component - shown to the user when login is required.
 */
@Component({
    moduleId: module.id,
    selector: 'login-page',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.css']
})
export class LoginPageComponent implements OnInit {

    private username: string;
    private password: string;
    private rememberUser: boolean;
    private loginError: string;

    private authenticating: boolean = false;

    constructor(@Inject(IAuthenticationService) private authService: IAuthenticationService, private router: Router) {}

    ngOnInit(): void {
        let v: string = localStorage.getItem(REMEMBER_USERNAME_KEY);
        this.rememberUser = v == 'true';
        if (this.rememberUser) {
            this.username = localStorage.getItem(SAVED_USERNAME_KEY);
        }
    }

    /**
     * Called when the user clicks the "login" button on the login form.
     */
    public login(): void {
        this.authenticating = true;
        localStorage.setItem(REMEMBER_USERNAME_KEY, String(this.rememberUser));
        if (this.rememberUser) {
            localStorage.setItem(SAVED_USERNAME_KEY, this.username);
        }
        this.authService.login(this.username, this.password).then( user => {
            console.info("[LoginPageComponent] User successfully logged in: %o", user);
            this.authenticating = false;

            let path:string = sessionStorage.getItem("apiman.studio.pages.login.redirect-to.path");
            let query:string = sessionStorage.getItem("apiman.studio.pages.login.redirect-to.query");
            let queryParams:any = {};

            if (query) {
                let qitems: string[][] = query.split('&').map(item => item.split("=").map(b => decodeURIComponent(b)));
                for (let pair of qitems) {
                    queryParams[pair[0]] = pair[1];
                }
            }

            let rpath: string = this.asRoute(path);
            console.info("[LoginPageComponent] Login successful, redirecting to: %s", rpath);

            this.router.navigate([ this.asRoute(rpath) ], { "queryParams": queryParams });
        }).catch( reason => {
            this.authenticating = false;
            this.loginError = reason;
        });
    }

    /**
     * Converts a path (as taken from the browser location) into a route.  This is done by removing
     * any possible leading path context like /studio.  Example:
     *
     * /studio/apis/newapi  =>  /apis/newapi
     *
     * When the UI is deployed to a sub-context, this is necessary.
     *
     * @param path
     */
    private asRoute(path: string): string {
        let index: number = location.pathname.indexOf("/login");
        return path.substring(index);
    }
}
