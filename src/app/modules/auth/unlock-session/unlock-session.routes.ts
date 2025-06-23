/*******************************************************************************************************
 * Nombre del archivo:  auth-unlock-session.routes.ts
 * Descripción:         Define la ruta para el componente de desbloqueo de sesión dentro del módulo de autenticación.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Inclusión del encabezado técnico estandarizado.
 *******************************************************************************************************/
import { Routes } from '@angular/router';
import { AuthUnlockSessionComponent } from 'app/modules/auth/unlock-session/unlock-session.component';
export default [
    {
        path: '',
        component: AuthUnlockSessionComponent,
    },
] as Routes;