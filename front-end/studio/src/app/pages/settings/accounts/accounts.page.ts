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
import {AbstractPageComponent} from "../../../components/page-base.component";
import {ILinkedAccountsService} from "../../../services/accounts.service";
import {LinkedAccount} from "../../../models/linked-account.model";
import {ActivatedRoute} from "@angular/router";

export const ACCOUNT_LINK_NONCE_KEY = "apicurio.studio.linked-accounts.nonces";

/**
 * The Settings/Accounts Page component.
 */
@Component({
    moduleId: module.id,
    selector: "accounts-page",
    templateUrl: "accounts.page.html",
    styleUrls: ["accounts.page.css"]
})
export class LinkedAccountsPageComponent extends AbstractPageComponent {

    private accounts: LinkedAccount[];
    private linksInProgress: any = {};

    /**
     * C'tor.
     * @param {ILinkedAccountsService} accountsApi
     * @param {ActivatedRoute} route
     */
    constructor(@Inject(ILinkedAccountsService) private accountsApi: ILinkedAccountsService, route: ActivatedRoute) {
        super(route);
    }

    /**
     * @see AbstractPageComponent.loadAsyncPageData()
     */
    public loadAsyncPageData(): void {
        console.log("[LinkedAccountsPageComponent] loadAsyncPageData")
        this.accountsApi.getLinkedAccounts().then( accounts => {
            this.accounts = accounts;
            this.loaded("accounts");
        }).catch( error => {
            console.error("[LinkedAccountsPageComponent] Error fetching linked accounts.");
            this.error(error);
        });
    }

    /**
     * Returns true if an account of the given type has been created.
     * @param {string} type
     * @return {boolean}
     */
    public isAccountCreated(type: string): boolean {
        let account: LinkedAccount = this.account(type);
        if (account && account.linkedOn) {
            return true;
        }
        return false;
    }

    /**
     * Returns true if an account is missing entirely from the list.
     * @param {string} type
     * @return {boolean}
     */
    public isAccountMissing(type: string): boolean {
        let account: LinkedAccount = this.account(type);
        if (!account) {
            return true;
        }
        return false;
    }

    /**
     * Returns true if an account of the given type has been initiated but not completed.
     * @param {string} type
     * @return {boolean}
     */
    public isAccountInitiated(type: string): boolean {
        let account: LinkedAccount = this.account(type);
        if (account && !account.linkedOn) {
            return true;
        }
        return false;
    }

    /**
     * Returns true if the account is actively being linked or deleted.
     * @param {string} type
     * @return {boolean}
     */
    public isAccountInProgress(type: string): boolean {
        return this.linksInProgress[type];
    }

    /**
     * Called to initiate linking of a particular account.
     * @param {string} type
     */
    public createLinkedAccount(type: string): void {
        this.linksInProgress[type] = true;
        let redirectUrl: string = location.href + "/" + type + "/created";
        this.accountsApi.createLinkedAccount(type, redirectUrl).then( ila => {
            let account: LinkedAccount = new LinkedAccount();
            account.type = type;
            this.accounts.push(account);
            this.linksInProgress[type] = false;
            console.info("Redirecting to: %s", ila.authUrl);
            // Save the nonce in local storage - we'll need it later when the redirect back to Apicurio happens.
            localStorage.setItem(ACCOUNT_LINK_NONCE_KEY + "." + type, ila.nonce);
            // Send the user to the Account Link auth URL (Keycloak account linking URL)
            location.replace(ila.authUrl);
        }).catch( error => {
            this.error(error);
        });
    }

    /**
     * Called to delete a (or cancel an in-progress) linked account.
     * @param {string} type
     */
    public deleteLinkedAccount(type: string): void {
        this.linksInProgress[type] = true;
        this.accountsApi.deleteLinkedAccount(type).then( () => {
            let account: LinkedAccount = this.account(type);
            this.accounts.splice(this.accounts.indexOf(account), 1);
            this.linksInProgress[type] = false;
        }).catch( error => {
            this.error(error);
        });
    }

    /**
     * Returns the linked account of the given type or null if not found.
     * @param {string} type
     * @return {LinkedAccount}
     */
    protected account(type: string): LinkedAccount {
        for (let account of this.accounts) {
            if (account.type === type) {
                return account;
            }
        }
        return null;
    }

}
