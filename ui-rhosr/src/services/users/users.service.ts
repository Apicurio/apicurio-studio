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

import {BaseService} from "../baseService";
import {RegistryInstance, UserInfo} from "../../models";

/**
 * A service that provides access to the /users endpoint.
 */
export class UsersService extends BaseService {

    private anonymousUser: UserInfo;

    constructor() {
        super();
        this.anonymousUser = {
            admin: true,
            developer: false,
            displayName: "Anonymous",
            username: "anonymous",
            viewer: false
        };
    }

    public init(): void {
        // Nothing to init (done in c'tor)
    }

    public getUserInfo(instance: RegistryInstance): Promise<UserInfo> {
        if (this.isInstanceAuthEnabled()) {
            const endpoint: string = this.endpoint(instance.registryUrl,"/apis/registry/v2/users/me");
            return this.httpGet<UserInfo>(endpoint);
        } else {
            return Promise.resolve(this.anonymousUser);
        }
    }

    private isInstanceAuthEnabled(): boolean {
        return this.config.instancesConfig().auth.type !== "none";
    }

}
