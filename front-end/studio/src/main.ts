import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import * as Keycloak from 'keycloak-js';

function printBanner(env) {
    console.log(`%c ___________________________________________________
  Welcome to     _                 _
     /\\         (_)               (_)
    /  \\   _ __  _  ___ _   _ _ __ _  ___
   / /\\ \\ | '_ \\| |/ __| | | | '__| |/ _ \\
  / ____ \\| |_) | | (__| |_| | |  | | (_) |
 /_/    \\_\\ .__/|_|\\___|\\__,_|_|  |_|\\___/
          | |
          |_|
          
 Mode: %s
 ___________________________________________________
`, "font-family:monospace", env);
}

if (environment.production) {
    enableProdMode();
    platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
        printBanner("Production");
    }).catch(err => console.log(err));
} else {
    const keycloak = Keycloak();
    keycloak.init({onLoad: 'login-required'}).then(function (authenticated) {
        if (authenticated) {
            window['keycloak'] = keycloak;
            platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
                printBanner("Development");
            }).catch(err => console.log(err));
        }
    }).catch(function () {
        alert('Failed to initialize authentication subsystem.');
    });
}
