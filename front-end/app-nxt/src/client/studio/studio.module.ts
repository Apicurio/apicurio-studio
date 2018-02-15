import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {APP_BASE_HREF} from '@angular/common';
import {StudioComponent} from './studio.component';
import {StudioRouting} from "./studio-routing";
import {FormsModule} from "@angular/forms";
import {ApisServiceProvider} from "./services/apis.service.provider";
import {LinkedAccountsServiceProvider} from "./services/accounts.service.provider";
import {AuthenticationCanActivateGuard} from "./guards/auth.guard";
import {ConfigService} from "./services/config.service";
import {AuthenticationServiceProvider} from "./services/auth.service.provider";
import {DashboardPageComponent} from "./pages/dashboard/dashboard.page";
import {BreadcrumbsComponent} from "./components/breadcrumbs/breadcrumbs.component";
import {BreadcrumbComponent} from "./components/breadcrumbs/breadcrumb.component";
import {PageErrorComponent} from "./components/page-error.component";
import {VerticalNavComponent} from "./components/vertical-nav.component";
import {NavHeaderComponent} from "./components/nav-header.component";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  imports: [
      BrowserModule, FormsModule, HttpClientModule, StudioRouting
  ],
  declarations: [
      StudioComponent, DashboardPageComponent, BreadcrumbsComponent, BreadcrumbComponent, PageErrorComponent,
      VerticalNavComponent, NavHeaderComponent
  ],
  providers: [
      { provide: APP_BASE_HREF, useValue: '<%= APP_BASE %>' },
      ApisServiceProvider, LinkedAccountsServiceProvider, AuthenticationServiceProvider, ConfigService,
      AuthenticationCanActivateGuard
  ],
  bootstrap: [StudioComponent]

})
export class StudioModule { }
