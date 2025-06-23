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