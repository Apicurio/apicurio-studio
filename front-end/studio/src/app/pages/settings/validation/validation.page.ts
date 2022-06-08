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
import {CreateValidationProfile, UpdateValidationProfile, ValidationProfile} from "../../../models/validation.model";
import {ValidationProblemSeverity, ValidationRuleSet} from "@apicurio/data-models";

/**
 * The Settings/Profile Page component.
 */
@Component({
    selector: "validation-page",
    templateUrl: "validation.page.html",
    styleUrls: ["validation.page.css"]
})
export class ValidationPageComponent extends AbstractPageComponent {

    builtInProfiles: ValidationProfileExt[];
    profiles: ValidationProfileExt[];

    editorOpen: boolean;
    editorModel: ValidationProfile;

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

    /**
     * Load page data asynchronously.
     */
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
            this.profiles = [...profiles];
            this.loaded("profiles");
        }).catch( error => {
            console.error("[ValidationPageComponent] Error fetching built in validation profiles.");
            this.error(error);
        });
    }

    /**
     * Return a list of all profiles to display in the UI in the appropriate order.
     */
    allProfiles(): ValidationProfileExt[] {
        let rval: ValidationProfileExt[] = [];
        this.builtInProfiles.forEach(profile => rval.push(profile));
        this.profiles.sort((p1, p2) => {
            return p1.name.toLocaleLowerCase().localeCompare(p2.name.toLocaleLowerCase());
        }).forEach(profile => rval.push(profile));
        return rval;
    }

    /**
     * Edit the given profile, or create a new profile if none is given.
     * @param profile
     */
    editProfile(profile?: ValidationProfile): void {
        this.editorModel = new ValidationProfile();
        if (profile) {
            this.editorModel.id = profile.id;
            this.editorModel.name = profile.name;
            this.editorModel.description = profile.description;
            this.editorModel.severities = this.copySeverities(profile.severities);
            this.editorModel.externalRuleset = profile.externalRuleset;
        } else {
            this.editorModel.id = null;
            this.editorModel.name = null;
            this.editorModel.description = "";
            this.editorModel.severities = {};
            this.editorModel.externalRuleset = null;
        }
        this.editorOpen = true;
    }

    private copySeverities(severities: any): any {
        return { ...severities };
    }

    /**
     * Called to clone the given profile.
     * @param profile
     */
    cloneProfile(profile: ValidationProfile): void {
        let newProfile: ValidationProfile = new ValidationProfile();
        newProfile.id = null;
        newProfile.name = profile.name + " (Copy)";
        newProfile.description = profile.description;
        newProfile.severities = {};
        if (profile.id == -1) { // Disable all rules
            let ruleset: ValidationRuleSet = new ValidationRuleSet();
            ruleset.getAllRules().forEach( rule => {
                newProfile.severities[rule.code] = ValidationProblemSeverity.ignore;
            });
        } else if (profile.id == -2) { // OpenAPI spec-only
            let ruleset: ValidationRuleSet = new ValidationRuleSet();
            ruleset.getAllRules().forEach( rule => {
                // Severity is "medium" if the rule is spec mandated otherwise it's "ignore"
                newProfile.severities[rule.code] = rule.specMandated ? ValidationProblemSeverity.medium : ValidationProblemSeverity.ignore;
            });
        } else if (profile.id == -3) { // Enable all rules
            let ruleset: ValidationRuleSet = new ValidationRuleSet();
            ruleset.getAllRules().forEach( rule => {
                // Severity is always high.
                newProfile.severities[rule.code] = ValidationProblemSeverity.high;
            });
        } else {
            newProfile.severities = this.copySeverities(profile.severities);
        }

        this.editProfile(newProfile);
    }

    /**
     * Called when the user clicks Save on the Create/Edit Validation Profile editor.
     */
    saveProfile(): void {
        let profile: ValidationProfile = this.editorModel;

        // Create a new profile
        if (profile.id === null) {
            let info: CreateValidationProfile = {
                name: this.editorModel.name,
                description: this.editorModel.description,
                severities: this.editorModel.severities,
                externalRuleset: this.editorModel.externalRuleset
            };
            this.validationService.createValidationProfile(info).then( profile => {
                this.profiles.push(profile);
                this.editorOpen = false;
            }).catch( error => {
                this.error(error);
            });
        }

        // Update an existing profile
        if (profile.id !== null) {
            let update: UpdateValidationProfile = {
                name: this.editorModel.name,
                description: this.editorModel.description,
                severities: this.editorModel.severities,
                externalRuleset: this.editorModel.externalRuleset
            };
            this.validationService.updateValidationProfile(this.editorModel.id, update).then( newProfile => {
                let idx: number = -1;
                this.profiles.forEach( (p, pidx) => {
                    if (p.id === profile.id) {
                        idx = pidx;
                    }
                });
                if (idx >= 0) {
                    this.profiles.splice(idx, 1, newProfile);
                }

                this.editorOpen = false;
            }).catch( error => {
                this.error(error);
            });
        }

    }

    /**
     * Called to delete a profile.
     * @param profile
     */
    deleteProfile(profile: ValidationProfileExt): void {
        this.profiles.splice(this.profiles.indexOf(profile), 1);
        this.validationService.deleteValidationProfile(profile.id).catch( error => {
            this.error(error);
        });
    }

}
