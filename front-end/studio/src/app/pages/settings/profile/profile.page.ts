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
import {IAuthenticationService} from "../../../services/auth.service";
import {AbstractPageComponent} from "../../../components/page-base.component";
import {User} from "../../../models/user.model";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";

/**
 * The Settings/Profile Page component.
 */
@Component({
    selector: "profile-page",
    templateUrl: "profile.page.html",
    styleUrls: ["profile.page.css"]
})
export class ProfilePageComponent extends AbstractPageComponent {

    /**
     * C'tor.
     * @param authService
     * @param route
     * @param titleService
     */
    constructor(@Inject(IAuthenticationService) private authService: IAuthenticationService, route: ActivatedRoute, titleService: Title) {
        super(route, titleService);
    }

    /**
     * The page title.
     * 
     */
    protected pageTitle(): string {
        return "Apicurio Studio - Settings - Profile";
    }

    public loadAsyncPageData(): void {
        console.log("[ProfilePageComponent] loadAsyncPageData")
    }

    public user(): User {
        return this.authService.getAuthenticatedUserNow();
    }

}
