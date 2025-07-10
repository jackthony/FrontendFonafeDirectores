/*******************************************************************************************************
 * Nombre del archivo:  fo-button.component.ts
 * Descripción:          Componente reutilizable de un botón personalizado que permite
 *                       manejar eventos de clic y personalizar iconos, texto, y el estado
 *                       del botón (habilitado/deshabilitado).
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del componente FoButton con soporte para iconos, texto y eventos.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'fo-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './fo-button.component.html',
  styleUrl: './fo-button.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FoButtonComponent {
    disabledBtn = input<boolean>(false);
	nameForm = input<string>(null);
	icon = input<string>(null);
	text = input<string>('');
  type = input<string>('button');
	@Output() eventAction: EventEmitter<void> = new EventEmitter();
	emitAction(): void {
		this.eventAction.emit();
	}
}