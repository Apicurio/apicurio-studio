import {OpaqueToken} from "@angular/core";
import {Observable} from 'rxjs/Observable';

import {Api} from "../models/api.model";
import {ApiCollaborators} from "../models/api-collaborators";


export interface IApisService {

    /**
     * Called to discover the details about an API.  This will typically parse the URL, and then query
     * the appropriate back-end to divine additional API details (such as its name and description).
     * @param apiUrl
     */
    discoverApi(apiUrl: string): Promise<Api>;

    /**
     * Gets an array of the repository types supported by this apis service.
     *
     * @return string[]
     */
    getSupportedRepositoryTypes(): string[];

    /**
     * Gets an observable over all of the APIs.  The list of APIs is not guaranteed
     * to be in any particular order.  The resulting observer can be used to watch for
     * changes to the list of APIs.
     */
    getAllApis(): Observable<Api[]>;

    /**
     * Gets an observable over the recent APIs.  Callers can then subscribe to this
     * observable to be notified when the value changes.
     *
     * @return Observable<Api[]>
     */
    getRecentApis(): Observable<Api[]>;

    /**
     * Creates a new API with the given information.  This will store the API in whatever
     * storage is used by this service impl.  It will return a Promise that the caller can
     * use to be notified when the API has been successfully stored.
     * @param api
     * @return Promise<Api>
     */
    createApi(api: Api): Promise<Api>;

    /**
     * Called to delete an API.  This is done asynchronously and thus returns a promise.
     * @param api
     */
    deleteApi(api: Api): Promise<void>;

    /**
     * Gets a single Api by its ID.
     * @param apiId the ID of the api
     */
    getApi(apiId: string): Promise<Api>;

    /**
     * Gets the list of collaborators for the API with the given id.
     * @param api
     */
    getCollaborators(api: Api): Promise<ApiCollaborators>;

}

export const IApisService = new OpaqueToken("IApisService");
