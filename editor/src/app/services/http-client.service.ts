/**
 * @license
 * Copyright 2022 Red Hat
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
import {LoggerService} from "./logger.service";
import {HttpClient, HttpEvent, HttpResponse} from "@angular/common/http";

/**
 * A service used to make HTTP calls.
 */
@Injectable()
export class HttpClientService {

    constructor(private logger: LoggerService, private http: HttpClient) {
    }

    public endpoint(url: string, params?: any, queryParams?: any): string {
        let rval: string = url;

        if (params) {
            Object.keys(params).forEach(key => {
                const value: string = encodeURIComponent(params[key]);
                rval = rval.replace(":" + key, value);
            });
        }
        if (queryParams) {
            let first: boolean = true;
            Object.keys(queryParams).forEach(key => {
                if (queryParams[key]) {
                    const value: string = encodeURIComponent(queryParams[key]);
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
            });
        }
        return rval;
    }

    public options(headers: {[header: string]: string}): any {
        const options = {
            headers
        };
        return options;
    }

    public httpGet<T>(url: string, options: any, successCallback?: (value: T) => T): Promise<T> {
        options.observe = "response";
        return this.mappedPromise(this.http.get<HttpResponse<any>>(url, options).toPromise(), response => {
            if (successCallback) {
                return successCallback(response.body);
            } else {
                return response.body;
            }
        });
    }

    private mappedPromise<T>(requestPromise: Promise<HttpEvent<any>>, mapper: (response: HttpResponse<any>) => T): Promise<T> {
        return requestPromise.then( response => {
            return mapper(response as any);
        });
    }
}
