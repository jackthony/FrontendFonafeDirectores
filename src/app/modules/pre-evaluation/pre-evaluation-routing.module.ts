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
import { PreEvaluationComponent } from './components/pre-evaluation/pre-evaluation.component';
import { permissionGuard } from '../user/guards/permission.guard';
import { HomePreEvaluationComponent } from './components/pre-evaluation registration/home-pre-evaluation/home-pre-evaluation.component';
import { businessResolver } from '../business/infrastructure/business/resolvers/business.resolver';
import { GenerateRequestComponent } from './components/pre-evaluation registration/generate-request/generate-request.component';

const routes: Routes = [
        {
            path: '',
            component: PreEvaluationComponent,
/*             canActivate: [permissionGuard],
            data: { module: 'nuevas-solicitudes', action: 'Ver' } */
        },
        {
            path     : 'home-pre-evaluation',
            component: HomePreEvaluationComponent,
/*             canActivate: [permissionGuard], */
            resolve: {
                /* data: businessResolver */
            },
            data: { module: 'nuevas-solicitudes', action: 'Ver' }
        },
        {
            path: "nueva-solicitud/:id",
            component: GenerateRequestComponent,
            data: { module: 'nuevas-solicitudes', action: 'Ver' }
        }
        ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PreEvaluationSystemRoutingModule { }