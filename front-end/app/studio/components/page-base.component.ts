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

import {OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";

export abstract class AbstractPageComponent implements OnInit, OnDestroy {

    public dataLoaded: Map<string, boolean> = new Map<string, boolean>();
    public pageError: any;

    /**
     * C'tor.
     * @param {ActivatedRoute} route
     */
    constructor(protected route: ActivatedRoute) {
    }

    /**
     * Called when the page is initialized.  Triggers the loading of asynchronous
     * page data.
     */
    public ngOnInit(): void {
        // Extract route params and query params and pass them to "loadAsyncPageData"
        let combined = Observable.combineLatest(this.route.params, this.route.queryParams, (params, qparams) => ({params, qparams}));
        combined.subscribe( ap => {
            this.loadAsyncPageData(ap.params, ap.qparams);
        });
    }

    /**
     * Called when the page is destroyed.
     */
    public ngOnDestroy(): void {
    }

    /**
     * Called to kick off loading the page's async data.  Subclasses should
     * override to provide page-specific data loading.
     * @param pathParams
     * @param queryParams
     */
    public loadAsyncPageData(pathParams: any, queryParams: any): void {
    }

    /**
     * Called by a subclass (page) to report an error during loading of data.
     * @param error
     */
    public error(error: any): void {
        console.error("    Error: %o", error);
        this.pageError = error;
    }

    /**
     * Called when page data has been loaded.
     * @param key
     */
    public loaded(key: string): void {
        this.dataLoaded[key] = true;
    }

    /**
     * Called to determine whether some page data has been loaded yet.
     * @param key
     * @return {boolean}
     */
    public isLoaded(key: string): boolean {
        if (this.dataLoaded[key]) {
            return true;
        } else {
            return false;
        }
    }

}
