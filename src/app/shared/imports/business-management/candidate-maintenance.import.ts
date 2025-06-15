import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { FoButtonComponent } from '@components/fo-button/fo-button.component';
import { FoContCardComponent } from '@components/fo-cont-card/fo-cont-card.component';
import { FoReturnComponent } from '@components/fo-return/fo-return.component';
import { FoSearchForButtonComponent } from '@components/fo-search-for-button/fo-search-for-button.component';
import { FoSearchComponent } from '@components/fo-search/fo-search.component';
import { FoTableComponent } from '@components/fo-table/fo-table.component';
import { FoTitleModuleComponent } from '@components/fo-title-module/fo-title-module.component';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { FormInputModule } from 'app/shared/modules/form-input.module';

export const CANDIDATE_MAINTENANCE_IMPORTS = [
    CommonModule,
    FoReturnComponent,
    FoContCardComponent,
    FoTitleModuleComponent,
    FoTableComponent,
    FoSearchForButtonComponent,
    MatCheckboxModule, 
    FormInputModule, 
    MatTabsModule,
    FoButtonComponent,
    FoSearchComponent,
    TranslateMessageForm,
];
