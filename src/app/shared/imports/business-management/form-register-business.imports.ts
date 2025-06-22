import { CommonModule } from "@angular/common";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
import { FoButtonDialogComponent } from "@components/fo-button-dialog/fo-button-dialog.component";
import { FoContCardComponent } from "@components/fo-cont-card/fo-cont-card.component";
import { FoFileUrlUploadComponent } from "@components/fo-file-url-upload/fo-file-url-upload.component";
import { FoReturnComponent } from "@components/fo-return/fo-return.component";
import { FoTitleAreaComponent } from "@components/fo-title-area/fo-title-area.component";
import { FoTitleModuleComponent } from "@components/fo-title-module/fo-title-module.component";
import { TranslateMessageForm } from "app/core/pipes/error-message-form.pipe";
import { DirectoryBusinessComponent } from "app/modules/admin/business-management/components/directory-business/directory-business.component";
import { PermissionButtonDirective } from "app/shared/directives/permission-button.directive";
import { FormInputModule } from "app/shared/modules/form-input.module";
import { NgxMaskDirective } from "ngx-mask";

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
];
