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

import {Http} from "@angular/http";

import {LocalApisService} from "./apis-local.service";
import {IApisService} from "./apis.service";
import {IAuthenticationService} from "./auth.service";
import {ConfigService} from "./config.service";
import {HubApisService} from "./apis-hub.service";


function ApisServiceFactory(http: Http, authService: IAuthenticationService, config: ConfigService): IApisService {
    if (config.apisType() === "hub") {
        console.info("[ApisServiceFactory] Creating instance of HubApisService");
        return new HubApisService(http, authService, config);
    } else {
        console.info("[ApisServiceFactory] Creating instance of LocalApisService");
        return new LocalApisService(http, authService);
    }
};


export let ApisServiceProvider =
{
    provide: IApisService,
    useFactory: ApisServiceFactory,
    deps: [Http, IAuthenticationService, ConfigService]
};

