import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

/* Top level app stuff */
import {StudioComponent} from './studio.component';
import {StudioRouting} from './studio.routing';

/* Resolves */
import {ApisServiceProvider} from "./services/apis.service.provider";
import {RecentApisResolve} from "./pages/dashboard/dashboard.resolve";
import {ApiResolve} from "./pages/apis/api-detail.resolve";

/* Global Components */
import {NavHeaderComponent} from "./components/nav-header.component";
import {VerticalNavComponent} from "./components/vertical-nav.component";
import {BreadcrumbsComponent} from "./components/breadcrumbs.component";

/* Pages */
import {DashboardPageComponent} from './pages/dashboard/dashboard.page';
import {ApisPageComponent} from "./pages/apis/apis.page";
import {NewApiPageComponent} from "./pages/apis/newapi.page";
import {ApiDetailPageComponent} from "./pages/apis/api-detail.page";

/* Page Components */
import {NewApiFormComponent} from "./pages/apis/newapi/newapi-form.component";

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, StudioRouting],
    declarations: [StudioComponent, DashboardPageComponent, ApisPageComponent, NewApiPageComponent, NavHeaderComponent,
        VerticalNavComponent, BreadcrumbsComponent, NewApiFormComponent, ApiDetailPageComponent],
    providers: [ApisServiceProvider, RecentApisResolve, ApiResolve],
    bootstrap: [StudioComponent]
})
export class StudioModule {
}
