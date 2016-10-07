import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardPageComponent} from './pages/dashboard/dashboard.page';
import {ApisPageComponent} from "./pages/apis/apis.page";
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
    }
];


export const StudioRouting: ModuleWithProviders = RouterModule.forRoot(studioRoutes);
