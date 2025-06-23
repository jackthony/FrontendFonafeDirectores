/*************************************************************************************
   * Nombre del archivo:  maintenance-specialty.component.ts
   * Descripción:         Componente para la gestión de especialidades: búsqueda, paginación,
   *                      alta/edición, activación y desactivación con confirmación.
   * Autor:               Daniel Alva
   * Fecha de creación:   01/06/2025
   * Última modificación: 23/06/2025 por Daniel Alva
   * Cambios recientes:   Corrección de género en mensajes y limpieza de importaciones.
   **************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseModel } from '@models/IResponseModel';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { CONFIG_ACTIVE_DIALOG_SPECIALTY, CONFIG_INACTIVE_DIALOG_SPECIALTY, MAINTENANCE_SPECIALTY_HEADER_TABLE } from 'app/shared/configs/system-maintenance/maintenance-specialty.config';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, firstValueFrom } from 'rxjs';
import { DialogMaintenanceSpecialtyFormComponent } from '../dialog-maintenance-specialty-form/dialog-maintenance-specialty-form.component';
import { MAINTENANCE_GENERAL_IMPORTS } from 'app/shared/imports/system-maintenance/maintenance-ministry.imports';
import { SpecialtyService } from 'app/modules/admin/shared/domain/services/specialty.service';
import { SpecialtyEntity } from 'app/modules/admin/shared/domain/entities/specialty.entity';
import { UserService } from 'app/core/user/user.service';
@Component({
  selector: 'app-maintenance-specialty',
  standalone: true,
  imports: [...MAINTENANCE_GENERAL_IMPORTS],
  templateUrl: './maintenance-specialty.component.html',
  styleUrl: './maintenance-specialty.component.scss'
})
export default class MaintenanceSpecialtyComponent {
    private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);
	private _dialogConfirmationService = inject(DialogConfirmationService);
	private _matDialog: MatDialog = inject(MatDialog);
	private _specialtyService = inject(SpecialtyService);
	private _ngxToastrService = inject(NgxToastrService);
	private _spinner = inject(NgxSpinnerService);
	private _userService = inject(UserService);
    titleModule = signal<string>('Mantenedor de especialidad');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTable = signal<SpecialtyEntity[]>([]);
	iconsTable = signal<IconOption<SpecialtyEntity>[]>([]);
	nameBtnAdd = signal<string>('Agregar especialidad');
	loadingTable = signal<boolean>(false);
	pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
	paramSearchTable = signal<string>('');
	placeHolderSearch = signal<string>('Busca por nombre');
	filterState = signal<boolean | null>(true);
	delaySearchTable = signal<number>(400);
	/**
     * Hook de inicialización: carga estructura de tabla, íconos y datos iniciales.
     */
	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_SPECIALTY_HEADER_TABLE);
		this.iconsTable.set(this.defineIconsTable());
		this.searchTable();
	}
	/** Redirige al home */
	returnInit(): void {
		this._router.navigate(['home']);
	}
    /**
     * Lógica para búsqueda paginada de especialidades según filtros actuales.
     */
	searchTable(): void {
		this.loadingTable.set(true);
		this._specialtyService.getByPagination(this.paramSearchTable(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE, this.filterState()).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<SpecialtyEntity>) => {
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
	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		this.searchTable();
	}
	searchByItem(event: string): void {
		this.paramSearchTable.set(event);
		this.pageIndexTable.set(1);
		this.searchTable();
	}
    /**
     * Define la lista de íconos con acciones por fila (editar, activar, desactivar).
     */
	defineIconsTable(): IconOption<SpecialtyEntity>[] {
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconInactive = new IconOption("remove_circle_outline", "mat_outline", "Desactivar");
    	const iconActive = new IconOption("restart_alt", "mat_outline", "Activar");
		iconEdit.actionIcono = (data: SpecialtyEntity) => {
            this.openFormDialog(data);
        };
		iconInactive.actionIcono = (data: SpecialtyEntity) => {
            this.deleteSpecialty(data);
        };
		iconActive.actionIcono = (data: SpecialtyEntity) => {
            this.deleteSpecialty(data);
        };
		iconInactive.isHidden = (data: SpecialtyEntity) => !data.bActivo;
    	iconActive.isHidden = (data: SpecialtyEntity) => data.bActivo;
        return [iconEdit, iconInactive, iconActive];
    }
	/**
     * Activa o desactiva una especialidad según su estado actual.
     * Confirma con diálogo antes de proceder.
     */
	async deleteSpecialty(data: SpecialtyEntity): Promise<void> {
		const config = data.bActivo ? CONFIG_INACTIVE_DIALOG_SPECIALTY : CONFIG_ACTIVE_DIALOG_SPECIALTY;
		const dialogRef = await this._dialogConfirmationService.open(config);
        const isValid = await firstValueFrom(dialogRef.afterClosed());
		if(isValid) {
			this._spinner.show();
			const request = new SpecialtyEntity();
			request.nIdEspecialidad = data.nIdEspecialidad;
			request.nUsuarioModificacion = this._userService.userLogin().usuarioId;
			this._specialtyService
				.delete(request)
				.pipe(finalize(() => this._spinner.hide()))
				.subscribe({
					next: (response: ResponseModel<boolean>) => {
						if (response.isSuccess) {
							const messageToast = data.bActivo ? 'Especialidad desactivado exitosamente' : 'Especialidad activado exitosamente';
							this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
							this.searchTable();
						}
					},
				});
		}
	}
    /**
     * Abre el diálogo para registrar o actualizar una especialidad.
     * Recarga la tabla al cierre exitoso.
     */
	openFormDialog(element?: SpecialtyEntity | null): void {
		const respDialogo = this._matDialog.open(DialogMaintenanceSpecialtyFormComponent, {
			data: { object: element },
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchTable();
				if(element) this._ngxToastrService.showSuccess('Especialidad actualizado exitosamente', '¡Éxito!');
			    else this._ngxToastrService.showSuccess('Especialidad registrado exitosamente', '¡Éxito!');
				
		    }
		});
	}
	/** Aplica filtro de estado (activos, inactivos, todos) */
	setFilterState(event: boolean | null) {
		this.filterState.set(event);
	}
}