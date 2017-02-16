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

import {Injectable, Inject} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot} from "@angular/router";
import {Api} from "../../models/api.model";
import {IApisService} from "../../services/apis.service";
import {Subscription} from "rxjs";

/**
 * Resolves the recent APIs prior to loading the dashboard screen.
 */
@Injectable()
export class RecentApisResolve implements Resolve<Api[]> {
    constructor(@Inject(IApisService) private apis: IApisService) {
    }

    resolve(route: ActivatedRouteSnapshot): Promise<Api[]> {
        let promise: Promise<Api[]> = new Promise((resolve) => {
            let subscription: Subscription = this.apis.getRecentApis().subscribe(data => {
                resolve(data);
                subscription.unsubscribe();
            });
        });
        return promise;
    }
}
