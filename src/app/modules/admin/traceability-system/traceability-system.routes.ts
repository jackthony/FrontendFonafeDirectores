/*******************************************************************************************************
 * Archivo de rutas:      requests-routing.ts
 * Descripción:           Define las rutas del módulo de solicitudes nuevas. Establece la ruta raíz
 *                        para mostrar el componente principal asociado al módulo.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 * Última modificación:   23/06/2025 por Daniel Alva
 * Cambios recientes:     - Configuración de ruta base para el componente NewRequestsComponent.
 *******************************************************************************************************/
import { Routes } from '@angular/router';
import { TraceabilitySystemComponent } from './components/traceability-system.component';

export default [
    {
        path     : '',
        component: TraceabilitySystemComponent,
    },
] as Routes;
