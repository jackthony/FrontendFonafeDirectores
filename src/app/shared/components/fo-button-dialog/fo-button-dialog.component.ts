/*******************************************************************************************************
 * Nombre del archivo:  fo-button-dialog.component.ts
 * Descripción:          Componente reutilizable de un botón personalizado en un diálogo, que maneja
 *                       eventos de clic, tipo de botón y estado deshabilitado, permitiendo personalizar
 *                       el texto del botón y su acción asociada.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del componente FoButtonDialog con manejo de botones
 *                         y eventos en un diálogo.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ButtonEnum } from 'app/shared/enums/button.enum';
@Component({
  selector: 'fo-button-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './fo-button-dialog.component.html',
  styleUrl: './fo-button-dialog.component.scss',
})
export class FoButtonDialogComponent {
  @Output() eventActionClick: EventEmitter<void> = new EventEmitter<void>();
	textBtn = input.required<string>();
	typeButton = input<number>(ButtonEnum.SEND);
	buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
  btnDisabled = input<boolean>(false);
  actionClick(): void {
    this.eventActionClick.emit();
  }
}