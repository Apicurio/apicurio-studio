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

    version: string = "N/A";
    builtOn: Date = new Date();
    projectUrl: string = "http://studio.apiman.io/";

    constructor(@Inject(IAuthenticationService) private authService: IAuthenticationService) {
        if (window['ApimanStudioInfo']) {
            console.info("[NavHeaderComponent] Found app info: %o", window['ApimanStudioInfo'])
            this.version = window['ApimanStudioInfo'].version;
            this.builtOn = new Date(window['ApimanStudioInfo'].builtOn);
            this.projectUrl = window['ApimanStudioInfo'].url;
        } else {
            console.info("[NavHeaderComponent] App info not found.");
        }
    }

    ngOnInit(): void {
    }

    public user(): Observable<User> {
        return this.authService.getAuthenticatedUser();
    }

    public logout(): void {
        this.authService.logout();
    }

}
