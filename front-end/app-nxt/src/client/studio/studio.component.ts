import {Component, Inject, OnInit} from "@angular/core";
import {IAuthenticationService} from "./services/auth.service";
import './operators';

/**
 * This class represents the main application component.
 */
@Component({
    moduleId: module.id,
    selector: "apicurio-studio",
    templateUrl: "studio.component.html",
    styleUrls: [ "studio.component.css" ]
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
