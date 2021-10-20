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

import {Api} from "../../../../models/api.model";
import {AbstractPageComponent} from "../../../../components/page-base.component";
import {IAuthenticationService} from "../../../../services/auth.service";
import {LinkedAccount} from "../../../../models/linked-account.model";
import {
    DropDownOption,
    DropDownOptionValue,
    DropDownOptionValue as Value
} from "../../../../components/common/drop-down.component";
import {CodeEditorMode} from "../../../../components/common/code-editor.component";
import {PublishApi} from "../../../../models/publish-api.model";
import {Title} from "@angular/platform-browser";
import {ApisService} from "../../../../services/apis.service";
import {LinkedAccountsService} from "../../../../services/accounts.service";
import {ApiPublication} from "../../../../models/api-publication.model";

@Component({
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
    public resource: string;
    public format: string = "YAML";
    public dereference: string = "false";
    public commitMessage: string;

    public publishing: boolean = false;
    public published: boolean = false;


    refOptions: DropDownOption[] = [
        new DropDownOptionValue("Publish API Spec As-Is", "false"),
        new DropDownOptionValue("Dereference All External $refs", "true")
    ];

    /**
     * Constructor.
     * @param router
     * @param route
     * @param apis
     * @param accounts
     * @param authService
     * @param titleService
     */
    constructor(private router: Router, route: ActivatedRoute, private apis: ApisService,
                private accountsService: LinkedAccountsService,
                @Inject(IAuthenticationService) private authService: IAuthenticationService,
                protected titleService: Title) {
        super(route, titleService);
        this.api = new Api();
    }

    /**
     * The page title.
     * 
     */
    protected pageTitle(): string {
        if (this.api.name) {
            return "Apicurio Studio - Publish API :: " + this.api.name;
        } else {
            return "Apicurio Studio - Publish API";
        }
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
            this.updatePageTitle();
            if (api.type === "GraphQL") {
                this.format = "SDL";
            }
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
        this.apis.getPublications(apiId, 0, 1).then( publications => {
            if (publications && publications.length > 0) {
                this.loadStateFromPublication(publications[0]);
            } else {
                console.info("[PublishPageComponent] No prior publications found.");
            }
            this.dataLoaded["publications"] = true;
        }).catch(error => {
            console.error("[PublishPageComponent] Error getting Publications");
            this.error(error);
        });
    }

    private loadStateFromPublication(publication: ApiPublication): void {
        console.info("[PublishPageComponent] Loading page state from: ", publication);
        let info: any = JSON.parse(publication.info);
        console.info("[PublishPageComponent] Page state info: ", info);
        if (info.type === "GitHub") {
            this.model = {
                org: info.org,
                repo: info.repo,
                branch: info.branch
            };
        }
        if (info.type === "GitLab") {
            this.model = {
                group: info.group,
                project: info.project,
                branch: info.branch
            };
        }
        if (info.type === "Bitbucket") {
            this.model = {
                team: info.team,
                repo: info.repo,
                branch: info.branch
            };
        }
        this.resource = info.resource;
        this.format = info.format;
        this._selectedType = info.type;
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

        this.publishing = true;
        let info: PublishApi = new PublishApi();
        info.type = this._selectedType;
        info.org = this.model.org;
        info.repo = this.model.repo;
        info.team = this.model.team;
        info.group = this.model.group;
        info.project = this.model.project;
        info.branch = this.model.branch;
        info.resource = this.resource;
        info.format = this.format;
        info.commitMessage = this.commitMessage;

        this.apis.publishApi(this.api.id, info, this.dereference).then( () => {
            this.publishing = false;
            this.published = true;
        }).catch( error => {
            this.publishing = false;
            this.error(error);
        });
    }

    public setPublishTo(target: string): void {
        if (!this.hasAccount(target) || this.publishing) {
            return;
        }
        this._selectedType = target;
    }

    public setModel(model: any): void {
        this.model = model;
    }

    public resourceChanged(): void {
        if (this.model && this.resource && this.resource.endsWith(".json")) {
            this.format = "JSON";
        }
        if (this.model && this.resource && this.resource.endsWith(".yaml")) {
            this.format = "YAML";
        }
        if (this.model && this.resource && this.resource.endsWith(".yml")) {
            this.format = "YAML";
        }
        if (this.model && this.resource && this.resource.endsWith(".graphql")) {
            this.format = "SDL";
        }
    }

    public isValid(): boolean {
        return this.modelValid &&
            this.commitMessage &&
            this.commitMessage.length > 0 &&
            this.resource &&
            this.resource.length > 0;
    }
    
    public isGraphQL(): boolean {
        return this.api && this.api.type === "GraphQL";
    }

    public commitMessageMode(): CodeEditorMode {
        return CodeEditorMode.Markdown;
    }

    public formatOptions(): DropDownOption[] {
        if (this.isGraphQL()) {
            return [
                new Value("SDL", "SDL")
            ];
        }
        return [
            new Value("YAML", "YAML"),
            new Value("JSON", "JSON")
        ];
    }
}
