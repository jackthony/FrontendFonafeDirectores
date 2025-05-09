import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output, signal, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ButtonEnum } from 'app/core/enums/button.enum';

@Component({
  selector: 'fo-button-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './fo-button-dialog.component.html',
  styleUrl: './fo-button-dialog.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FoButtonDialogComponent {
  @Output() eventActionClick: EventEmitter<void> = new EventEmitter<void>();
	textBtn = input.required<string>();
	typeButton = input<number>(ButtonEnum.SEND);
	buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
  btnDisabled = input<boolean>(false);

  actionClick(): void {
    this.eventActionClick.emit();
  }
}
