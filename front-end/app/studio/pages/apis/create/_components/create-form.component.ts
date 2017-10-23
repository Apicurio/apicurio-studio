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

import {Component, EventEmitter, Inject, Output} from "@angular/core";
import {IApisService} from "../../../../services/apis.service";
import {User} from "../../../../models/user.model";
import {IAuthenticationService} from "../../../../services/auth.service";
import {NewApi} from "../../../../models/new-api.model";
import {ILinkedAccountsService} from "../../../../services/accounts.service";
import {LinkedAccount} from "../../../../models/linked-account";
import {GitHubOrganization} from "../../../../models/github-organization";
import {DropDownOption} from "../../{apiId}/editor/_components/common/drop-down.component";
import {GitHubRepository} from "../../../../models/github-repository";
import {GitLabGroup} from "../../../../models/gitlab-group";
import {GitLabProject} from "../../../../models/gitlab-project";


@Component({
    moduleId: module.id,
    selector: "createapi-form",
    templateUrl: "create-form.component.html",
    styleUrls: ["create-form.component.css"]
})
export class CreateApiFormComponent {

    @Output() onCreateApi = new EventEmitter<NewApi>();

    model: any = {
        type: "3.0.0",
        name: null,
        description: null,
        accountType: null,
        github: {
            organization: null,
            repository: null,
            resource: null
        },
        gitlab: {
            group: null,
            project: null,
            resource: null
        },
        bitbucket: {
        }
    };
    creatingApi: boolean = false;
    error: string;

    fetchingAccounts: boolean = false;

    // when fetching github data
    fetchingOrgs: boolean = false;
    fetchingRepos: boolean = false;

    // when fetching gitlab data
    fetchingGroups: boolean = false;
    fetchingProjects: boolean = false;

    showAccountLinkingWarning: boolean = false;

    private _accounts: LinkedAccount[];

    // GitHub data
    private _gh_orgs: GitHubOrganization[];
    private _gh_userOrg: GitHubOrganization;
    private _gh_repos: GitHubRepository[];

    // GitLab data
    private _gl_groups: GitLabGroup[];
    private _gl_user: string;
    private _gl_projects: GitLabProject[];

    private _user: User;

    public ngOnInit(): void {
    }

    /**
     * Constructor.
     * @param {IApisService} apisService
     * @param {IAuthenticationService} authService
     * @param {ILinkedAccountsService} accountsService
     */
    constructor(@Inject(IApisService) private apisService: IApisService,
            @Inject(IAuthenticationService) private authService: IAuthenticationService,
            @Inject(ILinkedAccountsService) private accountsService: ILinkedAccountsService)
    {
        this.creatingApi = false;
        this.fetchingOrgs = false;
        this.fetchingAccounts = true;

        authService.getAuthenticatedUser().subscribe( user => {
            this._user = user;
        });

        accountsService.getLinkedAccounts().then( accounts => {
            this._accounts = accounts;
        }).catch( error => {
            console.error("[CreateApiFormComponent] Error getting linked accounts: %o", error)
            this.error = error;
            this.fetchingAccounts = false;
        });
    }

    public typeOptions(): DropDownOption[] {
        return [
            { name: "Open API 2.0 (Swagger)", value: "2.0"},
            { name: "Open API 3.0.0", value: "3.0.0"}
        ];
    }

    public changeType(value: string): void {
        this.model.type = value;
    }

    /**
     * Sets the selected account type.
     * @param {string} accountType
     */
    public setAccountType(accountType: string): void {
        if (this.model.accountType === accountType) {
            return;
        }
        if (this.hasLinkedAccount(accountType)) {
            this.model.accountType = accountType;
            this.showAccountLinkingWarning = false;

            if (accountType === "GitHub") {
                this.model.github.organization = null;
                this.model.github.repository = null;
                this.fetchGitHubOrgs();
            }

            if (accountType === "GitLab") {
                this.model.gitlab.group = null;
                this.model.gitlab.project = null;
                this.fetchGitLabGroups();
            }

        } else {
            this.showAccountLinkingWarning = true;
        }
    }

    /*****************************************
     * GitHub
     *****************************************/

    public gitHubUserOrg(): GitHubOrganization {
        return this._gh_userOrg;
    }

    public gitHubOrganizations(): GitHubOrganization[] {
        return this._gh_orgs;
    }

    public setGitHubOrganization(org: GitHubOrganization): void {
        this.model.github.organization = org;
        this.model.github.repository = null;
        this.fetchingRepos = true;
        this._gh_repos = [];
        this.accountsService.getAccountRepositories('GitHub', this.model.github.organization.id).then( repos => {
            this._gh_repos = repos.sort( (repo1, repo2) => {
                return repo1.name.toLowerCase().localeCompare(repo2.name.toLowerCase());
            });
            this.fetchingRepos = false;
        }).catch( errorReason => {
            console.error("[CreateApiFormComponent] Error getting repos: %o", errorReason)
            this.error = errorReason;
            this.fetchingRepos = false;
        });
    }

    public gitHubRepositories(): GitHubRepository[] {
        return this._gh_repos;
    }

    public setGitHubRepository(repo: GitHubRepository): void {
        this.model.github.repository = repo;
    }

    private fetchGitHubOrgs(): void {
        this.fetchingOrgs = true;
        this.accountsService.getAccountOrganizations("GitHub").then( orgs => {
            this._gh_orgs = [];
            orgs.forEach( org => {
                if (!org.userOrg) {
                    this._gh_orgs.push(org);
                } else {
                    this._gh_userOrg = org;
                }
            });
            this._gh_orgs = this._gh_orgs.sort( (org1, org2) => {
                return org1.id.toLowerCase().localeCompare(org2.id.toLowerCase());
            });
            this.fetchingOrgs = false;
        }).catch( error => {
            console.error("[CreateApiFormComponent] Error getting orgs: %o", error)
            this.error = error;
            this.fetchingOrgs = false;
        });
    }

    /******************************************
     * GitLab
     ******************************************/

    public gitLabUser(): string {
        return this._gl_user;
    }

    public gitLabGroups(): any[] {
        return this._gl_groups;
    }

    public setGitLabGroup(group: any): void {
        this.model.gitlab.group = group;
        this.model.gitlab.project = null;
        this.fetchingProjects = true;
        this._gl_projects = [];
        this.accountsService.getAccountProjects('GitLab', group.id).then( projects => {
            this._gl_projects = projects.sort( (project1, project2) => {
                return project1.name.toLowerCase().localeCompare(project2.name.toLowerCase());
            });
            this.fetchingProjects = false;
        }).catch( errorReason => {
            console.error("[CreateApiFormComponent] Error getting projects: %o", errorReason)
            this.error = errorReason;
            this.fetchingProjects = false;
        });
    }

    public gitLabProjects(): any[] {
        return this._gl_projects;
    }

    public setGitLabProject(project: any): void {
        this.model.gitlab.project = project;
    }

    private fetchGitLabGroups(): void {
        this.fetchingGroups = true;
        this.accountsService.getAccountGroups("GitLab").then( groups => {
            this._gl_groups = [];
            groups.forEach( group => {
                this._gl_groups.push(group);
            });
            this._gl_groups = this._gl_groups.sort( (group1, group2) => {
                return group1.name.toLowerCase().localeCompare(group2.name.toLowerCase());
            });
            this.fetchingGroups = false;
        }).catch( error => {
            console.error("[CreateApiFormComponent] Error getting groups: %o", error)
            this.error = error;
            this.fetchingGroups = false;
        });
    }


    /**
     * Called when the user clicks the "Create API" submit button on the form.
     */
    public createApi(): void {
        let api: NewApi = new NewApi();
        api.specVersion = this.model.type;
        api.name = this.model.name;
        api.description = this.model.description;
        if (this.model.accountType === "GitHub") {
            let sep: string = "";
            if (this.model.github.resource && this.model.github.resource[0] !== '/') {
                sep = "/";
            }
            api.repositoryUrl = "https://github.com/" +
                this.model.github.organization.id + "/" +
                this.model.github.repository.name + "/blob/master" + sep +
                this.model.github.resource;
        } else if (this.model.accountType === "GitLab") {
            let sep: string = "";
            if (this.model.gitlab.resource && this.model.gitlab.resource[0] !== '/') {
                sep = "/";
            }
            api.repositoryUrl = "https://gitlab.com/" +
                this.model.gitlab.group.path + "/" +
                this.model.gitlab.project.path + "/blob/master" + sep +
                this.model.gitlab.resource;
        } else if (this.model.accountType === "Bitbucket") {
        }

        console.info("[CreateApiFormComponent] Firing 'create-api' event: %o", api);

        this.creatingApi = true;
        this.onCreateApi.emit(api);
    }

    /**
     * Returns true if all of the required form fields have values.  This method does
     * not care whether the form fields have *valid* values (form validation takes
     * care of that).
     * @return {boolean}
     */
    public isFormComplete(): boolean {
        return this.model.github.repository != null || this.model.gitlab.project != null;
    }

    /**
     * Returns true only if the user has a linked account of the appropriate type.
     * @param {string} accountType
     * @return {boolean}
     */
    public hasLinkedAccount(accountType: string): boolean {
        if (this._accounts) {
            return this._accounts.reduce( (pmatch, account) => {
                let match: boolean = account.type === accountType;
                return pmatch || match;
            }, false);
        }
        return false;
    }
}
