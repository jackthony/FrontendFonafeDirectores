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
import NewRequestsComponent from './components/new-requests/new-requests.component';
export default [
    {
        path     : '',
        component: NewRequestsComponent,
    },
] as Routes;
