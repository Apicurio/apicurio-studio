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
import {RouterModule, Routes} from "@angular/router";
import {DashboardPageComponent} from "./pages/dashboard/dashboard.page";
import {AuthenticationCanActivateGuard} from "./guards/auth.guard";


const _studioRoutes: any[] = [
    {
        path: "",
        component: DashboardPageComponent
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
