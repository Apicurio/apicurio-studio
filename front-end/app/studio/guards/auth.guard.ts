import {Injectable, Inject} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {IAuthenticationService} from "../services/auth.service";
import {Subscription} from "rxjs";

@Injectable()
export class AuthenticationCanActivateGuard implements CanActivate {

    private isAuthenticated: boolean;
    private sub: Subscription;

    constructor(@Inject(IAuthenticationService) private authService: IAuthenticationService, private router: Router) {
        this.sub = authService.isAuthenticated().subscribe(value => {
            this.isAuthenticated = value;
        });
    }

    canActivate() {
        if (!this.isAuthenticated) {
            let path: string = location.pathname;
            let query: string = location.search.substring(1);

            sessionStorage.setItem("apiman.studio.pages.login.redirect-to.path", path);
            sessionStorage.setItem("apiman.studio.pages.login.redirect-to.query", query);

            this.router.navigate(["/login"]);
        }
        return this.isAuthenticated;
    }
}