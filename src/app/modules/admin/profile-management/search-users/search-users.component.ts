import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { FoButtonComponent } from '@components/fo-button/fo-button.component';
import { FoContCardComponent } from '@components/fo-cont-card/fo-cont-card.component';
import { FoSearchComponent } from '@components/fo-search/fo-search.component';

@Component({
  selector: 'app-search-users',
  standalone: true,
  imports: [CommonModule, FoContCardComponent, FoSearchComponent, FoButtonComponent],
  templateUrl: './search-users.component.html',
  styleUrl: './search-users.component.scss'
})
export class SearchUsersComponent {
    placeTextSearch = signal<string>('Busca por nombre de usuario');
	iconBtnSearch = signal<string>('mat_outline:add_circle_outline');
	textBtnSearch = signal<string>('Agregar usuario');
}
