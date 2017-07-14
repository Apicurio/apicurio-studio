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


const RECENT_APIS_LOCAL_STORAGE_KEY = "apicurio.studio.services.hub-apis.recent-apis";


/**
 * An implementation of the APIs service that uses the Apicurio Studio back-end (Hub API) service
 * to store and retrieve relevant information for the user.
 */
export class HubApisService implements IApisService {

    private apiBaseHref: string;

    private theRecentApis: Api[];
    private _recentApis: BehaviorSubject<Api[]> = new BehaviorSubject([]);
    private recentApis: Observable<Api[]> = this._recentApis.asObservable();

    private cachedApis: Api[] = null;

    /**
     * Constructor.
     * @param http
     * @param authService
     */
    constructor(private http: Http, private authService: IAuthenticationService, private config: ConfigService) {
        this.apiBaseHref = this.config.hubUrl();
        this.theRecentApis = this.loadRecentApis();
        if (this.theRecentApis === null) {
            this._recentApis.next([]);
        } else {
            this._recentApis.next(this.theRecentApis);
        }
    }

    /**
     * Returns the supported repository types.
     * @return {[string]}
     */
    public getSupportedRepositoryTypes(): string[] {
        return ["GitHub"];
    }

    /**
     * Fetch the APIs from the back-end service.
     * @return {Promise<Api[]>}
     */
    public getApis(): Promise<Api[]> {
        console.info("[HubApisService] Getting all APIs");
        let listApisUrl: string = this.endpoint("/designs");

        let headers: Headers = new Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });

        console.info("[HubApisService] Fetching API list: %s", listApisUrl);

        return this.http.get(listApisUrl, options).map( response => {
            let apis: Api[] = response.json() as Api[];
            this.cachedApis = apis;
            if (this.theRecentApis === null) {
                this.theRecentApis = this.getRecentFromAllApis(apis);
                this._recentApis.next(this.theRecentApis);
            }
            return apis;
        }).toPromise();
    }

    /**
     * Gets the recent APIs.
     * @return {Observable<Api[]>}
     */
    public getRecentApis(): Observable<Api[]> {
        return this.recentApis;
    }

    /**
     * Creates an API by calling the back end service.
     * @param api
     * @return {Promise<Api>}
     */
    public createApi(api: NewApi): Promise<Api> {
        console.info("[HubApisService] Creating the API via the hub API");

        let createApiUrl: string = this.endpoint("/designs");
        let headers: Headers = new Headers({ "Accept": "application/json", "Content-Type": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });
        let body: any = api;

        console.info("[HubApisService] Creating an API Design: %s", createApiUrl);

        return this.http.post(createApiUrl, body, options).map( response => {
            let api: Api = response.json() as Api;
            return api;
        }).toPromise();
    }

    /**
     * Adds an API by calling the back end service.
     * @param api
     * @return {Promise<Api>}
     */
    public addApi(api: AddApi): Promise<Api> {
        console.info("[HubApisService] Adding an API design via the hub API");

        let addApiUrl: string = this.endpoint("/designs");
        let headers: Headers = new Headers({ "Accept": "application/json", "Content-Type": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });
        let body: any = api;

        console.info("[HubApisService] Adding an API Design: %s", addApiUrl);

        return this.http.put(addApiUrl, body, options).map( response => {
            let api: Api = response.json() as Api;
            return api;
        }).toPromise();
    }

    /**
     * Deletes and API by calling the back-end service.
     * @param api
     * @return {Promise<void>}
     */
    public deleteApi(api: Api): Promise<void> {
        console.info("[HubApisService] Deleting an API design via the hub API");

        let deleteApiUrl: string = this.endpoint("/designs/:designId", {
            designId: api.id
        });

        let headers: Headers = new Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });

        console.info("[HubApisService] Deleting an API Design: %s", deleteApiUrl);

        return this.http.delete(deleteApiUrl, options).map( () => {
            this.cachedApis = null;
            this.removeFromRecent(api);
            this._recentApis.next(this.theRecentApis);
            return null;
        }).toPromise();
    }

    /**
     * Fetches a single API from the back-end service.
     * @param apiId
     * @return {Promise<Api>}
     */
    public getApi(apiId: string): Promise<Api> {
        let getApiUrl: string = this.endpoint("/designs/:designId", {
            designId: apiId
        });

        let headers: Headers = new Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });

        console.info("[HubApisService] Getting an API Design: %s", getApiUrl);

        return this.http.get(getApiUrl, options).map( response => {
            let api: Api = response.json() as Api;
            this.addToRecentApis(api);
            this._recentApis.next(this.theRecentApis);
            return api;
        }).toPromise();
    }

    /**
     * Gets an API definition by fetrching its meta-data and then its content.
     * @param apiId
     * @return {Promise<ApiDefinition>}
     */
    public getApiDefinition(apiId: string): Promise<ApiDefinition> {
        return this.getApi(apiId).then( api => {
            let getContentUrl: string = this.endpoint("/designs/:designId/content", {
                designId: apiId
            });

            let headers: Headers = new Headers({ "Accept": "application/json" });
            this.authService.injectAuthHeaders(headers);
            let options = new RequestOptions({
                headers: headers
            });

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
     * Updates the content of an API by storing it in the back-end service.
     * @param definition
     * @param saveMessage
     * @param saveComment
     * @return {Promise<T>}
     */
    public updateApiDefinition(definition: ApiDefinition, saveMessage: string, saveComment: string): Promise<ApiDefinition> {
        console.info("[HubApisService] Updating an API definition (content): %s", definition.name);

        let updateContentUrl: string = this.endpoint("/designs/:designId/content", {
            designId: definition.id
        });
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "X-Apicurio-CommitMessage": saveMessage,
            "X-Apicurio-CommitComment": saveComment,
            "X-Content-SHA": definition.version
        });
        console.info("[HubApisService] SHA: %s", definition.version);
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({
            headers: headers
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
     * Fetches the list of collaborators for a given API by calling the back-end service.
     * @param apiId
     * @return {Promise<T>}
     */
    public getCollaborators(apiId: string): Promise<ApiCollaborators> {
        let collaboratorsUrl: string = this.endpoint("/designs/:designId/collaborators", {
            designId: apiId
        });

        let headers: Headers = new Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });

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
     * Fetches the current user's organizations from the back-end service.
     * @return {Promise<string[]>}
     */
    public getOrganizations(): Promise<string[]> {
        let organizationsUrl: string = this.endpoint("/currentuser/organizations");

        let headers: Headers = new Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });

        console.info("[HubApisService] Getting organizations: %s", organizationsUrl);

        return this.http.get(organizationsUrl, options).map( response => {
            return response.json() as string[];
        }).toPromise();
    }

    /**
     * Fetches the current user's repositories from the back-end service.
     * @param organization
     * @param isUser
     * @return {Promise<string[]>}
     */
    public getRepositories(organization: string, isUser?: boolean): Promise<string[]> {
        let repositoriesUrl: string = this.endpoint("/currentuser/organizations/:org/repositories", {
            org: organization
        });

        let headers: Headers = new Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });

        console.info("[HubApisService] Getting repositories: %s", repositoriesUrl);

        return this.http.get(repositoriesUrl, options).map( response => {
            return response.json() as string[];
        }).toPromise();
    }

    /**
     * Creates a github API endpoint from the api path and params.
     * @param path
     * @param params
     * @return {string}
     */
    protected endpoint(path: string, params?: any): string {
        if (params) {
            for (let key in params) {
                let value: string = params[key];
                path = path.replace(":" + key, value);
            }
        }
        return this.apiBaseHref + path;
    }

    /**
     * Loads the recent APIs from browser local storage.
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
     * @param apis
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
     * @param api
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
     * @param api
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
}
