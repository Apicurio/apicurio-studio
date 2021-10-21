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
import {ApiTypes} from "../models/api-types.enum";
import {StoredApiDesignTemplate} from "../models/stored-api-design-template.model";
import {NewApiTemplate} from "../models/new-api-template.model";
import {UpdateApiTemplate} from "../models/update-api-template.model";
import {ApiTemplateKinds} from "../models/api-template-kinds.enum";


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
        return this.templateCache.hasOwnProperty(type) ? this.templateCache[type] : [];
    }

    public loadTemplates(type: string): Promise<ApiDesignTemplate[]> {
        if (!this.templateCache.hasOwnProperty(type)) {
            console.info(`[TemplateService] Templates of type '${type}' are not ready, loading them from the API...`)
            let options: any = this.options({ "Accept": "application/json" });
            return this.httpGet<any>(this.endpoint("/templates", {}, { type: type }), options)
                .then(rawTemplates => {
                    let templates: ApiDesignTemplate[] = rawTemplates.map( template => {
                        return {
                            type: template.type,
                            name: template.name,
                            description: template.description,
                            content: template.document
                        };
                    })
                    this.templateCache[type] = templates;
                    return templates;
                }).catch(error => {
                    console.error("Couldn't load templates", error);
                    return [];
                });
        }
        return Promise.resolve(this.templateCache[type]);
    }

    public loadAllTemplates(): Promise<any> {
        return Promise.all([
            this.loadTemplates(ApiTypes.OpenAPI20),
            this.loadTemplates(ApiTypes.OpenAPI30),
            this.loadTemplates(ApiTypes.AsyncAPI20),
            this.loadTemplates(ApiTypes.GraphQL)
        ]);
    }

    /**
     * @see TemplateService.getApiTemplates
     */
    public getStoredTemplates(): Promise<StoredApiDesignTemplate[]> {
        console.info("[TemplateService] Getting API templates");

        let apiTemplatesUrl: string = this.endpoint("/templates", {}, { kind: ApiTemplateKinds.STORED });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[TemplateService] Fetching API templates: %s", apiTemplatesUrl);
        return this.httpGet<any[]>(apiTemplatesUrl, options).then(rawTemplates => {
            let templates: StoredApiDesignTemplate[] = rawTemplates.map( template => {
                return {
                    templateId: template.templateId,
                    type: template.type,
                    name: template.name,
                    description: template.description,
                    owner: template.owner,
                    content: template.document
                };
            });
            return templates;
        });
    }

    /**
     * @see TemplateService.createApiTemplate
     */
    public createStoredTemplate(template: NewApiTemplate): Promise<StoredApiDesignTemplate> {
        console.info("[TemplateService] Creating an API template");

        let apiTemplatesUrl: string = this.endpoint("/templates");
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[TemplateService] Creating an API template: %s", apiTemplatesUrl);
        return this.httpPostWithReturn<NewApiTemplate, StoredApiDesignTemplate>(apiTemplatesUrl, template, options);
    }

    /**
     * @see TemplateService.getApiTemplates
     */
    public getStoredTemplate(templateId: string): Promise<StoredApiDesignTemplate> {
        console.info("[TemplateService] Getting the API template for id %s", templateId);

        let apiTemplateUrl: string = this.endpoint("/templates/:templateId", {
            templateId: templateId
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[TemplateService] Fetching API template: %s", apiTemplateUrl);
        return this.httpGet<any>(apiTemplateUrl, options).then(rawTemplate => {
            return {
                templateId: rawTemplate.templateId,
                type: rawTemplate.type,
                name: rawTemplate.name,
                description: rawTemplate.description,
                owner: rawTemplate.owner,
                content: rawTemplate.document
            }
        });
    }

    /**
     * @see TemplateService.updateApiTemplate
     */
    public updateStoredTemplate(templateId: string, template: UpdateApiTemplate): Promise<void> {
        console.info("[TemplateService] Updating the API template for id %s", templateId);

        let apiTemplateUrl: string = this.endpoint("/templates/:templateId", {
            templateId: templateId
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[TemplateService] Updating an API template: %s", apiTemplateUrl);
        return this.httpPut<UpdateApiTemplate>(apiTemplateUrl, template, options);
    }

    /**
     * @see TemplateService.deleteApiTemplate
     */
    public deleteStoredTemplate(templateId: string): Promise<void> {
        console.info("[TemplateService] Deleting the API template for id %s", templateId);

        let apiTemplateUrl: string = this.endpoint("/templates/:templateId", {
            templateId: templateId
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[TemplateService] Deleting an API template: %s", apiTemplateUrl);
        return this.httpDelete(apiTemplateUrl, options);
    }
}
