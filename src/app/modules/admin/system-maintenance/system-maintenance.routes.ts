import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { businessResolver } from 'app/core/resolvers/business.resolver';
import MaintenanceSectorComponent from './maintenance-sector/maintenance-sector.component';

export default [
    {
        path: '',
        children: [
            { path: '', redirectTo: '/error-404', pathMatch: 'full' },
            {
                path: 'ministerio',
                //component: MaintenanceSectorComponent
                loadComponent: () => import('./maintenance-ministry/maintenance-ministry.component'),
            },
            {
                path: 'sector',
                //component: MaintenanceSectorComponent
                loadComponent: () => import('./maintenance-sector/maintenance-sector.component'),
            }
        ]
    },
] as Routes;
