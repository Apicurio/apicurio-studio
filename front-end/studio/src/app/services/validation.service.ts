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

import {Injectable} from "@angular/core";
import {
    DefaultSeverityRegistry,
    IDocumentValidatorExtension,
    IValidationSeverityRegistry,
    Library,
    Node,
    ValidationProblem,
    ValidationProblemSeverity,
    ValidationRuleMetaData
} from "@apicurio/data-models";
import {AbstractHubService} from "./hub";
import {HttpClient} from "@angular/common/http";
import {IAuthenticationService} from "./auth.service";
import {ConfigService} from "./config.service";
import {CreateValidationProfile, UpdateValidationProfile, ValidationProfile} from "../models/validation.model";
import { ISpectralValidationService } from "./spectral-api.service";


export class StrictSeverityRegistry implements IValidationSeverityRegistry {

    public lookupSeverity(): ValidationProblemSeverity {
        return ValidationProblemSeverity.high;
    }

}


export class NoValidationRegistry implements IValidationSeverityRegistry {

    public lookupSeverity(): ValidationProblemSeverity {
        return ValidationProblemSeverity.ignore;
    }

}

// create a validation extension which makes a request to the Spectral micro-service
export function createSpectralValidationExtension(validationService: ISpectralValidationService, validationProfile: ValidationProfileExt): IDocumentValidatorExtension {
    const ruleset = validationProfile.externalRuleset;
    return {
        async validateDocument(document: Node): Promise<ValidationProblem[]> {
            return await validationService.validate(Library.writeDocumentToJSONString(document as any), ruleset);
        }
    }
}


export class MappedValidationSeverityRegistry implements IValidationSeverityRegistry {

    constructor(private severities: {[key: string]: ValidationProblemSeverity}) {}

    public lookupSeverity(rule: ValidationRuleMetaData): ValidationProblemSeverity {
        if (this.severities[rule.code] !== undefined) {
            return this.severities[rule.code];
        }
        return ValidationProblemSeverity.low;
    }

}


export class ValidationProfileExt extends ValidationProfile {
    registry: IValidationSeverityRegistry;
    builtIn: boolean;
}


/**
 * A service that manages the list of validation profiles the user can choose from.  Also allows the
 * user to manage custom validation profiles.  This service will remember the validation profile
 * chosen for a particular API in the browser's local storage.
 */
@Injectable()
export class ValidationService extends AbstractHubService {

    private profiles: ValidationProfileExt[] = [];
    private builtInProfiles: ValidationProfileExt[] = [];

    /**
     * Constructor.
     * @param http
     * @param authService
     * @param config
     */
    constructor(http: HttpClient, authService: IAuthenticationService, config: ConfigService) {
        super(http, authService, config);
        this.builtInProfiles = [
            {
                id: -1,
                name: "No Validation",
                description: "Disable all validation.",
                severities: {},
                builtIn: true,
                registry: new NoValidationRegistry()
            },
            {
                id: -2,
                name: "OpenAPI Spec Validation",
                description: "Validate against the OpenAPI specification rules only (no additional rules)",
                severities: {},
                builtIn: true,
                registry: new DefaultSeverityRegistry()
            },
            {
                id: -3,
                name: "Strict Validation",
                description: "Apply all known validation rules at critical/high severity.",
                severities: {},
                builtIn: true,
                registry: new StrictSeverityRegistry()
            }
        ];
        this.getValidationProfiles().then();
    }

    public getProfiles(): ValidationProfileExt[] {
        return [ ...this.builtInProfiles, ...this.profiles].sort( (p1, p2) => {
            return p1.name.toLowerCase().localeCompare(p2.name.toLowerCase());
        });
    }

    public getProfile(id: number): ValidationProfileExt {
        for (let profile of this.profiles) {
            if (profile.id === id) {
                return profile;
            }
        }
        for (let profile of this.builtInProfiles) {
            if (profile.id === id) {
                return profile;
            }
        }
        return null;
    }

    public getDefaultProfile(): ValidationProfileExt {
        // TODO implement this!
        return this.builtInProfiles[1];
    }

    public getProfileForApi(apiId: string): ValidationProfileExt {
        let storage: Storage = window.localStorage;
        let key: string = `apicurio.validation.profiles.${ apiId }`;
        let val: string = storage.getItem(key);
        if (val !== null) {
            let validationId: number = parseInt(val);
            let profile: ValidationProfileExt = this.getProfile(validationId);
            
            if (profile) { return profile; }
        }
        return this.getDefaultProfile();
    }

    public setProfileForApi(apiId: string, profile: ValidationProfileExt): void {
        let storage: Storage = window.localStorage;
        let key: string = `apicurio.validation.profiles.${ apiId }`;
        if (!profile) {
            storage.removeItem(key);
        } else {
            storage.setItem(key, "" + profile.id);
        }
    }

    public getBuiltInValidationProfiles(): Promise<ValidationProfileExt[]> {
        return Promise.resolve(this.builtInProfiles);
    }

    /**
     * Gets all of the validation profiles for the current user.
     */
    public getValidationProfiles(): Promise<ValidationProfileExt[]> {
        console.info("[ValidationService] Getting all validation profiles");

        let url: string = this.endpoint("/validationProfiles");
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[ValidationService] Fetching validation profiles: %s", url);
        return this.httpGet<ValidationProfile[]>(url, options).then( profiles => {
            this.profiles = profiles.map(profile => {
                let severities: {[key: string]: ValidationProblemSeverity} = this.convertServerServerities(profile.severities);
                return {
                    id: profile.id,
                    name: profile.name,
                    description: profile.description,
                    builtIn: false,
                    severities: severities,
                    // if there is an external ruleset attached, ignore built in rules
                    registry: profile.externalRuleset ? new NoValidationRegistry() : new MappedValidationSeverityRegistry(severities),
                    externalRuleset: profile.externalRuleset
                }
            });
            return this.profiles;
        });
    }

    /**
     * Called to create a custom validation profile.
     * @param info
     */
    public createValidationProfile(info: CreateValidationProfile): Promise<ValidationProfileExt> {
        console.info("[ValidationService] Creating a validation profile named %s", info.name, info.externalRuleset);

        let createUrl: string = this.endpoint("/validationProfiles");
        let options: any = this.options({ "Accept": "application/json", "Content-Type": "application/json" });

        console.info("[ValidationService] Creating a validation profile: %s", createUrl);
        return this.httpPostWithReturn<CreateValidationProfile, ValidationProfile>(createUrl, info, options).then( p => {
            let severities: {[key: string]: ValidationProblemSeverity} = this.convertServerServerities(p.severities);
            let newProfile: ValidationProfileExt = {
                id: p.id,
                name: p.name,
                description: p.description,
                builtIn: false,
                severities: severities,
                registry: new MappedValidationSeverityRegistry(severities),
                externalRuleset: p.externalRuleset
            };
            this.profiles.push(newProfile);
            return newProfile;
        });
    }

    /**
     * Called to update a validation profile on the server.
     * @param profileId
     * @param update
     */
    public updateValidationProfile(profileId: number, update: UpdateValidationProfile): Promise<ValidationProfileExt> {
        console.info("[ValidationService] Updating a validation profile with id %o", update);

        let updateUrl: string = this.endpoint("/validationProfiles/:profileId", {
            profileId: profileId
        });
        let options: any = this.options({ "Accept": "application/json", "Content-Type": "application/json" });

        console.info("[ValidationService] Updating a validation profile: %s", updateUrl);
        return this.httpPut<UpdateValidationProfile>(updateUrl, update, options).then( () => {
            let updatedProfile: ValidationProfileExt = {
                id: profileId,
                name: update.name,
                description: update.description,
                builtIn: false,
                severities: update.severities,
                externalRuleset: update.externalRuleset,
                registry: new MappedValidationSeverityRegistry(update.severities)
            };
            let profileIndex: number = -1;
            this.profiles.forEach( (p, idx) => {
                if (p.id === profileId) {
                    profileIndex = idx;
                }
            });
            if (profileIndex === -1) {
                this.profiles.push(updatedProfile);
            } else {
                this.profiles.splice(profileIndex, 1, updatedProfile);
            }
            return updatedProfile;
        });
    }

    /**
     * Called to delete a validation profile from the server.
     * @param profileId
     */
    public deleteValidationProfile(profileId: number): Promise<void> {
        console.info("[ValidationService] Deleting a validation profile with id %o", profileId);

        let deleteUrl: string = this.endpoint("/validationProfiles/:profileId", {
            profileId: profileId
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[ValidationService] Deleting a validation profile: %s", deleteUrl);
        return this.httpDelete(deleteUrl, options).then( () => {
            let profileIndex: number = -1;
            this.profiles.forEach( (p, idx) => {
                if (p.id === profileId) {
                    profileIndex = idx;
                }
            });
            if (profileIndex !== -1) {
                this.profiles.splice(profileIndex, 1);
            }
        });

    }

    /**
     * Convert from server format (strings) to local severity values (ValidationProblemSeverity enum).
     * @param severities
     */
    private convertServerServerities(severities: any): {[key: string]: ValidationProblemSeverity} {
        let rval: {[key: string]: ValidationProblemSeverity} = {};
        Object.getOwnPropertyNames(severities).forEach( key => {
            let value: string = severities[key];
            let severity: ValidationProblemSeverity = ValidationProblemSeverity.low;
            switch (value) {
                case "ignore": severity = ValidationProblemSeverity.ignore; break;
                case "low": severity = ValidationProblemSeverity.low; break;
                case "medium": severity = ValidationProblemSeverity.medium; break;
                case "high": severity = ValidationProblemSeverity.high; break;
            }
            rval[key] = severity;
        });
        return rval;
    }

}
