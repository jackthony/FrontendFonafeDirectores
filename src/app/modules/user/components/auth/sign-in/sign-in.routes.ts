/*************************************************************************************
   * Nombre del archivo:  sign-in.routes.ts
   * Descripción:         Configuración de rutas para el módulo de inicio de sesión (sign-in).
   * Autor:               Daniel Alva
   * Fecha de creación:   01/06/2025
   * Última modificación: 23/06/2025 por Daniel Alva
   * Cambios recientes:   Creación inicial del archivo de rutas de sign-in.
   **************************************************************************************/
import { Routes } from '@angular/router';
import { AuthSignInComponent } from 'app/modules/user/components/auth/sign-in/sign-in.component';
export default [
    {
        path: '',
        component: AuthSignInComponent,
    },
] as Routes;