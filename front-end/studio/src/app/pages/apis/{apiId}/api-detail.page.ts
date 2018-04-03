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
import {ActivatedRoute, Router} from "@angular/router";

import {IApisService} from "../../../services/apis.service";
import {Api} from "../../../models/api.model";
import {ApiContributors} from "../../../models/api-contributors.model";
import {AbstractPageComponent} from "../../../components/page-base.component";
import {ApiDesignChange} from "../../../models/api-design-change.model";
import {Title} from "@angular/platform-browser";

@Component({
    moduleId: module.id,
    selector: "api-detail-page",
    templateUrl: "api-detail.page.html",
    styleUrls: ["api-detail.page.css"]
})
export class ApiDetailPageComponent extends AbstractPageComponent {

    public api: Api;
    public contributors: ApiContributors;
    public activity: ApiDesignChange[] = [];
    public activityStart: number = 0;
    public activityEnd: number = 10;
    public hasMoreActivity: boolean = false;
    public gettingMoreActivity: boolean = false;

    /**
     * Constructor.
     * @param {Router} router
     * @param {ActivatedRoute} route
     * @param {IApisService} apis
     * @param {Title} titleService
     */
    constructor(private router: Router, route: ActivatedRoute,
                @Inject(IApisService) private apis: IApisService, titleService: Title) {
        super(route, titleService);
        this.api = new Api();
    }

    /**
     * The page title.
     * @return {string}
     */
    protected pageTitle(): string {
        if (this.api.name) {
            return "Apicurio Studio - API :: " + this.api.name;
        } else {
            return "Apicurio Studio - API Details";
        }
    }

    /**
     * Called to kick off loading the page's async data.
     * @param params
     */
    public loadAsyncPageData(params: any): void {
        console.info("[ApiDetailPageComponent] Loading async page data");
        let apiId: string = params["apiId"];
        this.apis.getApi(apiId).then(api => {
            this.api = api;
            this.dataLoaded["api"] = true;
            this.updatePageTitle();
        }).catch(error => {
            console.error("[ApiDetailPageComponent] Error getting API");
            this.error(error);
        });
        this.apis.getContributors(apiId).then(contributors => {
            console.info("[ApiDetailPageComponent] Contributors data loaded: %o", contributors);
            this.contributors = contributors;
            this.dataLoaded["contributors"] = true;
        }).catch(error => {
            console.error("[ApiDetailPageComponent] Error getting API contributors");
            this.error(error);
        });
        this.apis.getActivity(apiId, this.activityStart, this.activityEnd).then(activity => {
            console.info("[ApiDetailPageComponent] Activity data loaded: %o", activity);
            this.activity = activity;
            this.dataLoaded["activity"] = true;
            this.hasMoreActivity = activity && activity.length >= 10;
        }).catch(error => {
            console.error("[ApiDetailPageComponent] Error getting API activity");
            this.error(error);
        });
    }

    /**
     * Called to delete the API from the studio (unmanage it).
     */
    public deleteApi(): void {
        // TODO need a visual indicator that we're working on the delete
        this.apis.deleteApi(this.api).then(() => {
            this.router.navigate([ "" ]);
        }).catch( reason => {
            this.error(reason);
        });
    }

    /**
     * Called when the user clicks on a Tag in the API details page.
     * @param {string} tag
     */
    public selectTag(tag: string): void {
        // TODO do something when the user clicks a tag?
    }

    /**
     * Called when the user wishes to see more activity.
     */
    public showMoreActivity(): void {
        this.activityStart += 10;
        this.activityEnd += 10;

        this.apis.getActivity(this.api.id, this.activityStart, this.activityEnd).then(activity => {
            this.activity = this.activity.concat(activity);
            this.hasMoreActivity = activity && activity.length >= 10;
        }).catch(error => {
            console.error("[ApiDetailPageComponent] Error getting API activity");
            this.error(error);
        });
    }

}
