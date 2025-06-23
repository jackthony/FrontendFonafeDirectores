/*******************************************************************************************************
 * Nombre del archivo:  business-management-imports.ts
 * Descripción:          Este módulo centraliza las importaciones comunes utilizadas en los componentes
 *                       relacionados a la gestión de negocios. Agrupa módulos Angular, Material y 
 *                       componentes personalizados que permiten estructurar vistas de mantenimiento,
 *                       búsqueda y administración de entidades de negocio.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FoButtonComponent } from 'app/modules/admin/shared/components/fo-button/fo-button.component';
import { FoContCardComponent } from 'app/modules/admin/shared/components/fo-cont-card/fo-cont-card.component';
import { FoReturnComponent } from 'app/modules/admin/shared/components/fo-return/fo-return.component';
import { FoSearchForButtonComponent } from 'app/modules/admin/shared/components/fo-search-for-button/fo-search-for-button.component';
import { FoTableComponent } from 'app/modules/admin/shared/components/fo-table/fo-table.component';
import { FoTitleModuleComponent } from 'app/modules/admin/shared/components/fo-title-module/fo-title-module.component';
export const BUSINESS_MANAGEMENT_IMPORTS = [
    CommonModule,
    FoReturnComponent,
    FoContCardComponent,
    FoTitleModuleComponent,
    FoTableComponent,
    FoSearchForButtonComponent,
    FoButtonComponent,
    MatButtonModule, 
    MatMenuModule, 
    MatIconModule
];