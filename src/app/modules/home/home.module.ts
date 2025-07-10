/*******************************************************************************************************
 * Nombre del archivo:  home.module.ts
 * Descripción:          Módulo principal de la página de inicio, que agrupa los componentes necesarios para 
 *                       mostrar la información de la página inicial del sistema, incluyendo banners informativos, 
 *                       procesos del usuario y tablas con información relevante.
 *                       Este módulo proporciona una estructura modular para la página de inicio con sus 
 *                       respectivos componentes y dependencias.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del módulo de inicio con componentes informativos y de procesos.
 *******************************************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { BannerInformativeComponent } from './components/banner-informative/banner-informative.component';
import { SubTitleCardComponent } from '../../shared/components/sub-title-card/sub-title-card.component';
import { FoTableComponent } from '../../shared/components/fo-table/fo-table.component';
import { MyProcessesComponent } from './components/my-processes/my-processes.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PermissionButtonDirective } from 'app/shared/directives/permission-button.directive';
import { CardProcessComponent } from './components/card-process/card-process.component';
import { HomeComponent } from './components/home/home.component';
import { FoContCardComponent } from 'app/shared/components/fo-cont-card/fo-cont-card.component';
@NgModule({
  declarations: [
    BannerInformativeComponent,
    CardProcessComponent,
    MyProcessesComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SubTitleCardComponent, 
    FoTableComponent,
    MatIconModule, 
    MatButtonModule, 
    PermissionButtonDirective,
    FoContCardComponent,
  ]
})
export default class HomeModule { }