/*******************************************************************************************************
 * Nombre del componente: CardProcessComponent
 * Descripción:           Componente visual para representar una tarjeta de proceso dentro del módulo 
 *                        "Mis procesos". Muestra información del proceso y permite navegar a sus 
 *                        acciones mediante un menú expandible. Emite eventos al componente padre.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 * Última modificación:   23/06/2025 por Daniel Alva
 * Cambios recientes:     - Implementación de evento para navegación.
 *                        - Integración de señal para mostrar/ocultar menú de acciones.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PermissionButtonDirective } from 'app/shared/directives/permission-button.directive';
import { ListOfProcesses } from 'app/shared/interfaces/IListOfProcesses';
@Component({
  selector: 'app-card-process',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, PermissionButtonDirective],
  templateUrl: './card-process.component.html',
  styleUrl: './card-process.component.scss'
})
export class CardProcessComponent {
	process = input.required<ListOfProcesses>();
	viewListOptions = signal<boolean>(false);
	@Output() eventActionClick: EventEmitter<string> = new EventEmitter<string>();
	/**
   * Método ejecutado cuando el usuario selecciona una opción del proceso.
   * Si no se proporciona una URL, alterna la visibilidad del listado de acciones.
   * @param url Ruta a la que se debe navegar. Si es nula o vacía, se despliega el menú.
   */
	toClickOption(url: string): void {
		if(!url) {
			this.listOptions();
			return;
		} 
		this.eventActionClick.emit(url);
	}
	/**
   * Método que alterna el estado de la variable `viewListOptions` para mostrar u ocultar
   * el menú de acciones disponibles del proceso.
   */
	listOptions(): void {
		this.viewListOptions.set(!this.viewListOptions());
	}
}