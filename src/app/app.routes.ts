/*************************************************************************************
 * Nombre del archivo:  app.routes.ts
 * Descripción:         Definición de rutas principales de la aplicación Angular.
 *                      Incluye rutas protegidas y públicas, agrupadas por layout,
 *                      y con guardas para autenticación, sesión y permisos por módulo.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Configuración de rutas públicas, protegidas, y módulos
 *                      administrativos con control de acceso granular.
 *************************************************************************************/
import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { SessionGuard } from './core/auth/guards/session.guard';
import { permissionGuard } from './core/auth/guards/permission.guard';
export const appRoutes: Route[] = [
    {path: '', pathMatch : 'full', redirectTo: 'home'},
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'home'},
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'fonafe'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes')},
            //{path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')},
        ]
    },
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
        ]
    },
    /* {
        path: 'example',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'home', loadComponent: () => import('app/modules/admin/home/home.component') },
        ]
    }, */
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [/* SessionGuard */],
        component: LayoutComponent,
        data: {
            layout: 'fonafe'
        },
        /* 
        Cargar rutas hijas
        */
        children: [
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
            { path: 'home', loadComponent: () => import('app/modules/admin/home/components/home/home.component') },
            { 
                path: 'gestion-perfiles', 
                loadComponent: () => import('app/modules/admin/profile-management/components/profile-management/profile-management.component'),
                canActivate: [permissionGuard],
                data: { module: 'gestion-perfiles', action: 'Ver' }
            },
            { 
                path: 'gestion-empresas', 
                loadChildren: () => import('app/modules/admin/business-management/business-management.routes'),
                canActivate: [permissionGuard],
                data: { module: 'gestion-empresas', action: 'Ver' }
            },
            { 
                path: 'solicitudes', 
                loadChildren: () => import('app/modules/admin/new-requests/new-requests.routes'),
                canActivate: [permissionGuard],
                data: { module: 'solicitudes', action: 'Ver' }
            },
            { 
                path: 'mantenimiento-candidatos', 
                loadChildren: () => import('app/modules/admin/candidate-maintenance/candidate-maintenance.routes'),
                canActivate: [permissionGuard],
                data: { module: 'Mantenimiento Candidatos', action: 'Ver' }
            },
            { 
                path: 'mantenedores-sistema', 
                loadChildren: () => import('app/modules/admin/system-maintenance/system-maintenance.routes'),
                canActivate: [permissionGuard],
                data: { module: 'mantenimiento-sistemas', action: 'Ver' }
            },
            { path: 'error-404', pathMatch: 'full', loadChildren: () => import('app/modules/admin/error/components/error-404/error-404.routes')},
            { path: '**', redirectTo: 'error-404'}
        ]
    }
];