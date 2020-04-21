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

import {InitiatedLinkedAccount} from "../models/initiated-linked-account.model";
import {LinkedAccount} from "../models/linked-account.model";
import {GitHubOrganization} from "../models/github-organization.model";
import {GitHubRepository} from "../models/github-repository.model";
import {GitLabGroup} from "../models/gitlab-group.model";
import {GitLabProject} from "../models/gitlab-project.model";
import {BitbucketRepository} from "../models/bitbucket-repository.model";
import {BitbucketTeam} from "../models/bitbucket-team.model";
import {AbstractHubService} from "./hub";
import {SourceCodeBranch} from "../models/source-code-branch.model";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {CompleteLinkedAccount} from "../models/complete-linked-account.model";
import {CreateLinkedAccount} from "../models/create-linked-account.model";
import {IAuthenticationService} from "./auth.service";
import {Injectable} from "@angular/core";


/**
 * An implementation of the Linked Accounts service that uses the Apicurio Studio back-end (Hub API) service
 * to store and retrieve relevant information for the user.
 */
@Injectable()
export class LinkedAccountsService extends AbstractHubService {

    /**
     * Constructor.
     * @param http
     * @param authService
     * @param config
     */
    constructor(http: HttpClient, authService: IAuthenticationService, config: ConfigService) {
        super(http, authService, config);
    }

    /**
     * @see LinkedAccountsService.getLinkedAccounts
     */
    public getLinkedAccounts(): Promise<LinkedAccount[]> {
        console.info("[LinkedAccountsService] Getting all linked accounts");

        let url: string = this.endpoint("/accounts");
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[LinkedAccountsService] Fetching linked accounts: %s", url);
        return this.httpGet<LinkedAccount[]>(url, options);
    }

    /**
     * @see LinkedAccountsService.createLinkedAccount
     */
    public createLinkedAccount(accountType: string, redirectUrl: string): Promise<InitiatedLinkedAccount> {
        console.info("[LinkedAccountsService] Creating a linked account via the hub API.  Type: %s", accountType);
        let cla: CreateLinkedAccount = new CreateLinkedAccount();
        cla.type = accountType;
        cla.redirectUrl = redirectUrl;

        let url: string = this.endpoint("/accounts");
        let options: any = this.options({ "Accept": "application/json", "Content-Type": "application/json" });

        console.info("[LinkedAccountsService] Creating a linked account: %s", url);
        return this.httpPostWithReturn<CreateLinkedAccount, InitiatedLinkedAccount>(url, cla, options);
    }

    /**
     * @see LinkedAccountsService.deleteLinkedAccount
     */
    public deleteLinkedAccount(type: string): Promise<void> {
        console.info("[LinkedAccountsService] Deleting a linked account via the hub API");

        let url: string = this.endpoint("/accounts/:accountType", {
            accountType: type
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[LinkedAccountsService] Deleting a linked account: %s", url);
        return this.httpDelete(url, options);
    }

    /**
     * @see LinkedAccountsService.getLinkedAccount
     */
    public getLinkedAccount(type: string): Promise<LinkedAccount> {
        let url: string = this.endpoint("/accounts/:accountType", {
            accountType: type
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[LinkedAccountsService] Getting a linked account: %s", url);
        return this.httpGet<LinkedAccount>(url, options);
    }

    /**
     * @see LinkedAccountsService.completeLinkedAccount
     */
    public completeLinkedAccount(accountType: string, nonce: string): Promise<void> {
        console.info("[LinkedAccountsService] Completing a linked account via the hub API.  Type: %s", accountType);
        let cla: CompleteLinkedAccount = new CompleteLinkedAccount();
        cla.nonce = nonce;

        let url: string = this.endpoint("/accounts/:accountType", {
            accountType: accountType
        });
        let options: any = this.options({ "Accept": "application/json", "Content-Type": "application/json" });

        console.info("[LinkedAccountsService] Finalizing/completing a linked account: %s", url);
        return this.httpPut<CompleteLinkedAccount>(url, cla, options);
    }

    /**
     * @see LinkedAccountsService.getAccountOrganizations
     */
    public getAccountOrganizations(accountType: string): Promise<GitHubOrganization[]> {
        let organizationsUrl: string = this.endpoint("/accounts/:accountType/organizations", {
            accountType: accountType
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[LinkedAccountsService] Getting organizations: %s", organizationsUrl);
        return this.httpGet<GitHubOrganization[]>(organizationsUrl, options);
    }

    /**
     * @see LinkedAccountsService.getAccountRepositories
     */
    public getAccountRepositories(accountType: string, organizationOrTeam: string): Promise<GitHubRepository[]|BitbucketRepository[]> {
        let repositoriesUrl: string = this.endpoint("/accounts/:accountType/organizations/:org/repositories", {
            accountType: accountType,
            org: organizationOrTeam
        });
        if (accountType === "Bitbucket") {
            repositoriesUrl = this.endpoint("/accounts/:accountType/teams/:team/repositories", {
                accountType: accountType,
                team: organizationOrTeam
            });
        }
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[LinkedAccountsService] Getting repositories: %s", repositoriesUrl);
        return this.httpGet<GitHubRepository[]|BitbucketRepository[]>(repositoriesUrl, options);
    }

    /**
     * @see LinkedAccountsService.getAccountBranches
     */
    public getAccountBranches(accountType: string, orgOrTeam: string, projectOrRepo: string|number): Promise<SourceCodeBranch[]> {
        let urlTemplate: string = "/accounts/:accountType/organizations/:orgOrTeam/repositories/:projectOrRepo/branches";
        if (accountType === "GitLab") {
            urlTemplate = "/accounts/:accountType/projects/:projectOrRepo/repository/branches";
        } else if (accountType === "Bitbucket") {
            urlTemplate = "/accounts/:accountType/teams/:orgOrTeam/repositories/:projectOrRepo/branches";
        }
        let branchesUrl: string = this.endpoint(urlTemplate, {
            accountType: accountType,
            orgOrTeam: orgOrTeam,
            projectOrRepo: projectOrRepo
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[LinkedAccountsService] Getting branches: %s", branchesUrl);
        return this.httpGet<SourceCodeBranch[]>(branchesUrl, options);
    }

    /**
     * @see LinkedAccountsService.getAccountGroups
     */
    public getAccountGroups(accountType: string): Promise<GitLabGroup[]> {
        let groupsUrl: string = this.endpoint("/accounts/:accountType/groups", {
            accountType: accountType
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[LinkedAccountsService] Getting groups: %s", groupsUrl);
        return this.httpGet<GitLabGroup[]>(groupsUrl, options);
    }

    /**
     * @see LinkedAccountsService.getAccountProjects
     */
    public getAccountProjects(accountType: string, group: number): Promise<GitLabProject[]> {
        let projectsUrl: string = this.endpoint("/accounts/:accountType/groups/:group/projects", {
            accountType: accountType,
            group: group
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[LinkedAccountsService] Getting projects: %s", projectsUrl);
        return this.httpGet<GitLabProject[]>(projectsUrl, options);
    }

    /**
     * @see LinkedAccountsService.getAccountTeams
     */
    public getAccountTeams(accountType: string): Promise<BitbucketTeam[]> {
        let teamsUrl: string = this.endpoint("/accounts/:accountType/teams", {
            accountType: accountType
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[LinkedAccountsService] Getting teams: %s", teamsUrl);
        return this.httpGet<BitbucketTeam[]>(teamsUrl, options);
    }

}
