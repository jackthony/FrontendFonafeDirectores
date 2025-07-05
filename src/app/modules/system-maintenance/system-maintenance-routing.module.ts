import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import MaintenanceRoleComponent from './components/maintenance-role/maintenance-role.component';
import MaintenanceMinistryComponent from './components/maintenance-ministry/maintenance-ministry.component';
import MaintenanceSectorComponent from './components/maintenance-sector/maintenance-sector.component';
import MaintenanceIndustryComponent from './components/maintenance-industry/maintenance-industry.component';
import MaintenancePositionComponent from './components/maintenance-position/maintenance-position.component';
import MaintenanceTypeDirectorComponent from './components/maintenance-type-director/maintenance-type-director.component';
import MaintenanceSpecialtyComponent from './components/maintenance-specialty/maintenance-specialty.component';

const routes: Routes = [
	{
        path: '',
        children: [
            { path: '', redirectTo: '/error-404', pathMatch: 'full' },
            {
                path: 'rol',
				component: MaintenanceRoleComponent
            },
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
                path: 'cargo',
                component: MaintenancePositionComponent
            },
            {
                path: 'tipo-director',
                component: MaintenanceTypeDirectorComponent
            },
            {
                path: 'especialidad',
                component: MaintenanceSpecialtyComponent
            }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemMaintenanceRoutingModule { }
