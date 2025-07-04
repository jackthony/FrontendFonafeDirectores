/*******************************************************************************************************
 * Nombre del componente: Error500Component
 * Descripción:           Componente que representa la vista de error 500 (Error Interno del Servidor).
 *                        Se muestra cuando ocurre un error inesperado en el backend o la aplicación 
 *                        falla por una condición no controlada. Brinda la posibilidad de redireccionar 
 *                        al usuario a una ruta segura.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 * Última modificación:   23/06/2025 por Daniel Alva
 * Cambios recientes:     - Implementación del componente con estrategia de detección OnPush.
 *                        - Uso de RouterLink para facilitar navegación en el template.
 *******************************************************************************************************/
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector       : 'error-500',
    templateUrl    : './error-500.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [RouterLink],
})
export class Error500Component
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
