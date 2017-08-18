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

import {Component, OnInit, Inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {IApisService} from "../../../services/apis.service";
import {Api} from "../../../models/api.model";
import {AbstractPageComponent} from "../../../components/page-base.component";

@Component({
    moduleId: module.id,
    selector: "addapi-page",
    templateUrl: "add.page.html",
    styleUrls: ["add.page.css"]
})
export class AddApiPageComponent extends AbstractPageComponent {

    /**
     * Constructor.
     * @param {Router} router
     * @param {ActivatedRoute} route
     * @param {IApisService} apis
     */
    constructor(private router: Router, route: ActivatedRoute, @Inject(IApisService) private apis: IApisService) {
        super(route);
    }

    /**
     * Called when the Add API form (component) emits a "add-api" event.  This is bound to
     * from the addapi.page.html template.
     * @param {Api} api
     */
    public onAddApi(api: Api) {
        console.log("[AddApiPageComponent] onAddApi(): " + JSON.stringify(api))
        this.apis.addApi(api).then(updatedApi => {
            let link: string[] = [ "/apis", updatedApi.id ];
            console.info("[AddApiPageComponent] Navigating to: %o", link);
            this.router.navigate(link);
        }).catch( error => {
            console.error("[AddApiPageComponent] Error adding API: %o", error);
            this.error(error);
        })
    }

}
