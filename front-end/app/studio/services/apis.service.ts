import {OpaqueToken} from "@angular/core";
import {Observable} from 'rxjs/Observable';

import {Api} from "../models/api.model";


export interface IApisService {

    /**
     * Gets an array of the repository types supported by this apis service.
     *
     * @return string[]
     */
    getSupportedRepositoryTypes(): string[];

    /**
     * Gets an observable over the recent APIs.  Callers can then subscribe to this
     * observable to be notified when the value changes.
     *
     * @return Observable<Api[]>
     */
    getRecentApis(): Observable<Api[]>;

}

export const IApisService = new OpaqueToken("IApisService");
