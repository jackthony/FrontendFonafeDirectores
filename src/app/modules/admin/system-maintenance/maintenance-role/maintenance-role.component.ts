import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '@models/business/role.interface';
import { ResponseModel } from '@models/IResponseModel';
import { RoleService } from '@services/role.service';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { CONFIG_DELETE_DIALOG_ROLE, MAINTENANCE_ROL_HEADER_TABLE } from 'app/shared/configs/system-maintenance/maintenance-role.config';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, firstValueFrom } from 'rxjs';
import { DialogMaintenanceRoleFormComponent } from './dialog/dialog-maintenance-role-form/dialog-maintenance-role-form.component';
import { MAINTENANCE_GENERAL_IMPORTS } from 'app/shared/imports/system-maintenance/maintenance-ministry.imports';

@Component({
  selector: 'app-maintenance-role',
  standalone: true,
  imports: [...MAINTENANCE_GENERAL_IMPORTS],
  templateUrl: './maintenance-role.component.html',
  styleUrl: './maintenance-role.component.scss'
})
export default class MaintenanceRoleComponent {
    private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);
	private _dialogConfirmationService = inject(DialogConfirmationService);

	private _matDialog: MatDialog = inject(MatDialog);

	private _sectorService = inject(RoleService);
	private _authorizationService = inject(AuthorizationService);

	private _ngxToastrService = inject(NgxToastrService);
	private _spinner = inject(NgxSpinnerService);
	
    titleModule = signal<string>('Mantenedor de roles');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTable = signal<Role[]>([]);
	iconsTable = signal<IconOption<Role>[]>([]);
	nameBtnAdd = signal<string>('Agregar rol');
	
	loadingTable = signal<boolean>(false);
	pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
	paramSearchTable = signal<string>('');
	placeHolderSearch = signal<string>('Busca por nombre');

	delaySearchTable = signal<number>(400);

	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_ROL_HEADER_TABLE);
		this.iconsTable.set(this.defineIconsTable());
		this.searchTable();
	}

	returnInit(): void {
		this._router.navigate(['home']);
	}

	searchTable(): void {
		this.loadingTable.set(true);
		const request = new RequestOption();
		request.queryParams = [
			{ key: 'pageIndex' , value: this.pageIndexTable() },
			{ key: 'pageSize' , value: PAGINATOR_PAGE_SIZE }
		];
		if(this.paramSearchTable()) 
			request.queryParams.push({ key: 'name', value: this.paramSearchTable() });
		this._sectorService.getByPagination(request).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<Role>) => {
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


	defineIconsTable(): IconOption<Role>[]{
		const resolvedModule = this._route.snapshot.data['module'];
		const authorization = this._authorizationService.canPerform(resolvedModule, 'write');

        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconDelete = new IconOption("delete", "mat_outline", "Eliminar");

		iconEdit.actionIcono = (data: Role) => {
            this.openFormDialog(data);
        };

		iconDelete.actionIcono = (data: Role) => {
            this.deleteBussines(data);
        };

		iconEdit.isDisabled = (data: Role) => !authorization;
		iconDelete.isDisabled = (data: Role) => !authorization;

        return [iconEdit, iconDelete];
    }

	async deleteBussines(data: Role): Promise<void> {

		const dialogRef = await this._dialogConfirmationService.open(CONFIG_DELETE_DIALOG_ROLE);
        const isValid = await firstValueFrom(dialogRef.afterClosed());
		if(isValid) {
			this._spinner.show();
			const request = new RequestOption();
				request.resource = "Delete",
				request.pathVariables = [data.nIdRol];
				this._sectorService
					.delete(request)
					.pipe(finalize(() => this._spinner.hide()))
					.subscribe({
						next: (response: ResponseModel<Role>) => {
							if (response.isSuccess) {
								const messageToast = 'Rol eliminado exitosamente';
								this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
								this.searchTable();
							}
						},
					});
		}
	}

	openFormDialog(element?: Role | null): void {
		const respDialogo = this._matDialog.open(DialogMaintenanceRoleFormComponent, {
			data: { object: element },
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchTable();
				if(element) this._ngxToastrService.showSuccess('Rol actualizado exitosamente', '¡Éxito!');
			    else this._ngxToastrService.showSuccess('Rol registrado exitosamente', '¡Éxito!');
				
		    }
		});
	}
}
