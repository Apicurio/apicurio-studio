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


const GITHUB_API_ENDPOINT = "https://api.github.com";

/**
 * An abstract base class for services that need to make API calls to Github.
 */
export abstract class AbstractGithubService {

    /**
     * Creates a github API endpoint from the api path and params.
     * @param path
     * @param params
     * 
     */
    protected endpoint(path: string, params?: any): string {
        if (params) {
            for (let key in params) {
                let value: string = params[key];
                path = path.replace(":" + key, value);
            }
        }
        return GITHUB_API_ENDPOINT + path;
    }

}