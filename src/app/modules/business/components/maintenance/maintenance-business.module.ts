/*******************************************************************************************************
 * Nombre del archivo:  maintenance-business.module.ts
 * Descripción:          Módulo encargado de gestionar el mantenimiento de las entidades relacionadas con 
 *                       el negocio, como ministerios, sectores, industrias, tipos de directores, especialidades, 
 *                       entre otros. Este módulo incluye componentes para mostrar y editar los datos de 
 *                       estas entidades, así como formularios y diálogos para la creación y modificación de 
 *                       información. Además, se utiliza para organizar el contenido en pestañas y tablas, 
 *                       permitiendo a los usuarios gestionar eficientemente los datos del negocio.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del módulo de mantenimiento para gestionar entidades de negocio.
 *******************************************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceBusinessRoutingModule } from './maintenance-business-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { NgxMaskDirective } from 'ngx-mask';
import { PermissionButtonDirective } from 'app/shared/directives/permission-button.directive';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FoFileUrlUploadComponent } from 'app/shared/components/fo-file-url-upload/fo-file-url-upload.component';
import { FoContCardComponent } from 'app/shared/components/fo-cont-card/fo-cont-card.component';
import { FoButtonDialogComponent } from 'app/shared/components/fo-button-dialog/fo-button-dialog.component';
import { FoButtonComponent } from 'app/shared/components/fo-button/fo-button.component';
import { MatDialogModule } from '@angular/material/dialog';
import MaintenanceMinistryComponent from './maintenance-ministry/maintenance-ministry.component';
import MaintenanceSectorComponent from './maintenance-sector/maintenance-sector.component';
import MaintenanceIndustryComponent from './maintenance-industry/maintenance-industry.component';
import MaintenanceTypeDirectorComponent from './maintenance-type-director/maintenance-type-director.component';
import MaintenanceSpecialtyComponent from './maintenance-specialty/maintenance-specialty.component';
import { DialogTypeDirectorFormComponent } from './dialog-type-director-form/dialog-type-director-form.component';
import { DialogSectorFormComponent } from './dialog-sector-form/dialog-sector-form.component';
import { DialogMinistryFormComponent } from './dialog-ministry-form/dialog-ministry-form.component';
import { DialogMaintenanceSpecialtyFormComponent } from './dialog-maintenance-specialty-form/dialog-maintenance-specialty-form.component';
import { DialogIndustryFormComponent } from './dialog-industry-form/dialog-industry-form.component';
import { FoMatTreeFlatComponent } from 'app/shared/components/fo-mat-tree-flat/fo-mat-tree-flat.component';
import { FoReturnComponent } from 'app/shared/components/fo-return/fo-return.component';
import { FoTitleModuleComponent } from 'app/shared/components/fo-title-module/fo-title-module.component';
import { FoTitleAreaComponent } from 'app/shared/components/fo-title-area/fo-title-area.component';
import { FoTableComponent } from 'app/shared/components/fo-table/fo-table.component';
import { FoSearchForButtonComponent } from 'app/shared/components/fo-search-for-button/fo-search-for-button.component';
@NgModule({
  declarations: [
    MaintenanceMinistryComponent,
    MaintenanceSectorComponent,
    MaintenanceIndustryComponent,
    MaintenanceTypeDirectorComponent,
    MaintenanceSpecialtyComponent,
    DialogTypeDirectorFormComponent,
    DialogSectorFormComponent,
    DialogMinistryFormComponent,
    DialogMaintenanceSpecialtyFormComponent,
    DialogIndustryFormComponent
  ],
  imports: [
    CommonModule,
    MaintenanceBusinessRoutingModule,
    FoContCardComponent, 
    FoMatTreeFlatComponent, 
    MatIconModule, 
    MatButtonModule,
    FoReturnComponent,  
    FoTitleModuleComponent, 
    MatCheckboxModule, 
    FormInputModule, 
    MatTabsModule, 
    FoFileUrlUploadComponent,
    FoTitleAreaComponent,
    FoButtonDialogComponent,
    TranslateMessageForm,
    NgxMaskDirective,
    PermissionButtonDirective,
    FoTableComponent,
    FoSearchForButtonComponent,
    FoButtonComponent,
    MatMenuModule, 
    MatDatepickerModule,
    MatDialogModule
  ]
})
export default class MaintenanceBusinessModule { }