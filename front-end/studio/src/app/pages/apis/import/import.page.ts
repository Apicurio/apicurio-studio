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
import {ActivatedRoute, Router} from "@angular/router";

import {ApisService} from "../../../services/apis.service";
import {AbstractPageComponent} from "../../../components/page-base.component";
import {ImportApi} from "../../../models/import-api.model";
import {Title} from "@angular/platform-browser";

@Component({
    selector: "importapi-page",
    templateUrl: "import.page.html",
    styleUrls: ["import.page.css"]
})
export class ImportApiPageComponent extends AbstractPageComponent {

    public importing: boolean = false;
    public importError: any;

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
        return "Apicurio Studio - Import API";
    }

    /**
     * Called when the Import API form (component) emits a "import-api" event.  This is bound to
     * from the importapi.page.html template.
     * @param api
     */
    public onImportApi(api: ImportApi) {
        this.importing = true;
        this.importError = null;
        console.log("[ImportApiPageComponent] onImportApi(): " + JSON.stringify(api))
        this.apis.importApi(api).then(importedApi => {
            let link: string[] = [ "/apis", importedApi.id ];
            console.info("[ImportApiPageComponent] Navigating to: %o", link);
            this.router.navigate(link);
        }).catch( error => {
            console.error("[ImportApiPageComponent] Error importing API: %o", error);
            this.importing = false;
            if (error.status === 404) {
                this.importError = error;
            } else {
                this.error(error);
            }
        });
    }

}
