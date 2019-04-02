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
    DefaultValidationSeverityRegistry,
    IOasValidationSeverityRegistry,
    OasValidationProblemSeverity
} from "oai-ts-core";
import {AbstractHubService} from "./hub";
import {HttpClient} from "@angular/common/http";
import {IAuthenticationService} from "./auth.service";
import {ConfigService} from "./config.service";
import {ValidationProfile} from "../models/validation.model";
import {LinkedAccount} from "../models/linked-account.model";


export class StrictSeverityRegistry implements IOasValidationSeverityRegistry {

    public lookupSeverity(): OasValidationProblemSeverity {
        return OasValidationProblemSeverity.high;
    }

}


export class NoValidationRegistry implements IOasValidationSeverityRegistry {

    public lookupSeverity(): OasValidationProblemSeverity {
        return OasValidationProblemSeverity.ignore;
    }

}


export class ValidationProfileExt extends ValidationProfile {
    registry: IOasValidationSeverityRegistry;
    builtIn: boolean;
}


/**
 * A service that manages the list of validation profiles the user can choose from.  Also allows the
 * user to manage custom validation profiles.  This service will remember the validation profile
 * chosen for a particular API in the browser's local storage.
 */
@Injectable()
export class ValidationService extends AbstractHubService {

    private profiles: ValidationProfileExt[];
    private builtInProfiles: ValidationProfileExt[];

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
                registry: new DefaultValidationSeverityRegistry()
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
        return this.profiles;
    }

    public getProfile(id: number): ValidationProfileExt {
        for (let profile of this.profiles) {
            if (profile.id === id) {
                return profile;
            }
        }
        return null;
    }

    public getDefaultProfile(): ValidationProfileExt {
        // TODO implement this!
        return this.builtInProfiles[0];
    }

    public getProfileForApi(apiId: string): ValidationProfileExt {
        let storage: Storage = window.localStorage;
        let key: string = `apicurio.validation.profiles.${ apiId }`;
        let val: string = storage.getItem(key);
        if (val !== null) {
            let validationId: number = parseInt(val);
            return this.getProfile(validationId);
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
                return {
                    id: profile.id,
                    name: profile.name,
                    description: profile.description,
                    builtIn: false,
                    severities: profile.severities,
                    registry: null
                }
            });
            return this.profiles;
        });
    }

}
