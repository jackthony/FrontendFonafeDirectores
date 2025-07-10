/*******************************************************************************************************
 * Nombre del archivo:  maintenance-business-routing.module.ts
 * Descripción:          Módulo encargado de gestionar las rutas de mantenimiento relacionadas con las 
 *                       entidades del negocio, tales como ministerios, sectores, industrias, tipos de 
 *                       directores, y especialidades. Este módulo define las rutas necesarias para la 
 *                       navegación entre los diferentes componentes de mantenimiento de estas entidades.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial de las rutas para las entidades de negocio.
 *******************************************************************************************************/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import MaintenanceMinistryComponent from './maintenance-ministry/maintenance-ministry.component';
import MaintenanceSectorComponent from './maintenance-sector/maintenance-sector.component';
import MaintenanceIndustryComponent from './maintenance-industry/maintenance-industry.component';
import MaintenanceTypeDirectorComponent from './maintenance-type-director/maintenance-type-director.component';
import MaintenanceSpecialtyComponent from './maintenance-specialty/maintenance-specialty.component';
const routes: Routes = [
	{
        path: 'ministerio',
        component: MaintenanceMinistryComponent
    },
    {
        path: 'sector',
        component: MaintenanceSectorComponent
    },
    {
        path: 'rubro',
        component: MaintenanceIndustryComponent
    },
    {
        path: 'tipo-director',
        component: MaintenanceTypeDirectorComponent
    },
    {
        path: 'especialidad',
        component: MaintenanceSpecialtyComponent
    }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceBusinessRoutingModule { }