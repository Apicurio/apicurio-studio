import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {IApisService} from "./apis.service";
import {Api} from "../models/api.model";

export class RemoteApisService implements IApisService {

    private headers = new Headers({'Content-Type': 'application/json'});
    private apisUrl = '/apis';  // URL to web api

    constructor(private http: Http) {
        console.log("[remote] Creating apis service");
    }

    getRecentApis(): Api[] {
        console.log("[remote] Getting the list of recent APIs!");
        return [];
    }

}
