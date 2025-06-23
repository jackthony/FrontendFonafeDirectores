/*************************************************************************************
   * Nombre del archivo:  sign-out.routes.ts
   * Descripción:         Configuración de rutas para el módulo de cierre de sesión.
   * Autor:               Daniel Alva
   * Fecha de creación:   01/06/2025
   * Última modificación: 23/06/2025 por Daniel Alva
   * Cambios recientes:   Creación inicial del archivo de rutas de sign-out.
   **************************************************************************************/
import { Routes } from '@angular/router';
import { AuthSignOutComponent } from 'app/modules/auth/sign-out/sign-out.component';
export default [
    {
        path: '',
        component: AuthSignOutComponent,
    },
] as Routes;