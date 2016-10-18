import {Component, OnInit, Inject} from '@angular/core';
import {User} from "../models/user.model";
import {IAuthenticationService} from "../services/auth.service";
import {Observable} from "rxjs";

@Component({
    moduleId: module.id,
    selector: 'nav-header',
    templateUrl: 'nav-header.component.html',
    styleUrls: [ 'nav-header.component.css' ]
})
export class NavHeaderComponent implements OnInit {

    constructor(@Inject(IAuthenticationService) private authService: IAuthenticationService) {}

    ngOnInit(): void {
    }

    public user(): Observable<User> {
        return this.authService.getAuthenticatedUser();
    }

    public logout(): void {
        this.authService.logout();
    }

}
