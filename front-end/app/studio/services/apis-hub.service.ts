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


import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

import {IApisService} from "./apis.service";
import {Api, ApiDefinition} from "../models/api.model";
import {IAuthenticationService} from "./auth.service";
import {ConfigService} from "./config.service";
import {ApiCollaborator, ApiCollaborators} from "../models/api-collaborators";

import {Headers, Http, RequestOptions} from "@angular/http";
import {NewApi} from "../models/new-api.model";
import {AddApi} from "../models/add-api.model";
import {AbstractHubService} from "./hub";


const RECENT_APIS_LOCAL_STORAGE_KEY = "apicurio.studio.services.hub-apis.recent-apis";

/**
 * An implementation of the APIs service that uses the Apicurio Studio back-end (Hub API) service
 * to store and retrieve relevant information for the user.
 */
export class HubApisService extends AbstractHubService implements IApisService {

    private theRecentApis: Api[];
    private _recentApis: BehaviorSubject<Api[]> = new BehaviorSubject([]);
    private recentApis: Observable<Api[]> = this._recentApis.asObservable();

    private cachedApis: Api[] = null;

    /**
     * Constructor.
     * @param http
     * @param authService
     */
    constructor(http: Http, authService: IAuthenticationService, config: ConfigService) {
        super(http, authService, config);
        this.theRecentApis = this.loadRecentApis();
        if (this.theRecentApis === null) {
            this._recentApis.next([]);
        } else {
            this._recentApis.next(this.theRecentApis);
        }
    }

    /**
     * @see IApisService.getSupportedRepositoryTypes
     */
    public getSupportedRepositoryTypes(): string[] {
        return ["GitHub"];
    }

    /**
     * @see IApisService.getApis
     */
    public getApis(): Promise<Api[]> {
        console.info("[HubApisService] Getting all APIs");

        let listApisUrl: string = this.endpoint("/designs");
        let options: RequestOptions = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Fetching API list: %s", listApisUrl);

        return this.http.get(listApisUrl, options).map( response => {
            let apis: Api[] = response.json() as Api[];
            this.cachedApis = apis;
            if (this.theRecentApis === null) {
                this.theRecentApis = this.getRecentFromAllApis(apis);
                this._recentApis.next(this.theRecentApis);
            }
            this.removeMissingRecentApis(apis);
            return apis;
        }).toPromise();
    }

    /**
     * @see IApisService.getRecentApis
     */
    public getRecentApis(): Observable<Api[]> {
        return this.recentApis;
    }

    /**
     * @see IApisService.createApi
     */
    public createApi(api: NewApi): Promise<Api> {
        console.info("[HubApisService] Creating the API via the hub API");

        let createApiUrl: string = this.endpoint("/designs");
        let options: RequestOptions = this.options({ "Accept": "application/json", "Content-Type": "application/json" });
        let body: any = api;

        console.info("[HubApisService] Creating an API Design: %s", createApiUrl);

        return this.http.post(createApiUrl, body, options).map( response => {
            let api: Api = response.json() as Api;
            return api;
        }).toPromise();
    }

    /**
     * @see IApisService.addApi
     */
    public addApi(api: AddApi): Promise<Api> {
        console.info("[HubApisService] Adding an API design via the hub API");

        let addApiUrl: string = this.endpoint("/designs");
        let options: RequestOptions = this.options({ "Accept": "application/json", "Content-Type": "application/json" });
        let body: any = api;

        console.info("[HubApisService] Adding an API Design: %s", addApiUrl);

        return this.http.put(addApiUrl, body, options).map( response => {
            let api: Api = response.json() as Api;
            return api;
        }).toPromise();
    }

    /**
     * @see IApisService.deleteApi
     */
    public deleteApi(api: Api): Promise<void> {
        console.info("[HubApisService] Deleting an API design via the hub API");

        let deleteApiUrl: string = this.endpoint("/designs/:designId", {
            designId: api.id
        });
        let options: RequestOptions = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Deleting an API Design: %s", deleteApiUrl);

        return this.http.delete(deleteApiUrl, options).map( () => {
            this.cachedApis = null;
            this.removeFromRecent(api);
            this._recentApis.next(this.theRecentApis);
            return null;
        }).toPromise();
    }

    /**
     * @see IApisService.getApi
     */
    public getApi(apiId: string): Promise<Api> {
        let getApiUrl: string = this.endpoint("/designs/:designId", {
            designId: apiId
        });
        let options: RequestOptions = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Getting an API Design: %s", getApiUrl);

        return this.http.get(getApiUrl, options).map( response => {
            let api: Api = response.json() as Api;
            this.addToRecentApis(api);
            this._recentApis.next(this.theRecentApis);
            return api;
        }).toPromise();
    }

    /**
     * @see IApisService.getApiDefinition
     */
    public getApiDefinition(apiId: string): Promise<ApiDefinition> {
        return this.getApi(apiId).then( api => {
            let getContentUrl: string = this.endpoint("/designs/:designId/content", {
                designId: apiId
            });
            let options: RequestOptions = this.options({ "Accept": "application/json" });

            console.info("[HubApisService] Getting API Design content: %s", getContentUrl);

            return this.http.get(getContentUrl, options).map( response => {
                let openApiSpec: any = response.json();
                let rheaders: Headers = response.headers;
                let sha: string = rheaders.get("X-Content-SHA");
                console.info("Received SHA: " + sha);
                let apiDef: ApiDefinition = ApiDefinition.fromApi(api);
                apiDef.spec = openApiSpec;
                apiDef.version = sha;
                return apiDef;
            }).toPromise();
        });
    }

    /**
     * @see IApisService.updateApiDefinition
     */
    public updateApiDefinition(definition: ApiDefinition, saveMessage: string, saveComment: string): Promise<ApiDefinition> {
        console.info("[HubApisService] Updating an API definition (content): %s", definition.name);
        console.info("[HubApisService] SHA: %s", definition.version);

        let updateContentUrl: string = this.endpoint("/designs/:designId/content", {
            designId: definition.id
        });
        let options: RequestOptions = this.options({
            "Content-Type": "application/json",
            "X-Apicurio-CommitMessage": saveMessage,
            "X-Apicurio-CommitComment": saveComment,
            "X-Content-SHA": definition.version
        });
        let body: any = definition.spec;

        return this.http.put(updateContentUrl, body, options).map( response => {
            let newSha: string = response.headers.get("X-Content-SHA");
            console.info("[HubApisService] New SHA found: %s", newSha);
            definition.version = newSha;
            return definition;
        }).toPromise();
    }

    /**
     * @see IApisService.getCollaborators
     */
    public getCollaborators(apiId: string): Promise<ApiCollaborators> {
        let collaboratorsUrl: string = this.endpoint("/designs/:designId/collaborators", {
            designId: apiId
        });
        let options: RequestOptions = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Getting collaborators: %s", collaboratorsUrl);

        return this.http.get(collaboratorsUrl, options).map( response => {
            let items: any[] = response.json();
            let rval: ApiCollaborators = new ApiCollaborators();
            rval.collaborators = [];
            rval.totalChanges = 0;
            items.forEach( item => {
                let name: string = item["name"];
                let url: string = item["url"];
                let commits: number = item["commits"];
                let collaborator: ApiCollaborator = new ApiCollaborator();
                collaborator.numChanges = commits;
                collaborator.userName = name;
                collaborator.userUrl = url;
                rval.collaborators.push(collaborator);
                rval.totalChanges += commits;
            });
            return rval;
        }).toPromise();
    }

    /**
     * @see IApisService.getOrganizations
     */
    public getOrganizations(): Promise<string[]> {
        let organizationsUrl: string = this.endpoint("/currentuser/organizations");
        let options: RequestOptions = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Getting organizations: %s", organizationsUrl);

        return this.http.get(organizationsUrl, options).map( response => {
            return response.json() as string[];
        }).toPromise();
    }

    /**
     * @see IApisService.getRepositories
     */
    public getRepositories(organization: string, isUser?: boolean): Promise<string[]> {
        let repositoriesUrl: string = this.endpoint("/currentuser/organizations/:org/repositories", {
            org: organization
        });
        let options: RequestOptions = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Getting repositories: %s", repositoriesUrl);

        return this.http.get(repositoriesUrl, options).map( response => {
            return response.json() as string[];
        }).toPromise();
    }

    /**
     * Loads the recent APIs from browser local storage.
     * @return {Api[]}
     */
    private loadRecentApis(): Api[] {
        let storedApis: string = localStorage.getItem(RECENT_APIS_LOCAL_STORAGE_KEY);
        if (storedApis) {
            let apis: any[] = JSON.parse(storedApis);
            return apis;
        } else {
            return null;
        }
    }

    /**
     * Returns the most recent 3 APIs from the full list of APIs provided.  Uses the
     * API's "last modified" time to determine the most recent 3 APIs.
     * @param {Api[]} apis
     * @return {Api[]}
     */
    private getRecentFromAllApis(apis: Api[]): Api[] {
        return apis.slice().sort( (api1, api2) => {
            if (api1.modifiedOn < api2.modifiedOn) {
                return 1;
            }
            return -1;
        }).slice(0, 3);
    }

    /**
     * Adds the given API to the list of "recent APIs".  This may also remove an API
     * from the list in addition to re-ordering the recent APIs list.
     * @param {Api} api
     * @return {Api[]}
     */
    private addToRecentApis(api: Api): Api[] {
        let recent: Api[] = [];
        if (this.theRecentApis !== null) {
            recent = this.theRecentApis.slice();
        }

        // Check if the api is already in the list
        let oldApi: Api = null;
        recent.forEach( a => {
            if (api.id === a.id) {
                oldApi = a;
            }
        });
        // If so, remove it.
        if (oldApi !== null) {
            recent.splice(recent.indexOf(oldApi), 1);
        }

        // Now push the API onto the list (should be first)
        recent.unshift(api);

        // Limit the # of APIs to 3
        if (recent.length > 3) {
            recent = recent.slice(0, 3);
        }

        // Finally save the recent APIs in local storage
        setTimeout(() => {
            let serializedApis: string = JSON.stringify(recent);
            localStorage.setItem(RECENT_APIS_LOCAL_STORAGE_KEY, serializedApis);
        }, 50);

        this.theRecentApis = recent;
        return recent;
    }

    /**
     * Removes an API from the list of recent APIs.
     * @param {Api} api
     * @return {Api[]}
     */
    private removeFromRecent(api: Api) {
        let recent: Api[] = [];
        if (this.theRecentApis !== null) {
            recent = this.theRecentApis.slice();
        }

        // Check if the api is in the list
        let oldApi: Api = null;
        recent.forEach( a => {
            if (api.id === a.id) {
                oldApi = a;
            }
        });
        // If so, remove it.
        if (oldApi !== null) {
            recent.splice(recent.indexOf(oldApi), 1);
        }

        // Save the recent APIs in local storage
        setTimeout(() => {
            let serializedApis: string = JSON.stringify(recent);
            localStorage.setItem(RECENT_APIS_LOCAL_STORAGE_KEY, serializedApis);
        }, 50);

        this.theRecentApis = recent;
        return recent;
    }

    /**
     * Removes any API from the "recent APIs" list that is not in the
     * given list of "all" Apis.
     * @param {Api[]} apis
     */
    private removeMissingRecentApis(apis: Api[]) {
        this.theRecentApis.filter( recentApi => {
            let found: boolean = false;
            apis.forEach( api => {
                if (api.id === recentApi.id) {
                    found = true;
                }
            });
            return !found;
        }).forEach( diffApi => {
            console.info("[HubApisService] Removing '%s' from the recent APIs list.", diffApi.name);
            this.theRecentApis.splice(this.theRecentApis.indexOf(diffApi), 1);
        });
    }
}
