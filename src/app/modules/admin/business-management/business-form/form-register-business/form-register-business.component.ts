import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FoContCardComponent } from '@components/fo-cont-card/fo-cont-card.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-form-register-business',
  standalone: true,
  imports: [CommonModule, FoContCardComponent, MatTabsModule],
  templateUrl: './form-register-business.component.html',
  styleUrl: './form-register-business.component.scss'
})
export class FormRegisterBusinessComponent {

}
