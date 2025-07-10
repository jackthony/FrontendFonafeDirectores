/*******************************************************************************************************
 * Nombre del archivo:  fo-return.component.ts
 * Descripción:          Componente que representa un botón con un ícono de regreso. Al hacer clic en el 
 *                       botón, emite un evento para indicar que el usuario desea regresar al inicio o realizar 
 *                       alguna acción asociada.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del componente de botón de retorno con texto y evento de clic.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
    selector: 'fo-return',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    templateUrl: './fo-return.component.html',
    styleUrl: './fo-return.component.scss',
})
export class FoReturnComponent {
    text = input<string>('Regresar al inicio');
    @Output() eventActionClick: EventEmitter<void> = new EventEmitter<void>();
    toClickOption(): void {
        this.eventActionClick.emit();
    }
}