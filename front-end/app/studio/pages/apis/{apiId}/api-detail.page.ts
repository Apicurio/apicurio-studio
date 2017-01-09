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

import {Component, OnInit, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {IApisService} from "../../../services/apis.service";
import {Api} from "../../../models/api.model";
import {ApiCollaborators} from "../../../models/api-collaborators";

@Component({
    moduleId: module.id,
    selector: 'api-detail-page',
    templateUrl: 'api-detail.page.html',
    styleUrls: ['api-detail.page.css']
})
export class ApiDetailPageComponent implements OnInit {

    public api: Api;
    public collaborators: ApiCollaborators;

    public dataLoaded: Map<string, boolean> = new Map<string, boolean>();

    /**
     * Constructor.
     * @param router
     * @param route
     * @param apis
     */
    constructor(private router: Router,
                private route: ActivatedRoute,
                @Inject(IApisService) private apis: IApisService) {
        this.api = new Api();
    }

    public ngOnInit(): void {
        this.route.data.subscribe( value => {
            this.api = value["api"];
            console.info("[ApiDetailPageComponent] API from resolve: %o", this.api);
            this.loadAsyncPageData();
        });
    }

    /**
     * Called to kick off loading the page's async data.
     */
    public loadAsyncPageData(): void {
        console.info("[ApiDetailPageComponent] Loading async page data");
        this.apis.getCollaborators(this.api).then( collaborators => {
            console.info("[ApiDetailPageComponent] Collaborators data loaded: %o", collaborators);
            this.collaborators = collaborators;
            this.dataLoaded["collaborators"] = true;
        } );
    }

    /**
     * Returns a full URL for the repository resource, for display purposes.
     * @return {string}
     */
    public getResourceUrlLabel(): string {
        let sep: string = "";
        if (!this.api.repositoryResource.resourceName.startsWith('/')) {
            sep = "/";
        }
        return this.api.repositoryResource.repositoryUrl + sep + this.api.repositoryResource.resourceName;
    }

    /**
     * Returns a full URL for the repository resource, for link purposes.
     * @return {string}
     */
    public getResourceUrlHref(): string {
        let sep: string = "";
        if (!this.api.repositoryResource.resourceName.startsWith('/')) {
            sep = "/";
        }
        return this.api.repositoryResource.repositoryUrl + "/blob/master" + sep + this.api.repositoryResource.resourceName;
    }

    /**
     * Called to delete the API from the studio (unmanage it).
     */
    public onDelete(): void {
        // TODO need a visual indicator that we're working on the delete
        this.apis.deleteApi(this.api).then(() => {
            this.router.navigate([ "" ]);
        }).catch( reason => {
            alert("Failed to delete the API!");
        });
    }

}
