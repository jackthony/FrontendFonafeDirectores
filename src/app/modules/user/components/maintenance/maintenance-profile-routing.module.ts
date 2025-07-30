/*******************************************************************************************************
 * Nombre del archivo:  maintenance-profile-routing.module.ts
 * Descripción:          Módulo de enrutamiento para el mantenimiento de perfiles, que define las rutas y 
 *                       componentes asociados con la gestión de cargos y roles en el sistema.
 *                       Este módulo proporciona rutas específicas para acceder a los componentes que permiten 
 *                       la gestión de roles y posiciones.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial de las rutas para el mantenimiento de cargos y roles.
 *******************************************************************************************************/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import MaintenancePositionComponent from './maintenance-position/maintenance-position.component';
import MaintenanceRoleComponent from './maintenance-role/maintenance-role.component';
const routes: Routes = [
	{
        path: 'cargo',
        component: MaintenancePositionComponent,
        
    },
    {
        path: 'rol',
        component: MaintenanceRoleComponent
    },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceProfileRoutingModule { }