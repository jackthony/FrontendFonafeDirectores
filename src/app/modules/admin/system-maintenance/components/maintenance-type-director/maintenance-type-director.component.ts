/*************************************************************************************
 * Nombre del archivo:  maintenance-type-director.component.ts
 * Descripción:         Componente para la gestión de tipos de director, con paginación,
 *                      búsquedas, acciones de activar/desactivar y diálogos de confirmación.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Creación inicial del componente de mantenimiento de tipo de director.
 **************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseModel } from '@models/IResponseModel';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { CONFIG_ACTIVE_DIALOG_TYPE_DIRECTOR, CONFIG_INACTIVE_DIALOG_TYPE_DIRECTOR, MAINTENANCE_TYPE_DIRECTOR_HEADER_TABLE } from 'app/shared/configs/system-maintenance/maintenance-type-director.config';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, firstValueFrom } from 'rxjs';
import { DialogTypeDirectorFormComponent } from '../dialog-type-director-form/dialog-type-director-form.component';
import { MAINTENANCE_GENERAL_IMPORTS } from 'app/shared/imports/system-maintenance/maintenance-ministry.imports';
import { TypeDirectorService } from 'app/modules/admin/shared/domain/services/type-director.service';
import { TypeDirectorEntity } from 'app/modules/admin/shared/domain/entities/type-director.entity';
import { UserService } from 'app/core/user/user.service';
@Component({
  selector: 'app-maintenance-type-director',
  standalone: true,
  imports: [...MAINTENANCE_GENERAL_IMPORTS],
  templateUrl: './maintenance-type-director.component.html',
  styleUrl: './maintenance-type-director.component.scss'
})
export default class MaintenanceTypeDirectorComponent {
    private readonly _router = inject(Router); // Servicio de enrutamiento para redirecciones
	private readonly _route = inject(ActivatedRoute); // Servicio para obtener parámetros de la ruta activa
	private _dialogConfirmationService = inject(DialogConfirmationService); // Servicio para abrir diálogos de confirmación
	private _matDialog: MatDialog = inject(MatDialog);
	private _sectorService = inject(TypeDirectorService);
	private _authorizationService = inject(AuthorizationService);
	private _ngxToastrService = inject(NgxToastrService); // Servicio para mostrar notificaciones tipo toast
	private _spinner = inject(NgxSpinnerService);
	private _userService = inject(UserService);	// Servicio para obtener información del usuario logueado
    titleModule = signal<string>('Mantenedor Tipo de director');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTable = signal<TypeDirectorEntity[]>([]);
	iconsTable = signal<IconOption<TypeDirectorEntity>[]>([]);
	nameBtnAdd = signal<string>('Agregar tipo');
	loadingTable = signal<boolean>(false);
	pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
	paramSearchTable = signal<string>('');
	placeHolderSearch = signal<string>('Busca por nombre');
	filterState = signal<boolean | null>(true);
	delaySearchTable = signal<number>(400);
	/**
	 * Hook de inicialización del componente.
	 * Inicializa los encabezados de tabla, los íconos de acciones por fila y ejecuta la búsqueda inicial.
	 */	
	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_TYPE_DIRECTOR_HEADER_TABLE);
		this.iconsTable.set(this.defineIconsTable());
		this.searchTable();
	}
	/**
	 * Redirecciona al usuario a la página de inicio del sistema.
	 */
	returnInit(): void {
		this._router.navigate(['home']);
	}
	/**
     * Ejecuta la búsqueda de datos con los filtros actuales.
     * Incluye búsqueda por texto, página actual y filtro de estado.
     */
	searchTable(): void {
		this.loadingTable.set(true);
		this._sectorService.getByPagination(this.paramSearchTable(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE, this.filterState()).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<TypeDirectorEntity>) => {
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
	 * Cambia la página actual de la tabla y ejecuta la búsqueda.
	 * @param event Número de página seleccionado.
	 */
	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		this.searchTable();
	}
	/**
	 * Establece el texto de búsqueda y reinicia la tabla desde la primera página.
	 * @param event Texto ingresado por el usuario.
	 */
	searchByItem(event: string): void {
		this.paramSearchTable.set(event);
		this.pageIndexTable.set(1);
		this.searchTable();
	}
	/**
	 * Define los íconos de acciones disponibles por cada fila:
	 * - Editar
	 * - Activar
	 * - Desactivar
	 * Cada ícono contiene la acción a ejecutar y la condición de visibilidad.
	 * @returns Lista de objetos IconOption configurados.
	 */
	defineIconsTable(): IconOption<TypeDirectorEntity>[] {
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconInactive = new IconOption("remove_circle_outline", "mat_outline", "Desactivar");
    	const iconActive = new IconOption("restart_alt", "mat_outline", "Activar");
		iconEdit.actionIcono = (data: TypeDirectorEntity) => {
            this.openFormDialog(data);
        };
		iconInactive.actionIcono = (data: TypeDirectorEntity) => {
            this.deleteTypeDirector(data);
        };
		iconActive.actionIcono = (data: TypeDirectorEntity) => {
            this.deleteTypeDirector(data);
        };
		iconInactive.isHidden = (data: TypeDirectorEntity) => !data.bActivo;
    	iconActive.isHidden = (data: TypeDirectorEntity) => data.bActivo;
        return [iconEdit, iconInactive, iconActive];
    }
	/**
	 * Ejecuta la lógica de activación o desactivación de un tipo de director.
	 * Muestra un cuadro de confirmación y, en caso afirmativo, envía la solicitud al backend.
	 * @param data Entidad `TypeDirectorEntity` que representa el registro a modificar.
	 */
	async deleteTypeDirector(data: TypeDirectorEntity): Promise<void> {
		const config = data.bActivo ? CONFIG_INACTIVE_DIALOG_TYPE_DIRECTOR : CONFIG_ACTIVE_DIALOG_TYPE_DIRECTOR;
		const dialogRef = await this._dialogConfirmationService.open(config);
        const isValid = await firstValueFrom(dialogRef.afterClosed());
		if(isValid) {
			this._spinner.show();
			const request = new TypeDirectorEntity();
			request.nIdTipoDirector = data.nIdTipoDirector;
			request.nUsuarioModificacion = this._userService.userLogin().usuarioId;
			this._sectorService
				.delete(request)
				.pipe(finalize(() => this._spinner.hide()))
				.subscribe({
					next: (response: ResponseModel<boolean>) => {
						if (response.isSuccess) {
							const messageToast = data.bActivo ? 'Tipo de director desactivado exitosamente' : 'Tipo de director activado exitosamente'; // Muestra un mensaje de éxito
							this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
							this.searchTable();
						}
					},
				});
		}
	}
	/**
	 * Abre un cuadro de diálogo (modal) con el formulario para crear o editar un tipo de director.
	 * Al cerrar el diálogo de forma exitosa, se recarga la tabla.
	 * @param element Entidad existente a editar. Si es null, se abrirá en modo creación.
	 */
	openFormDialog(element?: TypeDirectorEntity | null): void {
		const respDialogo = this._matDialog.open(DialogTypeDirectorFormComponent, {
			data: { object: element },
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchTable();
				if(element) this._ngxToastrService.showSuccess('Tipo de director actualizado exitosamente', '¡Éxito!');
			    else this._ngxToastrService.showSuccess('Tipo de director registrado exitosamente', '¡Éxito!');
				
		    }
		});
	}
	/**
	 * Establece el filtro de estado (activo/inactivo/todos) para la tabla.
	 * @param event Valor booleano (true, false) o null para mostrar todos los estados.
	 */
	setFilterState(event: boolean | null) {
		this.filterState.set(event);
	}
}