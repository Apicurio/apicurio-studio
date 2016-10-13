import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

/* Pages */
import {DashboardPageComponent} from './pages/dashboard/dashboard.page';
import {ApisPageComponent} from "./pages/apis/apis.page";
import {NewApiPageComponent} from "./pages/apis/newapi.page";
import {ApiDetailPageComponent} from "./pages/apis/api-detail.page";

/* Resolvers */
import {RecentApisResolve} from "./pages/dashboard/dashboard.resolve";
import {ApiResolve} from "./pages/apis/api-detail.resolve";


const studioRoutes: Routes = [
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
];


export const StudioRouting: ModuleWithProviders = RouterModule.forRoot(studioRoutes);
