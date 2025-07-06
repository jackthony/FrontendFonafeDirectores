/*************************************************************************************
 * Nombre del archivo:  maintenance-sector.component.ts
 * Descripción:         Componente para la gestión de sectores: búsqueda, paginación,
 *                      registro, edición, activación y desactivación con confirmación.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Limpieza de imports no utilizados y validación de textos de UI.
 *************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PAGINATOR_PAGE_SIZE } from 'app/shared/config/paginator.config';
import { CONFIG_ACTIVE_DIALOG_SECTOR, CONFIG_INACTIVE_DIALOG_SECTOR, MAINTENANCE_SECTOR_HEADER_TABLE } from 'app/modules/business/config/maintenance/maintenance-sector.config';
import { TableColumnsDefInterface } from 'app/shared/interfaces/table-columns-def.interface';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, firstValueFrom } from 'rxjs';
import { DialogSectorFormComponent } from '../dialog-sector-form/dialog-sector-form.component';
import { SectorService } from 'app/modules/business/domain/services/maintenance/sector.service';
import { SectorEntity } from 'app/modules/business/domain/entities/maintenance/sector.entity';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { ResponseEntity } from '@models/response.entity';
import { IconOption } from 'app/shared/interfaces/generic-icon.interface';
@Component({
  selector: 'app-maintenance-sector',
  standalone: false,
  templateUrl: './maintenance-sector.component.html',
  styleUrl: './maintenance-sector.component.scss'
})
export default class MaintenanceSectorComponent {
  	private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);
	private _dialogConfirmationService = inject(DialogConfirmationService);
	private _matDialog: MatDialog = inject(MatDialog);
	private _sectorService = inject(SectorService);
	private _ngxToastrService = inject(NgxToastrService);
	private _spinner = inject(NgxSpinnerService);
	private _userService = inject(UserService);
    titleModule = signal<string>('Mantenedor de sectores');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTable = signal<SectorEntity[]>([]);
	iconsTable = signal<IconOption<SectorEntity>[]>([]);
	nameBtnAdd = signal<string>('Agregar sector');
	loadingTable = signal<boolean>(false);
	pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
	paramSearchTable = signal<string>('');
	placeHolderSearch = signal<string>('Busca por nombre');
	delaySearchTable = signal<number>(400);
	filterState = signal<boolean | null>(true);
	/**
	 * Hook de inicialización del componente.
	 * Carga los encabezados de la tabla, define los íconos disponibles y ejecuta la primera búsqueda.
	 */
	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_SECTOR_HEADER_TABLE);
		this.iconsTable.set(this.defineIconsTable());
		this.searchTable();
	}
	/**
	 * Redirecciona al usuario a la vista principal del sistema (home).
	 */
	returnInit(): void {
		this._router.navigate(['home']);
	}
	/**
	 * Ejecuta la búsqueda paginada de sectores aplicando los filtros actuales.
	 * Actualiza los datos y el total de páginas según el resultado recibido.
	 */
	searchTable(resetIndexTable?: boolean): void {
		if(resetIndexTable) this.pageIndexTable.set(1);
		this.loadingTable.set(true);
		this._sectorService.getByPagination(this.paramSearchTable(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE, this.filterState()).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseEntity<SectorEntity>) => {
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
	 * Cambia la página del paginador de la tabla y actualiza los datos mostrados.
	 * @param event Número de página seleccionado
	 */
	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		this.searchTable();
	}
	/**
	 * Realiza una búsqueda por texto ingresado (nombre o parte del sector).
	 * Reinicia la paginación para mostrar los primeros resultados.
	 * @param event Texto ingresado para búsqueda
	 */
	searchByItem(event: string): void {
		this.paramSearchTable.set(event);
		this.pageIndexTable.set(1);
		this.searchTable();
	}
	/**
	 * Define los íconos de acción disponibles por fila: editar, activar y desactivar.
	 * La visibilidad de cada ícono depende del estado actual del sector.
	 * @returns Lista de acciones configuradas para la tabla
	 */
	defineIconsTable(): IconOption<SectorEntity>[] {
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconInactive = new IconOption("trash", "heroicons_outline", "Eliminar");
    	const iconActive = new IconOption("settings_backup_restore", "mat_outline", "Activar");
		iconEdit.actionIcono = (data: SectorEntity) => {
            this.openFormDialog(data);
        };
		iconInactive.actionIcono = (data: SectorEntity) => {
            this.deleteSector(data);
        };
		iconActive.actionIcono = (data: SectorEntity) => {
            this.deleteSector(data);
        };
		iconInactive.isHidden = (data: SectorEntity) => !data.bActivo;
    	iconActive.isHidden = (data: SectorEntity) => data.bActivo;
        return [iconEdit, iconInactive, iconActive];
    }
	/**
	 * Activa o desactiva un sector, según su estado actual.
	 * Solicita confirmación al usuario antes de ejecutar la acción.
	 * @param data Sector seleccionado para modificar su estado
	 */
	async deleteSector(data: SectorEntity): Promise<void> {
		const config = data.bActivo ? CONFIG_INACTIVE_DIALOG_SECTOR : CONFIG_ACTIVE_DIALOG_SECTOR;
		const dialogRef = await this._dialogConfirmationService.open(config);
        const isValid = await firstValueFrom(dialogRef.afterClosed());
		if(isValid) {
			this._spinner.show();
			const request = new SectorEntity();
			request.nIdSector = data.nIdSector;
			request.nUsuarioModificacion = this._userService.userLogin().usuarioId;
			this._sectorService
				.delete(request)
				.pipe(finalize(() => this._spinner.hide()))
				.subscribe({
					next: (response: ResponseEntity<boolean>) => {
						if (response.isSuccess) {
							const messageToast = data.bActivo ? 'Sector eliminado exitosamente' : 'Sector activado exitosamente';
							this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
							this.searchTable();
						}
					},
				});
		}
	}
	/**
	 * Abre el diálogo para registrar un nuevo sector o editar uno existente.
	 * Si el formulario se completa con éxito, se actualiza la tabla y se muestra una notificación.
	 * @param element Sector a editar (si se proporciona); si es null, se asume un nuevo registro
	 */
	openFormDialog(element?: SectorEntity | null): void {
		const respDialogo = this._matDialog.open(DialogSectorFormComponent, {
			data: { object: element },
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchTable();
				if(element) this._ngxToastrService.showSuccess('Sector actualizado exitosamente', '¡Éxito!');
			    else this._ngxToastrService.showSuccess('Sector registrado exitosamente', '¡Éxito!');
				
		    }
		});
	}
	/**
	 * Establece el filtro de estado de los sectores: activos, inactivos o todos.
	 * @param event Estado seleccionado para filtrar la tabla (true, false o null)
	 */
	setFilterState(event: boolean | null) {
		this.filterState.set(event);
	}
}