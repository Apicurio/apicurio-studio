/**
 * @license
 * Copyright 2018 JBoss Inc
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

import {IApisService} from "../../../../services/apis.service";
import {Api} from "../../../../models/api.model";
import {AbstractPageComponent} from "../../../../components/page-base.component";
import {IAuthenticationService} from "../../../../services/auth.service";
import {ILinkedAccountsService} from "../../../../services/accounts.service";
import {LinkedAccount} from "../../../../models/linked-account.model";
import {DropDownOption} from "../../../../components/common/drop-down.component";

@Component({
    moduleId: module.id,
    selector: "publish-page",
    templateUrl: "publish.page.html",
    styleUrls: ["publish.page.css"]
})
export class PublishPageComponent extends AbstractPageComponent {

    public api: Api;
    public accounts: LinkedAccount[];

    public _selectedType: string;
    public model: any;
    public modelValid: any;
    public format: string = "yaml";

    public publishing: boolean = false;

    /**
     * Constructor.
     * @param {Router} router
     * @param {ActivatedRoute} route
     * @param {IApisService} apis
     * @param {ILinkedAccountsService} accounts
     * @param {IAuthenticationService} authService
     */
    constructor(private router: Router, route: ActivatedRoute,
                @Inject(IApisService) private apis: IApisService,
                @Inject(ILinkedAccountsService) private accountsService: ILinkedAccountsService,
                @Inject(IAuthenticationService) private authService: IAuthenticationService) {
        super(route);
        this.api = new Api();
    }

    /**
     * Called to kick off loading the page's async data.
     * @param params
     */
    public loadAsyncPageData(params: any): void {
        console.info("[PublishPageComponent] Loading async page data");
        let apiId: string = params["apiId"];
        this.apis.getApi(apiId).then(api => {
            this.api = api;
            this.dataLoaded["api"] = true;
        }).catch(error => {
            console.error("[PublishPageComponent] Error getting API");
            this.error(error);
        });
        this.accountsService.getLinkedAccounts().then( accounts => {
            this.accounts = accounts;
            this.dataLoaded["accounts"] = true;
        }).catch(error => {
            console.error("[PublishPageComponent] Error getting Accounts");
            this.error(error);
        });
    }

    public isDataLoaded(): boolean {
        return this.isLoaded("api") && this.isLoaded("accounts");
    }

    public hasAccount(type: string): boolean {
        for (let account of this.accounts) {
            if (account.type === type) {
                return true;
            }
        }
        return false;
    }

    public hasAtLeastOneAccount(): boolean {
        return this.accounts.length > 0;
    }

    public isSelected(type: string): boolean {
        return this._selectedType === type;
    }

    public publishApi(): void {
        if (!this.modelValid) {
            return;
        }
        // TODO publish the API now!
        this.publishing = true;
    }

    public setPublishTo(target: string): void {
        if (!this.hasAccount(target) || this.publishing) {
            return;
        }
        this._selectedType = target;
    }

    public setModel(model: any): void {
        this.model = model;
        if (this.model.resource && this.model.resource.endsWith(".json")) {
            this.format = "json";
        }
    }

    public formatOptions(): DropDownOption[] {
        return [
            {
                name: "YAML",
                value: "yaml"
            },
            {
                name: "JSON",
                value: "json"
            }
        ];
    }
}
