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
import { TraceabilitySystemRoutingModule } from './traceability-system-routing.module';
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
import { SystemLogsComponent } from './components/system-logs/system-logs.component';
import { TraceabilitySystemComponent } from './components/traceability-system/traceability-system.component';
import { AuditLogsComponent } from './components/audit-logs/audit-logs.component';
@NgModule({
  declarations: [
            TraceabilitySystemComponent,
            SystemLogsComponent,
            AuditLogsComponent
          ],
  imports: [CommonModule, 
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
            TraceabilitySystemRoutingModule
          ]
})
export default class TraceabilitySystemModule { }