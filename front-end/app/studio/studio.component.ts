import {Component, Inject, OnInit} from '@angular/core';
import {IAuthenticationService} from "./services/auth.service";

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Component({
    moduleId: module.id,
    selector: 'api-design-studio',
    templateUrl: 'studio.component.html',
    styleUrls: [ 'studio.component.less' ]
})
export class StudioComponent implements OnInit {

    private routerOutletWrapperId: string;
    private routerOutletWrapperClass: string;

    constructor(@Inject(IAuthenticationService) private authService: IAuthenticationService) {
        this.routerOutletWrapperId = "api-page-body";
        this.routerOutletWrapperClass = "";

        authService.isAuthenticated().subscribe(authed => {
            if (authed) {
                this.routerOutletWrapperId = "api-page-body";
                this.routerOutletWrapperClass = "";
            } else {
                this.routerOutletWrapperId = "login-form";
                this.routerOutletWrapperClass = "login-pf";
            }
        });
    }

    ngOnInit(): void {
    }

}
