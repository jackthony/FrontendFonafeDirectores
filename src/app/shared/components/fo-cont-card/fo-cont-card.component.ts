/*******************************************************************************************************
 * Nombre del archivo:  fo-cont-card.component.ts
 * Descripción:          Componente reutilizable que representa una tarjeta de contenido con título y
 *                       un subtítulo opcional, permitiendo configurar el padding de la tarjeta.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del componente FoContCard con soporte para título
 *                         y padding configurable.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SubTitleCardComponent } from 'app/shared/components/sub-title-card/sub-title-card.component';
@Component({
  selector: 'fo-cont-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, SubTitleCardComponent],
  templateUrl: './fo-cont-card.component.html',
  styleUrl: './fo-cont-card.component.scss'
})
export class FoContCardComponent {
    title = input<string>('');
    enabledPadding = input<boolean>(true);
}