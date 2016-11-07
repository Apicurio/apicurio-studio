import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

/* Top level app stuff */
import {StudioComponent} from './studio.component';
import {StudioRouting} from './studio.routing';

/* Service Providers */
import {ApisServiceProvider} from "./services/apis.service.provider";
import {AuthenticationServiceProvider} from "./services/auth.service.provider";

/* Resolves */
import {RecentApisResolve} from "./pages/dashboard/dashboard.resolve";
import {ApiResolve} from "./pages/apis/{apiId}/api-detail.resolve";
import {ApiDefinitionResolve} from "./pages/apis/{apiId}/editor/api-editor.resolve";

/* Guards */
import {AuthenticationCanActivateGuard} from "./guards/auth.guard";

/* Global Components */
import {NavHeaderComponent} from "./components/nav-header.component";
import {VerticalNavComponent} from "./components/vertical-nav.component";
import {BreadcrumbsComponent} from "./components/breadcrumbs/breadcrumbs.component";
import {BreadcrumbComponent} from "./components/breadcrumbs/breadcrumb.component";

/* Pages */
import {LoginPageComponent} from "./pages/login/login.page";
import {DashboardPageComponent} from './pages/dashboard/dashboard.page';
import {ApisPageComponent} from "./pages/apis/apis.page";
import {NewApiPageComponent} from "./pages/apis/newapi/newapi.page";
import {ApiDetailPageComponent} from "./pages/apis/{apiId}/api-detail.page";
import {ApiEditorPageComponent} from "./pages/apis/{apiId}/editor/api-editor.page";

/* Page Components */
import {NewApiFormComponent} from "./pages/apis/newapi/newapi-form.component";
import {ApisListComponent} from "./pages/apis/apis-list.component";
import {ApisCardsComponent} from "./pages/apis/apis-cards.component";

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, StudioRouting],
    declarations: [StudioComponent, DashboardPageComponent, ApisPageComponent, NewApiPageComponent, LoginPageComponent,
        NavHeaderComponent, VerticalNavComponent, BreadcrumbsComponent, BreadcrumbComponent, NewApiFormComponent,
        ApiDetailPageComponent, ApiEditorPageComponent, ApisListComponent, ApisCardsComponent],
    providers: [ApisServiceProvider, AuthenticationServiceProvider,
        RecentApisResolve, ApiResolve, ApiDefinitionResolve,
        AuthenticationCanActivateGuard
    ],
    bootstrap: [StudioComponent]
})
export class StudioModule {
}
