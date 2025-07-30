/*******************************************************************************************************
 * Nombre del archivo:  shared-routing.module.ts
 * Descripción:          Módulo de enrutamiento compartido que define las rutas para componentes de error
 *                       (404 y 500) y permite su uso en otros módulos de la aplicación.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Definición inicial de rutas para Error404Component y Error500Component.
 *******************************************************************************************************/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './components/error-404/error-404.component';
import { Error500Component } from './components/error-500/error-500.component';
/**
 * Módulo de enrutamiento compartido que declara y exporta las rutas 
 * relacionadas con las páginas de error de la aplicación.
 */
const routes: Routes = [
  	{
		path: 'error-404',
		component: Error404Component
	},
	{
		path: 'error-500',
		component: Error500Component
	}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }