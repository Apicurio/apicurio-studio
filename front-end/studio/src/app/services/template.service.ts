/**
 * @license
 * Copyright 2018 JBoss Inc
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
import {ApiDesignTemplate} from "../models/api-design-template.model";
import {AbstractHubService} from "./hub";
import {HttpClient} from "@angular/common/http";
import {IAuthenticationService} from "./auth.service";
import {ConfigService} from "./config.service";


/**
 * A service to manage a list of API Design templates that can be used when creating new
 * APIs.
 */
@Injectable()
export class TemplateService extends AbstractHubService {

    private templateCache: { [key: string]: ApiDesignTemplate[] } = {};

    /**
     * Constructor.
     * @param http
     * @param authService
     * @param config
     */
    constructor(http: HttpClient, authService: IAuthenticationService, config: ConfigService) {
        super(http, authService, config);
    }

    /**
     * Gets a list of templates for the given spec version.
     * @param type
     */
    public getTemplates(type: string): ApiDesignTemplate[] {
        if (!this.templateCache.hasOwnProperty(type)) {
            console.info(`[TemplateService] Templates of type '${type}' are not ready, loading them from the API...`)
            let rval: ApiDesignTemplate[] = [];
            let options: any = this.options({ "Accept": "application/json" });
            this.httpGet<any>(this.endpoint("/templates", {}, { type: type }), options)
                .then(rawTemplates => {
                    for (let template of rawTemplates) {
                        rval.push({
                            type: template.type,
                            name: template.name,
                            description: template.description,
                            content: template.document
                        })
                    }
                }).catch(error => {
                    console.error("Couldn't load templates", error);
                });
            this.templateCache[type] = rval;
        }
        return this.templateCache[type];
    }
}
