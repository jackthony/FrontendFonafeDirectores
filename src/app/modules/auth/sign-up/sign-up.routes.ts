/*******************************************************************************************************
 * Nombre del archivo:  auth-sign-up.routing.ts
 * Descripción:         Configuración de rutas para el módulo de registro de usuarios (sign-up).
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Inclusión de cabecera técnica y estructura estándar de rutas para Angular.
 *******************************************************************************************************/
import { Routes } from '@angular/router';
import { AuthSignUpComponent } from 'app/modules/auth/sign-up/sign-up.component';
export default [
    {
        path: '',
        component: AuthSignUpComponent,
    },
] as Routes;