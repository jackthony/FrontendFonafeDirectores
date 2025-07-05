import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileManagementComponent } from './components/profile/profile-management/profile-management.component';
import MaintenancePositionComponent from './components/maintenance/maintenance-position/maintenance-position.component';
import MaintenanceRoleComponent from './components/maintenance/maintenance-role/maintenance-role.component';
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
