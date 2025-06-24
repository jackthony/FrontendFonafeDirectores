import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseModel } from '@models/IResponseModel';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { COLUMNS_BUSINESS_MANAGEMENT, CONFIG_DELETE_DIALOG_BUSINESS } from 'app/shared/configs/business-management/business-management.config';
import { BUSINESS_MANAGEMENT_IMPORTS } from 'app/shared/imports/business-management/business-management.imports';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { finalize, firstValueFrom, Observable } from 'rxjs';
import { DialogConfirmation } from 'app/modules/admin/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BusinessService } from '../../domain/services/business.service';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-business-management',
  standalone: true,
  imports: [...BUSINESS_MANAGEMENT_IMPORTS],
  templateUrl: './business-management.component.html',
  styleUrl: './business-management.component.scss'
})
export class BusinessManagementComponent {
  // Inyección de dependencias
  private readonly _router = inject(Router); // Servicio de navegación
  private _businessService = inject(BusinessService); // Servicio para la gestión de empresas
  private _dialogConfirmationService = inject(DialogConfirmationService); // Servicio para diálogos de confirmación
  private _ngxToastrService = inject(NgxToastrService); // Servicio para mostrar notificaciones
  private _spinner = inject(NgxSpinnerService); // Servicio para mostrar un spinner de carga
  private _userService = inject(UserService)

  // Definición de variables reactivas y señales
  placeHolderSearch = signal<string>('Busca por múltiples campos'); // Texto para el campo de búsqueda
  downloadEnterprise = signal<string>('Agregar empresa'); // Texto para el botón de agregar empresa
  addEnterprise = signal<string>('Agregar empresa'); // Texto para el botón de agregar empresa
  
  titleModule = signal<string>('Gestión de empresas'); // Título de la página
  headerTable = signal<TableColumnsDefInterface[]>([]); // Columnas de la tabla
  dataTableBusiness = signal<BusinessEntity[]>([]); // Datos de la tabla de empresas
  iconsTable = signal<IconOption<BusinessEntity>[]>([]); // Iconos de la tabla para cada empresa
  loadingTable = signal<boolean>(false); // Indicador de carga de la tabla

  businessSearch = signal<string>(''); // Valor de búsqueda de empresas
  pageIndexTable = signal<number>(1); // Página actual de la tabla
  totalPagesTable = signal<number>(1); // Total de páginas
  delaySearchBusiness = signal<number>(400); // Retraso en la búsqueda (en milisegundos)
  filterState = signal<boolean | null>(true);

  /**
   * Método de inicialización del componente
   */
  ngOnInit(): void {
    this.headerTable.set(COLUMNS_BUSINESS_MANAGEMENT); // Establece las columnas de la tabla
    this.iconsTable.set(this.defineIconsTable()); // Establece los iconos de la tabla
    this.searchBusiness(); // Realiza la búsqueda inicial de empresas
  }

  /**
   * Método para buscar empresas
   */
  	searchBusiness(): void {
        this.loadingTable.set(true); // Activa el indicador de carga
        // Realiza la solicitud a la API para obtener las empresas
        this._businessService.getByPagination(this.businessSearch(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE, this.filterState()).pipe(
          finalize(() => this.loadingTable.set(false)) // Desactiva el indicador de carga después de la solicitud
        ).subscribe({
          next: (response: ResponseModel<BusinessEntity>) => {
            if (response.isSuccess) {
              const totalPages = Math.ceil(response.pagination.totalRows / PAGINATOR_PAGE_SIZE);
              this.totalPagesTable.set(totalPages > 0 ? totalPages : 1); // Calcula el total de páginas
              this.dataTableBusiness.set(response.lstItem); // Asigna los datos de la tabla
            } else this.dataTableBusiness.set([]); // Si la respuesta no es exitosa, vacía la tabla
          },
          error: () => {
            this.totalPagesTable.set(1); // Si hay un error, restablece la paginación
            this.dataTableBusiness.set([]); // Vacía la tabla
          }
        });
  }

  /**
   * Método para cambiar la página de la tabla
   */
  changePageTable(event: number): void {
    this.pageIndexTable.set(event); // Establece la página actual
    this.searchBusiness(); // Realiza la búsqueda para la nueva página
  }

  /**
   * Método para buscar por empresa
   */
  searchByEnterprise(event: string): void {
    this.businessSearch.set(event); // Establece el valor de búsqueda
    this.pageIndexTable.set(1); // Reinicia la página a la primera
    this.searchBusiness(); // Realiza la búsqueda de empresas
  }

  /**
   * Método para agregar una nueva empresa
   */
  addCompany(): void {
    this._router.navigate(['gestion-empresas', 'registro']); // Redirige al formulario para agregar una empresa
  }

  /**
   * Método para definir los iconos de la tabla
   */
  defineIconsTable(): IconOption<BusinessEntity>[] {
    const iconEdit = new IconOption("create", "mat_outline", "Editar"); // Icono para editar
    const iconInactive = new IconOption("remove_circle_outline", "mat_outline", "Desactivar"); // Icono para desactivar
    const iconActive = new IconOption("restart_alt", "mat_outline", "Activar"); // Icono para activar

    // Acciones asociadas a cada icono
    iconEdit.actionIcono = (data: BusinessEntity) => {
      this.editBussines(data); // Llama al método para editar la empresa
    };

    iconInactive.actionIcono = (data: BusinessEntity) => {
      this.deleteBussines(data); // Llama al método para desactivar la empresa
    };

    iconActive.actionIcono = (data: BusinessEntity) => {
      this.deleteBussines(data); // Llama al método para activar la empresa
    };

    // Controla la visibilidad de los iconos según el estado de la empresa
    iconInactive.isHidden = (data: BusinessEntity) => !data.bActivo; // Oculta el icono de desactivar si la empresa ya está desactivada
    iconActive.isHidden = (data: BusinessEntity) => data.bActivo; // Oculta el icono de activar si la empresa ya está activa

    return [iconEdit, iconInactive, iconActive]; // Devuelve los iconos
  }

  /**
   * Método para editar una empresa
   */
  editBussines(data: BusinessEntity): void {
    this._router.navigate([`/gestion-empresas/registro/${data.nIdEmpresa}`]); // Redirige al formulario de edición de la empresa
  }

  /**
   * Método para desactivar o activar una empresa
   */
  async deleteBussines(data: BusinessEntity): Promise<void> {
    const title = data.bActivo ? '¿Estás seguro de desactivar la empresa?' : '¿Estás seguro de activar la empresa?'; // Título del diálogo
    const message = data.bActivo 
      ? 'Recuerda que una vez desactivada la empresa, no podrá ser visualizada como activa, pero podrás consultar su información.'
      : 'Recuerda que una vez activada la empresa, será visualizada como activa'; // Mensaje del diálogo
    const button = data.bActivo ? 'Desactivar' : "Activar"; // Texto del botón de acción

    const config: DialogConfirmation = { // Configura el diálogo de confirmación
      title: title,
      message: message,
      actions: {
        confirm: { label: button }, // Configura el botón de confirmación
        iconClose: false
      },
    };

    const dialogRef = await this._dialogConfirmationService.open(config); // Abre el diálogo de confirmación
    const isValid = await firstValueFrom(dialogRef.afterClosed()); // Espera a que se cierre el diálogo
    if (isValid) {
      this._spinner.show(); // Muestra el spinner de carga
      const request = new BusinessEntity();
      request.nIdEmpresa = data.nIdEmpresa;
      request.nUsuarioModificacion = this._userService.userLogin().usuarioId;
      this._businessService
        .delete(request)
        .pipe(finalize(() => this._spinner.hide())) // Desactiva el spinner después de completar la solicitud
        .subscribe({
          next: (response: ResponseModel<boolean>) => {
            if (response.isSuccess) {
              const messageToast = data.bActivo ? 'Empresa desactivada exitosamente' : 'Empresa activada exitosamente'; // Mensaje de notificación
              this._ngxToastrService.showSuccess(messageToast, '¡Éxito!'); // Muestra la notificación
              this.searchBusiness(); // Realiza la búsqueda nuevamente
            }
          },
        });
    }
  }

  /**
   * Método para redirigir a la página de inicio
   */
    returnInit(): void {
      this._router.navigate(['home']); // Redirige al inicio
    }
  
    exportExcel(): void {
      	const downloadExcel$ = this._businessService.exportExcelEnterprise();
		this.downloadFile(downloadExcel$, 'xlsx', 'application/vnd.ms-excel');
    }
  
    exportPdf(): void {
		const downloadPdf$ = this._businessService.exportPdfEnterprise();
	  	this.downloadFile(downloadPdf$, 'pdf', 'application/pdf');
    }

	downloadFile(observable: Observable<ArrayBuffer>, type: string, mimeType: string) {
        this._spinner.show();
        observable.subscribe({
            next: ((response: ArrayBuffer) => {
                const blob = new Blob([response], { type: mimeType });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                document.body.appendChild(a);
                a.setAttribute("style", "display: none");
                a.href = url;
                a.download = `reporte_empresas.${type}`; // Nombre del archivo a descargar
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                this._spinner.hide();
            })
        })
    };
	/**
	 * Método para establecer el estado del filtro de la tabla.
	 * Permite activar o desactivar el filtro según el parámetro recibido.
	 * @param event Estado del filtro (true, false o null).
	 */
	setFilterState(event: boolean | null) {
		this.filterState.set(event);
	}

}