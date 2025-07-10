/*******************************************************************************************************
 * Nombre del archivo:  fo-search-for-button.component.ts
 * Descripción:          Componente que combina la funcionalidad de búsqueda con filtros y un botón de acción 
 *                       (como agregar un nuevo usuario). Incluye un campo de búsqueda, un botón para agregar 
 *                       usuarios, y un filtro basado en el estado activo/inactivo. Emite eventos asociados a 
 *                       la búsqueda, filtro y acción de agregar elementos.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del componente con búsqueda, filtros y manejo de botones.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, EventEmitter, input, OnInit, Output, signal, ViewEncapsulation } from '@angular/core';
import { FoSearchComponent } from 'app/shared/components/fo-search/fo-search.component';
import { PermissionButtonDirective } from 'app/shared/directives/permission-button.directive';
import { FoContCardComponent } from '../fo-cont-card/fo-cont-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FoButtonComponent } from '../fo-button/fo-button.component';
@Component({
    selector: 'fo-search-for-button',
    standalone: true,
    imports: [
        CommonModule,
        FoContCardComponent,
        FoSearchComponent,
        FoButtonComponent,
        PermissionButtonDirective,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatCheckboxModule,
        FormsModule,
        MatTooltipModule
    ],
    templateUrl: './fo-search-for-button.component.html',
    styleUrl: './fo-search-for-button.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class FoSearchForButtonComponent implements OnInit {
    placeTextSearch = input<string>('Busca por nombre de usuario');
    iconBtnSearch = input<string>('mat_outline:add_circle_outline');
    textBtnSearch = input<string>('Agregar usuario');
    disableDirective = input(false, { transform: booleanAttribute });
    delaySearch = input<number>(0);
    isActive: boolean = true;
    isInactive: boolean = false;
    filterValue = signal<boolean | null>(null);
    viewFilterState = input(false, { transform: booleanAttribute });
    @Output() eventNewElement: EventEmitter<void> = new EventEmitter<void>();
    @Output() eventSearch: EventEmitter<string> = new EventEmitter<string>();
    @Output() eventFilterState: EventEmitter<boolean | null> = new EventEmitter<boolean | null>();
    @Output() eventBtnSearch: EventEmitter<void> = new EventEmitter<void>();
    ngOnInit(): void {
        this.onCheckboxChange();
    }
    addUser(): void {
        this.eventNewElement.emit();
    }
    getDataSearch(event: string): void {
        this.eventSearch.emit(event);
    }
    onCheckboxChange() {
        if (this.isActive && this.isInactive) {
          this.filterValue.set(null);
        } else if (this.isActive) {
          this.filterValue.set(true);
        } else if (this.isInactive) {
          this.filterValue.set(false);
        } else {
          this.filterValue.set(null);
        }
        
        this.eventFilterState.emit(this.filterValue());
    }
    onSearch(): void {
        this.eventBtnSearch.emit();
    }
}