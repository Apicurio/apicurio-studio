import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

/* Pages */
import {DashboardPageComponent} from './pages/dashboard/dashboard.page';
import {ApisPageComponent} from "./pages/apis/apis.page";
import {NewApiPageComponent} from "./pages/apis/newapi.page";

/* Resolvers */
import {RecentApisResolve} from "./pages/dashboard/dashboard.resolve";


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
    }
];


export const StudioRouting: ModuleWithProviders = RouterModule.forRoot(studioRoutes);
