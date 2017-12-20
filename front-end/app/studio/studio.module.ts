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
import {ModalModule, BsDropdownModule} from "ngx-bootstrap";

/* ACE Editor */
import { AceEditorComponent } from "ng2-ace-editor";

/* Top level app stuff */
import {StudioComponent} from "./studio.component";
import {StudioRouting} from "./studio.routing";

/* Services */
import {ApisServiceProvider} from "./services/apis.service.provider";
import {LinkedAccountsServiceProvider} from "./services/accounts.service.provider";
import {AuthenticationServiceProvider} from "./services/auth.service.provider";
import {ConfigService} from "./services/config.service";

/* Guards */
import {AuthenticationCanActivateGuard} from "./guards/auth.guard";
import {ApiEditorPageGuard} from "./pages/apis/{apiId}/editor/api-editor.page";

/* Global Components */
import {NavHeaderComponent} from "./components/nav-header.component";
import {VerticalNavComponent} from "./components/vertical-nav.component";
import {BreadcrumbsComponent} from "./components/breadcrumbs/breadcrumbs.component";
import {BreadcrumbComponent} from "./components/breadcrumbs/breadcrumb.component";
import {ConfirmDeleteDialogComponent} from "./components/dialogs/confirm-delete.component";
import {PageErrorComponent} from "./components/page-error.component";

/* Pages */
import {LoginPageComponent} from "./pages/login/login.page";
import {DashboardPageComponent} from "./pages/dashboard/dashboard.page";
import {ApisPageComponent} from "./pages/apis/apis.page";
import {CreateApiPageComponent} from "./pages/apis/create/create.page";
import {ImportApiPageComponent} from "./pages/apis/import/import.page";
import {ApiDetailPageComponent} from "./pages/apis/{apiId}/api-detail.page";
import {ApiEditorPageComponent} from "./pages/apis/{apiId}/editor/api-editor.page";
import {ProfilePageComponent} from "./pages/settings/profile/profile.page";
import {LinkedAccountsPageComponent} from "./pages/settings/accounts/accounts.page";
import {SettingsPageComponent} from "./pages/settings/settings";
import {NotFoundPageComponent} from "./pages/404.page";
import {CreatedLinkedAccountPageComponent} from "./pages/settings/accounts/{accountType}/created/created.page";

/* Page Components */
import {CreateApiFormComponent} from "./pages/apis/create/_components/create-form.component";
import {ImportApiFormComponent} from "./pages/apis/import/_components/import-form.component";
import {ApisListComponent} from "./pages/apis/_components/apis-list.component";
import {ApisCardsComponent} from "./pages/apis/_components/apis-cards.component";
import {ApiEditorComponent} from "./pages/apis/{apiId}/editor/editor.component";
import {SettingsNavComponent} from "./pages/settings/_components/settings-nav.component";
import {EditorDisconnectedDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/editor-disconnected.component";


/** Directives **/
import {DivAutoHeight, TextAreaAutosize, TextBoxAutosize} from "./directives/autosize.directive";

/** Editor Components */
import {PathItemComponent} from "./pages/apis/{apiId}/editor/_components/common/path-item.component";
import {DefinitionItemComponent} from "./pages/apis/{apiId}/editor/_components/forms/definition-item.component";
import {ResponseItemComponent} from "./pages/apis/{apiId}/editor/_components/common/response-item.component";
import {
    Main20FormComponent,
    Main30FormComponent
} from "./pages/apis/{apiId}/editor/_components/forms/main-form.component";
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
import {SecurityScheme20DialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/security-scheme-20.component";
import {SecurityScheme30DialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/security-scheme-30.component";
import {InlineTextEditorComponent} from "./pages/apis/{apiId}/editor/_components/common/inline-text-editor.component";
import {InlineTextAreaComponent} from "./pages/apis/{apiId}/editor/_components/common/inline-textarea-editor.component";
import {DropDownComponent} from "./pages/apis/{apiId}/editor/_components/common/drop-down.component";
import {ResponseRowComponent} from "./pages/apis/{apiId}/editor/_components/forms/operation/response-row.component";
import {SchemaTypeComponent} from "./pages/apis/{apiId}/editor/_components/common/schema-type.component";
import {AddFormDataParamDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-formData-param.component";
import {ParamRowComponent} from "./pages/apis/{apiId}/editor/_components/forms/operation/param-row.component";
import {PropertyRowComponent} from "./pages/apis/{apiId}/editor/_components/forms/definition/property-row.component";
import {AddSchemaPropertyDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-schema-property.component";
import {ValidationIconComponent} from "./pages/apis/{apiId}/editor/_components/common/validation-icon.component";
import {ProblemFormComponent} from "./pages/apis/{apiId}/editor/_components/forms/problem-form.component";
import {CloneDefinitionDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/clone-definition.component";
import {ClonePathDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/clone-path.component";
import {EditorMasterComponent} from "./pages/apis/{apiId}/editor/_components/master.component";
import {ResponseRow30Component} from "./pages/apis/{apiId}/editor/_components/forms/operation/response-row-30.component";
import {Operation30FormComponent} from "./pages/apis/{apiId}/editor/_components/forms/operation-30-form.component";
import {ContentComponent} from "./pages/apis/{apiId}/editor/_components/forms/operation/content.component";
import {AddMediaTypeDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-media-type.component";
import {AddServerDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-server.component";
import {ServerUrlComponent} from "./pages/apis/{apiId}/editor/_components/common/server-url.component";
import {ServersSectionComponent} from "./pages/apis/{apiId}/editor/_components/forms/shared/servers.component";


@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, StudioRouting, ModalModule.forRoot(), BsDropdownModule.forRoot()],
    declarations: [
        StudioComponent, DashboardPageComponent, ApisPageComponent, CreateApiPageComponent, ImportApiPageComponent,
        LoginPageComponent, NavHeaderComponent, VerticalNavComponent, BreadcrumbsComponent, BreadcrumbComponent,
        CreateApiFormComponent, ImportApiFormComponent, ApiDetailPageComponent, ApiEditorPageComponent, ApisListComponent,
        ApisCardsComponent, ApiEditorComponent, PathItemComponent, DefinitionItemComponent,
        ResponseItemComponent, Main20FormComponent, InlineTextAreaComponent, PathFormComponent, OperationFormComponent,
        TextAreaAutosize, InlineTextEditorComponent, DefinitionFormComponent, AceEditorComponent, DivAutoHeight,
        SearchComponent, AddDefinitionDialogComponent, AddPathDialogComponent, ConfirmDeleteDialogComponent,
        AddQueryParamDialogComponent, AddResponseDialogComponent, AddTagDialogComponent, SetLicenseDialogComponent,
        ContextHelpComponent, SetContactDialogComponent, SecurityScheme20DialogComponent, SecurityScheme30DialogComponent,
        DropDownComponent, ResponseRowComponent, SchemaTypeComponent, ParamRowComponent, AddFormDataParamDialogComponent,
        PropertyRowComponent, AddSchemaPropertyDialogComponent, ValidationIconComponent, ProblemFormComponent,
        PageErrorComponent, CloneDefinitionDialogComponent, ClonePathDialogComponent, EditorDisconnectedDialogComponent,
        ProfilePageComponent, LinkedAccountsPageComponent, SettingsPageComponent, NotFoundPageComponent,
        CreatedLinkedAccountPageComponent, SettingsNavComponent, EditorMasterComponent, Main30FormComponent,
        ResponseRow30Component, Operation30FormComponent, ContentComponent, AddMediaTypeDialogComponent, TextBoxAutosize,
        AddServerDialogComponent, ServerUrlComponent, ServersSectionComponent
    ],
    providers: [ApisServiceProvider, LinkedAccountsServiceProvider, AuthenticationServiceProvider, ConfigService,
        AuthenticationCanActivateGuard, ApiEditorPageGuard
    ],
    bootstrap: [StudioComponent]
})
export class StudioModule {
}
