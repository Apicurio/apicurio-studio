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

import {Component, Inject, EventEmitter, Output} from "@angular/core";
import {IApisService} from "../../../services/apis.service";
import {Api} from "../../../models/api.model";
import {User} from "../../../models/user.model";
import {IAuthenticationService} from "../../../services/auth.service";


@Component({
    moduleId: module.id,
    selector: "createapi-form",
    templateUrl: "create-form.component.html",
    styleUrls: ["create-form.component.css"]
})
export class CreateApiFormComponent {

    @Output() onCreateApi = new EventEmitter<Api>();

    model: any = {
        name: null,
        description: null,
        organization: null,
        repository: null,
        resource: null
    };
    creatingApi: boolean = false;
    error: string;

    fetchingOrgs: boolean = false;
    fetchingRepos: boolean = false;

    private _organizations: string[];
    private _repositories: string[];
    private user: User;


    public ngOnInit(): void {
    }

    /**
     * Constructor.
     * @param apis
     */
    constructor(@Inject(IApisService) private apis: IApisService, @Inject(IAuthenticationService) private authService: IAuthenticationService) {
        this.creatingApi = false;
        this.fetchingOrgs = true;
        authService.getAuthenticatedUser().subscribe( user => {
            this.user = user;
        });
        apis.getOrganizations().then( orgs => {
            orgs.push(this.user.username);
            this._organizations = orgs.sort( (org1, org2) => {
                return org1.toLowerCase().localeCompare(org2.toLowerCase());
            });
            this.fetchingOrgs = false;
        }).catch( reason => {
            this.error = reason;
            this.fetchingOrgs = false;
        });
    }

    public organizations(): string[] {
        return this._organizations;
    }

    public setOrganization(org: string): void {
        this.model.organization = org;
        this.model.repository = null;
        this.fetchingRepos = true;
        this._repositories = [];
        this.apis.getRepositories(this.model.organization, org === this.user.username).then( repos => {
            this._repositories = repos.sort();
            this.fetchingRepos = false;
        }).catch( reason => {
            this.error = reason;
            this.fetchingRepos = false;
        })
    }

    public repositories(): string[] {
        return this._repositories;
    }

    public setRepository(repo: string): void {
        this.model.repository = repo;
    }

    /**
     * Called when the user clicks the "Create API" submit button on the form.
     */
    public createApi(): void {
        let api: Api = new Api();
        api.name = this.model.name;
        api.description = this.model.description;
        api.repositoryResource.repositoryType = "GitHub";
        api.repositoryResource.repositoryUrl = "https://github.com/" + this.model.organization + "/" + this.model.repository;
        api.repositoryResource.resourceName = this.model.resource;

        this.creatingApi = true;
        this.onCreateApi.emit(api);
    }

}
