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
import {Title} from "@angular/platform-browser";
import {AbstractPageComponent} from "../components/page-base.component";

/**
 * The Settings Page component.
 */
@Component({
    selector: "default-page",
    template: "<div></div>"
})
export class DefaultPageComponent extends AbstractPageComponent {

    /**
     * C'tor.
     * @param router
     * @param route
     * @param titleService
     */
    constructor(private router: Router, route: ActivatedRoute, titleService: Title) {
        super(route, titleService);
    }

    /**
     * Returns the appropriate page title for this page.
     */
    protected pageTitle(): string {
        return "Apicurio Studio";
    }

    /**
     * @see AbstractPageComponent.loadAsyncPageData()
     */
    public loadAsyncPageData(): void {
        console.info("[SettingsPageComponent] Redirecting to 'dashboard'");
        this.router.navigate([ "/dashboard" ]);
    }
}
