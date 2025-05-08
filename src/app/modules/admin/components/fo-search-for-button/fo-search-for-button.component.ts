import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { FoButtonComponent } from '@components/fo-button/fo-button.component';
import { FoContCardComponent } from '@components/fo-cont-card/fo-cont-card.component';
import { FoSearchComponent } from '@components/fo-search/fo-search.component';

@Component({
    selector: 'fo-search-for-button',
    standalone: true,
    imports: [
        CommonModule,
        FoContCardComponent,
        FoSearchComponent,
        FoButtonComponent,
    ],
    templateUrl: './fo-search-for-button.component.html',
    styleUrl: './fo-search-for-button.component.scss',
})
export class FoSearchForButtonComponent {
    placeTextSearch = input<string>('Busca por nombre de usuario');
    iconBtnSearch = input<string>('mat_outline:add_circle_outline');
    textBtnSearch = input<string>('Agregar usuario');

    @Output() eventNewElement: EventEmitter<void> = new EventEmitter<void>();
    @Output() eventClickSearch: EventEmitter<string> =
        new EventEmitter<string>();

    addUser(): void {
        this.eventNewElement.emit();
    }

    clickSearch(event: string): void {
        
        this.eventClickSearch.emit(event);
    }
}
