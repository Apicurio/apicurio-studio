/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component} from '@angular/core';
import {IAuthenticationService} from './services/auth.service';
import {User} from "./models/user.model";

@Component({
    moduleId: module.id,
    selector: "apicurio-studio",
    templateUrl: "app.component.html",
    styleUrls: ["app.component.css"]
})
export class AppComponent {

    public routerOutletWrapperId: string;
    public routerOutletWrapperClass: string;

    version: string = "N/A";
    builtOn: Date = new Date();
    projectUrl: string = "http://www.apicur.io/";

    helpExpanded: boolean = false;

    /**
     * @param authService
     */
    constructor(public authService: IAuthenticationService) {
        this.routerOutletWrapperId = "api-page-body";
        this.routerOutletWrapperClass = "app-body";

        let w: any = window;
        if (w["ApicurioStudioInfo"]) {
            console.info("[NavHeaderComponent] Found app info: %o", w["ApicurioStudioInfo"]);
            this.version = w["ApicurioStudioInfo"].version;
            this.builtOn = new Date(w["ApicurioStudioInfo"].builtOn);
            this.projectUrl = w["ApicurioStudioInfo"].url;
        } else {
            console.info("[NavHeaderComponent] App info not found.");
        }

        authService.authenticated().subscribe(authed => {
            if (authed) {
                this.routerOutletWrapperId = "api-page-body";
                this.routerOutletWrapperClass = "app-body";
            } else {
                this.routerOutletWrapperId = "login-form";
                this.routerOutletWrapperClass = "login-pf";
            }
        });
    }


    public user(): User {
        return this.authService.getAuthenticatedUserNow();
    }


    public logout(): void {
        this.helpExpanded = false;
        this.authService.logout();
    }

}
