/*************************************************************************************
   * Nombre del archivo:  confirmation-required.routes.ts
   * Descripción:         Configuración de rutas para el módulo de confirmación requerida
   *                      tras el registro de un nuevo usuario.
   * Autor:               Daniel Alva
   * Fecha de creación:   01/06/2025
   * Última modificación: 23/06/2025 por Daniel Alva
   * Cambios recientes:   Creación inicial del archivo de rutas de confirmation-required.
   **************************************************************************************/
import { Routes } from '@angular/router';
import { AuthConfirmationRequiredComponent } from 'app/modules/user/auth/components/confirmation-required/confirmation-required.component';
export default [
    {
        path: '',
        component: AuthConfirmationRequiredComponent,
    },
] as Routes;