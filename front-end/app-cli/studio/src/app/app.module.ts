import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ApisServiceProvider} from './services/apis.service.provider';
import {LinkedAccountsServiceProvider} from './services/accounts.service.provider';
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
import {AceEditorModule} from 'ng2-ace-editor';
import {ActivityItemComponent} from './pages/apis/{apiId}/_components/activity-item.component';
import {ApiCollaborationPageComponent} from './pages/apis/{apiId}/collaboration/api-collaboration.page';
import {ApiAcceptPageComponent} from './pages/apis/{apiId}/collaboration/accept/api-accept.page';
import {ApiDetailPageComponent} from './pages/apis/{apiId}/api-detail.page';


@NgModule({
  imports: [
    BrowserModule, FormsModule, HttpClientModule, AppRoutingModule, ModalModule.forRoot(), BsDropdownModule.forRoot(),
    AceEditorModule
  ],
  declarations: [
    AppComponent, DashboardPageComponent, BreadcrumbsComponent, BreadcrumbComponent, PageErrorComponent,
    VerticalNavComponent, NavHeaderComponent, ConfirmDeleteDialogComponent, CopyUrlDialogComponent,
    TextAreaAutosize, DivAutoHeight, TextBoxAutosize, NotFoundPageComponent, SettingsNavComponent,
    CreatedLinkedAccountPageComponent, LinkedAccountsPageComponent, ProfilePageComponent, SettingsPageComponent,
    ApisPageComponent, CreateApiPageComponent, ImportApiPageComponent, ImportApiFormComponent, CreateApiFormComponent,
    ApisListComponent, ApisCardsComponent, DropDownComponent, ActivityItemComponent, ApiCollaborationPageComponent,
    ApiAcceptPageComponent, ApiDetailPageComponent
  ],
  providers: [
    ApisServiceProvider, LinkedAccountsServiceProvider, AuthenticationServiceProvider, ConfigService,
    AuthenticationCanActivateGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
