import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseModel } from '@models/IResponseModel';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { CONFIG_ACTIVE_DIALOG_SECTOR, CONFIG_DELETE_DIALOG_SECTOR, CONFIG_INACTIVE_DIALOG_SECTOR, MAINTENANCE_SECTOR_HEADER_TABLE } from 'app/shared/configs/system-maintenance/maintenance-sector.config';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, firstValueFrom } from 'rxjs';
import { DialogSectorFormComponent } from '../dialog-sector-form/dialog-sector-form.component';
import { MAINTENANCE_GENERAL_IMPORTS } from 'app/shared/imports/system-maintenance/maintenance-ministry.imports';
import { SectorService } from 'app/modules/admin/shared/domain/services/sector.service';
import { SectorEntity } from 'app/modules/admin/shared/domain/entities/sector.entity';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-maintenance-sector',
  standalone: true,
  imports: [...MAINTENANCE_GENERAL_IMPORTS],
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
	private _userService = inject(UserService); // Inyecta el servicio UserService para obtener información del usuario
	
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

	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_SECTOR_HEADER_TABLE);
		this.iconsTable.set(this.defineIconsTable());
		this.searchTable();
	}

	returnInit(): void {
		this._router.navigate(['home']);
	}

	searchTable(): void {
		this.loadingTable.set(true);
		this._sectorService.getByPagination(this.paramSearchTable(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE, this.filterState()).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<SectorEntity>) => {
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

	defineIconsTable(): IconOption<SectorEntity>[] {
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconInactive = new IconOption("remove_circle_outline", "mat_outline", "Desactivar"); // Icono para desactivar
    	const iconActive = new IconOption("restart_alt", "mat_outline", "Activar"); // Icono para activar

		// Acción para editar un ministerio
		iconEdit.actionIcono = (data: SectorEntity) => {
            this.openFormDialog(data);
        };

		// Acción para eliminar un ministerio
		iconInactive.actionIcono = (data: SectorEntity) => {
            this.deleteSector(data);
        };

		iconActive.actionIcono = (data: SectorEntity) => {
            this.deleteSector(data);
        };

		iconInactive.isHidden = (data: SectorEntity) => !data.bActivo; // Oculta el icono de desactivar si la empresa ya está desactivada
    	iconActive.isHidden = (data: SectorEntity) => data.bActivo; // Oculta el icono de activar si la empresa ya está activa

        return [iconEdit, iconInactive, iconActive]; // Retorna los iconos de acción
    }

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
					next: (response: ResponseModel<boolean>) => {
						if (response.isSuccess) {
							const messageToast = data.bActivo ? 'Sector desactivado exitosamente' : 'Sector activado exitosamente'; // Muestra un mensaje de éxito
							this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
							this.searchTable();
						}
					},
				});
		}
	}

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

	setFilterState(event: boolean | null) {
		this.filterState.set(event);
	}
}
