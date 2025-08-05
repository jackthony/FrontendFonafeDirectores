import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { ButtonEnum } from 'app/shared/enums/button.enum';

@Component({
  selector: 'app-fo-button-grid',
  standalone: true,
  imports: [],
  templateUrl: './fo-button-grid.component.html',
  styleUrl: './fo-button-grid.component.scss'
})
export class FoButtonGridComponent {
    typeButton = input<number>(ButtonEnum.SEND);
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
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

