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
import {MockReference} from "../../../../models/mock-api.model";
import {AbstractPageComponent} from "../../../../components/page-base.component";
import {Title} from "@angular/platform-browser";
import {ApisService} from "../../../../services/apis.service";
import {OasDocument, Library} from "@apicurio/data-models";


@Component({
    selector: "mock-page",
    templateUrl: "mock.page.html",
    styleUrls: ["mock.page.css"]
})
export class MockPageComponent extends AbstractPageComponent {

    public api: ApiDefinition;
    public document: OasDocument;

    public modelValid: any;
    public mockReference: MockReference;

    public mocking: boolean = false;
    public mocked: boolean = false;

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
        if (this.api.name) {
            return "Apicurio Studio - Mock API :: " + this.api.name;
        } else {
            return "Apicurio Studio - Mock API";
        }
    }

    /**
     * Called to kick off loading the page's async data.
     * @param params
     */
    public loadAsyncPageData(params: any): void {
        console.info("[MockPageComponent] Loading async page data");
        let apiId: string = params["apiId"];
        this.apis.getApiDefinition(apiId).then(api => {
            this.api = api;
            if (typeof this.api.spec === "string") {
                this.document = <OasDocument> Library.readDocumentFromJSONString(this.api.spec);
            } else {
                this.document = <OasDocument> Library.readDocument(this.api.spec);
            }
            this.dataLoaded["api"] = true;
            this.updatePageTitle();
        }).catch(error => {
            console.error("[MockPageComponent] Error getting API def");
            this.error(error);
        });
    }

    public isDataLoaded(): boolean {
        return this.isLoaded("api");
    }

    public isValid(): boolean {
        return this.document != null;
    }

    public mockApi(): void {
        if (!this.isValid) {
            return;
        }

        this.mocking = true;

        this.apis.mockApi(this.api.id).then( (reference) => {
            console.log("[MockPageComponent] Published mock with serviceReference: " + reference.serviceRef);
            this.mocking = false;
            this.mocked = true;
            this.mockReference = reference;
        }).catch( error => {
            this.mocking = false;
            this.error(error);
        });
    }
}
