/*************************************************************************************
   * Nombre del archivo:  maintenance-role.component.ts
   * Descripción:         Componente para la gestión de roles: búsqueda, paginación,
   *                      alta/edición, activación y desactivación con confirmación.
   * Autor:               Daniel Alva
   * Fecha de creación:   01/06/2025
   * Última modificación: 23/06/2025 por Daniel Alva
   * Cambios recientes:   Limpieza de importación no usada y verificación de mensajes.
   **************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseModel } from '@models/IResponseModel';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { CONFIG_ACTIVE_DIALOG_ROLE, CONFIG_INACTIVE_DIALOG_ROLE, MAINTENANCE_ROL_HEADER_TABLE } from 'app/shared/configs/system-maintenance/maintenance-role.config';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
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
import { UserService } from 'app/core/user/user.service';
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
	private _userService = inject(UserService);
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
	filterState = signal<boolean | null>(true);
	delaySearchTable = signal<number>(400);
	/**
     * Inicialización del componente: define cabecera e íconos y carga datos iniciales.
     */
	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_ROL_HEADER_TABLE);
		this.iconsTable.set(this.defineIconsTable());
		this.searchTable();
	}
	/** Retorna al home */
	returnInit(): void {
		this._router.navigate(['home']);
	}
    /**
     * Ejecuta búsqueda de roles paginados, aplicando filtro y estado.
     */
	searchTable(): void {
		this.loadingTable.set(true);
		this._roleService.getByPagination(this.paramSearchTable(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE, this.filterState() ).pipe(
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
    /** Cambia la página actual del paginador y recarga los datos. */
	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		this.searchTable();
	}
    /** Realiza búsqueda al escribir nuevo término. */
	searchByItem(event: string): void {
		this.paramSearchTable.set(event);
		this.pageIndexTable.set(1);
		this.searchTable();
	}
    /** Define los íconos y acciones de la tabla de roles. */
	defineIconsTable(): IconOption<RoleEntity>[] {
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconInactive = new IconOption("remove_circle_outline", "mat_outline", "Desactivar");
    	const iconActive = new IconOption("restart_alt", "mat_outline", "Activar");
		iconEdit.actionIcono = (data: RoleEntity) => {
            this.openFormDialog(data);
        };
		iconInactive.actionIcono = (data: RoleEntity) => {
            this.deleteRole(data);
        };
		iconActive.actionIcono = (data: RoleEntity) => {
            this.deleteRole(data);
        };
		iconInactive.isHidden = (data: RoleEntity) => !data.bActivo;
    	iconActive.isHidden = (data: RoleEntity) => data.bActivo;
        return [iconEdit, iconInactive, iconActive];
    }
    /**
     * Activa o desactiva un rol con confirmación.
     * @param data Rol seleccionado
     */
	async deleteRole(data: RoleEntity): Promise<void> {
		const config = data.bActivo ? CONFIG_INACTIVE_DIALOG_ROLE : CONFIG_ACTIVE_DIALOG_ROLE;
		const dialogRef = await this._dialogConfirmationService.open(config);
        const isValid = await firstValueFrom(dialogRef.afterClosed());
		if(isValid) {
			this._spinner.show();
			const request = new RoleEntity();
			request.nRolId = data.nRolId;
			request.nIdUsuarioModificacion = this._userService.userLogin().usuarioId;
			this._roleService
				.delete(request)
				.pipe(finalize(() => this._spinner.hide()))
				.subscribe({
					next: (response: ResponseModel<boolean>) => {
						if (response.isSuccess) {
							const messageToast = data.bActivo ? 'Rol desactivado exitosamente' : 'Rol activado exitosamente';
							this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
							this.searchTable();
						}
					},
				});
		}
	}
    /**
     * Abre el formulario de creación o edición de rol.
     * @param element Rol a editar (si existe)
     */
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
    /** Establece el filtro de estado: activos, inactivos o todos */
	setFilterState(event: boolean | null) {
		this.filterState.set(event);
	}
}