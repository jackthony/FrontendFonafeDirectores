import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { FoContCardComponent } from '@components/fo-cont-card/fo-cont-card.component';
import { FoReturnComponent } from '@components/fo-return/fo-return.component';
import { FoTitleModuleComponent } from '@components/fo-title-module/fo-title-module.component';
import { FormRegisterBusinessComponent } from './form-register-business/form-register-business.component';

@Component({
  selector: 'app-business-form',
  standalone: true,
  imports: [CommonModule, FoReturnComponent, FoContCardComponent, FoTitleModuleComponent, FormRegisterBusinessComponent],
  templateUrl: './business-form.component.html',
  styleUrl: './business-form.component.scss'
})
export class BusinessFormComponent {
	textReturn = signal<string>('Regresar al buscador');
	titleModule = signal<string>('Nombre de la empresa');

	titleBold = signal<boolean>(true);
}
