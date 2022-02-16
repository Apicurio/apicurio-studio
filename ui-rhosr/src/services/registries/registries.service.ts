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
import {RegistryInstance} from "../../models";
import {AuthConfig} from "../config";

/**
 * The registries service.  Responsible for getting a list of registries the user
 * has access to.
 */
export class RegistriesService extends BaseService {

    public listRegistries(): Promise<RegistryInstance[]> {
        if (this.config.registriesConfig().static) {
            return Promise.resolve(this.config.registriesConfig().static as RegistryInstance[]);
        } else if (this.config.registriesConfig().apiUrl) {
            const auth: AuthConfig = this.config.registriesConfig().auth;
            const registriesBaseHref: string = this.config.registriesConfig().apiUrl as string;
            const endpoint: string = this.endpoint(registriesBaseHref,"/api/serviceregistry_mgmt/v1/registries");
            return this.httpGet<RegistryInstance[]>(endpoint, auth, this.options({}), data => {
                return data.items as RegistryInstance[];
            });
        } else {
            return Promise.resolve([]);
        }
    }

}
