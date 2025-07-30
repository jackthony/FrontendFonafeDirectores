/*******************************************************************************************************
 * Nombre del archivo:  quit.component.ts
 * Descripción:          Componente encargado de manejar las acciones relacionadas con la salida de la sesión
 *                       y el cambio de contraseña del usuario. Proporciona opciones de navegación para 
 *                       redirigir al usuario a la pantalla de cambio de contraseña o a la pantalla de cierre 
 *                       de sesión.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación del componente de cierre de sesión y cambio de contraseña.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
@Component({
    selector: 'app-quit',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule],
    templateUrl: './quit.component.html',
    styleUrl: './quit.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class QuitComponent {
    private _router = inject(Router);

    changePassword(): void {
        this._router.navigate(['/change-password']);
    }
	signOut(): void {
        this._router.navigate(['/sign-out']);
  }
}