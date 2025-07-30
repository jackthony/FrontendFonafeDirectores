/*************************************************************************************
 * Nombre del archivo:  maintenance-industry.component.ts
 * Descripción:         Componente para la gestión de rubros: búsqueda, paginación,
 *                      alta/edición, activación y desactivación con confirmación.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Adaptación completa siguiendo patrón general de mantenedores.
 *************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PAGINATOR_PAGE_SIZE } from 'app/shared/config/paginator.config';
import { CONFIG_ACTIVE_DIALOG_INDUSTRY, CONFIG_INACTIVE_DIALOG_INDUSTRY, MAINTENANCE_INDUSTRY_HEADER_TABLE } from 'app/modules/business/config/maintenance/maintenance-industry.config';
import { IconOption } from 'app/shared/interfaces/generic-icon.interface';
import { TableColumnsDefInterface } from 'app/shared/interfaces/table-columns-def.interface';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, firstValueFrom } from 'rxjs';
import { DialogIndustryFormComponent } from '../dialog-industry-form/dialog-industry-form.component';
import { IndustryService } from 'app/modules/business/domain/services/maintenance/industry.service';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { ResponseEntity } from '@models/response.entity';
import { IndustryEntity } from 'app/modules/business/domain/entities/maintenance/industry.entity';
@Component({
  selector: 'app-maintenance-industry',
  standalone: false,
  templateUrl: './maintenance-industry.component.html',
  styleUrl: './maintenance-industry.component.scss'
})
export default class MaintenanceIndustryComponent {
    private readonly _router = inject(Router); // Router para navegación
	private readonly _route = inject(ActivatedRoute); // ActivatedRoute para obtener parámetros de la ruta
	private _dialogConfirmationService = inject(DialogConfirmationService); // Servicio para diálogos de confirmación
	private _matDialog: MatDialog = inject(MatDialog); // MatDialog para abrir diálogos
	private _sectorService = inject(IndustryService); // Servicio para operaciones con rubros
	private _authorizationService = inject(AuthorizationService); // Servicio de autorización para verificar permisos
	private _ngxToastrService = inject(NgxToastrService); // Servicio para mostrar notificaciones tipo toast
	private _spinner = inject(NgxSpinnerService); // Servicio para mostrar spinner de carga
	private _userService = inject(UserService); // Servicio para obtener información del usuario logueado
    titleModule = signal<string>('Mantenedor de rubros');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTable = signal<IndustryEntity[]>([]);
	iconsTable = signal<IconOption<IndustryEntity>[]>([]);
	nameBtnAdd = signal<string>('Agregar rubro');
	loadingTable = signal<boolean>(false);
	pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
	paramSearchTable = signal<string>('');
	placeHolderSearch = signal<string>('Busca por nombre');
	filterState = signal<boolean | null>(true);
	/**
	 * Hook de ciclo de vida que se ejecuta al inicializar el componente.
	 * - Carga las cabeceras e íconos de la tabla desde configuración.
	 * - Ejecuta la búsqueda inicial de rubros.
	 */
	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_INDUSTRY_HEADER_TABLE);
		this.iconsTable.set(this.defineIconsTable());
		this.searchTable();
	}
	/**
	 * Redirige al usuario a la vista principal del sistema ('home').
	 * Puede utilizarse como acción de salida del mantenedor.
	 */
	returnInit(): void {
		this._router.navigate(['home']);
	}
	/**
	 * Método para buscar rubros con paginación y filtrado.
	 * Utiliza el servicio de sector para obtener los datos y actualiza la tabla.
	 */
	searchFilter(): void {
		this.pageIndexTable.set(1); 
		this.searchTable();
	}

	searchTable(resetIndexTable?: boolean): void {
		if(resetIndexTable) this.pageIndexTable.set(1);
		this.loadingTable.set(true);
		this._sectorService.getByPagination(this.paramSearchTable(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE, this.filterState()).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseEntity<IndustryEntity>) => {
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
	 * Método para cambiar la página de la tabla.
	 * Actualiza el índice de la página y realiza una nueva búsqueda.
	 * @param event Número de página seleccionado.
	 */
	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		this.searchTable();
	}
	/**
	 * Método para buscar rubros por el texto ingresado en el campo de búsqueda.
	 * Reinicia la paginación y realiza una nueva búsqueda.
	 * @param event Texto del campo de búsqueda.
	 */
	searchByItem(event: string): void {
		if(event.length >= 1 && event.trim().length === 0) return;
		this.paramSearchTable.set(event?.trim());
		this.pageIndexTable.set(1);
		this.searchTable();
	}
	/**
	 * Método para definir los iconos de acción de la tabla.
	 * Incluye iconos para editar, desactivar y activar rubros.
	 * @returns Array de IconOption con los iconos definidos.
	 */
	defineIconsTable(): IconOption<IndustryEntity>[] {
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconInactive = new IconOption("trash", "heroicons_outline", "Eliminar");
    	const iconActive = new IconOption("settings_backup_restore", "mat_outline", "Activar");
		iconEdit.actionIcono = (data: IndustryEntity) => {
            this.openFormDialog(data);
        };
		iconInactive.actionIcono = (data: IndustryEntity) => {
            this.deleteIndustry(data);
        };
		iconActive.actionIcono = (data: IndustryEntity) => {
            this.deleteIndustry(data);
        };
		iconInactive.isHidden = (data: IndustryEntity) => !data.bActivo;
    	iconActive.isHidden = (data: IndustryEntity) => data.bActivo;
        return [iconEdit, iconInactive, iconActive];
    }
		/**
	 * Activa o desactiva un ministerio seleccionado, solicitando confirmación previa.
	 * @param data Registro de IndustryEntity sobre el cual aplicar la acción.
	 */
	async deleteIndustry(data: IndustryEntity): Promise<void> {
		const config = data.bActivo ? CONFIG_INACTIVE_DIALOG_INDUSTRY : CONFIG_ACTIVE_DIALOG_INDUSTRY;
		const dialogRef = await this._dialogConfirmationService.open(config);
        const isValid = await firstValueFrom(dialogRef.afterClosed());
		if(isValid) {
			this._spinner.show();
			const request = new IndustryEntity();
			request.nIdRubro = data.nIdRubro;
			request.nUsuarioModificacion = this._userService.userLogin().usuarioId;
			this._sectorService
				.delete(request)
				.pipe(finalize(() => this._spinner.hide()))
				.subscribe({
					next: (response: ResponseEntity<boolean>) => {
						if (response.isSuccess) {
							const messageToast = data.bActivo ? 'Rubro eliminado exitosamente' : 'Rubro activado exitosamente'; // Muestra un mensaje de éxito
							this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
							this.searchTable();
						}
					},
				});
		}
	}
	/**
	 * Abre un diálogo para agregar o editar un rubro.
	 * Si se proporciona un elemento, se abre en modo edición; de lo contrario, en modo creación.
	 * @param element Objeto de tipo IndustryEntity a editar, o null para crear uno nuevo.
	 */
	openFormDialog(element?: IndustryEntity | null): void {
		const respDialogo = this._matDialog.open(DialogIndustryFormComponent, {
			data: { object: element },
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchTable();
				if(element) this._ngxToastrService.showSuccess('Rubro actualizado exitosamente', '¡Éxito!');
			    else this._ngxToastrService.showSuccess('Rubro registrado exitosamente', '¡Éxito!');
				
		    }
		});
	}
	/**
	 * Método para establecer el estado del filtro de la tabla.
	 * Permite activar o desactivar el filtro según el parámetro recibido.
	 * @param event Estado del filtro (true, false o null).
	 */
	setFilterState(event: boolean | null) {
		this.filterState.set(event);
	}
}