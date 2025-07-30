/*******************************************************************************************************
 * Nombre del archivo:  home-routing.module.ts
 * Descripción:          Módulo de enrutamiento para la página de inicio, que define las rutas específicas 
 *                       para la vista principal del sistema. Este módulo asegura que la ruta principal 
 *                       de la página de inicio cargue el componente adecuado (`HomeComponent`).
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del enrutamiento para la página de inicio.
 *******************************************************************************************************/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }