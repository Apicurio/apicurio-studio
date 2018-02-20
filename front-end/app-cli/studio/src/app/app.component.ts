import { Component } from '@angular/core';
import {IAuthenticationService} from './services/auth.service';

@Component({
  moduleId: module.id,
  selector: "apicurio-studio",
  templateUrl: "app.component.html",
  styleUrls: [ "app.component.css" ]
})
export class AppComponent {

  public routerOutletWrapperId: string;
  public routerOutletWrapperClass: string;

  constructor(public authService: IAuthenticationService) {
    this.routerOutletWrapperId = "api-page-body";
    this.routerOutletWrapperClass = "";

    authService.isAuthenticated().subscribe(authed => {
      if (authed) {
        this.routerOutletWrapperId = "api-page-body";
        this.routerOutletWrapperClass = "";
      } else {
        this.routerOutletWrapperId = "login-form";
        this.routerOutletWrapperClass = "login-pf";
      }
    });
  }

}
