/*******************************************************************************************************
 * Nombre del archivo:  profile-management-routing.module.ts
 * Descripción:          Módulo de enrutamiento para la gestión de perfiles, configurando rutas protegidas 
 *                       por un guardia de permisos. Las rutas incluyen la gestión de perfiles y la carga 
 *                       perezosa del módulo de mantenimiento.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Configuración de las rutas para el perfil y el mantenimiento de sistemas con protección de permisos.
 *******************************************************************************************************/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileManagementComponent } from './components/profile/profile-management/profile-management.component';
import { permissionGuard } from './guards/permission.guard';
const routes: Routes = [
  	{
		path: '',
		component: ProfileManagementComponent,
		canActivate: [permissionGuard],
		data: { module: 'gestion-perfiles', action: 'Ver' }
	},
	{
		path: 'mantenimiento',
		loadChildren: () => import('./components/maintenance/maintenance-profile.module'),
		canActivate: [permissionGuard],
		data: { module: 'mantenimiento-sistemas', action: 'Ver' }
	}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileManagementRoutingModule { }