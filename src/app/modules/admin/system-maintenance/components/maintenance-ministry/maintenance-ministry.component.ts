/*************************************************************************************
   * Nombre del archivo:  maintenance-ministry.component.ts
   * Descripción:         Componente para la gestión de ministerios: búsqueda, paginación,
   *                      alta/edición, activación y desactivación con confirmación.
   * Autor:               Daniel Alva
   * Fecha de creación:   01/06/2025
   * Última modificación: 23/06/2025 por Daniel Alva
   * Cambios recientes:   Limpieza de imports sin uso y adición de cabecera unificada.
   **************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseModel } from '@models/IResponseModel';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, firstValueFrom } from 'rxjs';
import { DialogMinistryFormComponent } from '../dialog-ministry-form/dialog-ministry-form.component';
import { CONFIG_ACTIVE_DIALOG_MINISTRY, CONFIG_DELETE_DIALOG_MINISTRY, CONFIG_INACTIVE_DIALOG_MINISTRY, MAINTENANCE_MINISTRY_MANAGEMENT } from 'app/shared/configs/system-maintenance/maintenance-ministry.config';
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
    private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);
	private _dialogConfirmationService = inject(DialogConfirmationService);
	private _matDialog: MatDialog = inject(MatDialog);
	private _ministryService = inject(MinistryService);
	private _authorizationService = inject(AuthorizationService);
	private _ngxToastrService = inject(NgxToastrService);
	private _spinner = inject(NgxSpinnerService);
	private _userService = inject(UserService);
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
	
	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_MINISTRY_MANAGEMENT);
		this.iconsTable.set(this.defineIconsTable());
		this.searchTable();
	}
	returnInit(): void {
		this._router.navigate(['home']);
	}
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
	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		this.searchTable();
	}
	searchByItem(event: string): void {
		this.paramSearchTable.set(event);
		this.pageIndexTable.set(1);
		this.searchTable();
	}
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
	setFilterState(event: boolean | null) {
		this.filterState.set(event);
	}
}