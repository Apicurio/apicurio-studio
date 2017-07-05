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
import {BehaviorSubject} from "rxjs/BehaviorSubject";

import {IApisService}   from "./apis.service";
import {Api, ApiDefinition} from "../models/api.model";
import {ApiCollaborators, ApiCollaborator} from "../models/api-collaborators";
import {Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {IAuthenticationService} from "./auth.service";
import {AbstractGithubService} from "./github";
import {Oas20Document, OasLibraryUtils} from "oai-ts-core";
import {ObjectUtils, HttpUtils} from "../util/common";
import {NewApi} from "../models/new-api.model";
import {AddApi} from "../models/add-api.model";


const APIS_LOCAL_STORAGE_KEY = "apicurio.studio.services.local-apis.apis";


class GithubResourceInfo {
    org: string;
    repo: string;
    resource: string;

    public static fromUrl(url: string): GithubResourceInfo {
        let r: RegExp = new RegExp("https://github.com/([^/]+)/([^/]+)/blob/[^/]+/(.*.json)", "i");
        let result: RegExpExecArray = r.exec(url);
        if (result == null) {
            r = new RegExp("https://raw.githubusercontent.com/([^/]+)/([^/]+)/[^/]+/(.*.json)", "i");
            result = r.exec(url);
        }
        if (result == null) {
            return null;
        }

        let rval: GithubResourceInfo = new GithubResourceInfo();
        rval.org = result[1];
        rval.repo = result[2];
        rval.resource = result[3];

        if (rval.resource == null) {
            return null;
        }

        return rval;
    }

    public toUrl(): string {
        return "https://github.com/" + this.org + "/" + this.repo + "/blob/master" + this.resource;
    }

}


/**
 * An implementation of the IApisService that uses local browser storage to track your APIs.  In addition,
 * it works directly with github to get and update API content.
 */
export class LocalApisService extends AbstractGithubService implements IApisService {

    private apiIdCounter: number = Date.now();

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
    constructor(private http: Http, private authService: IAuthenticationService) {
        super();
        this.allApis = this.loadApisFromLocalStorage();
        console.info("[LocalApisService] Loaded APIs from localStorage: %o", this.allApis);

        this._apis.next(this.allApis);
        let ra: Api[] = this.allApis.slice(0, 4);
        this._recentApis.next(ra);
    }

    /**
     * Loads the list of APIs known to this service from browser local storage.
     * @return the list of APIs loaded from local storage
     */
    private loadApisFromLocalStorage(): Api[] {
        let storedApis: string = localStorage.getItem(APIS_LOCAL_STORAGE_KEY);
        if (storedApis) {
            let apis: any[] = JSON.parse(storedApis);
            // Note: filter out legacy apis (the structure has changed)
            return apis.filter( api => {
                if (api['repositoryResource']) {
                    return false;
                }
                return true;
            });
        } else {
            return [];
        }
    }

    /**
     * Stores the list of APIs in browser local storage.
     * @param apis the list of APIs to save in local storage
     */
    private storeApisInLocalStorage(apis: Api[]): void {
        let serializedApis = null;
        if (apis) {
            serializedApis = JSON.stringify(apis);
        } else {
            serializedApis = JSON.stringify([]);
        }
        localStorage.setItem(APIS_LOCAL_STORAGE_KEY, serializedApis);
    }

    /**
     * Gets the supported repository types for this implementation.
     * @return {string[]}
     */
    public getSupportedRepositoryTypes(): string[] {
        return ["GitHub"];
    }

    /**
     * Gets an observable over all the apis.
     * @return {Observable<Api[]>}
     */
    public getAllApis(): Observable<Api[]> {
        return this.apis;
    }

    /**
     * Gets an observable over just the "recent" apis.
     * @return {Observable<Api[]>}
     */
    public getRecentApis(): Observable<Api[]> {
        return this.recentApis;
    }

    /**
     * Creates an api from meta-data collected from the user.
     * @param api
     * @return {Promise<Api>}
     */
    public createApi(api: NewApi): Promise<Api> {
        console.info("[LocalApisService] Creating the API in GitHub");
        let library: OasLibraryUtils = new OasLibraryUtils();
        let oaiDoc: Oas20Document = <Oas20Document>library.createDocument("2.0");
        oaiDoc.info = oaiDoc.createInfo();
        oaiDoc.info.title = api.name;
        oaiDoc.info.description = api.description;
        let oaiDocObj: any = library.writeNode(oaiDoc);
        let oaiContent: string = JSON.stringify(oaiDocObj, null, 4);
        let b64Content: string = btoa(oaiContent);
        let commitMessage: string = "Initial creation of API: " + api.name;

        let gri: GithubResourceInfo = GithubResourceInfo.fromUrl(api.repositoryUrl);
        let createFileUrl: string = this.endpoint("/repos/:owner/:repo/contents/:path", {
            owner: gri.org,
            repo: gri.repo,
            path: gri.resource
        });
        let headers: Headers = new Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });
        let body: any = {
            message: commitMessage,
            content: b64Content
        };

        console.info("[LocalApisService] Creating an API Definition in github @ URL: %s", createFileUrl);

        return this.http.put(createFileUrl, body, options).map( _ => {
            let rval: Api = new Api();
            let now: Date = new Date();

            rval.id = String(this.apiIdCounter++);
            rval.name = api.repositoryUrl;
            rval.description = api.repositoryUrl;
            rval.repositoryUrl = api.repositoryUrl;
            this.authService.getAuthenticatedUser().subscribe( user => {
                rval.createdBy = user.login;
                rval.modifiedBy = user.login;
            });
            rval.createdOn = now;
            rval.modifiedOn = now;

            return rval;
        }).flatMap( api => {
            return this.addApi(api);
        }).toPromise();
    }

    /**
     * Adds an API based on the provided meta-data.
     * @param addApi
     * @return {Promise<Api>}
     */
    public addApi(addApi: AddApi): Promise<Api> {
        return this.discoverApi(addApi.repositoryUrl).then( api => {
            // Generate a new ID for the Api
            api.id = String(this.apiIdCounter++);
            // Push the new Api onto the list
            this.allApis.unshift(api);
            // Save the result in local storage
            this.storeApisInLocalStorage(this.allApis);
            // Publish some events
            this._apis.next(this.allApis);
            let ra: Api[] = this.allApis.slice(0, 4);
            this._recentApis.next(ra);
            return Promise.resolve(api);
        });
    }

    /**
     * Deletes an API.  This does not delete the API from the source repository.  It simply removes
     * the API from the list of APIs "managed" by the studio.
     * @param api
     * @return {Promise<void>}
     */
    public deleteApi(api: Api): Promise<void> {
        let idx: number = this.allApis.indexOf(api);
        if (idx != -1) {
            this.allApis.splice(idx, 1);
            this._apis.next(this.allApis);
            let ra: Api[] = this.allApis.slice(0, 4);
            this._recentApis.next(ra);

            // Save the result in local storage
            this.storeApisInLocalStorage(this.allApis);
        }
        return Promise.resolve(null);
    }

    /**
     * Gets a single API by its id.  The API id is assigned when the API is created.
     * @param apiId
     * @return Promise<Api>
     */
    public getApi(apiId: string): Promise<Api> {
        let api: Api = this.getLocalApi(apiId);
        if (!ObjectUtils.isNullOrUndefined(api)) {
            this.storeApisInLocalStorage(this.allApis);
        }
        return Promise.resolve(api);
    }

    /**
     * Gets a single API definition by its ID.
     * @param apiId
     */
    public getApiDefinition(apiId: string): Promise<ApiDefinition> {
        let api: Api = this.getLocalApi(apiId);
        if (api === null) {
            return Promise.resolve(null);
        }
        let apiDef: ApiDefinition = ApiDefinition.fromApi(api);
        return this.resolveApiDefinitionSpec(apiDef);
    }

    /**
     * Updates an API definition by storing it in GitHub (creating a new version).
     * @param definition
     * @return {undefined}
     */
    public updateApiDefinition(definition: ApiDefinition, saveMessage: string, saveComment: string): Promise<ApiDefinition> {
        let gri: GithubResourceInfo = GithubResourceInfo.fromUrl(definition.repositoryUrl);
        let contentUrl: string = this.endpoint("/repos/:owner/:repo/contents/:path", {
            owner: gri.org,
            repo: gri.repo,
            path: gri.resource
        });
        let headers = new Headers({ "Accept": "application/json", "Content-Type": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({ headers: headers });

        let oaiContent: string = JSON.stringify(definition.spec, null, 4);
        let b64Content: string = btoa(oaiContent);

        let body: any = {
            message: saveMessage,
            content: b64Content,
            sha: definition.version
        };

        console.info("[LocalApisService] Saving API Definition to github @ URL: %s", contentUrl);
        console.info("                   Message: %s", saveMessage);
        console.info("                   SHA: %s", definition.version);
        return this.http.put(contentUrl, body, options).map( response => {
            let data: any = response.json();

            let rval: ApiDefinition = ApiDefinition.fromApi(definition);
            rval.spec = definition.spec;
            rval.version = data.content.sha;

            this.updateLocalApi(rval);

            if (saveComment) {
                let commitSha: string = data.commit.sha;
                this.addCommitComment(rval, commitSha, saveComment);
            }

            return rval;
        }).toPromise();
    }

    /**
     * Gets the list of collaborators for the given API.  This will use the github
     * API to fetch all of the commits associated with the resource.  It will then create a
     * summary object (the ApiCollaborators object) from this information and return it.
     *
     * The github API call is this:
     *
     * ```
     * curl -u USER:PASS https://api.github.com/repos/ORG/REPO/commits?path=/path/to/file.json
     * ```
     *
     * @param api
     * @return {undefined}
     */
    public getCollaborators(api: Api): Promise<ApiCollaborators> {
        console.info("[LocalApisService] Getting collaborator info.");
        let gri: GithubResourceInfo = GithubResourceInfo.fromUrl(api.repositoryUrl);
        console.info("[LocalApisService] Parsed GRI: %o", gri);
        let commitsUrl: string = this.endpoint("/repos/:owner/:repo/commits", {
            owner: gri.org,
            repo: gri.repo
        });
        let rval: ApiCollaborators = new ApiCollaborators();

        let headers: Headers = new Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set("path", gri.resource);
        let options = new RequestOptions({
            headers: headers,
            search: searchParams
        });
        let cmap: any = {};

        return this.http.get(commitsUrl, options).map( response => {
            let commits: any[] = response.json();
            for (let commit of commits) {
                let user: string = commit.author.login;
                let userUrl: string = commit.author.html_url;
                let collaborator: ApiCollaborator;
                if (user in cmap) {
                    collaborator = cmap[user];
                } else {
                    collaborator = new ApiCollaborator();
                    collaborator.userName = user;
                    collaborator.userUrl = userUrl;
                    collaborator.numChanges = 0;
                    rval.collaborators.push(collaborator);
                    cmap[user] = collaborator;
                }
                rval.totalChanges++;
                collaborator.numChanges++;
            }
            return this.top5Collaborators(rval);
        }).toPromise();
    }

    /**
     * Filter the list of collaborators so that only the top 5 are returned.
     * @param collaborators
     */
    private top5Collaborators(collaborators: ApiCollaborators): ApiCollaborators {
        collaborators.collaborators = collaborators.collaborators.sort( (a: ApiCollaborator, b: ApiCollaborator) => {
            if (a.numChanges > b.numChanges) {
                return -1;
            } else {
                return 1;
            }
        }).slice(0, 5);
        return collaborators;
    }

    /**
     * Retrieves all of the organizations for the logged-in user.
     * @return {undefined}
     */
    public getOrganizations(): Observable<string[]> {
        console.info("[LocalApisService] Getting organization list.");
        let orgsUrl: string = this.endpoint("/user/orgs");

        let headers: Headers = new Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });

        let fetch = function(http: Http, url: string, orgNames: string[], subject: BehaviorSubject<string[]>) {
            http.get(url, options).map( response => {
                let orgs: any[] = response.json();
                for (let org of orgs) {
                    orgNames.push(org.login);
                }

                subject.next(orgNames);

                let links: any = HttpUtils.parseLinkHeader(response.headers.get("Link"));
                let next: string = links["next"];
                if (next) {
                    fetch(http, next, orgNames, subject);
                }
                return [];
            }).toPromise().then();
        };

        let orgNames: string[] = [];
        let subject: BehaviorSubject<string[]> = new BehaviorSubject([]);
        fetch(this.http, orgsUrl, orgNames, subject);
        return subject.asObservable();
    }

    /**
     * Retrieves all of the repositories within a given organization.
     * @param organization
     * @return {undefined}
     */
    public getRepositories(organization: string, isUser?: boolean): Observable<string[]> {
        console.info("[LocalApisService] Getting repository list for org: %s", organization);
        let reposUrl: string = this.endpoint("/orgs/:org/repos", {
            org: organization
        });
        if (isUser) {
            reposUrl = this.endpoint("/users/:username/repos", {
                username: organization
            });
        }

        let headers: Headers = new Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });

        let fetch = function(http: Http, url: string, repositories: string[], subject: BehaviorSubject<string[]>) {
            http.get(url, options).map( response => {
                let repos: any[] = response.json();
                for (let repo of repos) {
                    repositories.push(repo.name);
                }

                subject.next(repositories);

                let links: any = HttpUtils.parseLinkHeader(response.headers.get("Link"));
                let next: string = links["next"];
                if (next) {
                    fetch(http, next, repositories, subject);
                }
                return [];
            }).toPromise().then();
        };

        let repositories: string[] = [];
        let repoSubject: BehaviorSubject<string[]> = new BehaviorSubject([]);
        fetch(this.http, reposUrl, repositories, repoSubject);
        return repoSubject.asObservable();
    }

    /**
     * Discover details about an API by parsing the URL and then querying github (assuming it's a valid
     * github URL) for the details of the API.  This entails grabbing the full content of the API definition,
     * parsing it, and extracting the name and description.  If these are not found, name and description
     * are generated from the URL.
     * @param apiUrl
     * @return {undefined}
     */
    public discoverApi(apiUrl: string): Promise<Api> {
        let api: Api = new Api();
        api.repositoryUrl = apiUrl;

        let gri: GithubResourceInfo = GithubResourceInfo.fromUrl(apiUrl);
        if (gri === null) {
            return Promise.reject<Api>("Invalid GitHub resource URL: " + apiUrl);
        } else {
            return this.resolveApiInfo(api);
        }
    }

    /**
     * Resolves the api info by fetching the content of the api definition from github and extracting
     * the title and description.
     * @param api
     */
    private resolveApiInfo(api: Api): Promise<Api> {
        let gri: GithubResourceInfo = GithubResourceInfo.fromUrl(api.repositoryUrl);
        let contentUrl: string = this.endpoint("/repos/:owner/:repo/contents/:path", {
            owner: gri.org,
            repo: gri.repo,
            path: gri.resource
        });
        let headers = new Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(contentUrl, options).toPromise().then( response => {
            let data: any = response.json();
            let b64content: string  = data.content;
            let content: string = atob(b64content);
            let pc: any = JSON.parse(content);

            // TODO if the content is greater than 1MB, need to make another call to the "blob" API

            api.name = pc.info.title;
            api.description = pc.info.description;
            return api;
        });
    }

    /**
     * Resolves the api info by fetching the content of the api definition from github and extracting
     * the title and description.
     * @param api
     */
    private resolveApiDefinitionSpec(api: ApiDefinition): Promise<ApiDefinition> {
        let gri: GithubResourceInfo = GithubResourceInfo.fromUrl(api.repositoryUrl);
        let contentUrl: string = this.endpoint("/repos/:owner/:repo/contents/:path", {
            owner: gri.org,
            repo: gri.repo,
            path: gri.resource
        });
        let headers = new Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({ headers: headers });
        console.info("Loading spec content from github @ URL: %s", contentUrl);
        return this.http.get(contentUrl, options).toPromise().then( response => {
            let data: any = response.json();
            let b64content: string  = data.content;
            let content: string = atob(b64content);
            let pc: any = JSON.parse(content);

            // TODO if the content is greater than 1MB, need to make another call to the "blob" API

            console.info("[LocalApisService] Spec content loaded successfully.");
            console.info("                   SHA: %s", data.sha);

            api.spec = pc;
            api.version = data.sha;
            return api;
        });
    }

    /**
     * Gets an API by id synchronously.
     * @param apiId
     * @return {any}
     */
    private getLocalApi(apiId: string): Api {
        let rval: Api = null;
        let idx: number = 0;
        while (idx < this.allApis.length) {
            let api: Api = this.allApis[idx];
            if (api.id === apiId) {
                rval = api;
                break;
            }
            idx++;
        }
        if (rval != null && idx > 0) {
            this.allApis.splice(idx, 1);
            this.allApis.unshift(rval);
            this._apis.next(this.allApis);
            let ra: Api[] = this.allApis.slice(0, 4);
            this._recentApis.next(ra);
        }
        return rval;
    }

    /**
     * Updates the meta-data of an API.
     * @param updatedApi
     */
    private updateLocalApi(updatedApi: Api): void {
        let api: Api = this.getLocalApi(updatedApi.id);
        if (!ObjectUtils.isNullOrUndefined(api)) {
            api.modifiedBy = updatedApi.modifiedBy;
            api.modifiedOn = updatedApi.modifiedOn;
            api.name = updatedApi.name;
            api.description = updatedApi.description;
            this.storeApisInLocalStorage(this.allApis);
        }
    }

    /**
     * Adds a comment to the commit.
     * @param apiDefinition
     * @param comment
     */
    private addCommitComment(definition: ApiDefinition, commitSha: string, comment: string): void {
        let gri: GithubResourceInfo = GithubResourceInfo.fromUrl(definition.repositoryUrl);
        let commentUrl: string = this.endpoint("/repos/:owner/:repo/commits/:sha/comments", {
            owner: gri.org,
            repo: gri.repo,
            sha: commitSha
        });
        let headers = new Headers({ "Accept": "application/json", "Content-Type": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({ headers: headers });

        let body: any = {
            body: comment
        };

        console.info("[LocalApisService] Adding a commit comment to github @ URL: %s", commentUrl);
        console.info("                   Comment: %s", comment);
        console.info("                   Commit SHA: %s", commitSha);
        this.http.post(commentUrl, body, options).toPromise().then();
    }

}
