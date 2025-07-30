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
import { PAGINATOR_PAGE_SIZE } from 'app/shared/config/paginator.config';
import { CONFIG_ACTIVE_DIALOG_ROLE, CONFIG_INACTIVE_DIALOG_ROLE, MAINTENANCE_ROL_HEADER_TABLE } from 'app/modules/business/config/maintenance/maintenance-role.config';
import { IconOption } from 'app/shared/interfaces/generic-icon.interface';
import { TableColumnsDefInterface } from 'app/shared/interfaces/table-columns-def.interface';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, firstValueFrom } from 'rxjs';
import { RoleEntity } from 'app/modules/user/domain/entities/maintenance/role.entity';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { ResponseEntity } from '@models/response.entity';
import { DialogMaintenanceRoleFormComponent } from '../dialog-maintenance-role-form/dialog-maintenance-role-form.component';
import { DialogMaintenanceRoleModulesComponent } from '../dialog-maintenance-role-modules/dialog-maintenance-role-modules.component';
import { RoleService } from 'app/modules/user/domain/services/maintenance/role.service';
import { ModuleService } from 'app/modules/user/domain/services/profile/module.service';
import { ModuleEntity } from 'app/modules/user/domain/entities/maintenance/module.entity';
@Component({
  selector: 'app-maintenance-role',
  standalone: false,
  templateUrl: './maintenance-role.component.html',
  styleUrl: './maintenance-role.component.scss'
})
export default class MaintenanceRoleComponent {
    private readonly _router = inject(Router); // Servicio de enrutamiento para navegación
	private readonly _route = inject(ActivatedRoute); // Ruta activa para navegación
	private _dialogConfirmationService = inject(DialogConfirmationService); // Servicio para abrir diálogos de confirmación
	private _matDialog: MatDialog = inject(MatDialog); // Servicio de diálogo para formularios
	private _roleService = inject(RoleService); // Servicio para manejar roles
	private _authorizationService = inject(AuthorizationService); // Servicio para manejar autorizaciones
	private _ngxToastrService = inject(NgxToastrService); // Servicio para mostrar notificaciones tipo toast
	private _spinner = inject(NgxSpinnerService); // Servicio para mostrar spinner de carga
	private _userService = inject(UserService); // Servicio para obtener información del usuario logueado
	private _moduleService = inject(ModuleService); // Servicio para obtener información del usuario logueado
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
	/**
	 * Hook de inicialización del componente.
	 * Carga la definición de columnas, íconos y ejecuta la búsqueda inicial de datos.
	 */
	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_ROL_HEADER_TABLE);
		this.iconsTable.set(this.defineIconsTable());
		this.searchTable();
	}
	/**
	 * Redirige al usuario a la página principal del sistema.
	 */
	returnInit(): void {
		this._router.navigate(['home']);
	}
	/**
	 * Ejecuta la búsqueda paginada de roles, aplicando filtros por nombre y estado.
	 * Actualiza la tabla y el total de páginas según la respuesta del servicio.
	 */
	searchTable(resetIndexTable?: boolean): void {
		if(resetIndexTable) this.pageIndexTable.set(1);
		this.loadingTable.set(true);
		this._roleService.getByPagination(this.paramSearchTable(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE, this.filterState() ).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseEntity<RoleEntity>) => {
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
		if(event.length >= 1 && event.trim().length === 0) return;
		this.paramSearchTable.set(event?.trim());
		this.pageIndexTable.set(1);
		this.searchTable();
	}
	/**
	 * Define los íconos y acciones disponibles para cada fila de la tabla.
	 * La visibilidad de los íconos depende del estado activo/inactivo del rol.
	 * @returns Lista de íconos con acciones asociadas para la tabla.
	 */
	defineIconsTable(): IconOption<RoleEntity>[] {
        const iconPermission = new IconOption("app_blocking", "mat_outline", "Definición de permisos");
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconInactive = new IconOption("trash", "heroicons_outline", "Eliminar");
   		const iconActive = new IconOption("settings_backup_restore", "mat_outline", "Activar");
		iconPermission.actionIcono = (data: RoleEntity) => {
            this.loadDataModules(data);
        };
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
        return [iconPermission, iconEdit, iconInactive, iconActive];
    }
	/**
	 * Activa o desactiva un rol, según su estado actual.
	 * Solicita confirmación al usuario antes de realizar la operación.
	 * @param data Objeto de tipo RoleEntity correspondiente al rol seleccionado.
	 */
	async deleteRole(data: RoleEntity): Promise<void> {
		const config = data.bActivo ? CONFIG_INACTIVE_DIALOG_ROLE : CONFIG_ACTIVE_DIALOG_ROLE;
		const dialogRef = await this._dialogConfirmationService.open(config);
        const isValid = await firstValueFrom(dialogRef.afterClosed());
		if(isValid) {
			this._spinner.show();
			const request = new RoleEntity();
			request.nRolId = data.nRolId;
			request.nUsuarioModificacionId = this._userService.userLogin().usuarioId;
			this._roleService
				.delete(request)
				.pipe(finalize(() => this._spinner.hide()))
				.subscribe({
					next: (response: ResponseEntity<boolean>) => {
						if (response.isSuccess) {
							const messageToast = data.bActivo ? 'Rol eliminado exitosamente' : 'Rol activado exitosamente';
							this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
							this.searchTable();
						}
					},
				});
		}
	}
	/**
	 * Abre un diálogo modal para registrar un nuevo rol o editar uno existente.
	 * Al cerrarse con éxito, actualiza la tabla y muestra notificación correspondiente.
	 * @param element (Opcional) Rol que se desea editar. Si no se proporciona, se asume un nuevo registro.
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

	loadDataModules(element: RoleEntity): void {
		this._spinner.show();
		this._moduleService.getAllActionsModules(element.nRolId)
		.pipe(
			finalize(() => this._spinner.hide()) 
		)
		.subscribe(response => {
			this.openFormDialogModules(element, response.lstItem);
		})
	}

	openFormDialogModules(element: RoleEntity, modules: ModuleEntity[]): void {
		const respDialogo = this._matDialog.open(DialogMaintenanceRoleModulesComponent, {
			data: { object: element, modules },
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchTable();
				this._ngxToastrService.showSuccess('Permisos actualizado exitosamente', '¡Éxito!');
		    }
		});
	}
	/**
	 * Aplica filtro por estado: activos, inactivos o todos (null).
	 * @param event Estado seleccionado (true, false o null).
	 */
	setFilterState(event: boolean | null) {
		this.filterState.set(event);
	}
}