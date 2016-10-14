import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {IApisService}   from "./apis.service";
import {Api} from "../models/api.model";
import {ApiCollaborators, ApiCollaborator} from "../models/api-collaborators";


const APIS_LOCAL_STORAGE_KEY = "apiman.studio.local-apis.apis";


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
     */
    constructor() {
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
     * Gets the list of collaborators for the API with the given id.  This will use the github
     * API to fetch all of the commits associated with the resource.  It will then create a
     * summary object (the ApiCollaborators object) from this information and return it.
     *
     * The github API call is this:
     *
     * ```
     * curl -u USER:PASS https://api.github.com/repos/ORG/REPO/commits?path=/path/to/file.json
     * ```
     *
     * @param apiId
     * @return {undefined}
     */
    getCollaborators(apiId: string): Promise<ApiCollaborators> {
        console.info("[LocalApisService] Getting collaborator info.");
        let rval: ApiCollaborators = new ApiCollaborators();
        rval.totalChanges = 100;

        let c1 = new ApiCollaborator();
        c1.userName = "gwashington";
        c1.numChanges = 25;

        let c2 = new ApiCollaborator();
        c2.userName = "alincoln";
        c2.numChanges = 3;

        let c3 = new ApiCollaborator();
        c3.userName = "bobama";
        c3.numChanges = 19;

        rval.collaborators.push(c1);
        rval.collaborators.push(c2);
        rval.collaborators.push(c3);

        console.info("[LocalApisService] Returning collaborator info: %o", rval);
        return Promise.resolve(rval);
    }

}
