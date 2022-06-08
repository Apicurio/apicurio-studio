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

import {ClipboardModule} from "ngx-clipboard";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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
import {AppRoutingModule} from './app-routing.module';
import {ConfirmDeleteDialogComponent} from './components/dialogs/confirm-delete.component';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ModalModule} from 'ngx-bootstrap/modal';
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
import {ApiCollaborationPageComponent} from './pages/apis/{apiId}/collaboration/api-collaboration.page';
import {ApiAcceptPageComponent} from './pages/apis/{apiId}/collaboration/accept/api-accept.page';
import {ApiDetailPageComponent} from './pages/apis/{apiId}/api-detail.page';
import {ApiEditorPageComponent, ApiEditorPageGuard} from './pages/apis/{apiId}/editor/api-editor.page';
import {PublishPageComponent} from "./pages/apis/{apiId}/publish/publish.page";
import {GitHubResourceComponent} from "./pages/apis/{apiId}/publish/_components/github-resource.component";
import {GitLabResourceComponent} from "./pages/apis/{apiId}/publish/_components/gitlab-resource.component";
import {BitbucketResourceComponent} from "./pages/apis/{apiId}/publish/_components/bitbucket-resource.component";
import {CurrentUserService} from "./services/current-user.service";
import {LinkedAccountsService} from "./services/accounts.service";
import {ApisService} from "./services/apis.service";
import {GenerateProjectWizardComponent} from "./pages/apis/{apiId}/_components/generate-project.wizard";
import {ApicurioEditorModule} from "./editor.module";
import {ApicurioCommonComponentsModule} from "./common-components.module";
import {ActivityItemComponent} from "./components/common/activity-item.component";
import {EditorDisconnectedDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/editor-disconnected.component';
import {TemplateService} from './services/template.service';
import {CopyPageComponent} from './pages/apis/{apiId}/copy/copy.page';
import {MockPageComponent} from './pages/apis/{apiId}/mock/mock.page';
import {DefaultPageComponent} from "./pages/default.page";
import {InvitationDialogComponent} from "./pages/apis/{apiId}/collaboration/_components/invitation.component";
import {ConfigureValidationComponent} from './pages/apis/{apiId}/_components/configure-validation.dialog';
import {ValidationService} from "./services/validation.service";
import {ValidationPageComponent} from "./pages/settings/validation/validation.page";
import {ProfileEditorComponent} from "./pages/settings/validation/_components/profile-editor.component";
import {TagListComponent} from "./components/common/tag-list.component";
import {SharingDialogComponent} from "./pages/apis/{apiId}/_components/sharing.dialog";
import {ApiTextEditorPageComponent} from "./pages/apis/{apiId}/editor/api-teditor.page";
import {DownloadDialogComponent} from "./pages/apis/{apiId}/_components/download.dialog";
import {ImportComponentsWizard} from "./pages/apis/{apiId}/_components/import-components.wizard";
import {DataTableComponent} from "./components/common/data-table.component";
import {LoadingComponent} from "./components/common/loading.component";
import {TemplatePublicationPageComponent} from "./pages/apis/{apiId}/template/template-publication.page";
import {TemplatesPageComponent} from "./pages/templates/templates.page";
import {TemplateEditorComponent} from "./pages/templates/_components/template-editor.component";
import { SpectralValidationService } from "./services/spectral-api.service.impl";

@NgModule({
    imports: [
        BrowserAnimationsModule, BrowserModule, FormsModule, HttpClientModule, AppRoutingModule, ModalModule.forRoot(), BsDropdownModule.forRoot(),
        ApicurioCommonComponentsModule, ApicurioEditorModule, ClipboardModule
    ],
    declarations: [
        AppComponent, DashboardPageComponent, BreadcrumbsComponent, BreadcrumbComponent, PageErrorComponent,
        VerticalNavComponent, ConfirmDeleteDialogComponent, InvitationDialogComponent, ValidationPageComponent,
        NotFoundPageComponent, SettingsNavComponent, CreatedLinkedAccountPageComponent, LinkedAccountsPageComponent,
        ProfilePageComponent, SettingsPageComponent, ApisPageComponent, CreateApiPageComponent, ImportApiPageComponent,
        ImportApiFormComponent, CreateApiFormComponent, ApisListComponent, ApisCardsComponent, CopyPageComponent,
        ApiCollaborationPageComponent, ApiAcceptPageComponent, ApiDetailPageComponent, ApiEditorPageComponent,
        PublishPageComponent, GitHubResourceComponent, GitLabResourceComponent, BitbucketResourceComponent,
        GenerateProjectWizardComponent, ActivityItemComponent, EditorDisconnectedDialogComponent, MockPageComponent,
        DefaultPageComponent, ConfigureValidationComponent, ProfileEditorComponent, TagListComponent,
        SharingDialogComponent, ApiTextEditorPageComponent, DownloadDialogComponent, ImportComponentsWizard,
        DataTableComponent, LoadingComponent, TemplatePublicationPageComponent, TemplatesPageComponent, TemplateEditorComponent
    ],
    providers: [
        ApisService, AuthenticationServiceProvider, ConfigService, LinkedAccountsService, ValidationService,
        AuthenticationCanActivateGuard, ApiEditorPageGuard, CurrentUserService, TemplateService, SpectralValidationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
