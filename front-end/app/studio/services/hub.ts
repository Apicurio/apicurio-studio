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


import {IAuthenticationService} from "./auth.service";
import {ConfigService} from "./config.service";
import {Headers, Http, RequestOptions} from "@angular/http";

/**
 * Base class for all Hub-API based services.
 */
export abstract class AbstractHubService {

    private apiBaseHref: string;
    private editingBaseHref: string;

    /**
     * Constructor.
     * @param http
     * @param authService
     */
    constructor(protected http: Http, protected authService: IAuthenticationService, protected config: ConfigService) {
        this.apiBaseHref = this.config.hubUrl();
        this.editingBaseHref = this.config.editingUrl();
    }

    /**
     * Creates a hub API endpoint from the api path and params.
     * @param {string} path
     * @param params
     * @return {string}
     */
    protected endpoint(path: string, params?: any): string {
        if (params) {
            for (let key in params) {
                let value: string = params[key];
                path = path.replace(":" + key, value);
            }
        }
        return this.apiBaseHref + path;
    }

    /**
     * Creates the request options used by the HTTP service when making
     * API calls.
     * @param headers
     * @param {boolean} authenticated
     * @return {RequestOptions}
     */
    protected options(headers: any, authenticated: boolean = true): RequestOptions {
        let options = new RequestOptions({
            headers: new Headers(headers)
        });
        if (authenticated) {
            this.authService.injectAuthHeaders(options.headers);
        }
        return options;
    }

    /**
     * Creates an editing endpoint from the given relative path and params.
     * @param {string} path
     * @param params
     * @return {string}
     */
    protected editingEndpoint(path: string, params?: any): string {
        if (params) {
            for (let key in params) {
                let value: string = params[key];
                path = path.replace(":" + key, value);
            }
        }
        return this.editingBaseHref + path;
    }

}
