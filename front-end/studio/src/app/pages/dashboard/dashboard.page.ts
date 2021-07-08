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

import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

import {Api} from "../../models/api.model";
import {IAuthenticationService} from "../../services/auth.service";
import {User} from "../../models/user.model";
import {ApisService} from "../../services/apis.service";
import {AbstractPageComponent} from "../../components/page-base.component";
import {LinkedAccountsService} from "../../services/accounts.service";
import {LinkedAccount} from "../../models/linked-account.model";
import {Title} from "@angular/platform-browser";
import {ApiDesignChange} from "../../models/api-design-change.model";
import {CurrentUserService} from "../../services/current-user.service";

/**
 * The Dashboard Page component - models the logical root path of the application.
 */
@Component({
    selector: "dashboard-page",
    templateUrl: "dashboard.page.html",
    styleUrls: ["dashboard.page.css"]
})
export class DashboardPageComponent extends AbstractPageComponent {

    public accounts: LinkedAccount[];
    public recentApis: Api[];
    public activity: ApiDesignChange[] = [];
    public activityStart: number = 0;
    public activityEnd: number = 10;
    public hasMoreActivity: boolean = false;
    public gettingMoreActivity: boolean = false;

    /**
     * C'tor.
     * @param apis
     * @param route
     * @param accountsService
     * @param authService
     * @param titleService
     * @param currentUserService
     */
    constructor(private apis: ApisService, route: ActivatedRoute,
                private accountsService: LinkedAccountsService,
                protected authService: IAuthenticationService,
                protected titleService: Title,
                protected currentUserService: CurrentUserService) {
        super(route, titleService);
    }

    /**
     * The page title.
     * 
     */
    protected pageTitle(): string {
        return "Apicurio Studio - Dashboard";
    }

    /**
     * @see AbstractPageComponent.loadAsyncPageData
     */
    public loadAsyncPageData(): void {
        console.log("[DashboardPageComponent] loadAsyncPageData")
        this.apis.getRecentApis().then( recent => {
            this.recentApis = recent;
            this.loaded("recentApis");
        }).catch( error => {
            console.error("[DashboardPageComponent] Error fetching recent API list.");
            this.error(error);
        });
        this.accountsService.getLinkedAccounts().then( accounts => {
            this.accounts = accounts;
            this.loaded("accounts");
        }).catch( error => {
            console.error("[DashboardPageComponent] Error fetching linked accounts.");
            this.error(error);
        });
        this.currentUserService.getActivity(this.activityStart, this.activityEnd).then(activity => {
            console.info("[DashboardPageComponent] Activity data loaded");
            this.activity = activity;
            this.hasMoreActivity = activity && activity.length >= 10;
            this.dataLoaded["activity"] = true;
        }).catch(error => {
            console.error("[DashboardPageComponent] Error getting user activity");
            this.error(error);
        });
    }

    /**
     * Gets the authenticated user.
     */
    user(): User {
        return this.authService.getAuthenticatedUserNow();
    }

    /**
     * Called when the user wishes to see more activity.
     */
    public showMoreActivity(): void {
        this.activityStart += 10;
        this.activityEnd += 10;

        this.currentUserService.getActivity(this.activityStart, this.activityEnd).then(activity => {
            this.activity = this.activity.concat(activity);
            this.hasMoreActivity = activity && activity.length >= 10;
        }).catch(error => {
            console.error("[DashboardPageComponent] Error getting user activity");
            this.error(error);
        });
    }

    public isOpenApi20(api: Api): boolean {
        return api.type === "OpenAPI20";
    }

    public isOpenApi30(api: Api): boolean {
        return api.type === "OpenAPI30";
    }

    public isAsyncApi20(api: Api): boolean {
        return api.type === "AsyncAPI20";
    }

    public isGraphQL(api: Api): boolean {
        return api.type === "GraphQL";
    }

}
