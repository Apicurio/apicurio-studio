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

import {Component, OnInit, Inject, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {ApisService} from "../../../services/apis.service";
import {Api} from "../../../models/api.model";
import {CreateApiFormComponent} from "./_components/create-form.component";
import {NewApi} from "../../../models/new-api.model";
import {AbstractPageComponent} from "../../../components/page-base.component";
import {Title} from "@angular/platform-browser";

@Component({
    moduleId: module.id,
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
     */
    constructor(private router: Router, route: ActivatedRoute, private apis: ApisService, titleService: Title) {
        super(route, titleService);
    }

    /**
     * The page title.
     * 
     */
    protected pageTitle(): string {
        return "Apicurio Studio - Create API";
    }

    /**
     * Called when the Create API form (component) emits a "create-api" event.  This is bound to
     * from the createapi.page.html template.
     * @param newApi
     */
    public onCreateApi(newApi: NewApi) {
        console.log("[CreateApiPageComponent] onCreateApi(): " + JSON.stringify(newApi))
        this.apis.createApi(newApi).then(api => {
            let link: string[] = [ "/apis", api.id ];
            console.info("[CreateApiPageComponent] Navigating to: %o", link);
            this.router.navigate(link);
        }).catch( error => {
            console.error("[CreateApiPageComponent] Error creating an API");
            this.error(error);
        })
    }

}
