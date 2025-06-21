import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [],
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatSelectModule],
  exports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatSelectModule]
})
export class FormInputModule { }