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
	process = input.required<ListOfProcesses>();
	viewListOptions = signal<boolean>(false);

	@Output() eventActionClick: EventEmitter<string> = new EventEmitter<string>();

	toClickOption(url: string): void {
		if(!url) {
			this.listOptions();
			return;
		} 
		this.eventActionClick.emit(url);
	}

	listOptions(): void {
		this.viewListOptions.set(!this.viewListOptions());
	}



}
