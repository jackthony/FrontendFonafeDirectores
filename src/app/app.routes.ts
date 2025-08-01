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
import { AuthGuard } from 'app/modules/user/guards/auth.guard';
import { NoAuthGuard } from 'app/modules/user/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { permissionGuard } from './modules/user/guards/permission.guard';
import { ResetPasswordTokenGuard } from './modules/user/guards/reset-password-token.guard';
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
            {path: 'confirmation-required', loadChildren: () => import('app/modules/user/components/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('app/modules/user/components/auth/forgot-password/forgot-password.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/user/components/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/user/components/auth/sign-up/sign-up.routes')},
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
            {path: 'sign-out', loadChildren: () => import('app/modules/user/components/auth/sign-out/sign-out.routes')},
            {path: 'unlock-session', loadChildren: () => import('app/modules/user/components/auth/unlock-session/unlock-session.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'fonafe'
        },
        /* 
        Cargar rutas hijas
        */
        children: [
            { path: 'change-password', loadChildren: () => import('app/modules/user/components/auth/change-password/change-password.routes') },
            { path: 'home', loadChildren: () => import('app/modules/home/home.module') },
            { 
                path: 'gestion-perfiles', 
                loadChildren: () => import('app/modules/user/profile-management.module'),
            },
            { 
                path: 'gestion-empresas', 
                loadChildren: () => import('app/modules/business/business-management.module'),
            },
            { 
                path: 'solicitudes', 
                loadChildren: () => import('app/modules/pre-evaluation/pre-evaluation.module'),
                //loadChildren: () => import('app/modules/new-requests/new-requests.module'),
                canActivate: [permissionGuard],
                data: { module: 'nuevas-solicitudes', action: 'Ver' }
            },
/*             { 
                path: 'solicitudes', 
                loadChildren: () => import('app/modules/pre-evaluation/pre-evaluation.module'),
                //loadChildren: () => import('app/modules/new-requests/new-requests.module'),
                canActivate: [permissionGuard],
            }, */
            { 
                path: 'mantenimiento-candidatos', 
                loadChildren: () => import('app/shared/shared.module'),
                canActivate: [permissionGuard],
                data: { module: 'mantenimiento-candidatos', action: 'Ver' }
            },
            { 
                path: 'trazabilidad-sistemas', 
                loadChildren: () => import('app/modules/traceability-system/traceability-system.module'),
                canActivate: [permissionGuard],
                data: { module: 'logs-trazabilidad', action: 'Ver' }
            },
        ]
    },
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'fonafe'
        },
        children: [
            {
                path: 'reset-password', 
                canActivate: [ResetPasswordTokenGuard],
                loadChildren: () => import('app/modules/user/components/auth/reset-password/reset-password.routes')
            },
            {
                path: 'confirm-account', 
                canActivate: [ResetPasswordTokenGuard],
                loadChildren: () => import('app/modules/user/components/auth/reset-password/reset-password.routes')
            }
        ]
         
    },
    { path: '', loadChildren: () => import('app/shared/shared.module')},
    { path: '**', redirectTo: 'error-404'}
];