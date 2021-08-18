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

import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {ApisService} from "../../../services/apis.service";
import {CreateApiFormComponent, CreateApiFormData} from "./_components/create-form.component";
import {NewApi} from "../../../models/new-api.model";
import {AbstractPageComponent} from "../../../components/page-base.component";
import {Title} from "@angular/platform-browser";
import {ImportApi} from "../../../models/import-api.model";
import {Base64} from "js-base64";
import {TemplateService} from "../../../services/template.service";

@Component({
    selector: "createapi-page",
    templateUrl: "create.page.html",
    styleUrls: ["create.page.css"]
})
export class CreateApiPageComponent extends AbstractPageComponent {

    @ViewChild("createApiForm") form: CreateApiFormComponent;

    /**
     * Constructor.
     * @param router
     * @param route
     * @param apis
     * @param titleService
     * @param templateService
     */
    constructor(private router: Router, route: ActivatedRoute, private apis: ApisService, titleService: Title,
                private templateService: TemplateService) {
        super(route, titleService);
    }

    /**
     * Called to kick off loading the page's async data.
     * @param params
     */
    public loadAsyncPageData(params: any): void {
        console.info("[CreateApiPageComponent] Loading async page data");
        // Dynamically load the templates.
        this.templateService.loadAllTemplates().then(() => {
            this.dataLoaded["templates"] = true;
        });
    }

    /**
     * The page title.
     */
    protected pageTitle(): string {
        return "Apicurio Studio - Create API";
    }

    /**
     * Called when the Create API form (component) emits a "create-api" event.  This is bound to
     * from the createapi.page.html template.
     * @param newApi
     */
    public onCreateApi(eventData: CreateApiFormData) {
        if (!eventData.template) {
            let newApi: NewApi = new NewApi();
            newApi.type = eventData.type;
            newApi.name = eventData.name;
            newApi.description = eventData.description;

            console.log("[CreateApiPageComponent] Creating a new (blank) API: " + JSON.stringify(newApi))
            this.apis.createApi(newApi).then(api => {
                let link: string[] = ["/apis", api.id];
                console.info("[CreateApiPageComponent] Navigating to: %o", link);
                this.router.navigate(link);
            }).catch(error => {
                console.error("[CreateApiPageComponent] Error creating an API");
                this.error(error);
            });
        } else {
            let importApi: ImportApi = new ImportApi();
            let spec: any = JSON.parse(eventData.template.content);
            this.updateSpec(spec, eventData);
            importApi.data = Base64.encode(JSON.stringify(spec));

            this.apis.importApi(importApi).then(updatedApi => {
                let link: string[] = [ "/apis", updatedApi.id ];
                console.info("[CreateApiPageComponent] Navigating to: %o", link);
                this.router.navigate(link);
            }).catch( error => {
                console.error("[CreateApiPageComponent] Error creating API: %o", error);
                this.error(error);
            })
        }
    }

    public updateSpec(spec: any, eventData: CreateApiFormData): void {
        // OpenAPI20, OpenAPI30, AsyncAPI20, GraphQL
        if (eventData.type == "OpenAPI20") {
            spec.swagger = "2.0";
        } else if (eventData.type == "OpenAPI30") {
            spec.openapi = "3.0.2";
        } else if (eventData.type == "AsyncAPI20") {
            spec.asyncapi = "2.0.0";
        } else if (eventData.type == "GraphQL") {
            spec.graphql = "June 2018";
        }
        if (!spec.info) {
            spec.info = {};
        }
        spec.info.title = eventData.name;
        if (eventData.description) {
            spec.info.description = eventData.description;
        }
    }

}
