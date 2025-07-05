/*************************************************************************************
   * Nombre del archivo:  forgot-password.routes.ts
   * Descripción:         Configuración de rutas para el módulo de recuperación de contraseña.
   * Autor:               Daniel Alva
   * Fecha de creación:   01/06/2025
   * Última modificación: 23/06/2025 por Daniel Alva
   * Cambios recientes:   Creación inicial del archivo de rutas para forgot-password.
   **************************************************************************************/
import { Routes } from '@angular/router';
import { AuthForgotPasswordComponent } from 'app/modules/user/auth/components/forgot-password/forgot-password.component';
export default [
    {
        path: '',
        component: AuthForgotPasswordComponent,
    },
] as Routes;