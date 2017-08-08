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

import {Http, RequestOptions} from "@angular/http";
import {AbstractHubService} from "./hub";
import {ILinkedAccountsService} from "./accounts.service";
import {LinkedAccount} from "../models/linked-account";
import {InitiatedLinkedAccount} from "../models/initiated-linked-account";
import {CreateLinkedAccount} from "../models/create-linked-account";
import {CompleteLinkedAccount} from "../models/complete-linked-account";
import {GitHubOrganization} from "../models/github-organization";
import {GitHubRepository} from "../models/github-repository";


/**
 * An implementation of the Linked Accounts service that uses the Apicurio Studio back-end (Hub API) service
 * to store and retrieve relevant information for the user.
 */
export class HubLinkedAccountsService extends AbstractHubService implements ILinkedAccountsService {

    /**
     * Constructor.
     * @param http
     * @param authService
     */
    constructor(http: Http, authService: IAuthenticationService, config: ConfigService) {
        super(http, authService, config);
    }

    /**
     * @see ILinkedAccountsService.getLinkedAccounts
     */
    public getLinkedAccounts(): Promise<LinkedAccount[]> {
        console.info("[HubLinkedAccountsService] Getting all linked accounts");

        let url: string = this.endpoint("/accounts");
        let options: RequestOptions = this.options({ "Accept": "application/json" });

        console.info("[HubLinkedAccountsService] Fetching linked accounts: %s", url);

        return this.http.get(url, options).map( response => {
            let accounts: LinkedAccount[] = response.json() as LinkedAccount[];
            return accounts;
        }).toPromise();
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
        let options: RequestOptions = this.options({ "Accept": "application/json", "Content-Type": "application/json" });
        let body: any = cla;

        console.info("[HubLinkedAccountsService] Creating a linked account: %s", url);

        return this.http.post(url, body, options).map( response => {
            let ila: InitiatedLinkedAccount = response.json() as InitiatedLinkedAccount;
            return ila;
        }).toPromise();
    }

    /**
     * @see ILinkedAccountsService.deleteLinkedAccount
     */
    public deleteLinkedAccount(type: string): Promise<void> {
        console.info("[HubLinkedAccountsService] Deleting a linked account via the hub API");

        let url: string = this.endpoint("/accounts/:accountType", {
            accountType: type
        });
        let options: RequestOptions = this.options({ "Accept": "application/json" });

        console.info("[HubLinkedAccountsService] Deleting a linked account: %s", url);

        return this.http.delete(url, options).map( () => {
            return null;
        }).toPromise();
    }

    /**
     * @see ILinkedAccountsService.getLinkedAccount
     */
    public getLinkedAccount(type: string): Promise<LinkedAccount> {
        let url: string = this.endpoint("/accounts/:accountType", {
            accountType: type
        });
        let options: RequestOptions = this.options({ "Accept": "application/json" });

        console.info("[HubLinkedAccountsService] Getting a linked account: %s", url);

        return this.http.get(url, options).map( response => {
            let account: LinkedAccount = response.json() as LinkedAccount;
            return account;
        }).toPromise();
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
        let options: RequestOptions = this.options({ "Accept": "application/json", "Content-Type": "application/json" });
        let body: any = cla;

        console.info("[HubLinkedAccountsService] Finalizing/completing a linked account: %s", url);

        return this.http.put(url, body, options).map( () => {
            return null;
        }).toPromise();
    }

    /**
     * @see ILinkedAccountsService.getAccountOrganizations
     */
    public getAccountOrganizations(accountType: string): Promise<GitHubOrganization[]> {
        let organizationsUrl: string = this.endpoint("/accounts/:accountType/organizations", {
            accountType: accountType
        });
        let options: RequestOptions = this.options({ "Accept": "application/json" });

        console.info("[HubLinkedAccountsService] Getting organizations: %s", organizationsUrl);

        return this.http.get(organizationsUrl, options).map( response => {
            return response.json() as GitHubOrganization[];
        }).toPromise();
    }

    /**
     * @see ILinkedAccountsService.getAccountRepositories
     */
    public getAccountRepositories(accountType: string, organization: string): Promise<GitHubRepository[]> {
        let repositoriesUrl: string = this.endpoint("/accounts/:accountType/organizations/:org/repositories", {
            accountType: accountType,
            org: organization
        });
        let options: RequestOptions = this.options({ "Accept": "application/json" });

        console.info("[HubLinkedAccountsService] Getting repositories: %s", repositoriesUrl);

        return this.http.get(repositoriesUrl, options).map( response => {
            return response.json() as GitHubRepository[];
        }).toPromise();
    }

}
