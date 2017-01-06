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