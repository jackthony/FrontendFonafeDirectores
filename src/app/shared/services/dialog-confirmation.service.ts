import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FoDialogConfirmationComponent } from '@components/fo-dialog-confirmation/fo-dialog-confirmation.component';
import { DialogConfirmation } from '@components/fo-dialog-confirmation/models/dialog-confirmation.interface';
import { merge } from 'lodash';
@Injectable({
    providedIn: 'root',
})
export class DialogConfirmationService {
	private _matDialog: MatDialog = inject(MatDialog);
	private _defaultConfig: DialogConfirmation = {
        title: 'Confirmar acción',
        message: 'Desea confirmar esta acción?',
        actions: {
            confirm: {
                show: true,
                label: 'Eliminar',
            },
            cancel: {
                show: true,
                label: 'Cancelar',
            },
			iconClose: false,
        },
        disableClose: true,
    };
	/**
	 * Método para abrir un diálogo de confirmación con una configuración personalizada.
	 * @param config Configuración personalizada para el diálogo de confirmación.
	 * @returns Una referencia al diálogo abierto.
	 */
	async open(config: DialogConfirmation): Promise<MatDialogRef<FoDialogConfirmationComponent>> {
		const userConfig = merge({}, this._defaultConfig, config);
		return this._matDialog.open(FoDialogConfirmationComponent, {
            autoFocus: false,
            disableClose: userConfig.disableClose,
            data: userConfig,
            panelClass: 'fuse-confirmation-dialog-panel',
			width: '450px'
        });
    }
}