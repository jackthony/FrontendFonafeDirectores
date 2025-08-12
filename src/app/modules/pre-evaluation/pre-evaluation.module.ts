/*******************************************************************************************************
 * Nombre del archivo:  traceability-system.module.ts
 * Descripción:          Módulo de sistema de trazabilidad que agrupa los componentes necesarios para la visualización
 *                       y gestión de registros del sistema, incluyendo registros de auditoría y logs del sistema.
 *                       Este módulo incluye componentes de interfaz de usuario como tarjetas, botones, formularios 
 *                       y permite interactuar con funcionalidades específicas del sistema de trazabilidad.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del módulo de trazabilidad con componentes de logs y auditoría.
 *******************************************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoReturnComponent } from 'app/shared/components/fo-return/fo-return.component';
import { FoTitleModuleComponent } from 'app/shared/components/fo-title-module/fo-title-module.component';
import { FoContCardComponent } from 'app/shared/components/fo-cont-card/fo-cont-card.component';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { FoButtonDialogComponent } from 'app/shared/components/fo-button-dialog/fo-button-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FoTitleAreaComponent } from 'app/shared/components/fo-title-area/fo-title-area.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { FoButtonComponent } from 'app/shared/components/fo-button/fo-button.component';
import { PreEvaluationSystemRoutingModule } from './pre-evaluation-routing.module';
import { PreEvaluationComponent } from './components/pre-evaluation/pre-evaluation.component';
import { FoTableComponent } from 'app/shared/components/fo-table/fo-table.component';
import { HomePreEvaluationComponent } from './components/pre-evaluation registration/home-pre-evaluation/home-pre-evaluation.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TabApplicationComponent } from './components/pre-evaluation registration/tab-application/tab-application.component';
import { TabCommentsComponent } from './components/pre-evaluation registration/tab-comments/tab-comments.component';
import { InfoCandidatesComponent } from './components/pre-evaluation registration/info-candidates/info-candidates.component';
import { FoFileUrlUploadComponent } from 'app/shared/components/fo-file-url-upload/fo-file-url-upload.component';
import { TabDocumentsComponent } from './components/pre-evaluation registration/tab-documents/tab-documents.component';
import { TabGeneralDataComponent } from './components/pre-evaluation registration/tab-general-data/tab-general-data.component';
import { MatCheckbox } from "@angular/material/checkbox";
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  declarations: [
          PreEvaluationComponent,
          HomePreEvaluationComponent,
          TabApplicationComponent,
          TabCommentsComponent,
          InfoCandidatesComponent,
          TabDocumentsComponent,
          TabGeneralDataComponent
          ],
  imports: [CommonModule,
    PreEvaluationSystemRoutingModule,
    FoButtonComponent,
    FoReturnComponent,
    FoTitleModuleComponent,
    FoContCardComponent,
    MatDatepickerModule,
    FormInputModule,
    MatDatepickerModule,
    FoTitleAreaComponent,
    MatButtonModule,
    MatIconModule,
    FoButtonDialogComponent,
    TranslateMessageForm,
    FoTableComponent,
    MatTabsModule,
    MatRadioModule,
    FoFileUrlUploadComponent, MatCheckbox]
})
export default class PreEvaluationSystemModule { }