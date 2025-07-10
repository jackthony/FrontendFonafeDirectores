/*******************************************************************************************************
 * Nombre del archivo:  traceability-system-routing.module.ts
 * Descripción:          Módulo de enrutamiento que define las rutas para el sistema de trazabilidad, permitiendo
 *                       la navegación entre los diferentes componentes relacionados con la gestión de logs de 
 *                       sistemas y auditoría.
 *                       Este módulo gestiona las rutas para las vistas de trazabilidad, auditoría y logs del sistema.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del módulo de enrutamiento para el sistema de trazabilidad.
 *******************************************************************************************************/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TraceabilitySystemComponent } from './components/traceability-system/traceability-system.component';
import { AuditLogsComponent } from './components/audit-logs/audit-logs.component';
import { SystemLogsComponent } from './components/system-logs/system-logs.component';
const routes: Routes = [
    {
        path: 'trazabilidad',
        component: TraceabilitySystemComponent,
    },
    {
        path: 'auditoria',
        component: AuditLogsComponent
    },
    {
        path: 'sistemas',
        component: SystemLogsComponent
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TraceabilitySystemRoutingModule { }