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

import {Component, Inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

import {Api} from "../../models/api.model";
import {IAuthenticationService} from "../../services/auth.service";
import {Observable} from "rxjs";
import {User} from "../../models/user.model";
import {IApisService} from "../../services/apis.service";
import {AbstractPageComponent} from "../../components/page-base.component";

/**
 * The Dashboard Page component - models the logical root path of the application.
 */
@Component({
    moduleId: module.id,
    selector: "dashboard-page",
    templateUrl: "dashboard.page.html",
    styleUrls: ["dashboard.page.css"]
})
export class DashboardPageComponent extends AbstractPageComponent {

    constructor(@Inject(IApisService) private apis: IApisService, route: ActivatedRoute,
                @Inject(IAuthenticationService) private authService: IAuthenticationService) {
        super(route);
    }

    public loadAsyncPageData(): void {
        console.log("[DashboardPageComponent] loadAsyncPageData")
        this.apis.getApis().then( apis => {
            this.loaded("apis");
        }).catch( error => {
            console.error("[DashboardPageComponent] Error fetching API list.");
            this.error(error);
        });
    }

    public user(): Observable<User> {
        return this.authService.getAuthenticatedUser();
    }

    public recentApis(): Observable<Api[]> {
        return this.apis.getRecentApis();
    }
}
