/*******************************************************************************************************
 * Nombre del archivo:  fo-search.component.ts
 * Descripción:          Componente de búsqueda que gestiona el texto de búsqueda con un retraso configurable,
 *                       emitiendo eventos tanto al cambiar el texto como al hacer clic en el botón de búsqueda.
 *                       Utiliza un Subject y debounceTime para optimizar la emisión de eventos y mejorar la experiencia del usuario.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del componente de búsqueda con manejo de retraso (debounce) y eventos.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, OnDestroy, OnInit, Output, signal, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-fo-search',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './fo-search.component.html',
  styleUrl: './fo-search.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FoSearchComponent implements OnInit, OnDestroy {
	disabledBtn = input<boolean>(false);
	defaultValue = input<string>('');
	delaySearch = input<number>(0);
	searchTerms = new Subject<string>();
	placeText = input<string>('');
	#searchTerms = signal<string>('');
	private _unsubscribeAll: Subject<null> = new Subject<null>();
	@Output() eventChangeData = new EventEmitter<string>();
	@Output() eventClickSearch = new EventEmitter<string>();
	ngOnInit(): void {
		this.searchTerms
		.pipe(
			debounceTime(this.delaySearch()),
			takeUntil(this._unsubscribeAll)
		).subscribe(textSearch => {
			this.eventChangeData.emit(textSearch);
		});
	}
	search(text: string): void {
		this.searchTerms.next(text);
		this.#searchTerms.set(text);
		
	}
	searchValue(): void {
		this.eventClickSearch.emit(this.#searchTerms());
	}
	ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}