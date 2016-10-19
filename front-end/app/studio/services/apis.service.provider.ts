import {Http} from '@angular/http';

import {LocalApisService} from "./apis-local.service";
import {IApisService} from "./apis.service";
import {IAuthenticationService} from "./auth.service";


function ApisServiceFactory(http: Http, authService: IAuthenticationService): IApisService {
    return new LocalApisService(http, authService);
};


export let ApisServiceProvider =
{
    provide: IApisService,
    useFactory: ApisServiceFactory,
    deps: [Http, IAuthenticationService]
};

