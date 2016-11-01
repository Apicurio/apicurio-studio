import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

/* Pages */
import {LoginPageComponent} from "./pages/login/login.page";
import {DashboardPageComponent} from './pages/dashboard/dashboard.page';
import {ApisPageComponent} from "./pages/apis/apis.page";
import {NewApiPageComponent} from "./pages/apis/newapi/newapi.page";
import {ApiDetailPageComponent} from "./pages/apis/{apiId}/api-detail.page";

/* Resolvers */
import {RecentApisResolve} from "./pages/dashboard/dashboard.resolve";
import {ApiResolve} from "./pages/apis/{apiId}/api-detail.resolve";
import {AuthenticationCanActivateGuard} from "./guards/auth.guard";

const _studioRoutes: any[] = [
    {
        path: '',
        component: DashboardPageComponent,
        resolve: {
            recentApis: RecentApisResolve
        }
    },
    {
        path: 'apis',
        component: ApisPageComponent
    },
    {
        path: 'apis/newapi',
        component: NewApiPageComponent
    },
    {
        path: 'apis/:apiId',
        component: ApiDetailPageComponent,
        resolve: {
            api: ApiResolve
        }
    },
    {
        path: 'login',
        component: LoginPageComponent
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
