import { Injectable, inject } from '@angular/core';
import { ToastrService } from "ngx-toastr"; 

@Injectable({
    providedIn: 'root',
})
export class NgxToastrService {
    // Inyecta el servicio ToastrService en la clase para utilizarlo para mostrar notificaciones
    private readonly toastr = inject(ToastrService);

    /**
     * Muestra una notificación de éxito con un mensaje y un título opcional.
     * @param message El mensaje de la notificación.
     * @param tittle El título de la notificación (opcional).
     */
    showSuccess(message: string, tittle?: string): void {
        this.toastr.success(message, tittle); // Llama al método success de ToastrService para mostrar una notificación de éxito
    }

    /**
     * Muestra una notificación de error con un mensaje y un título opcional.
     * @param message El mensaje de la notificación.
     * @param tittle El título de la notificación (opcional).
     */
    showError(message: string, tittle?: string): void {
        this.toastr.error(message, tittle); // Llama al método error de ToastrService para mostrar una notificación de error
    }
}
