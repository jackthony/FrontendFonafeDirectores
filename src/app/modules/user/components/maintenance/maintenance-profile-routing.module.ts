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
