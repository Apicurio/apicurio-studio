import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {IApisService}   from "./apis.service";
import {Api} from "../models/api.model";
import {ApiRepositoryType} from "../models/api-repository-type";

/**
 * An implementation of the IApisService that uses local browser storage to track your APIs.  In addition,
 * it works directly with github to get and update API content.
 */
export class LocalApisService implements IApisService {

    private _recentApis: BehaviorSubject<Api[]> = new BehaviorSubject([]);
    public recentApis: Observable<Api[]> = this._recentApis.asObservable();

    constructor() {
        this._recentApis.next([
            {
                id: "1",
                name: "Gateway Config API",
                description: "Used to directly configure the API Gateway (bypassing the management layer).",
                repositoryResource: null
            }
        ]);
    }

    getSupportedRepositoryTypes(): ApiRepositoryType[] {
        return [ApiRepositoryType.Github];
    }

    getRecentApis(): Observable<Api[]> {
        return this.recentApis;
    }

}
