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

import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {IAuthenticationService} from "../services/auth.service";

@Injectable()
export class AuthenticationCanActivateGuard implements CanActivate {

    /**
     * C'tor.
     * @param authService
     * @param router
     */
    constructor(protected authService: IAuthenticationService, private router: Router) {}

    canActivate() {
        let isAuthenticated: boolean = this.authService.isAuthenticated();
        if (!isAuthenticated) {
            let path: string = location.pathname;
            let query: string = location.search.substring(1);

            sessionStorage.setItem("apicurio.studio.pages.login.redirect-to.path", path);
            sessionStorage.setItem("apicurio.studio.pages.login.redirect-to.query", query);

            this.router.navigate(["/login"]);
        }
        return isAuthenticated;
    }
}
