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

import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {IApisService} from "../../../services/apis.service";
import {Api} from "../../../models/api.model";

@Component({
    moduleId: module.id,
    selector: 'newapi-page',
    templateUrl: 'newapi.page.html',
    styleUrls: ['newapi.page.css']
})
export class NewApiPageComponent implements OnInit {

    /**
     * Constructor.
     * @param router
     * @param apis
     */
    constructor(
            private router: Router,
            @Inject(IApisService) private apis: IApisService) {
    }

    public ngOnInit(): void {
    }

    /**
     * Called when the New API form (component) emits a "new-api" event.  This is bound to
     * from the newapi.page.html template.
     * @param api
     */
    public onCreateApi(api: Api) {
        console.log("[NewApiPageComponent] onCreateApi(): " + JSON.stringify(api))
        this.apis.createApi(api).then(updatedApi => {
            let link: string[] = [ "/apis", updatedApi.id ];
            console.info("[NewApiPageComponent] Navigating to: %o", link);
            this.router.navigate(link);
        }).catch( error => {
            console.error("[NewApiPageComponent] Error saving API: %o", error);
        })
    }

}
