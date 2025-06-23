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
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
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

@Component({
  selector: 'app-profile-management',
  standalone: true,
  imports: [...PROFILE_MANAGEMENT_IMPORTS],
  templateUrl: './profile-management.component.html',
  styleUrl: './profile-management.component.scss'
})
export default class ProfileManagementComponent {
	// Inyección de dependencias para manejar rutas, servicios y otros componentes
	private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);
	private _matDialog: MatDialog = inject(MatDialog);
	private _segUserService = inject(SegUserService);
	private _authorizationService = inject(AuthorizationService);
	private _constantService = inject(ConstantService);
	private _roleService = inject(RoleService);
	private _ngxToastrService = inject(NgxToastrService);
	private _spinner = inject(NgxSpinnerService);

	// Señales reactivas para controlar el estado de la tabla y el título del módulo
    titleModule = signal<string>('Gestión de perfiles');
	headerTable = signal<TableColumnsDefInterface[]>([]); // Define las columnas de la tabla
	dataTableActivities = signal<SegUserEntity[]>([]); // Define los datos que se mostrarán en la tabla
	iconsTable = signal<IconOption<SegUserEntity>[]>([]); // Define los iconos de las acciones de la tabla
	loadingTable = signal<boolean>(false); // Controla el estado de carga de la tabla
	pageIndexTable = signal<number>(1); // Controla la página actual de la tabla
	totalPagesTable = signal<number>(1); // Controla el número total de páginas
	userSearch = signal<string>(''); // Almacena la búsqueda de usuarios
	placeHolderSearch = signal<string>('Busca por apellidos y/o nombres'); // Define el texto de ayuda para la búsqueda
	delaySearchProfile = signal<number>(400); // Define el retraso para realizar la búsqueda

	// Método que se ejecuta cuando el componente es inicializado
	ngOnInit(): void {
		this.headerTable.set(COLUMNS_PROFILE_MANAGEMENT); // Establece las columnas de la tabla
		this.iconsTable.set(this.defineIconsTable()); // Define los iconos de la tabla
		this.searchUsers(); // Inicia la búsqueda de usuarios
	}

	// Método para redirigir al usuario a la página de inicio
	returnInit(): void {
		this._router.navigate(['home']); // Redirige al usuario a la ruta 'home'
	}

	// Método para buscar usuarios con paginación
	searchUsers(): void {
		this.loadingTable.set(true); // Activa el estado de carga de la tabla
		this._segUserService.getByPagination(this.userSearch(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE)
		.pipe(
			finalize(() => this.loadingTable.set(false)) // Finaliza la carga cuando termina la operación
		).subscribe({
			next: ((response: ResponseModel<SegUserEntity>) => {
				if(response.isSuccess) {
					const totalPages = Math.ceil(response.pagination.totalRows / PAGINATOR_PAGE_SIZE); // Calcula el total de páginas
					this.totalPagesTable.set(totalPages > 0 ? totalPages : 1); // Establece el número total de páginas
					this.dataTableActivities.set(response.lstItem); // Establece los usuarios en la tabla
				} else {
					this.dataTableActivities.set([]); // Si no hay resultados, vacía la tabla
				}
			}),
			error: (() => {
				this.totalPagesTable.set(1); // En caso de error, establece una sola página
				this.dataTableActivities.set([]); // Vacía los datos de la tabla
			})
		});
	}

	// Método para cambiar la página de la tabla
	changePageTable(event: number): void {
		this.pageIndexTable.set(event); // Establece la nueva página
		this.searchUsers(); // Realiza la búsqueda con la nueva página
	}

	// Método para buscar usuarios por nombre
	searchByUser(event: string): void {
		this.userSearch.set(event); // Establece el término de búsqueda
		this.pageIndexTable.set(1); // Reinicia a la primera página
		this.searchUsers(); // Realiza la búsqueda
	}

	// Método para definir los iconos de acción en la tabla
	defineIconsTable(): IconOption<SegUserEntity>[] {
		const resolvedModule = this._route.snapshot.data['module']; // Obtiene el módulo actual desde la ruta
		const authorization = this._authorizationService.canPerform(resolvedModule, 'write'); // Verifica si el usuario tiene permisos para editar

        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconRestore = new IconOption("restart_alt", "mat_outline", "Reestablecer contraseña");

		// Acción para editar un usuario
		iconEdit.actionIcono = (data: SegUserEntity) => {
            this.loadDataFormDialog(data);
        };

		// Acción para restablecer la contraseña de un usuario
		iconRestore.actionIcono = (data: SegUserEntity) => {
            this.restorePassword(data);
        };

		// Deshabilita los iconos si el usuario no tiene permisos
		/* iconEdit.isDisabled = (data: SegUserEntity) => !authorization;
		iconRestore.isDisabled = (data: SegUserEntity) => !authorization; */

        return [iconEdit, iconRestore]; // Retorna los iconos de acción
    }

	// Método para abrir el diálogo de restablecimiento de contraseña
	restorePassword(element: SegUserEntity) {
		const respDialogo = this._matDialog.open(ChangePasswordAdmComponent, {
			data: { object: element },
		    disableClose: true,
			width: "450px",
		    minWidth: "450px",
			panelClass: 'mat-dialog-not-padding',
		});
		// Se suscribe al cierre del diálogo y realiza la búsqueda de usuarios si se confirma el cambio
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchByUser(null); // Reinicia la búsqueda de usuarios
			    this._ngxToastrService.showSuccess('Cambio de clave realizado exitosamente', '¡Éxito!'); // Muestra notificación de éxito
		    }
		});
	}

	// Método para abrir el diálogo de edición o registro de perfil
	openFormDialog(element: SegUserEntity | null, lstStatus: ConstantEntity[], lstPosition: ConstantEntity[], lstProfile: RoleEntity[]): void {
		const respDialogo = this._matDialog.open(FormProfileComponent, {
			data: { object: element, lstStatus, lstPosition, lstProfile },
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		// Se suscribe al cierre del diálogo y actualiza la tabla si se confirma la acción
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchUsers(); // Realiza la búsqueda de usuarios nuevamente
				if(element) {
					this._ngxToastrService.showSuccess('Usuario actualizado exitosamente', '¡Éxito!'); // Muestra notificación de éxito
				} else {
					this._ngxToastrService.showSuccess('Usuario registrado exitosamente', '¡Éxito!'); // Muestra notificación de éxito
				}
		    }
		});
	}

	// Método para cargar los datos necesarios para el formulario de edición de perfil
	loadDataFormDialog(element?: SegUserEntity | null): void {
		this._spinner.show(); // Muestra el spinner de carga
		// Realiza varias solicitudes concurrentes para obtener los datos necesarios para el formulario
		forkJoin({
			status: this._constantService.getAll(CONST_STATUS_USER),
			position: this._constantService.getAll(CONST_POSITION_USER),
			profile: this._roleService.getAll()
		})
		.pipe(
			finalize(() => this._spinner.hide()) // Esconde el spinner cuando la operación finaliza
		)
		.subscribe(response => {
			this.openFormDialog(element, response.status.lstItem, response.position.lstItem, response.profile.lstItem); // Abre el diálogo de formulario con los datos obtenidos
		})
	}
}
