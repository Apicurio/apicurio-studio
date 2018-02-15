import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

function printBanner() {
  console.log(`%c ___________________________________________________
  Welcome to     _                 _
     /\\         (_)               (_)
    /  \\   _ __  _  ___ _   _ _ __ _  ___
   / /\\ \\ | '_ \\| |/ __| | | | '__| |/ _ \\
  / ____ \\| |_) | | (__| |_| | |  | | (_) |
 /_/    \\_\\ .__/|_|\\___|\\__,_|_|  |_|\\___/
          | |
          |_|
          
 Mode: Development
 ___________________________________________________
`, "font-family:monospace");
}

if (environment.production) {
  enableProdMode();
  platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));
} else {
  var keycloak = window["Keycloak"]();
  keycloak.init({onLoad: 'login-required'}).success(function (authenticated) {
    if (authenticated) {
      window['keycloak'] = keycloak;
      platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
        printBanner();
      }).catch(err => console.log(err));
    }
  }).error(function () {
    alert('Failed to initialize authentication subsystem.');
  });
}
