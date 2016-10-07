import {IApisService}   from "./apis.service";
import {Api} from "../models/api.model";

/**
 * An implementation of the IApisService that uses local browser storage to track your APIs.  In addition,
 * it works directly with github to get and update API content.
 */
export class LocalApisService implements IApisService {

    constructor() {
        console.log("[local] Creating apis service");
    }

    getRecentApis(): Api[] {
        console.log("[local] Getting the list of recent APIs!");
        return [];
    }

}
