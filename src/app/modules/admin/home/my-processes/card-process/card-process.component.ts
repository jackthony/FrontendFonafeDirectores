import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PermissionButtonDirective } from 'app/shared/directives/permission-button.directive';
import { ListOfProcesses, ListOptionsProcesses } from 'app/shared/interfaces/IListOfProcesses';

@Component({
  selector: 'app-card-process',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, PermissionButtonDirective],
  templateUrl: './card-process.component.html',
  styleUrl: './card-process.component.scss'
})
export class CardProcessComponent {
	// Recibe un proceso como propiedad de entrada. 'required' asegura que el valor sea obligatorio.
	process = input.required<ListOfProcesses>();

	// Signal reactivo que almacena el estado de si se debe mostrar las opciones de la lista
	viewListOptions = signal<boolean>(false);

	// Output que emite un evento cuando se hace clic en una opción, pasando la URL como dato
	@Output() eventActionClick: EventEmitter<string> = new EventEmitter<string>();

	// Método que maneja el clic en una opción de proceso.
	// Si no se pasa URL, alterna la visibilidad de la lista de opciones
	toClickOption(url: string): void {
		// Si no hay URL, muestra/oculta las opciones
		if(!url) {
			this.listOptions();
			return;
		} 
		// Si hay URL, emite el evento con la URL como parámetro
		this.eventActionClick.emit(url);
	}

	// Método para alternar la visibilidad de la lista de opciones
	listOptions(): void {
		// Cambia el estado de 'viewListOptions' de verdadero a falso, o viceversa
		this.viewListOptions.set(!this.viewListOptions());
	}
}
