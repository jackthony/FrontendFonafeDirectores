import { Routes } from '@angular/router';

export default [
    {
        path: '',
        children: [
            { path: '', redirectTo: '/error-404', pathMatch: 'full' },
            {
                path: 'rol',
                loadComponent: () => import('./maintenance-role/maintenance-role.component'),
            },
            {
                path: 'ministerio',
                loadComponent: () => import('./maintenance-ministry/maintenance-ministry.component'),
            },
            {
                path: 'sector',
                loadComponent: () => import('./maintenance-sector/maintenance-sector.component'),
            },
            {
                path: 'rubro',
                loadComponent: () => import('./maintenance-industry/maintenance-industry.component'),
            },
            {
                path: 'cargo',
                loadComponent: () => import('./maintenance-position/maintenance-position.component'),
            },
            {
                path: 'tipo-director',
                loadComponent: () => import('./maintenance-type-director/maintenance-type-director.component'),
            },
            {
                path: 'especialidad',
                loadComponent: () => import('./maintenance-specialty/maintenance-specialty.component'),
            }
        ]
    },
] as Routes;
