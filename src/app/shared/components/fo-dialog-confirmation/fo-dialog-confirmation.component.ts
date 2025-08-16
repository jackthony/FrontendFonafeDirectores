/*******************************************************************************************************
 * Nombre del archivo:  fo-dialog-confirmation.component.ts
 * Descripción:          Componente de diálogo de confirmación reutilizable, que muestra un mensaje 
 *                       de confirmación junto con opciones personalizadas de acción mediante botones.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del componente FoDialogConfirmation con manejo de
 *                         datos del diálogo y botones personalizados para la confirmación.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogConfirmation } from './models/dialog-confirmation.interface';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { FoButtonDialogComponent } from '../fo-button-dialog/fo-button-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
    selector: 'fo-dialog-confirmation',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule, FoButtonDialogComponent, MatTooltipModule],
    templateUrl: './fo-dialog-confirmation.component.html',
    styleUrl: './fo-dialog-confirmation.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class FoDialogConfirmationComponent {
    data: DialogConfirmation = inject(MAT_DIALOG_DATA);
	buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
}