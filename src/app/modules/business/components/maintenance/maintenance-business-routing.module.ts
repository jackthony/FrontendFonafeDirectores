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
