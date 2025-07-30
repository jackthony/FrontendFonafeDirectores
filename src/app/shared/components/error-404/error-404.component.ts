/*******************************************************************************************************
 * Nombre del componente: Error404Component
 * Descripción:           Componente responsable de mostrar la vista de error 404 (Página no encontrada).
 *                        Se utiliza cuando el usuario intenta acceder a una ruta inexistente en la 
 *                        aplicación. Permite redireccionar a rutas válidas mediante RouterLink.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 * Última modificación:   23/06/2025 por Daniel Alva
 * Cambios recientes:     - Implementación del componente con encapsulación global y detección OnPush.
 *                        - Preparado para vista estática con opción de navegación.
 *******************************************************************************************************/
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
@Component({
    selector       : 'error-404',
    templateUrl    : './error-404.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : false
})
export class Error404Component
{
    constructor()
    {
    }
}