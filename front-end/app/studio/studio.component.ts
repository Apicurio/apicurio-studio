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

import {Component, Inject, OnInit} from "@angular/core";
import {IAuthenticationService} from "./services/auth.service";

import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/toPromise";

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
