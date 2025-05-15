import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FoContCardComponent } from '@components/fo-cont-card/fo-cont-card.component';
import { FoReturnComponent } from '@components/fo-return/fo-return.component';
import { FoTitleModuleComponent } from '@components/fo-title-module/fo-title-module.component';

@Component({
  selector: 'app-new-requests',
  standalone: true,
  imports: [CommonModule, FoReturnComponent, FoTitleModuleComponent, FoContCardComponent],
  templateUrl: './new-requests.component.html',
  styleUrl: './new-requests.component.scss'
})
export class NewRequestsComponent {

	private readonly _router = inject(Router);

	returnInit(): void {
		this._router.navigate(['home']);
	}
}
