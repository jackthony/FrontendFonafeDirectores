import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogConfirmation } from './models/dialog-confirmation.interface';
import { ButtonEnum } from 'app/core/enums/button.enum';
import { FoButtonDialogComponent } from '@components/fo-button-dialog/fo-button-dialog.component';

@Component({
    selector: 'fo-dialog-confirmation',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule, FoButtonDialogComponent],
    templateUrl: './fo-dialog-confirmation.component.html',
    styleUrl: './fo-dialog-confirmation.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class FoDialogConfirmationComponent {
    data: DialogConfirmation = inject(MAT_DIALOG_DATA);

	buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
}
