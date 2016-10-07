import {Headers, Http} from '@angular/http';

import {LocalApisService} from "./apis-local.service";
import {IApisService} from "./apis.service";
import {RemoteApisService} from "./apis-remote.service";


function ApisServiceFactory(http: Http): IApisService {
    if (true == true) {
        return new LocalApisService();
    } else {
        return new RemoteApisService(http);
    }
};


export let ApisServiceProvider =
{
    provide: IApisService,
    useFactory: ApisServiceFactory,
    deps: [Http]
};

