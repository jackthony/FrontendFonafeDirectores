/*************************************************************************************
 * Nombre del archivo:  maintenance-position.component.ts
 * Descripción:         Componente para la gestión de cargos: búsqueda, paginación,
 *                      registro/edición, activación y desactivación con confirmación.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Eliminación de importaciones no utilizadas y validación de mensajes.
 *************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { finalize, firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableColumnsDefInterface } from 'app/shared/interfaces/table-columns-def.interface';
import { PAGINATOR_PAGE_SIZE } from 'app/shared/config/paginator.config';
import { CONFIG_ACTIVE_DIALOG_POSITION, CONFIG_INACTIVE_DIALOG_POSITION, MAINTENANCE_POSITION_HEADER_TABLE } from 'app/modules/business/config/maintenance/maintenance-position.config';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { ResponseEntity } from '@models/response.entity';
import { IconOption } from 'app/shared/interfaces/generic-icon.interface';
import { DialogPositionFormComponent } from '../dialog-position-form/dialog-position-form.component';
import { PositionEntity } from '../../../domain/entities/maintenance/position.entity';
import { PositionService } from 'app/modules/user/domain/services/maintenance/position.service';
@Component({
  selector: 'app-maintenance-position',
  standalone: false,
  templateUrl: './maintenance-position.component.html',
  styleUrl: './maintenance-position.component.scss'
})
export default class MaintenancePositionComponent {
    private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);
	private _dialogConfirmationService = inject(DialogConfirmationService);
	private _matDialog: MatDialog = inject(MatDialog);
	private _positionService = inject(PositionService);
	private _authorizationService = inject(AuthorizationService);
	private _ngxToastrService = inject(NgxToastrService);
	private _spinner = inject(NgxSpinnerService);
	private _userService = inject(UserService);
    titleModule = signal<string>('Mantenedor de cargos');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTable = signal<PositionEntity[]>([]);
	iconsTable = signal<IconOption<PositionEntity>[]>([]);
	nameBtnAdd = signal<string>('Agregar cargo');
	loadingTable = signal<boolean>(false);
	pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
	paramSearchTable = signal<string>('');
	placeHolderSearch = signal<string>('Busca por nombre');
	filterState = signal<boolean | null>(true);
	/**
	 * Hook de inicialización del componente.
	 * Inicializa las columnas e íconos de la tabla, y ejecuta la búsqueda inicial de datos.
	 */
	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_POSITION_HEADER_TABLE);
		this.iconsTable.set(this.defineIconsTable());
		this.searchTable();
	}
	/**
	 * Redirecciona al usuario a la página principal del sistema.
	 */
	returnInit(): void {
		this._router.navigate(['home']);
	}
	/**
	 * Prepara los parámetros de búsqueda para la tabla.
	 * @returns Un objeto RequestOption con los parámetros de búsqueda.
	 */
	searchTable(resetIndexTable?: boolean): void {
		if(resetIndexTable) this.pageIndexTable.set(1);
		this.loadingTable.set(true);
		this._positionService.getByPagination(this.paramSearchTable(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE, this.filterState()).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseEntity<PositionEntity>) => {
				if(response.isSuccess){
					const totalPages = Math.ceil(response.pagination.totalRows/PAGINATOR_PAGE_SIZE);
					this.totalPagesTable.set(totalPages > 0 ? totalPages : 1);
					this.dataTable.set(response.lstItem);
				} else this.dataTable.set([])
			}),
			error:(() => {
				this.totalPagesTable.set(1);
				this.dataTable.set([]);
			})
		})
	}
	/**
	 * Cambia la página actual de la tabla y ejecuta una nueva búsqueda.
	 * @param event El índice de la página seleccionada.
	 */
	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		this.searchTable();
	}
	/**
	 * Realiza una búsqueda en la tabla utilizando el texto ingresado.
	 * Actualiza el índice de la página a 1 y ejecuta la búsqueda.
	 * @param event El texto de búsqueda ingresado por el usuario.
	 */
	searchByItem(event: string): void {
		if(event.length >= 1 && event.trim().length === 0) return;
		this.paramSearchTable.set(event?.trim());
		this.pageIndexTable.set(1);
		this.searchTable();
	}
	/**
	 * Define los íconos de acción para la tabla de cargos.
	 * @returns Un arreglo de IconOption que define las acciones disponibles.
	 */
	defineIconsTable(): IconOption<PositionEntity>[] {
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconInactive = new IconOption("trash", "heroicons_outline", "Eliminar");
    	const iconActive = new IconOption("settings_backup_restore", "mat_outline", "Activar");
		iconEdit.actionIcono = (data: PositionEntity) => {
            this.openFormDialog(data);
        };
		iconInactive.actionIcono = (data: PositionEntity) => {
            this.deletePosition(data);
        };
		iconActive.actionIcono = (data: PositionEntity) => {
            this.deletePosition(data);
        };
		iconInactive.isHidden = (data: PositionEntity) => !data.bActivo;
    	iconActive.isHidden = (data: PositionEntity) => data.bActivo;
        return [iconEdit, iconInactive, iconActive];
    }
	/**
	 * Activa o desactiva un cargo según su estado actual.
	 * Solicita confirmación previa al usuario antes de aplicar el cambio.
	 * @param data Cargo seleccionado.
	 */
	async deletePosition(data: PositionEntity): Promise<void> {
		const config = data.bActivo ? CONFIG_INACTIVE_DIALOG_POSITION : CONFIG_ACTIVE_DIALOG_POSITION;
		const dialogRef = await this._dialogConfirmationService.open(config);
        const isValid = await firstValueFrom(dialogRef.afterClosed());
		if(isValid) {
			this._spinner.show();
			const request = new PositionEntity();
			request.nIdCargo = data.nIdCargo;
			request.nUsuarioModificacion = this._userService.userLogin().usuarioId;
			this._positionService
				.delete(request)
				.pipe(finalize(() => this._spinner.hide()))
				.subscribe({
					next: (response: ResponseEntity<boolean>) => {
						if (response.isSuccess) {
							const messageToast = data.bActivo ? 'Cargo desactivado exitosamente' : 'Cargo activado exitosamente';
							this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
							this.searchTable();
						}
					},
				});
		}
	}
	/**
	 * Abre el formulario de registro o edición de un cargo.
	 * Al cerrar exitosamente, actualiza la tabla y muestra un mensaje.
	 * @param element Cargo a editar (opcional).
	 */
	openFormDialog(element?: PositionEntity | null): void {
		const respDialogo = this._matDialog.open(DialogPositionFormComponent, {
			data: { object: element },
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchTable();
				if(element) this._ngxToastrService.showSuccess('Cargo actualizado exitosamente', '¡Éxito!');
			    else this._ngxToastrService.showSuccess('Cargo registrado exitosamente', '¡Éxito!');
				
		    }
		});
	}
	/**
	 * Establece el estado del filtro para mostrar u ocultar elementos inactivos.
	 * @param event Estado del filtro (true, false o null).
	 */
	setFilterState(event: boolean | null) {
		this.filterState.set(event);
	}
}