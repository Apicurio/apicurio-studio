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


export class StrictSeverityRegistry implements IOasValidationSeverityRegistry {

    public lookupSeverity(ruleCode: string): OasValidationProblemSeverity {
        return OasValidationProblemSeverity.high;
    }

}


export class NoValidationRegistry implements IOasValidationSeverityRegistry {

    public lookupSeverity(ruleCode: string): OasValidationProblemSeverity {
        return OasValidationProblemSeverity.ignore;
    }

}

export class ValidationProfile {
    id: string;
    name: string;
    description: string;
    registry: IOasValidationSeverityRegistry;
}

/**
 * A service that manages the list of validation profiles the user can choose from.  Also allows the
 * user to manage custom validation profiles.  This service will remember the validation profile
 * chosen for a particular API in the browser's local storage.
 */
@Injectable()
export class ValidationService {

    private profiles: ValidationProfile[];

    constructor() {
        this.profiles = [
            {
                id: "none",
                name: "No Validation",
                description: "Disable all validation.",
                registry: new NoValidationRegistry()
            },
            {
                id: "default",
                name: "Default Validation",
                description: "Validate against the OpenAPI specification rules only (no additional rules)",
                registry: new DefaultValidationSeverityRegistry()
            },
            {
                id: "strict",
                name: "Strict Validation",
                description: "Apply all known validation rules at critical/high severity.",
                registry: new StrictSeverityRegistry()
            }
        ];
    }

    public getProfiles(): ValidationProfile[] {
        return this.profiles;
    }

    public getProfile(id: string): ValidationProfile {
        for (let profile of this.profiles) {
            if (profile.id === id) {
                return profile;
            }
        }
        return null;
    }

    public getProfileForApi(apiId: string): ValidationProfile {
        let storage: Storage = window.localStorage;
        let key: string = `apicurio.validation.profiles.${ apiId }`;
        let validationId: string = storage.getItem(key);
        if (validationId !== null) {
            return this.getProfile(validationId);
        }
        return this.getProfile("default");
    }

    public setProfileForApi(apiId: string, profile: ValidationProfile): void {
        let storage: Storage = window.localStorage;
        let key: string = `apicurio.validation.profiles.${ apiId }`;
        if (!profile) {
            storage.removeItem(key);
        } else {
            storage.setItem(key, profile.id);
        }
    }
}