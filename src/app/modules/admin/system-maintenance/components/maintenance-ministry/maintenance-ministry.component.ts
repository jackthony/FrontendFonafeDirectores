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
import { CONFIG_DELETE_DIALOG_MINISTRY, MAINTENANCE_MINISTRY_MANAGEMENT } from 'app/shared/configs/system-maintenance/maintenance-ministry.config';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { MAINTENANCE_GENERAL_IMPORTS } from 'app/shared/imports/system-maintenance/maintenance-ministry.imports';
import { MinistryService } from 'app/modules/admin/shared/domain/services/ministry.service';
import { MinistryEntity } from 'app/modules/admin/business-management/domain/entities/ministry.entity';

@Component({
  selector: 'app-maintenance-ministry',
  standalone: true,
  imports: [...MAINTENANCE_GENERAL_IMPORTS],
  templateUrl: './maintenance-ministry.component.html',
  styleUrl: './maintenance-ministry.component.scss'
})
export default class MaintenanceMinistryComponent {
    // Inyección de dependencias para gestionar rutas, servicios y otros componentes
    private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);
	private _dialogConfirmationService = inject(DialogConfirmationService);
	private _matDialog: MatDialog = inject(MatDialog);
	private _ministryService = inject(MinistryService);
	private _authorizationService = inject(AuthorizationService);
	private _ngxToastrService = inject(NgxToastrService);
	private _spinner = inject(NgxSpinnerService);
	
    // Señales reactivas para manejar el estado de la tabla y los datos de los ministerios
    titleModule = signal<string>('Mantenedor de ministerios');
	headerTable = signal<TableColumnsDefInterface[]>([]); // Define las columnas de la tabla
	dataTable = signal<MinistryEntity[]>([]); // Define los datos que se mostrarán en la tabla
	iconsTable = signal<IconOption<MinistryEntity>[]>([]); // Define los iconos de las acciones de la tabla
	nameBtnAdd = signal<string>('Agregar ministerio'); // Define el texto del botón de agregar ministerio
	
	// Variables de estado y paginación para la tabla
	loadingTable = signal<boolean>(false);
	pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
	paramSearchTable = signal<string>('');
	placeHolderSearch = signal<string>('Busca por nombre');
	delaySearchTable = signal<number>(400);
	filterState = signal<boolean | null>(null);

	// Método que se ejecuta cuando el componente es inicializado
	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_MINISTRY_MANAGEMENT); // Establece las columnas de la tabla
		this.iconsTable.set(this.defineIconsTable()); // Define los iconos de la tabla
		this.searchTable(); // Realiza la búsqueda de los ministerios
	}

	// Método para redirigir al usuario a la página de inicio
	returnInit(): void {
		this._router.navigate(['home']); // Redirige al usuario a la ruta 'home'
	}

	// Método para buscar los ministerios con paginación
	searchTable(): void {
		this.loadingTable.set(true); // Activa el estado de carga de la tabla
		this._ministryService.getByPagination(this.paramSearchTable(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE, this.filterState()).pipe(
			finalize(() => this.loadingTable.set(false)) // Finaliza la carga cuando termina la operación
		).subscribe({
			next: ((response: ResponseModel<MinistryEntity>) => {
				if(response.isSuccess) {
					const totalPages = Math.ceil(response.pagination.totalRows / PAGINATOR_PAGE_SIZE); // Calcula el total de páginas
					this.totalPagesTable.set(totalPages > 0 ? totalPages : 1); // Establece el número total de páginas
					this.dataTable.set(response.lstItem); // Establece los ministerios en la tabla
				} else {
					this.dataTable.set([]); // Si no hay resultados, vacía la tabla
				}
			}),
			error: (() => {
				this.totalPagesTable.set(1); // En caso de error, establece una sola página
				this.dataTable.set([]); // Vacía los datos de la tabla
			})
		});
	}

	// Método para cambiar la página de la tabla
	changePageTable(event: number): void {
		this.pageIndexTable.set(event); // Establece la nueva página
		this.searchTable(); // Realiza la búsqueda con la nueva página
	}

	// Método para buscar los ministerios por nombre
	searchByItem(event: string): void {
		this.paramSearchTable.set(event); // Establece el término de búsqueda
		this.pageIndexTable.set(1); // Reinicia a la primera página
		this.searchTable(); // Realiza la búsqueda
	}

	// Método para definir los iconos de acción en la tabla
	defineIconsTable(): IconOption<MinistryEntity>[] {
		const resolvedModule = this._route.snapshot.data['module']; // Obtiene el módulo actual desde la ruta
		const authorization = this._authorizationService.canPerform(resolvedModule, 'write'); // Verifica si el usuario tiene permisos para editar

        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconDelete = new IconOption("delete", "mat_outline", "Eliminar");

		// Acción para editar un ministerio
		iconEdit.actionIcono = (data: MinistryEntity) => {
            this.openFormDialog(data);
        };

		// Acción para eliminar un ministerio
		iconDelete.actionIcono = (data: MinistryEntity) => {
            this.deleteBussines(data);
        };

		// Deshabilita los iconos si el usuario no tiene permisos
		iconEdit.isDisabled = (data: MinistryEntity) => !authorization;
		iconDelete.isDisabled = (data: MinistryEntity) => !authorization;

        return [iconEdit, iconDelete]; // Retorna los iconos de acción
    }

	// Método para eliminar un ministerio
	async deleteBussines(data: MinistryEntity): Promise<void> {
		// Abre un diálogo de confirmación para la eliminación
		const dialogRef = await this._dialogConfirmationService.open(CONFIG_DELETE_DIALOG_MINISTRY);
        const isValid = await firstValueFrom(dialogRef.afterClosed()); // Espera la respuesta del diálogo de confirmación
		if(isValid) {
			this._spinner.show(); // Muestra el spinner de carga
			this._ministryService
				.delete(data.nIdMinisterio) // Llama al servicio para eliminar el ministerio
				.pipe(finalize(() => this._spinner.hide())) // Finaliza la operación y oculta el spinner
				.subscribe({
					next: (response: ResponseModel<boolean>) => {
						if (response.isSuccess) {
							const messageToast = 'Ministerio eliminado exitosamente'; // Muestra un mensaje de éxito
							this._ngxToastrService.showSuccess(messageToast, '¡Éxito!'); // Muestra la notificación
							this.searchTable(); // Realiza la búsqueda de los ministerios nuevamente
						}
					},
				});
		}
	}

	// Método para abrir el diálogo de edición o registro de ministerio
	openFormDialog(element?: MinistryEntity | null): void {
		const respDialogo = this._matDialog.open(DialogMinistryFormComponent, {
			data: { object: element }, // Pasa los datos al diálogo
		    disableClose: true, // Desactiva el cierre del diálogo al hacer clic fuera
			width: "700px", // Establece el tamaño del diálogo
		    minWidth: "350px", // Establece el tamaño mínimo del diálogo
			panelClass: 'mat-dialog-not-padding', // Aplica estilos personalizados al diálogo
		});
		// Se suscribe al cierre del diálogo y actualiza la tabla si se confirma la acción
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchTable(); // Realiza la búsqueda de ministerios nuevamente
				if(element) this._ngxToastrService.showSuccess('Ministerio actualizado exitosamente', '¡Éxito!'); // Muestra la notificación de éxito
			    else this._ngxToastrService.showSuccess('Ministerio registrado exitosamente', '¡Éxito!'); // Muestra la notificación de éxito
		    }
		});
	}

	setFilterState(event: boolean | null) {
		this.filterState.set(event);
	}
}
