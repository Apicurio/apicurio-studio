import {Headers, Http} from '@angular/http';

import {IAuthenticationService} from "./auth.service";
import {GithubAuthenticationService} from "./auth-github.service";


function AuthenticationServiceFactory(http: Http): IAuthenticationService {
    return new GithubAuthenticationService(http);
};


export let AuthenticationServiceProvider =
{
    provide: IAuthenticationService,
    useFactory: AuthenticationServiceFactory,
    deps: [Http]
};

