import {OpaqueToken} from "@angular/core";
import {Observable} from 'rxjs/Observable';

import {Api} from "../models/api.model";
import {ApiRepositoryType} from "../models/api-repository-type";


export interface IApisService {

    /**
     * Gets an array of the repository types supported by this apis service.
     *
     * @return ApiRepositoryType[]
     */
    getSupportedRepositoryTypes(): ApiRepositoryType[];

    /**
     * Gets an observable over the recent APIs.  Callers can then subscribe to this
     * observable to be notified when the value changes.
     *
     * @return Observable<Api[]>
     */
    getRecentApis(): Observable<Api[]>;

}

export const IApisService = new OpaqueToken("IApisService");
