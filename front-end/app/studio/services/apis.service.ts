
import {OpaqueToken} from "@angular/core";

import {Api} from "../models/api.model";

export interface IApisService {

    getRecentApis(): Promise<Api[]>;

}

export const IApisService = new OpaqueToken("LoginService");
