/*************************************************************************************
 * Nombre del archivo:  app.component.ts
 * Descripción:         Componente raíz de la aplicación Angular. Contiene el router-outlet
 *                      y módulos compartidos globales como el spinner. Se usa como punto
 *                      de entrada visual y estructural en la arquitectura de componentes.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 22/06/2025 por Daniel Alva
 * Cambios recientes:   Declaración inicial del componente raíz con soporte para RouterOutlet y Spinner.
 *************************************************************************************/
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet, NgxSpinnerModule],
})
export class AppComponent {
}