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

import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

/* Guards */
import {AuthenticationCanActivateGuard} from "./guards/auth.guard";
import {ApiEditorPageGuard} from "./pages/apis/{apiId}/editor/api-editor.page";

/* Pages */
import {LoginPageComponent} from "./pages/login/login.page";
import {DashboardPageComponent} from "./pages/dashboard/dashboard.page";
import {ApisPageComponent} from "./pages/apis/apis.page";
import {CreateApiPageComponent} from "./pages/apis/create/create.page";
import {ApiDetailPageComponent} from "./pages/apis/{apiId}/api-detail.page";
import {ImportApiPageComponent} from "./pages/apis/import/import.page";
import {ApiEditorPageComponent} from "./pages/apis/{apiId}/editor/api-editor.page";
import {ProfilePageComponent} from "./pages/settings/profile/profile.page";
import {LinkedAccountsPageComponent} from "./pages/settings/accounts/accounts.page";
import {SettingsPageComponent} from "./pages/settings/settings";
import {NotFoundPageComponent} from "./pages/404.page";
import {CreatedLinkedAccountPageComponent} from "./pages/settings/accounts/{accountType}/created/created.page";
import {ApiCollaborationPageComponent} from "./pages/apis/{apiId}/collaboration/api-collaboration.page";
import {ApiAcceptPageComponent} from "./pages/apis/{apiId}/collaboration/accept/api-accept.page";


const _studioRoutes: any[] = [
    {
        path: "",
        component: DashboardPageComponent
    },
    {
        path: "apis",
        component: ApisPageComponent
    },
    {
        path: "apis/create",
        component: CreateApiPageComponent
    },
    {
        path: "apis/import",
        component: ImportApiPageComponent
    },
    {
        path: "apis/:apiId",
        component: ApiDetailPageComponent
    },
    {
        path: "apis/:apiId/collaboration",
        component: ApiCollaborationPageComponent
    },
    {
        path: "apis/:apiId/collaboration/accept/:inviteId",
        component: ApiAcceptPageComponent
    },
    {
        path: "apis/:apiId/editor",
        component: ApiEditorPageComponent,
        canDeactivate: [ApiEditorPageGuard]
    },
    {
        path: "settings",
        component: SettingsPageComponent
    },
    {
        path: "settings/profile",
        component: ProfilePageComponent
    },
    {
        path: "settings/accounts",
        component: LinkedAccountsPageComponent
    },
    {
        path: "settings/accounts/:accountType/created",
        component: CreatedLinkedAccountPageComponent
    },
    {
        path: "login",
        component: LoginPageComponent
    },
    {
        path: "**",
        component: NotFoundPageComponent
    }
];
/* Add standard authentication guard to every route (except the login route). */
const studioRoutes: Routes = _studioRoutes.map(item => {
    if (item.path != "login") {
        item["canActivate"] = [
            AuthenticationCanActivateGuard
        ];
    }
    return item;
});

export const StudioRouting: ModuleWithProviders = RouterModule.forRoot(studioRoutes);
