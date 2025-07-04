/*************************************************************************************
   * Nombre del archivo:  reset-password.routes.ts
   * Descripción:         Configuración de rutas para el módulo de restablecimiento de contraseña.
   * Autor:               Daniel Alva
   * Fecha de creación:   01/06/2025
   * Última modificación: 23/06/2025 por Daniel Alva
   * Cambios recientes:   Creación inicial del archivo de rutas para reset-password.
   **************************************************************************************/
import { Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password.component';
export default [
    {
        path: '',
        component: ChangePasswordComponent,
    },
] as Routes;
