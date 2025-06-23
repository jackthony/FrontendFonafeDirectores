/*************************************************************************************
   * Nombre del archivo:  maintenance-position.component.ts
   * Descripción:         Componente para la gestión de cargos: búsqueda, paginación,
   *                      alta/edición, activación y desactivación con confirmación.
   * Autor:               Daniel Alva
   * Fecha de creación:   01/06/2025
   * Última modificación: 23/06/2025 por Daniel Alva
   * Cambios recientes:   Eliminación de importación no usada y verificación de mensajes.
   **************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { ResponseModel } from '@models/IResponseModel';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { finalize, firstValueFrom } from 'rxjs';
import { DialogPositionFormComponent } from '../dialog-position-form/dialog-position-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { CONFIG_ACTIVE_DIALOG_POSITION, CONFIG_DELETE_DIALOG_POSITION, CONFIG_INACTIVE_DIALOG_POSITION, MAINTENANCE_POSITION_HEADER_TABLE } from 'app/shared/configs/system-maintenance/maintenance-position.config';
import { MAINTENANCE_GENERAL_IMPORTS } from 'app/shared/imports/system-maintenance/maintenance-ministry.imports';
import { PositionService } from 'app/modules/admin/shared/domain/services/position.service';
import { PositionEntity } from 'app/modules/admin/shared/domain/entities/position.entity';
import { UserService } from 'app/core/user/user.service';
@Component({
  selector: 'app-maintenance-position',
  standalone: true,
  imports: [...MAINTENANCE_GENERAL_IMPORTS],
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
	delaySearchTable = signal<number>(400);
	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_POSITION_HEADER_TABLE);
		this.iconsTable.set(this.defineIconsTable());
		this.searchTable();
	}
	returnInit(): void {
		this._router.navigate(['home']);
	}
	searchTable(): void {
		this.loadingTable.set(true);
		this._positionService.getByPagination(this.paramSearchTable(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE, this.filterState()).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<PositionEntity>) => {
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
	defineIconsTable(): IconOption<PositionEntity>[] {
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconInactive = new IconOption("remove_circle_outline", "mat_outline", "Desactivar");
    	const iconActive = new IconOption("restart_alt", "mat_outline", "Activar");
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
					next: (response: ResponseModel<boolean>) => {
						if (response.isSuccess) {
							const messageToast = data.bActivo ? 'Cargo desactivado exitosamente' : 'Cargo activado exitosamente';
							this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
							this.searchTable();
						}
					},
				});
		}
	}
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
	setFilterState(event: boolean | null) {
		this.filterState.set(event);
	}
}