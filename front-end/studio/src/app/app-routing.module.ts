/**
 * @license
 * Copyright 2018 JBoss Inc
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
import {RouterModule, Routes} from '@angular/router';
import {DashboardPageComponent} from './pages/dashboard/dashboard.page';
import {AuthenticationCanActivateGuard} from './guards/auth.guard';
import {SettingsPageComponent} from './pages/settings/settings';
import {ProfilePageComponent} from './pages/settings/profile/profile.page';
import {LinkedAccountsPageComponent} from './pages/settings/accounts/accounts.page';
import {CreatedLinkedAccountPageComponent} from './pages/settings/accounts/{accountType}/created/created.page';
import {ApisPageComponent} from './pages/apis/apis.page';
import {CreateApiPageComponent} from './pages/apis/create/create.page';
import {ImportApiPageComponent} from './pages/apis/import/import.page';
import {ApiDetailPageComponent} from './pages/apis/{apiId}/api-detail.page';
import {ApiCollaborationPageComponent} from './pages/apis/{apiId}/collaboration/api-collaboration.page';
import {ApiAcceptPageComponent} from './pages/apis/{apiId}/collaboration/accept/api-accept.page';
import {ApiEditorPageComponent, ApiEditorPageGuard} from './pages/apis/{apiId}/editor/api-editor.page';
import {PublishPageComponent} from "./pages/apis/{apiId}/publish/publish.page";
import {CopyPageComponent} from './pages/apis/{apiId}/copy/copy.page';
import {MockPageComponent} from './pages/apis/{apiId}/mock/mock.page';
import {DefaultPageComponent} from "./pages/default.page";
import {ValidationPageComponent} from "./pages/settings/validation/validation.page";
import {ApiTextEditorPageComponent, ApiTextEditorPageGuard} from "./pages/apis/{apiId}/editor/api-teditor.page";
import {TemplatePublicationPageComponent} from "./pages/apis/{apiId}/template/template-publication.page";
import {TemplatesPageComponent} from "./pages/templates/templates.page";

const routes: Routes = [
    {
        path: "",
        component: DefaultPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: 'dashboard',
        component: DashboardPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: 'templates',
        component: TemplatesPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "settings",
        component: SettingsPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "settings/profile",
        component: ProfilePageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "settings/accounts",
        component: LinkedAccountsPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "settings/accounts/:accountType/created",
        component: CreatedLinkedAccountPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "settings/validation",
        component: ValidationPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "apis",
        component: ApisPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "apis/create",
        component: CreateApiPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "apis/import",
        component: ImportApiPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "apis/:apiId",
        component: ApiDetailPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "apis/:apiId/collaboration",
        component: ApiCollaborationPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "apis/:apiId/publish",
        component: PublishPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "apis/:apiId/copy",
        component: CopyPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "apis/:apiId/mock",
        component: MockPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "apis/:apiId/template",
        component: TemplatePublicationPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "apis/:apiId/collaboration/accept/:inviteId",
        component: ApiAcceptPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
    },
    {
        path: "apis/:apiId/editor",
        component: ApiEditorPageComponent,
        canActivate: [AuthenticationCanActivateGuard],
        canDeactivate: [ApiEditorPageGuard]
    },
    {
        path: "apis/:apiId/teditor",
        component: ApiTextEditorPageComponent,
        canActivate: [AuthenticationCanActivateGuard]
        //canDeactivate: [ApiTextEditorPageGuard]
    },
];


@NgModule({
    imports: [
        RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule {
}
