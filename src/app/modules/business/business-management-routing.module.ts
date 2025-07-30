/*******************************************************************************************************
 * Nombre del archivo:  business-management-routing.module.ts
 * Descripción:          Módulo de enrutamiento para la gestión de empresas, que define las rutas necesarias 
 *                       para la administración y registro de negocios dentro del sistema. Este módulo incluye 
 *                       rutas para la visualización de los negocios, la creación y edición de registros de 
 *                       empresas, y la gestión de mantenimiento de empresas, con control de acceso y permisos.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del enrutamiento para la gestión de empresas con control de permisos.
 *******************************************************************************************************/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { businessResolver } from './infrastructure/business/resolvers/business.resolver';
import { BusinessManagementComponent } from './components/business/business-management/business-management.component';
import { BusinessFormComponent } from './components/business/business-form/business-form.component';
import { permissionGuard } from '../user/guards/permission.guard';
const routes: Routes = [
	{
        path     : '',
        component: BusinessManagementComponent,
        canActivate: [permissionGuard],
        data: { module: 'gestion-empresas', action: 'Ver' }
    },
    {
        path     : 'registro',
        component: BusinessFormComponent,
        canActivate: [permissionGuard],
        resolve: {
            data: businessResolver
        },
        data: { module: 'gestion-empresas', action: 'Ver' }
    },
    {
        path     : 'registro/:id',
        component: BusinessFormComponent,
        canActivate: [permissionGuard],
        resolve: {
            data: businessResolver
        },
        data: { module: 'gestion-empresas', action: 'Ver' }
    },
    {
		path: 'mantenimiento',
		loadChildren: () => import('./components/maintenance/maintenance-business.module'),
		canActivate: [permissionGuard],
		canActivateChild: [permissionGuard],
		data: { module: 'mantenimiento-sistemas', action: 'Ver' }
	}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessManagementRoutingModule { }