import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionButtonDirective } from 'app/shared/directives/permission-button.directive';
import { MatIconModule } from '@angular/material/icon';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FoContCardComponent } from 'app/shared/components/fo-cont-card/fo-cont-card.component';
import { FoButtonDialogComponent } from 'app/shared/components/fo-button-dialog/fo-button-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MaintenanceProfileRoutingModule } from './maintenance-profile-routing.module';
import { DialogMaintenanceRoleFormComponent } from './dialog-maintenance-role-form/dialog-maintenance-role-form.component';
import { DialogMaintenanceRoleModulesComponent } from './dialog-maintenance-role-modules/dialog-maintenance-role-modules.component';
import { DialogPositionFormComponent } from './dialog-position-form/dialog-position-form.component';
import MaintenanceRoleComponent from './maintenance-role/maintenance-role.component';
import MaintenancePositionComponent from './maintenance-position/maintenance-position.component';
import { FoReturnComponent } from 'app/shared/components/fo-return/fo-return.component';
import { FoTitleModuleComponent } from 'app/shared/components/fo-title-module/fo-title-module.component';
import { FoTableComponent } from 'app/shared/components/fo-table/fo-table.component';
import { FoSearchForButtonComponent } from 'app/shared/components/fo-search-for-button/fo-search-for-button.component';


@NgModule({
  declarations: [
    DialogMaintenanceRoleFormComponent,
    DialogMaintenanceRoleModulesComponent,
    DialogPositionFormComponent,
    MaintenanceRoleComponent,
    MaintenancePositionComponent
  ],
  imports: [
    CommonModule,
    MaintenanceProfileRoutingModule,
    FoReturnComponent,
    FoContCardComponent,
    PermissionButtonDirective,
    MatIconModule,
    FormInputModule,
    MatDatepickerModule,
    FoButtonDialogComponent,
		TranslateMessageForm,
		ReactiveFormsModule,
		MatSelectModule,
		MatDialogModule,
		MatTooltipModule,
		MatButtonModule,
    MatCheckboxModule,
    FoTitleModuleComponent,
    FoTableComponent,
    FoSearchForButtonComponent,
  ]
})
export default class ProfileManagementModule { }