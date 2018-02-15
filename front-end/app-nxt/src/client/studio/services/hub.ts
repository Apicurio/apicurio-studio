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
import {HttpClient, HttpResponse} from "@angular/common/http";

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
     * Creates a hub API endpoint from the api path and params.
     * @param {string} path
     * @param params
     * @return {string}
     */
    protected endpoint(path: string, params?: any, queryParams?: any): string {
        if (params) {
            for (let key in params) {
                let value: string = params[key];
                path = path.replace(":" + key, value);
            }
        }
        let rval: string = this.apiBaseHref + path;
        if (queryParams) {
            let first: boolean = true;
            for (let key in queryParams) {
                let value: string = queryParams[key];
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
        return rval;
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

    /**
     * Creates the request options used by the HTTP service when making
     * API calls.
     * @param {{[p: string]: string}} headers
     * @param {boolean} authenticated
     * @return {any}
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
     * @param {string} url
     * @param options
     * @return {Promise<T>}
     */
    protected httpGet<T>(url: string, options: any, successCallback?: (apis: T) => T): Promise<T> {
        options["observe"] = "response";
        return this.http.get<T>(url, options).map( event => {
            let response: HttpResponse<T> = <any>event as HttpResponse<T>;
            if (successCallback) {
                return successCallback(response.body);
            } else {
                return response.body;
            }
        }).toPromise();
    }

    /**
     * Performs an HTTP POST operation to the given URL with the given body and options.  Returns
     * a Promise to null (no response data expected).
     * @param {string} url
     * @param {I} body
     * @param options
     * @return {Promise<void>}
     */
    protected httpPost<I>(url: string, body: I, options: any, successCallback?: () => void): Promise<void> {
        options["observe"] = "response";
        return this.http.post(url, body, options).map( () => {
            if (successCallback) {
                successCallback();
            }
            return null;
        }).toPromise();
    }

    /**
     * Performs an HTTP POST operation to the given URL with the given body and options.  Returns
     * a Promise to the HTTP response data.
     * @param {string} url
     * @param {I} body
     * @param options
     * @return {Promise<O>}
     */
    protected httpPostWithReturn<I, O>(url: string, body: I, options: any, successCallback?: (data: O) => O): Promise<O> {
        options["observe"] = "response";
        return this.http.post<O>(url, body, options).map( event => {
            let response: HttpResponse<O> = <any>event as HttpResponse<O>;
            let data: O = response.body;
            if (successCallback) {
                return successCallback(data);
            } else {
                return response.body;
            }
        }).toPromise();
    }

    /**
     * Performs an HTTP PUT operation to the given URL with the given body and options.  Returns
     * a Promise to null (no response data expected).
     * @param {string} url
     * @param {I} body
     * @param options
     * @return {Promise<void>}
     */
    protected httpPut<I>(url: string, body: I, options: any, successCallback?: () => void): Promise<void> {
        options["observe"] = "response";
        return this.http.put(url, body, options).map( () => {
            if (successCallback) {
                successCallback();
            }
            return null;
        }).toPromise();
    }

    /**
     * Performs an HTTP PUT operation to the given URL with the given body and options.  Returns
     * a Promise to the HTTP response data.
     * @param {string} url
     * @param {I} body
     * @param options
     * @return {Promise<O>}
     */
    protected httpPutWithReturn<I, O>(url: string, body: I, options: any, successCallback?: (data: O) => O): Promise<O> {
        options["observe"] = "response";
        return this.http.put<O>(url, body, options).map( event => {
            let response: HttpResponse<O> = <any>event as HttpResponse<O>;
            let data: O = response.body;
            if (successCallback) {
                return successCallback(data);
            } else {
                return response.body;
            }
        }).toPromise();
    }

    /**
     * Performs an HTTP DELETE operation to the given URL with the given body and options.
     * @param {string} url
     * @param options
     * @return {Promise<void>}
     */
    protected httpDelete(url: string, options: any, successCallback?: () => void): Promise<void> {
        options["observe"] = "response";
        return this.http.put(url, options).map( () => {
            if (successCallback) {
                successCallback();
            }
            return null;
        }).toPromise();
    }

}
