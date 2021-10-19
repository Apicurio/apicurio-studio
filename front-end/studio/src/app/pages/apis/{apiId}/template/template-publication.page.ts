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

import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {ApiDefinition} from "../../../../models/api.model";
import {AbstractPageComponent} from "../../../../components/page-base.component";
import {Title} from "@angular/platform-browser";
import {ApisService} from "../../../../services/apis.service";
import {NewApiTemplate} from "../../../../models/new-api-template.model";
import {ApiTemplatePublication} from "../../../../models/api-template-publication.model";

@Component({
    selector: "template-publication-page",
    templateUrl: "template-publication.page.html",
    styleUrls: ["template-publication.page.css"]
})
export class TemplatePublicationPageComponent extends AbstractPageComponent {

    public api: ApiDefinition;
    public templates: ApiTemplatePublication[];

    public name: string;
    public description: string;

    public sending: boolean = false;
    public sent: boolean = false;

    /**
     * Constructor.
     * @param router
     * @param route
     * @param apis
     * @param titleService
     */
    constructor(private router: Router, route: ActivatedRoute, private apis: ApisService, protected titleService: Title) {
        super(route, titleService);
        this.api = new ApiDefinition();
        this.api.name = "API";
    }

    /**
     * The page title.
     */
    protected pageTitle(): string {
        return "Apicurio Studio - Create Template";
    }

    /**
     * Called to kick off loading the page's async data.
     * @param params
     */
    public loadAsyncPageData(params: any): void {
        console.info("[TemplatePageComponent] Loading async page data");
        let apiId: string = params["apiId"];
        this.apis.getApiDefinition(apiId).then(api => {
            this.api = api;
            this.dataLoaded["api"] = true;
            this.updatePageTitle();
        }).catch(error => {
            console.error("[TemplatePageComponent] Error getting API def");
            this.error(error);
        });
        this.apis.getTemplatePublications(apiId).then(templates => { // getTemplateActivity
            this.templates = templates;
            if (templates && templates.length > 0) {
                console.debug(`Loaded ${templates.length} templates for apiId ${apiId}`);
            }
            this.dataLoaded["templates"] = true;
        });
        
    }

    public isDataLoaded(): boolean {
        return this.isLoaded("api") && this.isLoaded("templates");
    }
    
    public hasTemplatePublications() {
        return this.templates && this.templates.length > 0
    }

    public publishTemplate(): void {
        if (!this.isValid()) {
            return;
        }
        this.sending = true;

        let newTemplate: NewApiTemplate = new NewApiTemplate();
        newTemplate.name = this.name;
        newTemplate.description = this.description;

        this.apis.publishApiTemplate(this.api.id, newTemplate).then(thing => {
            this.sending = false;
            this.sent = true;
            let link: string[] = [ "/apis", this.api.id ];
            console.info("[TemplatePageComponent] Navigating to: %o", link);
            this.router.navigate(link);
        }).catch(error => {
            this.sending = false;
            this.sent = false;
            this.error(error);
        })
    }

    public isValid(): boolean {
        return this.api && this.name && this.name.length > 0;
    }

}
