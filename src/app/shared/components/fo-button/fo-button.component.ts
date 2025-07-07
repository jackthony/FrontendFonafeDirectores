import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output, signal, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'fo-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './fo-button.component.html',
  styleUrl: './fo-button.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FoButtonComponent {
    disabledBtn = input<boolean>(false);
	nameForm = input<string>(null);
	icon = input<string>(null);
	text = input<string>('');
  type = input<string>('button');

	@Output() eventAction: EventEmitter<void> = new EventEmitter();

	emitAction(): void {
		this.eventAction.emit();
	}
}
