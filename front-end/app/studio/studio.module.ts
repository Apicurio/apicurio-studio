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

import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

/* Bootstrap */
import {ModalModule, DropdownModule} from "ng2-bootstrap";

/* ACE Editor */
import { AceEditorComponent } from "ng2-ace-editor";

/* Top level app stuff */
import {StudioComponent} from "./studio.component";
import {StudioRouting} from "./studio.routing";

/* Service Providers */
import {ApisServiceProvider} from "./services/apis.service.provider";
import {AuthenticationServiceProvider} from "./services/auth.service.provider";

/* Resolves */
import {RecentApisResolve} from "./pages/dashboard/dashboard.resolve";
import {ApiResolve} from "./pages/apis/{apiId}/api-detail.resolve";
import {ApiDefinitionResolve} from "./pages/apis/{apiId}/editor/api-editor.resolve";

/* Guards */
import {AuthenticationCanActivateGuard} from "./guards/auth.guard";
import {ApiEditorPageGuard} from "./pages/apis/{apiId}/editor/api-editor.page";

/* Global Components */
import {NavHeaderComponent} from "./components/nav-header.component";
import {VerticalNavComponent} from "./components/vertical-nav.component";
import {BreadcrumbsComponent} from "./components/breadcrumbs/breadcrumbs.component";
import {BreadcrumbComponent} from "./components/breadcrumbs/breadcrumb.component";
import {ConfirmDeleteDialogComponent} from "./components/dialogs/confirm-delete.component";

/* Pages */
import {LoginPageComponent} from "./pages/login/login.page";
import {DashboardPageComponent} from "./pages/dashboard/dashboard.page";
import {ApisPageComponent} from "./pages/apis/apis.page";
import {CreateApiPageComponent} from "./pages/apis/create/create.page";
import {AddApiPageComponent} from "./pages/apis/add/add.page";
import {ApiDetailPageComponent} from "./pages/apis/{apiId}/api-detail.page";
import {ApiEditorPageComponent} from "./pages/apis/{apiId}/editor/api-editor.page";

/* Page Components */
import {CreateApiFormComponent} from "./pages/apis/create/create-form.component";
import {AddApiFormComponent} from "./pages/apis/add/add-form.component";
import {ApisListComponent} from "./pages/apis/apis-list.component";
import {ApisCardsComponent} from "./pages/apis/apis-cards.component";
import {ApiEditorComponent} from "./pages/apis/{apiId}/editor/editor.component";
import {ApiCommitComponent} from "./pages/apis/{apiId}/editor/components/api-commit.component";

/** Directives **/
import {TextAreaAutosize} from "./directives/autosize.directive";

/** Editor Components */
import {PathItemComponent} from "./pages/apis/{apiId}/editor/components/path-item.component";
import {DefinitionItemComponent} from "./pages/apis/{apiId}/editor/components/definition-item.component";
import {ResponseItemComponent} from "./pages/apis/{apiId}/editor/components/response-item.component";
import {MainFormComponent} from "./pages/apis/{apiId}/editor/components/main-form.component";
import {PathFormComponent} from "./pages/apis/{apiId}/editor/components/path-form.component";
import {TitleEditorComponent} from "./pages/apis/{apiId}/editor/components/main-form/title-editor.component";
import {VersionEditorComponent} from "./pages/apis/{apiId}/editor/components/main-form/version-editor.component";
import {OperationFormComponent} from "./pages/apis/{apiId}/editor/components/operation-form.component";
import {SummaryEditorPFComponent} from "./pages/apis/{apiId}/editor/components/path-form/summary-editor.component";
import {DescriptionEditorComponent} from "./pages/apis/{apiId}/editor/components/main-form/description-editor.component";
import {DescriptionEditorPFComponent} from "./pages/apis/{apiId}/editor/components/path-form/description-editor.component";
import {SummaryEditorOFComponent} from "./pages/apis/{apiId}/editor/components/operation-form/summary-editor.component";
import {DescriptionEditorOFComponent} from "./pages/apis/{apiId}/editor/components/operation-form/description-editor.component";
import {RequestDescriptionEditorOFComponent} from "./pages/apis/{apiId}/editor/components/operation-form/req-description-editor.component";
import {DescriptionEditorQPComponent} from "./pages/apis/{apiId}/editor/components/operation-form/query-param-description-editor.component";
import {TypeEditorOFComponent} from "./pages/apis/{apiId}/editor/components/operation-form/type-editor.component";
import {DefinitionFormComponent} from "./pages/apis/{apiId}/editor/components/definition-form.component";
import {SearchComponent} from "./pages/apis/{apiId}/editor/components/search.component";
import {AddDefinitionDialogComponent} from "./pages/apis/{apiId}/editor/components/dialogs/add-definition.component";
import {AddPathDialogComponent} from "./pages/apis/{apiId}/editor/components/dialogs/add-path.component";
import {AddQueryParamDialogComponent} from "./pages/apis/{apiId}/editor/components/dialogs/add-query-param.component";


@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, StudioRouting, ModalModule.forRoot(), DropdownModule.forRoot()],
    declarations: [
        StudioComponent, DashboardPageComponent, ApisPageComponent, CreateApiPageComponent, AddApiPageComponent, LoginPageComponent,
        NavHeaderComponent, VerticalNavComponent, BreadcrumbsComponent, BreadcrumbComponent, CreateApiFormComponent, AddApiFormComponent,
        ApiDetailPageComponent, ApiEditorPageComponent, ApisListComponent, ApisCardsComponent, ApiEditorComponent, ApiCommitComponent,
        PathItemComponent, DefinitionItemComponent, ResponseItemComponent, MainFormComponent, TitleEditorComponent,
        VersionEditorComponent, PathFormComponent, OperationFormComponent, SummaryEditorPFComponent, DescriptionEditorPFComponent,
        DescriptionEditorComponent, TextAreaAutosize, SummaryEditorOFComponent, DescriptionEditorOFComponent,
        RequestDescriptionEditorOFComponent, DescriptionEditorQPComponent, TypeEditorOFComponent, DefinitionFormComponent,
        AceEditorComponent, SearchComponent, AddDefinitionDialogComponent, AddPathDialogComponent, ConfirmDeleteDialogComponent,
        AddQueryParamDialogComponent],
    providers: [ApisServiceProvider, AuthenticationServiceProvider,
        RecentApisResolve, ApiResolve, ApiDefinitionResolve,
        AuthenticationCanActivateGuard, ApiEditorPageGuard
    ],
    bootstrap: [StudioComponent]
})
export class StudioModule {
}
