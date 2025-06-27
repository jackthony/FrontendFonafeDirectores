/*************************************************************************************
 * Nombre del archivo:  ngx-toastr.service.ts
 * Descripción:         Servicio wrapper que encapsula el uso de ngx-toastr para
 *                      mostrar notificaciones de éxito y error de forma centralizada.
 *                      Permite desacoplar la lógica de notificaciones del resto de la aplicación.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   - Se integró el servicio con ngx-toastr usando inyección moderna.
 *                      - Métodos showSuccess y showError con tipado y documentación.
 *************************************************************************************/
import { Injectable, inject } from '@angular/core';
import { ToastrService } from "ngx-toastr"; 
@Injectable({
    providedIn: 'root',
})
export class NgxToastrService {
    private readonly toastr = inject(ToastrService);
    /**
     * Muestra una notificación de éxito con un mensaje y un título opcional.
     * @param message El mensaje de la notificación.
     * @param tittle El título de la notificación (opcional).
     */
    showSuccess(message: string, tittle?: string): void {
        this.toastr.success(message, tittle);
    }
    /**
     * Muestra una notificación de error con un mensaje y un título opcional.
     * @param message El mensaje de la notificación.
     * @param tittle El título de la notificación (opcional).
     */
    showError(message: string, tittle?: string): void {
        this.toastr.error(message, tittle);
    }
}