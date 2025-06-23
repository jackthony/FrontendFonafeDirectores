import { Routes } from '@angular/router';

export default [
    {
        path: '',
        children: [
            { path: '', redirectTo: '/error-404', pathMatch: 'full' },
            {
                path: 'rol',
                loadComponent: () => import('./components/maintenance-role/maintenance-role.component'),
            },
            {
                path: 'ministerio',
                loadComponent: () => import('./components/maintenance-ministry/maintenance-ministry.component'),
            },
            {
                path: 'sector',
                loadComponent: () => import('./components/maintenance-sector/maintenance-sector.component'),
            },
            {
                path: 'rubro',
                loadComponent: () => import('./components/maintenance-industry/maintenance-industry.component'),
            },
            {
                path: 'cargo',
                loadComponent: () => import('./components/maintenance-position/maintenance-position.component'),
            },
            {
                path: 'tipo-director',
                loadComponent: () => import('./components/maintenance-type-director/maintenance-type-director.component'),
            },
            {
                path: 'especialidad',
                loadComponent: () => import('./components/maintenance-specialty/maintenance-specialty.component'),
            }
        ]
    },
] as Routes;
