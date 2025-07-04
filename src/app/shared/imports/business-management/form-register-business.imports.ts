/*******************************************************************************************************
 * Nombre del archivo:  form-business-imports.ts
 * Descripción:          Conjunto de módulos, componentes, directivas y pipes necesarios para el módulo 
 *                       de gestión de negocios (Business Management).
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 *******************************************************************************************************/
import { CommonModule } from "@angular/common";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
import { FoFileUrlUploadComponent } from "app/modules/admin/shared/components/fo-file-url-upload/fo-file-url-upload.component";
import { FoReturnComponent } from "app/modules/admin/shared/components/fo-return/fo-return.component";
import { FoTitleAreaComponent } from "app/modules/admin/shared/components/fo-title-area/fo-title-area.component";
import { FoTitleModuleComponent } from "app/modules/admin/shared/components/fo-title-module/fo-title-module.component";
import { TranslateMessageForm } from "app/core/pipes/error-message-form.pipe";
import { DirectoryBusinessComponent } from "app/modules/admin/business-management/components/directory-business/directory-business.component";
import { PermissionButtonDirective } from "app/shared/directives/permission-button.directive";
import { FormInputModule } from "app/shared/modules/form-input.module";
import { NgxMaskDirective } from "ngx-mask";
import { FoContCardComponent } from "app/modules/admin/shared/components/fo-cont-card/fo-cont-card.component";
import { FoButtonDialogComponent } from "app/modules/admin/shared/components/fo-button-dialog/fo-button-dialog.component";
import { ArchivesBussinessComponent } from "app/modules/admin/business-management/components/archives-bussiness/archives-bussiness.component";
export const FORM_BUSINESS_IMPORTS = [
    CommonModule, 
    FoReturnComponent, 
    FoContCardComponent, 
    FoTitleModuleComponent, 
    MatCheckboxModule, 
    FormInputModule, 
    MatTabsModule, 
    FoFileUrlUploadComponent, 
    DirectoryBusinessComponent,
    FoTitleAreaComponent,
    FoButtonDialogComponent,
    TranslateMessageForm,
    NgxMaskDirective,
    PermissionButtonDirective,
    ArchivesBussinessComponent
];