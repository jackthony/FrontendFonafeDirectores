/*******************************************************************************************************
 * Nombre del archivo:  candidate-maintenance-imports.ts
 * Descripción:          Importaciones comunes utilizadas en el módulo de mantenimiento de candidatos.
 *                       Este archivo centraliza los módulos, componentes y pipes necesarios para 
 *                       construir interfaces reutilizables de mantenimiento (ABM).
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { FoButtonComponent } from 'app/modules/admin/shared/components/fo-button/fo-button.component';
import { FoReturnComponent } from 'app/modules/admin/shared/components/fo-return/fo-return.component';
import { FoSearchForButtonComponent } from 'app/modules/admin/shared/components/fo-search-for-button/fo-search-for-button.component';
import { FoSearchComponent } from 'app/modules/admin/shared/components/fo-search/fo-search.component';
import { FoTableComponent } from 'app/modules/admin/shared/components/fo-table/fo-table.component';
import { FoTitleModuleComponent } from 'app/modules/admin/shared/components/fo-title-module/fo-title-module.component';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { FoContCardComponent } from 'app/modules/admin/shared/components/fo-cont-card/fo-cont-card.component';
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