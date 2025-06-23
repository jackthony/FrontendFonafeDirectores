/*******************************************************************************************************
 * Nombre del archivo:  fo-table-imports.ts
 * Descripción:          Conjunto de módulos, componentes y pipes utilizados en la tabla FoTableComponent.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 *******************************************************************************************************/
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FoPillComponent } from "app/modules/admin/shared/components/fo-pill/fo-pill.component";
import { BooleanPipe } from "app/core/pipes/boolean.pipe";
import { EmptyPipe } from "app/core/pipes/empty.pipe";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
export const FO_TABLE_IMPORTS = [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    EmptyPipe,
    BooleanPipe,
    MatTooltipModule,
    MatProgressBarModule,
    NgxSkeletonLoaderModule,
    MatProgressSpinnerModule,
    FoPillComponent
  ];