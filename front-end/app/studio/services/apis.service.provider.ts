import {Headers, Http} from '@angular/http';

import {LocalApisService} from "./apis-local.service";
import {IApisService} from "./apis.service";


function ApisServiceFactory(http: Http): IApisService {
    return new LocalApisService();
};


export let ApisServiceProvider =
{
    provide: IApisService,
    useFactory: ApisServiceFactory,
    deps: [Http]
};

