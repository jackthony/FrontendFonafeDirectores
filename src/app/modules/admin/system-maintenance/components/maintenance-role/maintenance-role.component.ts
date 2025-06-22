import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseModel } from '@models/IResponseModel';
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
import { DialogMaintenanceRoleFormComponent } from '../dialog-maintenance-role-form/dialog-maintenance-role-form.component';
import { MAINTENANCE_GENERAL_IMPORTS } from 'app/shared/imports/system-maintenance/maintenance-ministry.imports';
import { RoleService } from 'app/modules/admin/shared/domain/services/role.service';
import { RoleEntity } from 'app/modules/admin/shared/domain/entities/role.entity';

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

	private _roleService = inject(RoleService);
	private _authorizationService = inject(AuthorizationService);

	private _ngxToastrService = inject(NgxToastrService);
	private _spinner = inject(NgxSpinnerService);
	
    titleModule = signal<string>('Mantenedor de roles');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTable = signal<RoleEntity[]>([]);
	iconsTable = signal<IconOption<RoleEntity>[]>([]);
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
		this._roleService.getByPagination(this.paramSearchTable(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE ).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<RoleEntity>) => {
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


	defineIconsTable(): IconOption<RoleEntity>[]{
		const resolvedModule = this._route.snapshot.data['module'];
		const authorization = this._authorizationService.canPerform(resolvedModule, 'write');

        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconDelete = new IconOption("delete", "mat_outline", "Eliminar");

		iconEdit.actionIcono = (data: RoleEntity) => {
            this.openFormDialog(data);
        };

		iconDelete.actionIcono = (data: RoleEntity) => {
            this.deleteBussines(data);
        };

		iconEdit.isDisabled = (data: RoleEntity) => !authorization;
		iconDelete.isDisabled = (data: RoleEntity) => !authorization;

        return [iconEdit, iconDelete];
    }

	async deleteBussines(data: RoleEntity): Promise<void> {
		const dialogRef = await this._dialogConfirmationService.open(CONFIG_DELETE_DIALOG_ROLE);
        const isValid = await firstValueFrom(dialogRef.afterClosed());
		if(isValid) {
			this._spinner.show();
			this._roleService
				.delete(data.nIdRol)
				.pipe(finalize(() => this._spinner.hide()))
				.subscribe({
					next: (response: ResponseModel<boolean>) => {
						if (response.isSuccess) {
							const messageToast = 'Rol eliminado exitosamente';
							this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
							this.searchTable();
						}
					},
				});
		}
	}

	openFormDialog(element?: RoleEntity | null): void {
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
