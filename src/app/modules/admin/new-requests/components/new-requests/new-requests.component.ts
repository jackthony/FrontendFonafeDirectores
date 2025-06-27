/*******************************************************************************************************
 * Nombre del componente: NewRequestsComponent
 * Descripción:           Componente encargado de mostrar la vista principal del módulo de nuevas 
 *                        solicitudes. Incluye un botón de retorno al inicio y estructura base para 
 *                        futuras funcionalidades relacionadas a solicitudes.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 * Última modificación:   23/06/2025 por Daniel Alva
 * Cambios recientes:     - Estructura inicial del componente standalone.
 *                        - Integración de componentes compartidos para layout y navegación.
 *******************************************************************************************************/
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
	private readonly _router = inject(Router);
	/**
   * Método encargado de redirigir al usuario a la pantalla principal del sistema.
   * Se invoca usualmente desde el componente `FoReturnComponent`.
   */
	returnInit(): void {
		this._router.navigate(['home']);
	}
}