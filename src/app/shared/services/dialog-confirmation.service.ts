import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FoDialogConfirmationComponent } from '@components/fo-dialog-confirmation/fo-dialog-confirmation.component';
import { DialogConfirmation } from '@components/fo-dialog-confirmation/models/dialog-confirmation.interface';
import { merge } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class DialogConfirmationService {
	// Inyecta el servicio MatDialog de Angular Material para abrir diálogos
	private _matDialog: MatDialog = inject(MatDialog);

	// Configuración predeterminada del diálogo de confirmación
	private _defaultConfig: DialogConfirmation = {
        title: 'Confirmar acción', // Título por defecto del diálogo
        message: 'Desea confirmar esta acción?', // Mensaje por defecto del diálogo
        actions: {
            confirm: {
                show: true, // Define que el botón de confirmación se debe mostrar
                label: 'Eliminar', // Etiqueta por defecto del botón de confirmación
            },
            cancel: {
                show: true, // Define que el botón de cancelación se debe mostrar
                label: 'Cancelar', // Etiqueta por defecto del botón de cancelación
            },
			iconClose: false, // Define si el icono de cierre debe ser visible o no
        },
        disableClose: true, // Deshabilita el cierre del diálogo al hacer clic fuera de él
    };

	/**
	 * Método para abrir un diálogo de confirmación con una configuración personalizada.
	 * @param config Configuración personalizada para el diálogo de confirmación.
	 * @returns Una referencia al diálogo abierto.
	 */
	async open(config: DialogConfirmation): Promise<MatDialogRef<FoDialogConfirmationComponent>> {
        // Combina la configuración predeterminada con la configuración proporcionada por el usuario
		const userConfig = merge({}, this._defaultConfig, config);
		
		// Abre el diálogo de confirmación con la configuración combinada
		return this._matDialog.open(FoDialogConfirmationComponent, {
            autoFocus: false, // Evita que el foco se coloque automáticamente en el primer campo del formulario
            disableClose: userConfig.disableClose, // Configura si se puede cerrar el diálogo haciendo clic fuera de él
            data: userConfig, // Pasa la configuración combinada al diálogo
            panelClass: 'fuse-confirmation-dialog-panel', // Aplica una clase CSS personalizada para el estilo del panel
			width: '450px' // Establece el ancho del diálogo
        });
    }
}