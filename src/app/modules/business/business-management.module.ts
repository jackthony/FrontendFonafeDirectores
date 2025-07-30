/*******************************************************************************************************
 * Nombre del archivo:  business-management.module.ts
 * Descripción:          Módulo principal para la gestión de negocios, que agrupa los componentes y servicios 
 *                       necesarios para la administración y visualización de archivos, directorios y formularios 
 *                       de negocios dentro del sistema. Este módulo también integra la funcionalidad de tablas,
 *                       formularios y componentes de carga de archivos.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del módulo de gestión de negocios con funcionalidades de 
 *                         archivos y directorios.
 *******************************************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessManagementRoutingModule } from './business-management-routing.module';
import { FoMatTreeFlatComponent } from '../../shared/components/fo-mat-tree-flat/fo-mat-tree-flat.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ArchivesBussinessComponent } from './components/business/archives-bussiness/archives-bussiness.component';
import { FoReturnComponent } from '../../shared/components/fo-return/fo-return.component';
import { FoTitleModuleComponent } from '../../shared/components/fo-title-module/fo-title-module.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { MatTabsModule } from '@angular/material/tabs';
import { DirectoryBusinessComponent } from './components/business/directory-business/directory-business.component';
import { FoTitleAreaComponent } from '../../shared/components/fo-title-area/fo-title-area.component';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { NgxMaskDirective } from 'ngx-mask';
import { PermissionButtonDirective } from 'app/shared/directives/permission-button.directive';
import { MatMenuModule } from '@angular/material/menu';
import { FoTableComponent } from '../../shared/components/fo-table/fo-table.component';
import { FoSearchForButtonComponent } from '../../shared/components/fo-search-for-button/fo-search-for-button.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FoFileUrlUploadComponent } from 'app/shared/components/fo-file-url-upload/fo-file-url-upload.component';
import { FoContCardComponent } from 'app/shared/components/fo-cont-card/fo-cont-card.component';
import { FoButtonDialogComponent } from 'app/shared/components/fo-button-dialog/fo-button-dialog.component';
import { FoButtonComponent } from 'app/shared/components/fo-button/fo-button.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BusinessFormComponent } from './components/business/business-form/business-form.component';
import { BusinessManagementComponent } from './components/business/business-management/business-management.component';
import { FormDirectoryComponent } from './components/business/form-directory/form-directory.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FoSearchComponent } from 'app/shared/components/fo-search/fo-search.component';
@NgModule({
  declarations: [
    ArchivesBussinessComponent,
    BusinessFormComponent,
    BusinessManagementComponent,
    DirectoryBusinessComponent,
    FormDirectoryComponent,
  ],
  imports: [
    CommonModule,
    BusinessManagementRoutingModule,
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
    MatDialogModule,
    MatTooltipModule,
    FoSearchComponent
  ]
})
export default class BusinessManagementModule { }