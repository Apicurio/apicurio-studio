/**
 * @license
 * Copyright 2019 JBoss Inc
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
import {IAuthenticationService} from "../../../services/auth.service";
import {AbstractPageComponent} from "../../../components/page-base.component";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {ValidationProfileExt, ValidationService} from "../../../services/validation.service";

/**
 * The Settings/Profile Page component.
 */
@Component({
    moduleId: module.id,
    selector: "validation-page",
    templateUrl: "validation.page.html",
    styleUrls: ["validation.page.css"]
})
export class ValidationPageComponent extends AbstractPageComponent {

    builtInProfiles: ValidationProfileExt[];
    profiles: ValidationProfileExt[];

    /**
     * C'tor.
     * @param authService
     * @param route
     * @param titleService
     * @param validationService
     */
    constructor(@Inject(IAuthenticationService) private authService: IAuthenticationService, route: ActivatedRoute,
                titleService: Title, private validationService: ValidationService) {
        super(route, titleService);
    }

    /**
     * The page title.
     */
    protected pageTitle(): string {
        return "Apicurio Studio - Settings - Validation";
    }

    public loadAsyncPageData(): void {
        console.log("[ValidationPageComponent] loadAsyncPageData!!");

        this.validationService.getBuiltInValidationProfiles().then( biProfiles => {
            console.log("[ValidationPageComponent] Default profiles loaded: ", biProfiles);
            this.builtInProfiles = biProfiles;
            this.loaded("builtInProfiles");
        }).catch( error => {
            console.error("[ValidationPageComponent] Error fetching built in validation profiles.");
            this.error(error);
        });
        this.validationService.getValidationProfiles().then( profiles => {
            console.log("[ValidationPageComponent] User profiles loaded.", profiles);
            this.profiles = profiles;
            this.loaded("profiles");
        }).catch( error => {
            console.error("[ValidationPageComponent] Error fetching built in validation profiles.");
            this.error(error);
        });
    }

    allProfiles(): ValidationProfileExt[] {
        let rval: ValidationProfileExt[] = [];
        this.builtInProfiles.forEach(profile => rval.push(profile));
        this.profiles.sort((p1, p2) => {
            return p1.name.toLocaleLowerCase().localeCompare(p2.name.toLocaleLowerCase());
        }).forEach(profile => rval.push(profile));
        return rval;
    }

}
