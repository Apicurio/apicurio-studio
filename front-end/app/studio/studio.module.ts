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
import {CreateApiFormComponent} from "./pages/apis/create/_components/create-form.component";
import {AddApiFormComponent} from "./pages/apis/add/_components/add-form.component";
import {ApisListComponent} from "./pages/apis/_components/apis-list.component";
import {ApisCardsComponent} from "./pages/apis/_components/apis-cards.component";
import {ApiEditorComponent} from "./pages/apis/{apiId}/editor/editor.component";
import {ApiCommitComponent} from "./pages/apis/{apiId}/editor/_components/api-commit.component";

/** Directives **/
import {TextAreaAutosize} from "./directives/autosize.directive";

/** Editor Components */
import {PathItemComponent} from "./pages/apis/{apiId}/editor/_components/common/path-item.component";
import {DefinitionItemComponent} from "./pages/apis/{apiId}/editor/_components/forms/definition-item.component";
import {ResponseItemComponent} from "./pages/apis/{apiId}/editor/_components/common/response-item.component";
import {MainFormComponent} from "./pages/apis/{apiId}/editor/_components/forms/main-form.component";
import {PathFormComponent} from "./pages/apis/{apiId}/editor/_components/forms/path-form.component";
import {OperationFormComponent} from "./pages/apis/{apiId}/editor/_components/forms/operation-form.component";
import {DefinitionFormComponent} from "./pages/apis/{apiId}/editor/_components/forms/definition-form.component";
import {SearchComponent} from "./pages/apis/{apiId}/editor/_components/common/search.component";
import {AddDefinitionDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-definition.component";
import {AddPathDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-path.component";
import {AddQueryParamDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-query-param.component";
import {AddResponseDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-response.component";
import {AddTagDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-tag.component";
import {SetLicenseDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/set-license.component";
import {ContextHelpComponent} from "./pages/apis/{apiId}/editor/_components/common/context-help.component";
import {SetContactDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/set-contact.component";
import {SecuritySchemeDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/security-scheme.component";
import {InlineTextEditorComponent} from "./pages/apis/{apiId}/editor/_components/common/inline-text-editor.component";
import {InlineTextAreaComponent} from "./pages/apis/{apiId}/editor/_components/common/inline-textarea-editor.component";
import {DropDownComponent} from "./pages/apis/{apiId}/editor/_components/common/drop-down.component";
import {ResponseRowComponent} from "./pages/apis/{apiId}/editor/_components/forms/operation/response-row.component";
import {SchemaTypeComponent} from "./pages/apis/{apiId}/editor/_components/common/schema-type.component";
import {AddFormDataParamDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-formData-param.component";
import {ParamRowComponent} from "./pages/apis/{apiId}/editor/_components/forms/operation/param-row.component";
import {PropertyRowComponent} from "./pages/apis/{apiId}/editor/_components/forms/definition/property-row.component";
import {AddSchemaPropertyDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-schema-property.component";


@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, StudioRouting, ModalModule.forRoot(), DropdownModule.forRoot()],
    declarations: [
        StudioComponent, DashboardPageComponent, ApisPageComponent, CreateApiPageComponent, AddApiPageComponent,
        LoginPageComponent, NavHeaderComponent, VerticalNavComponent, BreadcrumbsComponent, BreadcrumbComponent,
        CreateApiFormComponent, AddApiFormComponent, ApiDetailPageComponent, ApiEditorPageComponent, ApisListComponent,
        ApisCardsComponent, ApiEditorComponent, ApiCommitComponent, PathItemComponent, DefinitionItemComponent,
        ResponseItemComponent, MainFormComponent, InlineTextAreaComponent, PathFormComponent, OperationFormComponent,
        TextAreaAutosize, InlineTextEditorComponent, DefinitionFormComponent, AceEditorComponent,
        SearchComponent, AddDefinitionDialogComponent, AddPathDialogComponent, ConfirmDeleteDialogComponent,
        AddQueryParamDialogComponent, AddResponseDialogComponent, AddTagDialogComponent, SetLicenseDialogComponent,
        ContextHelpComponent, SetContactDialogComponent, SecuritySchemeDialogComponent, DropDownComponent,
        ResponseRowComponent, SchemaTypeComponent, ParamRowComponent, AddFormDataParamDialogComponent,
        PropertyRowComponent, AddSchemaPropertyDialogComponent
    ],
    providers: [ApisServiceProvider, AuthenticationServiceProvider,
        RecentApisResolve, ApiResolve, ApiDefinitionResolve,
        AuthenticationCanActivateGuard, ApiEditorPageGuard
    ],
    bootstrap: [StudioComponent]
})
export class StudioModule {
}
