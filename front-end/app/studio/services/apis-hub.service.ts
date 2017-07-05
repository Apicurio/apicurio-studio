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

export class HubApisService implements IApisService {

    private apiBaseHref: string;

    private allApis: Api[];

    private _recentApis: BehaviorSubject<Api[]> = new BehaviorSubject([]);
    public recentApis: Observable<Api[]> = this._recentApis.asObservable();

    private _apis: BehaviorSubject<Api[]> = new BehaviorSubject([]);
    public apis: Observable<Api[]> = this._apis.asObservable();

    /**
     * Constructor.
     * @param http
     * @param authService
     */
    constructor(private http: Http, private authService: IAuthenticationService, private config: ConfigService) {
        this.apiBaseHref = this.config.hubUrl();
        this.allApis = null;
    }

    public getSupportedRepositoryTypes(): string[] {
        return ["GitHub"];
    }

    public getAllApis(): Observable<Api[]> {
        console.info("[HubApisService] Getting all APIs");

        if (this.allApis === null) {
            this.allApis = [];
            this._apis.next(this.allApis);
            this.refreshApis();
        }

        return this.apis;
    }

    private refreshApis(): void {
        let listApisUrl: string = this.endpoint("/designs");

        let headers: Headers = new Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });

        console.info("[HubApisService] Refreshing API list: %s", listApisUrl);

        this.http.get(listApisUrl, options).map( response => {
            let apis: Api[] = response.json() as Api[];
            return apis;
        }).toPromise().then( apis => {
            this.allApis = apis;
            this._apis.next(apis);
        });
    }

    public getRecentApis(): Observable<Api[]> {
        return this.getAllApis();
    }

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
            this.allApis.push(api);
            this._apis.next(this.allApis);
            return api;
        }).toPromise();
    }

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
            this.allApis.push(api);
            this._apis.next(this.allApis);
            return api;
        }).toPromise();
    }

    public deleteApi(api: Api): Promise<void> {
        return undefined;
    }

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
            return response.json() as Api;
        }).toPromise();
    }

    public getApiDefinition(apiId: string): Promise<ApiDefinition> {
        return undefined;
    }

    public updateApiDefinition(definition: ApiDefinition, saveMessage: string, saveComment: string): Promise<ApiDefinition> {
        return undefined;
    }

    public getCollaborators(api: Api): Promise<ApiCollaborators> {
        let collaboratorsUrl: string = this.endpoint("/designs/:designId/collaborators", {
            designId: api.id
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

    public getOrganizations(): Observable<string[]> {
        // TODO implement this!
        return Observable.of(["Apicurio", "apiman", "EricWittmann"]);
    }

    public getRepositories(organization: string, isUser?: boolean): Observable<string[]> {
        // TODO implement this!
        return Observable.of(["apicurio-studio", "api-samples", "apiman"]);
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

}
