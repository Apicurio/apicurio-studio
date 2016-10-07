import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './pages/dashboard/dashboard.page';
import {ApisPageComponent} from "./pages/apis/apis.page";


const studioRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'apis',
        component: ApisPageComponent
    }
];


export const StudioRouting: ModuleWithProviders = RouterModule.forRoot(studioRoutes);
