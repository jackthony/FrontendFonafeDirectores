import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { FoButtonDialogComponent } from '@components/fo-button-dialog/fo-button-dialog.component';
import { FoTitleAreaComponent } from '@components/fo-title-area/fo-title-area.component';
import { ButtonEnum } from 'app/core/enums/button.enum';
import { FormInputModule } from 'app/shared/modules/form-input.module';

@Component({
  selector: 'app-form-directory',
  standalone: true,
  imports: [CommonModule, FormInputModule, MatDatepickerModule, FoTitleAreaComponent, MatButtonModule, MatIconModule, FoButtonDialogComponent],
  templateUrl: './form-directory.component.html',
  styleUrl: './form-directory.component.scss'
})
export class FormDirectoryComponent {
  	titleDirectory = signal<string>('Datos directorio');
  	titlePersonal = signal<string>('Datos personales');
	buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
}
