/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
import {ApiEditorComponent} from "./pages/apis/{apiId}/editor/editor.component";

/** Editor Components */
import {PathItemComponent} from "./pages/apis/{apiId}/editor/components/path-item.component";
import {DefinitionItemComponent} from "./pages/apis/{apiId}/editor/components/definition-item.component";
import {ResponseItemComponent} from "./pages/apis/{apiId}/editor/components/response-item.component";
import {MainFormComponent} from "./pages/apis/{apiId}/editor/components/main-form.component";
import {TitleEditorComponent} from "./pages/apis/{apiId}/editor/components/main-form/title-editor.component";


@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, StudioRouting],
    declarations: [StudioComponent, DashboardPageComponent, ApisPageComponent, NewApiPageComponent, LoginPageComponent,
        NavHeaderComponent, VerticalNavComponent, BreadcrumbsComponent, BreadcrumbComponent, NewApiFormComponent,
        ApiDetailPageComponent, ApiEditorPageComponent, ApisListComponent, ApisCardsComponent, ApiEditorComponent,
        PathItemComponent, DefinitionItemComponent, ResponseItemComponent, MainFormComponent, TitleEditorComponent],
    providers: [ApisServiceProvider, AuthenticationServiceProvider,
        RecentApisResolve, ApiResolve, ApiDefinitionResolve,
        AuthenticationCanActivateGuard
    ],
    bootstrap: [StudioComponent]
})
export class StudioModule {
}
