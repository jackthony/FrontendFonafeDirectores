import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FoReturnComponent } from 'app/modules/admin/shared/components/fo-return/fo-return.component';
import { FoTitleModuleComponent } from 'app/modules/admin/shared/components/fo-title-module/fo-title-module.component';
import { FoContCardComponent } from '../../../shared/components/fo-cont-card/fo-cont-card.component';

@Component({
  selector: 'app-new-requests',
  standalone: true,
  imports: [CommonModule, FoReturnComponent, FoTitleModuleComponent, FoContCardComponent],
  templateUrl: './new-requests.component.html',
  styleUrl: './new-requests.component.scss'
})
export default class NewRequestsComponent {

	// Inyección del servicio Router para permitir la navegación entre vistas de la aplicación.
	private readonly _router = inject(Router);

	// Método que redirige al usuario a la página de inicio (home) cuando se invoca.
	returnInit(): void {
		// Utiliza el servicio Router para navegar hacia la ruta 'home'.
		this._router.navigate(['home']);
	}
}