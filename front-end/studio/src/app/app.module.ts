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

import 'rxjs/Rx';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AuthenticationServiceProvider} from './services/auth.service.provider';
import {ConfigService} from './services/config.service';
import {AuthenticationCanActivateGuard} from './guards/auth.guard';
import {DashboardPageComponent} from './pages/dashboard/dashboard.page';
import {BreadcrumbsComponent} from './components/breadcrumbs/breadcrumbs.component';
import {BreadcrumbComponent} from './components/breadcrumbs/breadcrumb.component';
import {PageErrorComponent} from './components/page-error.component';
import {VerticalNavComponent} from './components/vertical-nav.component';
import {NavHeaderComponent} from './components/nav-header.component';
import {AppRoutingModule} from './app-routing.module';
import {ConfirmDeleteDialogComponent} from './components/dialogs/confirm-delete.component';
import {CopyUrlDialogComponent} from './components/dialogs/copy-url.component';
import {BsDropdownModule, ModalModule} from 'ngx-bootstrap';
import {DivAutoHeight, TextAreaAutosize, TextBoxAutosize} from './directives/autosize.directive';
import {NotFoundPageComponent} from './pages/404.page';
import {SettingsNavComponent} from './pages/settings/_components/settings-nav.component';
import {CreatedLinkedAccountPageComponent} from './pages/settings/accounts/{accountType}/created/created.page';
import {LinkedAccountsPageComponent} from './pages/settings/accounts/accounts.page';
import {ProfilePageComponent} from './pages/settings/profile/profile.page';
import {SettingsPageComponent} from './pages/settings/settings';
import {ApisPageComponent} from './pages/apis/apis.page';
import {CreateApiPageComponent} from './pages/apis/create/create.page';
import {ImportApiPageComponent} from './pages/apis/import/import.page';
import {ImportApiFormComponent} from './pages/apis/import/_components/import-form.component';
import {CreateApiFormComponent} from './pages/apis/create/_components/create-form.component';
import {ApisListComponent} from './pages/apis/_components/apis-list.component';
import {ApisCardsComponent} from './pages/apis/_components/apis-cards.component';
import {DropDownComponent} from './components/common/drop-down.component';
import {ApiCollaborationPageComponent} from './pages/apis/{apiId}/collaboration/api-collaboration.page';
import {ApiAcceptPageComponent} from './pages/apis/{apiId}/collaboration/accept/api-accept.page';
import {ApiDetailPageComponent} from './pages/apis/{apiId}/api-detail.page';
import {ValidationIconComponent} from './pages/apis/{apiId}/editor/_components/common/validation-icon.component';
import {ServerUrlComponent} from './pages/apis/{apiId}/editor/_components/common/server-url.component';
import {SearchComponent} from './pages/apis/{apiId}/editor/_components/common/search.component';
import {InlineTextEditorComponent} from './pages/apis/{apiId}/editor/_components/common/inline-text-editor.component';
import {SchemaTypeComponent} from './pages/apis/{apiId}/editor/_components/common/schema-type.component';
import {ResponseItemComponent} from './pages/apis/{apiId}/editor/_components/common/response-item.component';
import {PathItemComponent} from './pages/apis/{apiId}/editor/_components/common/path-item.component';
import {InlineTextAreaComponent} from './pages/apis/{apiId}/editor/_components/common/inline-textarea-editor.component';
import {ContextHelpComponent} from './pages/apis/{apiId}/editor/_components/common/context-help.component';
import {SecurityScheme30DialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/security-scheme-30.component';
import {SetLicenseDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/set-license.component';
import {SetContactDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/set-contact.component';
import {SecurityScheme20DialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/security-scheme-20.component';
import {AddTagDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-tag.component';
import {AddSchemaPropertyDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-schema-property.component';
import {EditorDisconnectedDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/editor-disconnected.component';
import {AddServerDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-server.component';
import {CloneDefinitionDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/clone-definition.component';
import {ClonePathDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/clone-path.component';
import {ResponseRow30Component} from './pages/apis/{apiId}/editor/_components/forms/operation/response-row-30.component';
import {ResponseRowComponent} from './pages/apis/{apiId}/editor/_components/forms/operation/response-row.component';
import {ParamRowComponent} from './pages/apis/{apiId}/editor/_components/forms/operation/param-row.component';
import {OperationFormComponent} from './pages/apis/{apiId}/editor/_components/forms/operation-form.component';
import {ContentComponent} from './pages/apis/{apiId}/editor/_components/forms/operation/content.component';
import {Operation30FormComponent} from './pages/apis/{apiId}/editor/_components/forms/operation-30-form.component';
import {PropertyRowComponent} from './pages/apis/{apiId}/editor/_components/forms/definition/property-row.component';
import {ServersSectionComponent} from './pages/apis/{apiId}/editor/_components/forms/shared/servers.component';
import {DefinitionItemComponent} from './pages/apis/{apiId}/editor/_components/forms/definition-item.component';
import {DefinitionFormComponent} from './pages/apis/{apiId}/editor/_components/forms/definition-form.component';
import {ProblemFormComponent} from './pages/apis/{apiId}/editor/_components/forms/problem-form.component';
import {PathFormComponent} from './pages/apis/{apiId}/editor/_components/forms/path-form.component';
import {EditorMasterComponent} from './pages/apis/{apiId}/editor/_components/master.component';
import {ApiEditorPageComponent} from './pages/apis/{apiId}/editor/api-editor.page';
import {ApiEditorComponent} from './pages/apis/{apiId}/editor/editor.component';
import {AddQueryParamDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-query-param.component';
import {AddPathDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-path.component';
import {AddResponseDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-response.component';
import {AddFormDataParamDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-formData-param.component';
import {AddDefinitionDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-definition.component';
import {
    Main20FormComponent,
    Main30FormComponent
} from './pages/apis/{apiId}/editor/_components/forms/main-form.component';
import {AddMediaTypeDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-media-type.component';
import {CodeEditorComponent} from "./components/common/code-editor.component";
import {PublishPageComponent} from "./pages/apis/{apiId}/publish/publish.page";
import {GitHubResourceComponent} from "./pages/apis/{apiId}/publish/_components/github-resource.component";
import {GitLabResourceComponent} from "./pages/apis/{apiId}/publish/_components/gitlab-resource.component";
import {BitbucketResourceComponent} from "./pages/apis/{apiId}/publish/_components/bitbucket-resource.component";
import {RenameDefinitionDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/rename-definition.component";
import {AceEditorComponent} from "./components/common/ace-editor.component";
import {AddExampleDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-example.component";
import {EditExampleDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/edit-example.component";
import {AddExample20DialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-example-20.component";
import {EditExample20DialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/edit-example-20.component";
import {ProblemsService} from "./pages/apis/{apiId}/editor/_services/problems.service";
import {SelectionService} from "./pages/apis/{apiId}/editor/_services/selection.service";
import {LicenseService} from "./pages/apis/{apiId}/editor/_services/license.service";
import {CurrentUserService} from "./services/current-user.service";
import {LinkedAccountsService} from "./services/accounts.service";
import {ApisService} from "./services/apis.service";
import {FormErrorMessageComponent} from "./components/common/form-error-message.component";
import {SecurityRequirementDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/security-requirement.component";
import {ActivityItemComponent} from "./components/common/activity-item.component";

@NgModule({
    imports: [
        BrowserModule, FormsModule, HttpClientModule, AppRoutingModule, ModalModule.forRoot(), BsDropdownModule.forRoot()
    ],
    declarations: [
        AppComponent, DashboardPageComponent, BreadcrumbsComponent, BreadcrumbComponent, PageErrorComponent,
        VerticalNavComponent, NavHeaderComponent, ConfirmDeleteDialogComponent, CopyUrlDialogComponent,
        TextAreaAutosize, DivAutoHeight, TextBoxAutosize, NotFoundPageComponent, SettingsNavComponent,
        CreatedLinkedAccountPageComponent, LinkedAccountsPageComponent, ProfilePageComponent, SettingsPageComponent,
        ApisPageComponent, CreateApiPageComponent, ImportApiPageComponent, ImportApiFormComponent, CreateApiFormComponent,
        ApisListComponent, ApisCardsComponent, DropDownComponent, ActivityItemComponent, ApiCollaborationPageComponent,
        ApiAcceptPageComponent, ApiDetailPageComponent, ValidationIconComponent, ServerUrlComponent, SearchComponent,
        SchemaTypeComponent, ResponseItemComponent, PathItemComponent, InlineTextAreaComponent, InlineTextEditorComponent,
        ContextHelpComponent, SetLicenseDialogComponent, SetContactDialogComponent, SecurityScheme30DialogComponent,
        SecurityScheme20DialogComponent, EditorDisconnectedDialogComponent, ClonePathDialogComponent, CloneDefinitionDialogComponent,
        AddTagDialogComponent, AddServerDialogComponent, AddSchemaPropertyDialogComponent, ResponseRow30Component, ResponseRowComponent,
        ParamRowComponent, ContentComponent, PropertyRowComponent, ServersSectionComponent, ProblemFormComponent, PathFormComponent,
        OperationFormComponent, Operation30FormComponent, DefinitionItemComponent, DefinitionFormComponent, EditorMasterComponent,
        ApiEditorPageComponent, ApiEditorComponent, AddQueryParamDialogComponent, AddPathDialogComponent, AddResponseDialogComponent,
        AddFormDataParamDialogComponent, AddDefinitionDialogComponent, AddMediaTypeDialogComponent, Main20FormComponent,
        Main30FormComponent, CodeEditorComponent, PublishPageComponent, GitHubResourceComponent, GitLabResourceComponent,
        BitbucketResourceComponent, RenameDefinitionDialogComponent, AceEditorComponent, AddExampleDialogComponent,
        EditExampleDialogComponent, AddExample20DialogComponent, EditExample20DialogComponent, FormErrorMessageComponent,
        SecurityRequirementDialogComponent
    ],
    providers: [
        ApisService, AuthenticationServiceProvider, ConfigService, LinkedAccountsService,
        AuthenticationCanActivateGuard, ProblemsService, SelectionService, LicenseService, CurrentUserService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
