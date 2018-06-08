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


import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {IAuthenticationService} from "./auth.service";
import {ConfigService} from "./config.service";
import {AbstractHubService} from "./hub";
import {ApiDesignChange} from "../models/api-design-change.model";
import {User} from "../models/user.model";

/**
 * An implementation of the Linked Accounts service that uses the Apicurio Studio back-end (Hub API) service
 * to store and retrieve relevant information for the user.
 */
@Injectable()
export class CurrentUserService extends AbstractHubService {

    /**
     * Constructor.
     * @param http
     * @param authService
     * @param config
     */
    constructor(http: HttpClient, authService: IAuthenticationService, config: ConfigService) {
        super(http, authService, config);
    }

    /**
     * Returns the current user's activity.
     */
    public getActivity(start: number, end: number): Promise<ApiDesignChange[]> {
        let user: User = this.authService.getAuthenticatedUserNow();

        console.info("[CurrentUserService] Getting all activity for user %s", user.login);

        let activityUrl: string = this.endpoint("/currentuser/activity", {}, {
            start: start,
            end: end
        });

        let options: any = this.options({ "Accept": "application/json" });

        console.info("[CurrentUserService] Fetching user activity: %s", activityUrl);
        return this.httpGet<ApiDesignChange[]>(activityUrl, options);
    }

}
