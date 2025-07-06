import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileManagementRoutingModule } from './profile-management-routing.module';
import { FoReturnComponent } from '../../shared/components/fo-return/fo-return.component';
import { FoTitleModuleComponent } from '../../shared/components/fo-title-module/fo-title-module.component';
import { FoTableComponent } from '../../shared/components/fo-table/fo-table.component';
import { FoSearchForButtonComponent } from '../../shared/components/fo-search-for-button/fo-search-for-button.component';
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
import { ProfileManagementComponent } from './components/profile/profile-management/profile-management.component';
import { FoContCardComponent } from 'app/shared/components/fo-cont-card/fo-cont-card.component';
import { FoButtonDialogComponent } from 'app/shared/components/fo-button-dialog/fo-button-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChangePasswordAdmComponent } from './components/profile/change-password-adm/change-password-adm.component';
import { FormProfileComponent } from './components/profile/form-profile/form-profile.component';


@NgModule({
  declarations: [
    ProfileManagementComponent,
    FormProfileComponent,
    ChangePasswordAdmComponent
  ],
  imports: [
    CommonModule,
    ProfileManagementRoutingModule,
    FoReturnComponent,
    FoTitleModuleComponent,
    FoTableComponent,
    FoSearchForButtonComponent,
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
    MatCheckboxModule
  ]
})
export default class ProfileManagementModule { }