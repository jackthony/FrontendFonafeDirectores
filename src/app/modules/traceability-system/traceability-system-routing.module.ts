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
