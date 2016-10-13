import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {IApisService}   from "./apis.service";
import {Api} from "../models/api.model";


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
        this.allApis.push(api);
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
        for (var api of this.allApis) {
            console.info("[LocalApisService] Comparing " + apiId + " to API with id: " + api.id);
            if (api.id === apiId) {
                console.info("[LocalApisService] Found API with id: " + apiId);
                console.info("[LocalApisService] %o", api);
                return Promise.resolve(api);
            }
        }
        console.info("[LocalApisService] No API found with id: " + apiId);
        return Promise.resolve(null);
    }

}
