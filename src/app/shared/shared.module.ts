/*******************************************************************************************************
 * Nombre del archivo:  shared.module.ts
 * Descripción:          Módulo compartido que agrupa los componentes de error (404 y 500) y 
 *                       configura el enrutamiento relacionado. Permite su reutilización en 
 *                       otras partes de la aplicación.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Creación de los componentes Error404Component y Error500Component.
 *******************************************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { Error500Component } from './components/error-500/error-500.component';
import { Error404Component } from './components/error-404/error-404.component';
import { RouterLink } from '@angular/router';
/**
 * Módulo compartido que declara los componentes de error (404 y 500),
 * importa el módulo de enrutamiento asociado y habilita la navegación
 * entre las páginas de error a través de RouterLink.
 */
@NgModule({
  declarations: [
    Error404Component,
    Error500Component
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    RouterLink
  ]
})
export default class SharedModule { }