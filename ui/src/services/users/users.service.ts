/**
 * @license
 * Copyright 2021 Red Hat
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

import {BaseService} from "../baseService";
import {UserInfo} from "../../models";

/**
 * A service that provides access to the /users endpoint.
 */
export class UsersService extends BaseService {

    private currentUserInfo: UserInfo;

    constructor() {
        super();
        this.currentUserInfo = {
            admin: false,
            developer: false,
            displayName: "",
            username: "",
            viewer: false
        };
    }

    public init(): void {
        // Nothing to init (done in c'tor)
    }

    public currentUser(): UserInfo {
        return this.currentUserInfo;
    }

    public updateCurrentUser(): Promise<UserInfo> {
        if (this.auth.isAuthenticated()) {
            // TODO cache the response for a few minutes to limit the # of times this is called per minute??
            const endpoint: string = this.endpoint("/users/me");
            return this.httpGet<UserInfo>(endpoint).then(userInfo => {
                this.currentUserInfo = userInfo;
                return userInfo;
            });
        } else {
            return Promise.resolve(this.currentUserInfo);
        }
    }

}
