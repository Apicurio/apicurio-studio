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
import {HttpClient, HttpEvent, HttpResponse} from "@angular/common/http";
import {User} from "../models/user.model";
import {HttpUtils} from "../util/common";

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
    constructor(protected http: HttpClient, protected authService: IAuthenticationService, protected config: ConfigService) {
        this.apiBaseHref = this.config.hubUrl();
        this.editingBaseHref = this.config.editingUrl();
    }

    /**
     * Gets the current user.
     */
    protected user(): User {
        return this.authService.getAuthenticatedUserNow();
    }


    /**
     * Creates a hub API endpoint from the api path and params.
     * @param path
     * @param params
     * 
     */
    protected endpoint(path: string, params?: any, queryParams?: any): string {
        if (params) {
            for (let key in params) {
                let value: string = encodeURIComponent(params[key]);
                path = path.replace(":" + key, value);
            }
        }
        let rval: string = this.apiBaseHref + path;
        if (queryParams) {
            let first: boolean = true;
            for (let key in queryParams) {
                if (queryParams[key]) {
                    let value: string = encodeURIComponent(queryParams[key]);
                    if (first) {
                        rval = rval + "?" + key;
                    } else {
                        rval = rval + "&" + key;
                    }
                    if (value != null && value != undefined) {
                        rval = rval + "=" + value;
                    }
                    first = false;
                }
            }
        }
        return rval;
    }

    /**
     * Creates an editing endpoint from the given relative path and params.
     * @param path
     * @param params
     * 
     */
    protected editingEndpoint(path: string, params?: any): string {
        if (params) {
            for (let key in params) {
                let value: string = encodeURIComponent(params[key]);
                path = path.replace(":" + key, value);
            }
        }
        return this.editingBaseHref + path;
    }

    /**
     * Creates the request options used by the HTTP service when making
     * API calls.
     * @param headers
     * @param authenticated
     * 
     */
    protected options(headers: {[header: string]: string}, authenticated: boolean = true): any {
        let options = {
            headers: headers
        };
        if (authenticated) {
            this.authService.injectAuthHeaders(options.headers);
        }
        return options;
    }

    /**
     * Performs an HTTP GET operation to the given URL with the given options.  Returns
     * a Promise to the HTTP response data.
     * @param url
     * @param options
     */
    protected httpGet<T>(url: string, options: any, successCallback?: (value: T) => T): Promise<T> {
        options["observe"] = "response";
        return HttpUtils.mappedPromise(this.http.get<HttpResponse<any>>(url, options).toPromise(), response => {
            if (successCallback) {
                return successCallback(response.body);
            } else {
                return response.body;
            }
        });
    }

    /**
     * Performs an HTTP POST operation to the given URL with the given body and options.  Returns
     * a Promise to null (no response data expected).
     * @param url
     * @param body
     * @param options
     * 
     */
    protected httpPost<I>(url: string, body: I, options: any, successCallback?: () => void): Promise<void> {
        options["observe"] = "response";
        return HttpUtils.mappedPromise(this.http.post<HttpResponse<any>>(url, body, options).toPromise(), () => {
            if (successCallback) {
                successCallback();
            }
            return null;
        });
    }

    /**
     * Performs an HTTP POST operation to the given URL with the given body and options.  Returns
     * a Promise to the HTTP response data.
     * @param url
     * @param body
     * @param options
     * 
     */
    protected httpPostWithReturn<I, O>(url: string, body: I, options: any, successCallback?: (data: O) => O): Promise<O> {
        options["observe"] = "response";
        return HttpUtils.mappedPromise(this.http.post<HttpResponse<any>>(url, body, options).toPromise(), response => {
            let data: O = response.body;
            if (successCallback) {
                return successCallback(data);
            } else {
                return response.body;
            }
        });
    }

    /**
     * Performs an HTTP PUT operation to the given URL with the given body and options.  Returns
     * a Promise to null (no response data expected).
     * @param url
     * @param body
     * @param options
     * 
     */
    protected httpPut<I>(url: string, body: I, options: any, successCallback?: () => void): Promise<void> {
        options["observe"] = "response";
        return HttpUtils.mappedPromise(this.http.put<HttpResponse<any>>(url, body, options).toPromise(), () => {
            if (successCallback) {
                successCallback();
            }
            return null;
        });
    }

    /**
     * Performs an HTTP PUT operation to the given URL with the given body and options.  Returns
     * a Promise to the HTTP response data.
     * @param url
     * @param body
     * @param options
     * 
     */
    protected httpPutWithReturn<I, O>(url: string, body: I, options: any, successCallback?: (data: O) => O): Promise<O> {
        options["observe"] = "response";
        return HttpUtils.mappedPromise(this.http.put<HttpResponse<any>>(url, body, options).toPromise(), response => {
            let data: O = response.body;
            if (successCallback) {
                return successCallback(data);
            } else {
                return response.body;
            }
        });
    }

    /**
     * Performs an HTTP DELETE operation to the given URL with the given body and options.
     * @param url
     * @param options
     * 
     */
    protected httpDelete(url: string, options: any, successCallback?: () => void): Promise<void> {
        options["observe"] = "response";
        return HttpUtils.mappedPromise(this.http.delete<HttpResponse<any>>(url, options).toPromise(), () => {
            if (successCallback) {
                successCallback();
            }
            return null;
        });
    }

}
