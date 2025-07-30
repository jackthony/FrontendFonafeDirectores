/*******************************************************************************************************
 * Nombre del archivo:  fo-title-module.component.ts
 * Descripción:          Componente reutilizable que muestra un título con la opción de aplicar un estilo en negrita.
 *                       Permite personalizar el texto del título y su estilo.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del componente con opciones de texto y estilo.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'fo-title-module',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fo-title-module.component.html',
  styleUrl: './fo-title-module.component.scss'
})
export class FoTitleModuleComponent {
    text = input.required<string>();

    titleBold = input<boolean>(false);
}
