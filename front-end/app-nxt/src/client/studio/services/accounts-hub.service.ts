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


import 'rxjs/Rx';
import {IAuthenticationService} from "./auth.service";
import {ConfigService} from "./config.service";

import {AbstractHubService} from "./hub";
import {ILinkedAccountsService} from "./accounts.service";
import {LinkedAccount} from "../models/linked-account";
import {InitiatedLinkedAccount} from "../models/initiated-linked-account";
import {CreateLinkedAccount} from "../models/create-linked-account";
import {CompleteLinkedAccount} from "../models/complete-linked-account";
import {GitHubOrganization} from "../models/github-organization";
import {GitHubRepository} from "../models/github-repository";
import {GitLabGroup} from "../models/gitlab-group";
import {GitLabProject} from "../models/gitlab-project";
import {BitbucketRepository} from "../models/bitbucket-repository";
import {BitbucketTeam} from "../models/bitbucket-team";
import {HttpClient} from "@angular/common/http";


/**
 * An implementation of the Linked Accounts service that uses the Apicurio Studio back-end (Hub API) service
 * to store and retrieve relevant information for the user.
 */
export class HubLinkedAccountsService extends AbstractHubService implements ILinkedAccountsService {

    /**
     * Constructor.
     * @param {HttpClient} http
     * @param {IAuthenticationService} authService
     * @param {ConfigService} config
     */
    constructor(http: HttpClient, authService: IAuthenticationService, config: ConfigService) {
        super(http, authService, config);
    }

    /**
     * @see ILinkedAccountsService.getLinkedAccounts
     */
    public getLinkedAccounts(): Promise<LinkedAccount[]> {
        console.info("[HubLinkedAccountsService] Getting all linked accounts");

        let url: string = this.endpoint("/accounts");
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubLinkedAccountsService] Fetching linked accounts: %s", url);
        return this.httpGet<LinkedAccount[]>(url, options);
    }

    /**
     * @see ILinkedAccountsService.createLinkedAccount
     */
    public createLinkedAccount(accountType: string, redirectUrl: string): Promise<InitiatedLinkedAccount> {
        console.info("[HubLinkedAccountsService] Creating a linked account via the hub API.  Type: %s", accountType);
        let cla: CreateLinkedAccount = new CreateLinkedAccount();
        cla.type = accountType;
        cla.redirectUrl = redirectUrl;

        let url: string = this.endpoint("/accounts");
        let options: any = this.options({ "Accept": "application/json", "Content-Type": "application/json" });

        console.info("[HubLinkedAccountsService] Creating a linked account: %s", url);
        return this.httpPostWithReturn<CreateLinkedAccount, InitiatedLinkedAccount>(url, cla, options);
    }

    /**
     * @see ILinkedAccountsService.deleteLinkedAccount
     */
    public deleteLinkedAccount(type: string): Promise<void> {
        console.info("[HubLinkedAccountsService] Deleting a linked account via the hub API");

        let url: string = this.endpoint("/accounts/:accountType", {
            accountType: type
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubLinkedAccountsService] Deleting a linked account: %s", url);
        return this.httpDelete(url, options);
    }

    /**
     * @see ILinkedAccountsService.getLinkedAccount
     */
    public getLinkedAccount(type: string): Promise<LinkedAccount> {
        let url: string = this.endpoint("/accounts/:accountType", {
            accountType: type
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubLinkedAccountsService] Getting a linked account: %s", url);
        return this.httpGet<LinkedAccount>(url, options);
    }

    /**
     * @see ILinkedAccountsService.completeLinkedAccount
     */
    public completeLinkedAccount(accountType: string, nonce: string): Promise<void> {
        console.info("[HubLinkedAccountsService] Completing a linked account via the hub API.  Type: %s", accountType);
        let cla: CompleteLinkedAccount = new CompleteLinkedAccount();
        cla.nonce = nonce;

        let url: string = this.endpoint("/accounts/:accountType", {
            accountType: accountType
        });
        let options: any = this.options({ "Accept": "application/json", "Content-Type": "application/json" });

        console.info("[HubLinkedAccountsService] Finalizing/completing a linked account: %s", url);
        return this.httpPut<CompleteLinkedAccount>(url, cla, options);
    }

    /**
     * @see ILinkedAccountsService.getAccountOrganizations
     */
    public getAccountOrganizations(accountType: string): Promise<GitHubOrganization[]> {
        let organizationsUrl: string = this.endpoint("/accounts/:accountType/organizations", {
            accountType: accountType
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubLinkedAccountsService] Getting organizations: %s", organizationsUrl);
        return this.httpGet<GitHubOrganization[]>(organizationsUrl, options);
    }

    /**
     * @see ILinkedAccountsService.getAccountRepositories
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

        console.info("[HubLinkedAccountsService] Getting repositories: %s", repositoriesUrl);
        return this.httpGet<GitHubRepository[]|BitbucketRepository[]>(repositoriesUrl, options);
    }

    /**
     * @see ILinkedAccountsService.getAccountGroups
     */
    public getAccountGroups(accountType: string): Promise<GitLabGroup[]> {
        let groupsUrl: string = this.endpoint("/accounts/:accountType/groups", {
            accountType: accountType
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubLinkedAccountsService] Getting groups: %s", groupsUrl);
        return this.httpGet<GitLabGroup[]>(groupsUrl, options);
    }

    /**
     * @see ILinkedAccountsService.getAccountProjects
     */
    public getAccountProjects(accountType: string, group: string): Promise<GitLabProject[]> {
        let projectsUrl: string = this.endpoint("/accounts/:accountType/groups/:group/projects", {
            accountType: accountType,
            group: group
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubLinkedAccountsService] Getting projects: %s", projectsUrl);
        return this.httpGet<GitLabProject[]>(projectsUrl, options);
    }

    /**
     * @see ILinkedAccountsService.getAccountTeams
     */
    public getAccountTeams(accountType: string): Promise<BitbucketTeam[]> {
        let teamsUrl: string = this.endpoint("/accounts/:accountType/teams", {
            accountType: accountType
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubLinkedAccountsService] Getting teams: %s", teamsUrl);
        return this.httpGet<BitbucketTeam[]>(teamsUrl, options);
    }

}
