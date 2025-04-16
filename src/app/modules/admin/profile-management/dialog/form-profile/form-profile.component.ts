import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FoButtonDialogComponent } from '@components/fo-button-dialog/fo-button-dialog.component';
import { ButtonEnum } from 'app/core/enums/button.enum';

@Component({
  selector: 'app-form-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormInputModule, MatDatepickerModule, FoButtonDialogComponent],
  templateUrl: './form-profile.component.html',
  styleUrl: './form-profile.component.scss'
})
export class FormProfileComponent {
  test = new FormControl('', Validators.required)
  buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
}
