import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemMaintenanceRoutingModule } from './system-maintenance-routing.module';
import MaintenanceRoleComponent from './components/maintenance-role/maintenance-role.component';
import { FoReturnComponent } from 'app/shared/components/fo-return/fo-return.component';
import { FoTitleModuleComponent } from 'app/shared/components/fo-title-module/fo-title-module.component';
import { FoTableComponent } from 'app/shared/components/fo-table/fo-table.component';
import { FoSearchForButtonComponent } from 'app/shared/components/fo-search-for-button/fo-search-for-button.component';
import { FoContCardComponent } from 'app/shared/components/fo-cont-card/fo-cont-card.component';
import { PermissionButtonDirective } from 'app/shared/directives/permission-button.directive';
import MaintenanceMinistryComponent from './components/maintenance-ministry/maintenance-ministry.component';
import MaintenanceSectorComponent from './components/maintenance-sector/maintenance-sector.component';
import MaintenancePositionComponent from './components/maintenance-position/maintenance-position.component';
import MaintenanceIndustryComponent from './components/maintenance-industry/maintenance-industry.component';
import MaintenanceTypeDirectorComponent from './components/maintenance-type-director/maintenance-type-director.component';
import MaintenanceSpecialtyComponent from './components/maintenance-specialty/maintenance-specialty.component';
import { DialogTypeDirectorFormComponent } from './components/dialog-type-director-form/dialog-type-director-form.component';
import { DialogSectorFormComponent } from './components/dialog-sector-form/dialog-sector-form.component';
import { MatIconModule } from '@angular/material/icon';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { FoButtonDialogComponent } from 'app/shared/components/fo-button-dialog/fo-button-dialog.component';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogPositionFormComponent } from './components/dialog-position-form/dialog-position-form.component';
import { DialogMinistryFormComponent } from './components/dialog-ministry-form/dialog-ministry-form.component';
import { DialogMaintenanceSpecialtyFormComponent } from './components/dialog-maintenance-specialty-form/dialog-maintenance-specialty-form.component';
import { DialogMaintenanceRoleModulesComponent } from './components/dialog-maintenance-role-modules/dialog-maintenance-role-modules.component';
import { DialogMaintenanceRoleFormComponent } from './components/dialog-maintenance-role-form/dialog-maintenance-role-form.component';
import { DialogIndustryFormComponent } from './components/dialog-industry-form/dialog-industry-form.component';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    MaintenanceRoleComponent,
    MaintenanceMinistryComponent,
    MaintenanceSectorComponent,
    MaintenanceIndustryComponent,
    MaintenancePositionComponent,
    MaintenanceTypeDirectorComponent,
    MaintenanceSpecialtyComponent,
    DialogTypeDirectorFormComponent,
    DialogSectorFormComponent,
    DialogPositionFormComponent,
    DialogMinistryFormComponent,
    DialogMaintenanceSpecialtyFormComponent,
    DialogMaintenanceRoleModulesComponent,
    DialogMaintenanceRoleFormComponent,
    DialogIndustryFormComponent

  ],
  imports: [
    CommonModule,
    SystemMaintenanceRoutingModule,
    FoReturnComponent,
    FoTitleModuleComponent,
    FoTableComponent,
    FoSearchForButtonComponent,
    FoContCardComponent,
    PermissionButtonDirective,
	  MatIconModule,
	  FormInputModule,
	  FoButtonDialogComponent,
	  TranslateMessageForm,
	  MatDialogModule,
    MatCheckboxModule
  ]
})
export default class SystemMaintenanceModule { }
