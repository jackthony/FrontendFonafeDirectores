/*******************************************************************************************************
 * Nombre del componente: ProfileManagementComponent
 * Descripción:           Componente principal para la gestión de perfiles de usuario. Permite listar,
 *                        buscar, editar usuarios y restablecer contraseñas. Integra servicios de
 *                        constantes, roles y usuarios con paginación y diálogos modales.
 * Autor:                 Daniel Alva
 * Fecha de creación:     10/06/2025
 * Última modificación:   23/06/2025 por Daniel Alva
 * Cambios recientes:     - Implementación de paginación y búsqueda por nombre.
 *                        - Integración con diálogos para edición y restablecimiento de contraseñas.
 *                        - Lógica dinámica para carga de roles, cargos y estados desde servicios.
 *******************************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { COLUMNS_PROFILE_MANAGEMENT, CONST_POSITION_USER, CONST_STATUS_USER } from 'app/shared/configs/profile-management/profile-management.config';
import { PROFILE_MANAGEMENT_IMPORTS } from 'app/shared/imports/components/profile-management.imports';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { FormProfileComponent } from '../form-profile/form-profile.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { finalize, forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { ResponseModel } from '@models/IResponseModel';
import { ChangePasswordAdmComponent } from '../change-password-adm/change-password-adm.component';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { SegUserService } from '../../domain/services/seg-user.service';
import { ConstantService } from '../../../shared/domain/services/constant.service';
import { RoleService } from 'app/modules/admin/shared/domain/services/role.service';
import { SegUserEntity } from '../../domain/entities/seg-user.entity';
import { ConstantEntity } from 'app/modules/admin/shared/domain/entities/constant.entity';
import { RoleEntity } from 'app/modules/admin/shared/domain/entities/role.entity';
import { PositionService } from 'app/modules/admin/shared/domain/services/position.service';
import { PositionEntity } from 'app/modules/admin/shared/domain/entities/position.entity';
@Component({
  selector: 'app-profile-management',
  standalone: true,
  imports: [...PROFILE_MANAGEMENT_IMPORTS],
  templateUrl: './profile-management.component.html',
  styleUrl: './profile-management.component.scss'
})
export default class ProfileManagementComponent {
	private readonly _router = inject(Router); // Servicio de Angular para navegar programáticamente entre rutas.
	private readonly _route = inject(ActivatedRoute); // Servicio que permite acceder a información de la ruta actual, como parámetros, datos o fragmentos.
	private _matDialog: MatDialog = inject(MatDialog); // Servicio de Angular Material para abrir y controlar diálogos modales.
	private _segUserService = inject(SegUserService); // Servicio personalizado que gestiona operaciones relacionadas con los usuarios (listar, buscar, editar, etc.).
	private _authorizationService = inject(AuthorizationService); // Servicio que maneja la lógica de permisos y autorización del usuario en la aplicación.
	private _constantService = inject(ConstantService); // Servicio que proporciona acceso a catálogos o constantes definidas en el sistema (e.g., tipos de documento).
	private _positionService = inject(PositionService); // Servicio que proporciona acceso a catálogos o constantes definidas en el sistema (e.g., tipos de documento).
	private _roleService = inject(RoleService); // Servicio encargado de gestionar los roles de usuario (crear, asignar, listar, etc.).
	private _ngxToastrService = inject(NgxToastrService); // Servicio de notificaciones tipo toast, usado para mostrar mensajes de éxito, error o información.
	private _spinner = inject(NgxSpinnerService); // Servicio que permite mostrar y ocultar spinners de carga en la interfaz de usuario.
    titleModule = signal<string>('Gestión de perfiles');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTableActivities = signal<SegUserEntity[]>([]);
	iconsTable = signal<IconOption<SegUserEntity>[]>([]);
	loadingTable = signal<boolean>(false);
	pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
	userSearch = signal<string>('');
	placeHolderSearch = signal<string>('Busca por apellidos y/o nombres');
	delaySearchProfile = signal<number>(400);
	/**
	 * Inicializa el componente cargando la cabecera de la tabla, los íconos y realiza una búsqueda inicial de usuarios.
	 */
	ngOnInit(): void {
		this.headerTable.set(COLUMNS_PROFILE_MANAGEMENT);
		this.iconsTable.set(this.defineIconsTable());
		this.searchUsers();
	}
	/**
	 * Redirige al usuario a la ruta principal del sistema.
	 */
	returnInit(): void {
		this._router.navigate(['home']);
	}
	/**
	 * Realiza la búsqueda paginada de usuarios, aplicando el filtro de nombre si está definido.
	 * También actualiza el número total de páginas para la paginación.
	 */
	searchUsers(): void {
		this.loadingTable.set(true);
		this._segUserService.getByPagination(this.userSearch(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE)
		.pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<SegUserEntity>) => {
				if(response.isSuccess) {
					const totalPages = Math.ceil(response.pagination.totalRows / PAGINATOR_PAGE_SIZE);
					this.totalPagesTable.set(totalPages > 0 ? totalPages : 1);
					this.dataTableActivities.set(response.lstItem); 
				} else {
					this.dataTableActivities.set([]);
				}
			}),
			error: (() => {
				this.totalPagesTable.set(1);
				this.dataTableActivities.set([]); 
			})
		});
	}
	/**
	 * Cambia la página actual del paginador y actualiza la búsqueda de usuarios en base al nuevo índice.
	 * @param event Número de página seleccionado.
	 */
	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		this.searchUsers();
	}
	/**
	 * Establece un nuevo valor de búsqueda y reinicia el índice de página antes de ejecutar la búsqueda de usuarios.
	 * @param event Texto de búsqueda (nombre del usuario).
	 */
	searchByUser(event: string): void {
		this.userSearch.set(event); 
		this.pageIndexTable.set(1); 
		this.searchUsers(); 
	}
	/**
	 * Define los íconos disponibles en cada fila de la tabla de usuarios, con sus respectivas acciones.
	 * @returns Lista de íconos configurados para editar y restablecer contraseña.
	 */
	defineIconsTable(): IconOption<SegUserEntity>[] {
		const resolvedModule = this._route.snapshot.data['module'];
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconRestore = new IconOption("restart_alt", "mat_outline", "Reestablecer contraseña");
		iconEdit.actionIcono = (data: SegUserEntity) => {
            this.loadDataFormDialog(data);
        };
		iconRestore.actionIcono = (data: SegUserEntity) => {
            this.restorePassword(data);
        };
        return [iconEdit, iconRestore];
    }
	/**
	 * Abre el diálogo para restablecer la contraseña de un usuario.
	 * @param element Usuario seleccionado.
	 */
	restorePassword(element: SegUserEntity) {
		const respDialogo = this._matDialog.open(ChangePasswordAdmComponent, {
			data: { object: element },
		    disableClose: true,
			width: "450px",
		    minWidth: "450px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchByUser(null);
			    this._ngxToastrService.showSuccess('Cambio de clave realizado exitosamente', '¡Éxito!');
		    }
		});
	}
	/**
	 * Abre el formulario modal para editar o registrar un nuevo usuario, con listas de estado, cargo y perfil cargadas.
	 * @param element Usuario a editar (null para nuevo).
	 * @param lstStatus Lista de estados disponibles.
	 * @param lstPosition Lista de cargos disponibles.
	 * @param lstProfile Lista de perfiles disponibles.
	 */
	openFormDialog(element: SegUserEntity | null, lstStatus: ConstantEntity[], lstPosition: PositionEntity[], lstProfile: RoleEntity[]): void {
		const respDialogo = this._matDialog.open(FormProfileComponent, {
			data: { object: element, lstStatus, lstPosition, lstProfile },
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchUsers();
				if(element) {
					this._ngxToastrService.showSuccess('Usuario actualizado exitosamente', '¡Éxito!'); 
				} else {
					this._ngxToastrService.showSuccess('Usuario registrado exitosamente', '¡Éxito!'); 
				}
		    }
		});
	}
	/**
	 * Carga en paralelo las listas necesarias (estado, cargo, perfil) para el formulario modal de edición de usuarios.
	 * Luego abre el formulario con la data precargada.
	 * @param element Usuario a editar (opcional).
	 */
	loadDataFormDialog(element?: SegUserEntity | null): void {
		this._spinner.show();
		forkJoin({
			status: this._constantService.getAll(CONST_STATUS_USER),
			position: this._positionService.getAll(),
			profile: this._roleService.getAll()
		})
		.pipe(
			finalize(() => this._spinner.hide()) 
		)
		.subscribe(response => {
			this.openFormDialog(element, response.status.lstItem, response.position.lstItem, response.profile.lstItem);
		})
	}
}