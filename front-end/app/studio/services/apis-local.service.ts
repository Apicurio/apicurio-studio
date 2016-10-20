import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {IApisService}   from "./apis.service";
import {Api} from "../models/api.model";
import {ApiCollaborators, ApiCollaborator} from "../models/api-collaborators";
import {Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {IAuthenticationService} from "./auth.service";


const APIS_LOCAL_STORAGE_KEY = "apiman.studio.services.local-apis.apis";

const GITHUB_API_ENDPOINT = "https://api.github.com";

class GithubRepoInfo {
    org: string;
    repo: string;

    public static fromUrl(url: string): GithubRepoInfo {
        let items: string[] = url.split("/");
        let repoInfo: GithubRepoInfo = new GithubRepoInfo();
        repoInfo.repo = items.pop();
        repoInfo.org = items.pop();
        return repoInfo;
    }

}


/**
 * An implementation of the IApisService that uses local browser storage to track your APIs.  In addition,
 * it works directly with github to get and update API content.
 */
export class LocalApisService implements IApisService {

    private apiIdCounter: number = Date.now();

    private allApis: Api[];

    private _recentApis: BehaviorSubject<Api[]> = new BehaviorSubject([]);
    public recentApis: Observable<Api[]> = this._recentApis.asObservable();

    private _apis: BehaviorSubject<Api[]> = new BehaviorSubject([]);
    public apis: Observable<Api[]> = this._recentApis.asObservable();

    /**
     * Constructor.
     * @param http
     * @param authService
     */
    constructor(private http: Http, private authService: IAuthenticationService) {
        this.allApis = this.loadApisFromLocalStorage();
        console.info("[LocalApisService] Loaded APIs from localStorage: %o", this.allApis);

        this._apis.next(this.allApis);
        let ra: Api[] = this.allApis.slice(0, 4);
        this._recentApis.next(ra);
    }

    /**
     * Creates a github API endpoint from the api path and params.
     * @param path
     * @param params
     * @return {string}
     */
    private endpoint(path: string, params: any): string {
        for (let key in params) {
            let value: string = params[key];
            path = path.replace(":" + key, value);
        }
        return GITHUB_API_ENDPOINT + path;
    }

    /**
     * Loads the list of APIs known to this service from browser local storage.
     * @return the list of APIs loaded from local storage
     */
    private loadApisFromLocalStorage(): Api[] {
        let storedApis: string = localStorage.getItem(APIS_LOCAL_STORAGE_KEY);
        if (storedApis) {
            return JSON.parse(storedApis);
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
        return ["Github"];
    }

    /**
     * Gets an observable over all the apis.
     * @return {Observable<Api[]>}
     */
    getAllApis(): Observable<Api[]> {
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
    public createApi(api: Api): Promise<Api> {
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
    }

    /**
     * Gets a single API by its id.  The API id is assigned when the API is created.
     * @param apiId
     * @return Promise<Api>
     */
    getApi(apiId: string): Promise<Api> {
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
        return Promise.resolve(rval);
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
    getCollaborators(api: Api): Promise<ApiCollaborators> {
        console.info("[LocalApisService] Getting collaborator info.");
        let gri: GithubRepoInfo = GithubRepoInfo.fromUrl(api.repositoryResource.repositoryUrl);
        console.info("[LocalApisService] Parsed GRI: %o", gri);
        let path: string = api.repositoryResource.resourceName;
        if (path.startsWith("/")) {
            path = path.slice(1);
        }
        let commitsUrl: string = this.endpoint("/repos/:owner/:repo/commits", {
            owner: gri.org,
            repo: gri.repo
        });
        let rval: ApiCollaborators = new ApiCollaborators();

        let headers: Headers = new Headers({ 'Accept': 'application/json' });
        this.authService.injectAuthHeaders(headers);
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set("path", path);
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
     * Discover details about an API by parsing the URL and then querying github (assuming it's a valid
     * github URL) for the details of the API.  This entails grabbing the full content of the API definition,
     * parsing it, and extracting the name and description.  If these are not found, name and description
     * are generated from the URL.
     * @param apiUrl
     * @return {undefined}
     */
    discoverApi(apiUrl: string): Promise<Api> {
        if (!apiUrl) {
            return Promise.reject<Api>("Invalid API url.");
        }
        if (!apiUrl.startsWith('http')) {
            return Promise.reject<Api>("Invalid API url.");
        }

        var parser = document.createElement('a');
        parser.href = apiUrl;

        if (parser.hostname != "github.com") {
            return Promise.reject<Api>("Host not supported: " + parser.hostname);
        }

        if (!parser.pathname) {
            return Promise.reject<Api>("Incomplete github URL.");
        }

        let pathItems: string[] = parser.pathname.split("/");

        if (!pathItems[0]) {
            pathItems.shift();
        }

        if (pathItems.length < 2) {
            return Promise.reject<Api>("Incomplete github URL.");
        }

        let api: Api = new Api();
        api.repositoryResource.repositoryType = "Github";
        api.repositoryResource.repositoryUrl = "http://github.com/" + pathItems.shift() + "/" + pathItems.shift();
        if (pathItems.length >= 3 && pathItems[0] === "blob") {
            // Remove the "blob" item
            pathItems.shift();
            // Remove the branch item
            pathItems.shift();

            // Set the resource path/name
            api.repositoryResource.resourceName = "/" + pathItems.join('/');

            // Resolve the name and description from this (full) repository resource
            return this.resolveApiInfo(api);
        } else {
            return Promise.resolve(api);
        }
    }

    /**
     * Resolves the api info by fetching the content of the api definition from github and extracting
     * the title and description.
     * @param api
     */
    public resolveApiInfo(api: Api): Promise<Api> {
        let gri: GithubRepoInfo = GithubRepoInfo.fromUrl(api.repositoryResource.repositoryUrl);
        let path: string = api.repositoryResource.resourceName;
        if (path.startsWith("/")) {
            path = path.slice(1);
        }
        let contentUrl: string = this.endpoint("/repos/:owner/:repo/contents/:path", {
            owner: gri.org,
            repo: gri.repo,
            path: path
        });
        let headers = new Headers({ 'Accept': 'application/json' });
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

}
