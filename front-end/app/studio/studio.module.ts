import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {StudioComponent} from './studio.component';
import {StudioRouting} from './studio.routing';

import {ApisServiceProvider} from "./services/apis.service.provider";
import {RecentApisResolve} from "./pages/dashboard/dashboard.resolve";

import {NavHeaderComponent} from "./components/nav-header.component";
import {VerticalNavComponent} from "./components/vertical-nav.component";
import {BreadcrumbsComponent} from "./components/breadcrumbs.component";

import {DashboardPageComponent} from './pages/dashboard/dashboard.page';
import {ApisPageComponent} from "./pages/apis/apis.page";
import {NewApiPageComponent} from "./pages/apis/newapi.page";

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, StudioRouting],
    declarations: [StudioComponent, DashboardPageComponent, ApisPageComponent, NewApiPageComponent, NavHeaderComponent, VerticalNavComponent, BreadcrumbsComponent],
    providers: [ApisServiceProvider, RecentApisResolve],
    bootstrap: [StudioComponent]
})
export class StudioModule {
}
