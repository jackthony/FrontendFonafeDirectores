import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PermissionButtonDirective } from 'app/shared/directives/permission-button.directive';

@Component({
  selector: 'app-card-process',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, PermissionButtonDirective],
  templateUrl: './card-process.component.html',
  styleUrl: './card-process.component.scss'
})
export class CardProcessComponent {
    icon = input.required<string>();
	text = input.required<string>();
	module = input.required<string>();

	@Output() eventActionClick: EventEmitter<void> = new EventEmitter<void>();

	toClickOption(): void {
		this.eventActionClick.emit();
	}

}
