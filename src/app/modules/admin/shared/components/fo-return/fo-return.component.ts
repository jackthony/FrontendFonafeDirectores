import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'fo-return',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    templateUrl: './fo-return.component.html',
    styleUrl: './fo-return.component.scss',
})
export class FoReturnComponent {
    text = input<string>('Regresar al inicio');

    @Output() eventActionClick: EventEmitter<void> = new EventEmitter<void>();

    toClickOption(): void {
        this.eventActionClick.emit();
    }
}
