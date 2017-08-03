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

import {Component, OnInit, Inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {IApisService} from "../../../services/apis.service";
import {Api} from "../../../models/api.model";
import {ApiCollaborators} from "../../../models/api-collaborators";
import {AbstractPageComponent} from "../../../components/page-base.component";

@Component({
    moduleId: module.id,
    selector: "api-detail-page",
    templateUrl: "api-detail.page.html",
    styleUrls: ["api-detail.page.css"]
})
export class ApiDetailPageComponent extends AbstractPageComponent {

    public api: Api;
    public collaborators: ApiCollaborators;

    /**
     * Constructor.
     * @param {Router} router
     * @param {ActivatedRoute} route
     * @param {IApisService} apis
     */
    constructor(private router: Router, route: ActivatedRoute,
                @Inject(IApisService) private apis: IApisService) {
        super(route);
        this.api = new Api();
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
        }).catch(error => {
            console.error("[ApiDetailPageComponent] Error getting API");
            this.error(error);
        });
        this.apis.getCollaborators(apiId).then(collaborators => {
            console.info("[ApiDetailPageComponent] Collaborators data loaded: %o", collaborators);
            this.collaborators = collaborators;
            this.dataLoaded["collaborators"] = true;
        }).catch(error => {
            console.error("[ApiDetailPageComponent] Error getting API collaborators");
            this.error(error);
        });
    }

    /**
     * Returns a full URL for the repository resource, for display purposes.
     * @return {string}
     */
    public getResourceUrlLabel(): string {
        return "View on GitHub";
    }

    /**
     * Returns a full URL for the repository resource, for link purposes.
     * @return {string}
     */
    public getResourceUrlHref(): string {
        return this.api.repositoryUrl;
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

}
