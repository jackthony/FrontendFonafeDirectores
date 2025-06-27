/*******************************************************************************************************
 * Nombre del archivo:  home-imports.ts
 * Descripción:          Conjunto de imports utilizados en el módulo de inicio del sistema (Home Module).
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 *******************************************************************************************************/
import { CommonModule } from "@angular/common";
import { FoTableComponent } from "app/modules/admin/shared/components/fo-table/fo-table.component";
import { SubTitleCardComponent } from "app/modules/admin/shared/components/sub-title-card/sub-title-card.component";
import { BannerInformativeComponent } from "app/modules/admin/home/components/banner-informative/banner-informative.component";
import { MyProcessesComponent } from "app/modules/admin/home/components/my-processes/my-processes.component";
export const HOME_IMPORTS = [
  CommonModule, 
  BannerInformativeComponent, 
  SubTitleCardComponent, 
  FoTableComponent,
  MyProcessesComponent
];