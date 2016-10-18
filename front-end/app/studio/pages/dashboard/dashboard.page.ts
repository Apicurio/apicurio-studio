import {Component, OnInit, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Api} from "../../models/api.model";
import {IAuthenticationService} from "../../services/auth.service";
import {Observable} from "rxjs";
import {User} from "../../models/user.model";

/**
 * The Dashboard Page component - models the logical root path of the application.
 */
@Component({
    moduleId: module.id,
    selector: 'dashboard-page',
    templateUrl: 'dashboard.page.html',
    styleUrls: ['dashboard.page.css']
})
export class DashboardPageComponent implements OnInit {

    recentApis: Api[];

    constructor(private route: ActivatedRoute, @Inject(IAuthenticationService) private authService: IAuthenticationService) {
    }

    ngOnInit(): void {
        this.route.data.subscribe( value => {
            this.recentApis = value["recentApis"];
        });
    }

    public user(): Observable<User> {
        return this.authService.getAuthenticatedUser();
    }
}
