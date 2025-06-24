/*************************************************************************************
 * Nombre del archivo:  maintenance-ministry.component.ts
 * Descripción:         Componente para la gestión de ministerios: búsqueda, paginación,
 *                      registro/edición, activación y desactivación con confirmación.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Limpieza de imports sin uso y estandarización de cabecera.
 *************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseModel } from '@models/IResponseModel';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, firstValueFrom } from 'rxjs';
import { DialogMinistryFormComponent } from '../dialog-ministry-form/dialog-ministry-form.component';
import { CONFIG_ACTIVE_DIALOG_MINISTRY, CONFIG_INACTIVE_DIALOG_MINISTRY, MAINTENANCE_MINISTRY_MANAGEMENT } from 'app/shared/configs/system-maintenance/maintenance-ministry.config';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { MAINTENANCE_GENERAL_IMPORTS } from 'app/shared/imports/system-maintenance/maintenance-ministry.imports';
import { MinistryService } from 'app/modules/admin/shared/domain/services/ministry.service';
import { MinistryEntity } from 'app/modules/admin/business-management/domain/entities/ministry.entity';
import { UserService } from 'app/core/user/user.service';
@Component({
  selector: 'app-maintenance-ministry',
  standalone: true,
  imports: [...MAINTENANCE_GENERAL_IMPORTS],
  templateUrl: './maintenance-ministry.component.html',
  styleUrl: './maintenance-ministry.component.scss'
})
export default class MaintenanceMinistryComponent {
    private readonly _router = inject(Router); // Router para navegación
	private readonly _route = inject(ActivatedRoute); // ActivatedRoute para obtener parámetros de la ruta
	private _dialogConfirmationService = inject(DialogConfirmationService); // Servicio para diálogos de confirmación
	private _matDialog: MatDialog = inject(MatDialog); // MatDialog para abrir diálogos
	private _ministryService = inject(MinistryService); // Servicio para operaciones con ministerios
	private _authorizationService = inject(AuthorizationService); // Servicio de autorización para verificar permisos
	private _ngxToastrService = inject(NgxToastrService); // Servicio para mostrar notificaciones
	private _spinner = inject(NgxSpinnerService); // Servicio para mostrar un spinner de carga
	private _userService = inject(UserService); // Servicio para obtener información del usuario actual
    titleModule = signal<string>('Mantenedor de ministerios');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTable = signal<MinistryEntity[]>([]);
	iconsTable = signal<IconOption<MinistryEntity>[]>([]);
	nameBtnAdd = signal<string>('Agregar ministerio');
	loadingTable = signal<boolean>(false);
	pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
	paramSearchTable = signal<string>('');
	placeHolderSearch = signal<string>('Busca por nombre');
	delaySearchTable = signal<number>(400);
	filterState = signal<boolean | null>(true);
	/**
	 * Hook de inicialización del componente.
	 * Inicializa las columnas e íconos de la tabla, y ejecuta la búsqueda inicial de datos.
	 */
	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_MINISTRY_MANAGEMENT);
		this.iconsTable.set(this.defineIconsTable());
		this.searchTable();
	}
	/**
	 * Hook de destrucción del componente.
	 * Redirige al usuario a la página de inicio al destruir el componente.
	 */
	returnInit(): void {
		this._router.navigate(['home']);
	}
	/**
	 * Realiza la búsqueda de ministerios con paginación y filtrado.
	 * Utiliza el servicio MinistryService para obtener los datos.
	 */
	searchTable(): void {
		this.loadingTable.set(true);
		this._ministryService.getByPagination(this.paramSearchTable(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE, this.filterState()).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<MinistryEntity>) => {
				if(response.isSuccess) {
					const totalPages = Math.ceil(response.pagination.totalRows / PAGINATOR_PAGE_SIZE);
					this.totalPagesTable.set(totalPages > 0 ? totalPages : 1);
					this.dataTable.set(response.lstItem);
				} else {
					this.dataTable.set([]);
				}
			}),
			error: (() => {
				this.totalPagesTable.set(1);
				this.dataTable.set([]);
			})
		});
	}
	/**
	 * Cambia la página activa del paginador y recarga la búsqueda.
	 * @param event Número de página seleccionado.
	 */
	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		this.searchTable();
	}
	/**
	 * Aplica un filtro por nombre ingresado, reinicia la paginación y ejecuta búsqueda.
	 * @param event Texto del campo de búsqueda.
	 */
	searchByItem(event: string): void {
		this.paramSearchTable.set(event);
		this.pageIndexTable.set(1);
		this.searchTable();
	}
	/**
	 * Define los íconos de acción para la tabla de ministerios.
	 * @returns Un arreglo de IconOption que define las acciones disponibles.
	 */
	defineIconsTable(): IconOption<MinistryEntity>[] {
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconInactive = new IconOption("remove_circle_outline", "mat_outline", "Desactivar");
    	const iconActive = new IconOption("restart_alt", "mat_outline", "Activar");
		iconEdit.actionIcono = (data: MinistryEntity) => {
            this.openFormDialog(data);
        };
		iconInactive.actionIcono = (data: MinistryEntity) => {
            this.deleteMinistry(data);
        };
		iconActive.actionIcono = (data: MinistryEntity) => {
            this.deleteMinistry(data);
        };
		iconInactive.isHidden = (data: MinistryEntity) => !data.bActivo;
    	iconActive.isHidden = (data: MinistryEntity) => data.bActivo;
        return [iconEdit, iconInactive, iconActive];
    }
	/**
	 * Activa o desactiva un ministerio seleccionado, solicitando confirmación previa.
	 * @param data Registro de ministerio sobre el cual aplicar la acción.
	 */
	async deleteMinistry(data: MinistryEntity): Promise<void> {
		const config = data.bActivo ? CONFIG_INACTIVE_DIALOG_MINISTRY : CONFIG_ACTIVE_DIALOG_MINISTRY;
		const dialogRef = await this._dialogConfirmationService.open(config);
        const isValid = await firstValueFrom(dialogRef.afterClosed());
		if(isValid) {
			const request = new MinistryEntity();
			request.nIdMinisterio = data.nIdMinisterio;
			request.nUsuarioModificacion =this._userService.userLogin().usuarioId
			this._spinner.show();
			this._ministryService
				.delete(request)
				.pipe(finalize(() => this._spinner.hide()))
				.subscribe({
					next: (response: ResponseModel<boolean>) => {
						if (response.isSuccess) {
							const messageToast = data.bActivo ? 'Ministerio desactivado exitosamente' : 'Ministerio activado exitosamente';
							this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
							this.searchTable();
						}
					},
				});
		}
	}
	/**
	 * Abre un diálogo para registrar o editar un ministerio.
	 * Si se proporciona un elemento, se edita; si no, se crea uno nuevo.
	 * @param element Objeto de tipo MinistryEntity a editar, o null para crear uno nuevo.
	 */
	openFormDialog(element?: MinistryEntity | null): void {
		const respDialogo = this._matDialog.open(DialogMinistryFormComponent, {
			data: { object: element },
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchTable();
				if(element) this._ngxToastrService.showSuccess('Ministerio actualizado exitosamente', '¡Éxito!');
			    else this._ngxToastrService.showSuccess('Ministerio registrado exitosamente', '¡Éxito!');
		    }
		});
	}
	/**
	 * Establece el estado del filtro para mostrar u ocultar los registros inactivos.
	 * @param event Valor booleano o nulo para activar/desactivar el filtro.
	 */
	setFilterState(event: boolean | null) {
		this.filterState.set(event);
	}
}