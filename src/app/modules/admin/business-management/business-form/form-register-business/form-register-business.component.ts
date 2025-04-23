import { Component, signal } from '@angular/core';
import { FORM_REGISTER_BUSINESS_IMPORTS } from 'app/shared/imports/business-management/form-register-business.imports';
@Component({
  selector: 'app-form-register-business',
  standalone: true,
  imports: [...FORM_REGISTER_BUSINESS_IMPORTS],
  templateUrl: './form-register-business.component.html',
  styleUrl: './form-register-business.component.scss'
})
export class FormRegisterBusinessComponent {
    titleFinancial = signal<string>('Infomación financiera');
}
