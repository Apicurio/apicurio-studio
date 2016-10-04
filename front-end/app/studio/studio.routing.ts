import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent }   from './pages/dashboard/dashboard.component';

const studioRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent
    }
];

export const StudioRouting: ModuleWithProviders = RouterModule.forRoot(studioRoutes);
