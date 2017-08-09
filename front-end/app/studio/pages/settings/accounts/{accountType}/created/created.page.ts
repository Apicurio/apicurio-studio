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
import {AbstractPageComponent} from "../../../../../components/page-base.component";
import {ILinkedAccountsService} from "../../../../../services/accounts.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ACCOUNT_LINK_NONCE_KEY} from "../../accounts.page";

/**
 * The page used to finalize the creation of an account link.
 */
@Component({
    moduleId: module.id,
    selector: "created-linked-account-page",
    templateUrl: "created.page.html",
    styleUrls: [ "created.page.css" ]
})
export class CreatedLinkedAccountPageComponent extends AbstractPageComponent {

    accountType: string;
    linkError: string;
    nonce: string;

    /**
     * C'tor.
     * @param {Router} router
     * @param {ActivatedRoute} route
     * @param {ILinkedAccountsService} accountsApi
     */
    constructor(private router: Router, route: ActivatedRoute,
                @Inject(ILinkedAccountsService) private accountsApi: ILinkedAccountsService) {
        super(route);
    }

    /**
     * @see AbstractPageComponent.loadAsyncPageData
     */
    public loadAsyncPageData(pathParams: any, queryParams: any): void {
        console.info("[CreatedLinkedAccountPageComponent] loadAsyncPageData")

        this.accountType = pathParams["accountType"];
        this.linkError = queryParams["link_error"];
        this.nonce = localStorage.getItem(ACCOUNT_LINK_NONCE_KEY + "." + this.accountType)

        console.info("Account Type: %s", this.accountType);
        console.info("Link Error: %s", this.linkError);
        console.info("Nonce: %s", this.nonce);

        if (!this.isLinkError()) {
            this.accountsApi.completeLinkedAccount(this.accountType, this.nonce).then( () => {
                this.router.navigate(["/settings/accounts"]);
            }).catch( error => this.error(error));
        } else {
            this.accountsApi.deleteLinkedAccount(this.accountType).then( () => {
                console.info("[CreatedLinkedAccountPageComponent] Deleted the (failed) linked account.");
            }).catch(error => {
                console.info("[CreatedLinkedAccountPageComponent] Tried to delete the (failed) linked account but got an error: %s", error.toString());
            });
        }
    }

    public isGitHub(): boolean {
        return this.accountType === "GitHub";
    }

    public isGitLab(): boolean {
        return this.accountType === "GitLab";
    }

    public isBitbucket(): boolean {
        return this.accountType === "Bitbucket";
    }

    public isLinkError(): boolean {
        if (this.linkError) {
            return true;
        }
        return false;
    }

}
