import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { FoContCardComponent } from '@components/fo-cont-card/fo-cont-card.component';
import { FoFileUrlUploadComponent } from '@components/fo-file-url-upload/fo-file-url-upload.component';
import { FoTitleAreaComponent } from '@components/fo-title-area/fo-title-area.component';
import { DirectoryBusinessComponent } from 'app/modules/admin/business-management/business-form/form-register-business/directory-business/directory-business.component';
import { FormInputModule } from 'app/shared/modules/form-input.module';


export const FORM_REGISTER_BUSINESS_IMPORTS = [
    CommonModule,
    FoContCardComponent,
    MatTabsModule,
    FormInputModule,
    FoTitleAreaComponent,
    MatCheckboxModule,
    FoFileUrlUploadComponent,
    DirectoryBusinessComponent
];
