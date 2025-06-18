import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { SessionGuard } from './core/auth/guards/session.guard';
import { permissionGuard } from './core/auth/guards/permission.guard';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'home'},

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'home'},

    // Auth routes for guests
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

    // Auth routes for authenticated users
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

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            //{path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes')},
        ]
    },

    // Admin routes
    {
        path: 'example',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'home', loadComponent: () => import('app/modules/admin/home/home.component') },
            //{path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes')},
        ]
    },

    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [SessionGuard],
        component: LayoutComponent,
        data: {
            layout: 'fonafe'
        },
        /* resolve: {
            initialData: initialDataResolver
        }, */
        children: [
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
            { path: 'home', loadComponent: () => import('app/modules/admin/home/home.component') },
            { 
                path: 'gestion-perfiles', 
                loadComponent: () => import('app/modules/admin/profile-management/profile-management.component'),
                canActivate: [permissionGuard],
                data: { module: 'gestion-perfiles', action: 'read' }
            },
            { 
                path: 'gestion-empresas', 
                loadChildren: () => import('app/modules/admin/business-management/business-management.routes'),
                canActivate: [permissionGuard],
                data: { module: 'gestion-empresas', action: 'read' }
            },
            { 
                path: 'solicitudes', 
                loadChildren: () => import('app/modules/admin/new-requests/new-requests.routes'),
                canActivate: [permissionGuard],
                data: { module: 'solicitudes', action: 'read' }
            },
            { 
                path: 'mantenimiento-candidatos', 
                loadChildren: () => import('app/modules/admin/candidate-maintenance/candidate-maintenance.routes'),
                canActivate: [permissionGuard],
                data: { module: 'Mantenimiento Candidatos', action: 'read' }
            },
            { 
                path: 'mantenedores-sistema', 
                loadChildren: () => import('app/modules/admin/system-maintenance/system-maintenance.routes'),
                canActivate: [permissionGuard],
                data: { module: 'mantenimiento-sistemas', action: 'read' }
            },
            { path: 'error-404', pathMatch: 'full', loadChildren: () => import('app/modules/admin/error/error-404/error-404.routes')},
            { path: '**', redirectTo: 'error-404'}
        ]
    }
];
