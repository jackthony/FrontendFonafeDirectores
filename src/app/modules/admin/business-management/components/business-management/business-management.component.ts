/*******************************************************************************************************
 * Nombre del archivo : business-management.component.ts
 * Descripción         : Componente para la gestión de empresas. Permite listar, buscar, exportar,
 *                       activar/desactivar y navegar al registro de empresas.
 * Autor               : Daniel Alva
 * Fecha de creación   : 23/06/2025
 *******************************************************************************************************/
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseModel } from '@models/IResponseModel';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { COLUMNS_BUSINESS_MANAGEMENT } from 'app/shared/configs/business-management/business-management.config';
import { BUSINESS_MANAGEMENT_IMPORTS } from 'app/shared/imports/business-management/business-management.imports';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { finalize, firstValueFrom, Observable } from 'rxjs';
import { DialogConfirmation } from 'app/modules/admin/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BusinessService } from '../../domain/services/business.service';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { UserService } from 'app/core/user/user.service';
import { ArchiveService } from 'app/modules/admin/shared/domain/services/archive.service';
import { ArchivingProcessService } from 'app/modules/admin/shared/domain/services/archiving-process.service';

@Component({
  selector: 'app-business-management',
  standalone: true,
  imports: [...BUSINESS_MANAGEMENT_IMPORTS],
  templateUrl: './business-management.component.html',
  styleUrl: './business-management.component.scss'
})
export class BusinessManagementComponent implements OnInit {
  private readonly _router = inject(Router); // Servicio de navegación
  private _businessService = inject(BusinessService); // Servicio para la gestión de empresas
  private _archiveService = inject(ArchiveService); // Servicio para la gestión de empresas
  private _dialogConfirmationService = inject(DialogConfirmationService); // Servicio para diálogos de confirmación
  private _ngxToastrService = inject(NgxToastrService); // Servicio para mostrar notificaciones
  private _spinner = inject(NgxSpinnerService); // Servicio para mostrar un spinner de carga
  private _archivingProcessService = inject(ArchivingProcessService); // Servicio para mostrar un spinner de carga
  private _userService = inject(UserService)
  placeHolderSearch = signal<string>('Busca por múltiples campos');
  downloadEnterprise = signal<string>('Agregar empresa');
  addEnterprise = signal<string>('Agregar empresa');
  titleModule = signal<string>('Gestión de empresas'); 
  headerTable = signal<TableColumnsDefInterface[]>([]); 
  dataTableBusiness = signal<BusinessEntity[]>([]); 
  iconsTable = signal<IconOption<BusinessEntity>[]>([]); 
  loadingTable = signal<boolean>(false);
  businessSearch = signal<string>('');
  pageIndexTable = signal<number>(1);
  totalPagesTable = signal<number>(1);
  delaySearchBusiness = signal<number>(400);
  filterState = signal<boolean | null>(true);
  
  /**
   * Método de inicialización del componente
   */
  ngOnInit(): void {
    this.headerTable.set(COLUMNS_BUSINESS_MANAGEMENT);
    this.iconsTable.set(this.defineIconsTable());
    this.searchBusiness();
  }
  
  /**
   * Método para buscar empresas
   */
  	searchBusiness(resetIndexTable?: boolean): void {
		if(resetIndexTable) this.pageIndexTable.set(1);
        this.loadingTable.set(true);
        this._businessService.getByPagination(this.businessSearch(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE, this.filterState()).pipe(
          finalize(() => this.loadingTable.set(false))
        ).subscribe({
          next: (response: ResponseModel<BusinessEntity>) => {
            if (response.isSuccess) {
              const totalPages = Math.ceil(response.pagination.totalRows / PAGINATOR_PAGE_SIZE);
              this.totalPagesTable.set(totalPages > 0 ? totalPages : 1);
              this.dataTableBusiness.set(response.lstItem);
            } else this.dataTableBusiness.set([]); 
          },
          error: () => {
            this.totalPagesTable.set(1);
            this.dataTableBusiness.set([]); 
          }
        });
  }
  searchFilter(): void {
	this.pageIndexTable.set(1); 
	this.searchBusiness();
  }
  /**
   * Método para cambiar la página de la tabla
   */
  changePageTable(event: number): void {
    this.pageIndexTable.set(event);
    this.searchBusiness(); 
  }
  /**
   * Método para buscar por empresa
   */
  searchByEnterprise(event: string): void {
    this.businessSearch.set(event); 
    this.pageIndexTable.set(1); 
    this.searchBusiness(); 
  }
  /**
   * Método para agregar una nueva empresa
   */
  addCompany(): void {
    this._router.navigate(['gestion-empresas', 'registro']);
  }
  /**
   * Método para definir los iconos de la tabla
   */
  defineIconsTable(): IconOption<BusinessEntity>[] {
    const iconEdit = new IconOption("create", "mat_outline", "Editar");
    const iconInactive = new IconOption("remove_circle_outline", "mat_outline", "Desactivar");
    const iconActive = new IconOption("restart_alt", "mat_outline", "Activar");
    iconEdit.actionIcono = (data: BusinessEntity) => {
      this.editBussines(data);
    };
    iconInactive.actionIcono = (data: BusinessEntity) => {
      this.deleteBussines(data);
    };
    iconActive.actionIcono = (data: BusinessEntity) => {
      this.deleteBussines(data);
    };
    iconInactive.isHidden = (data: BusinessEntity) => !data.bActivo;
    iconActive.isHidden = (data: BusinessEntity) => data.bActivo; 
    return [iconEdit, iconInactive, iconActive];
  }
  /**
   * Método para editar una empresa
   */
  editBussines(data: BusinessEntity): void {
    this._router.navigate([`/gestion-empresas/registro/${data.nIdEmpresa}`]);
  }
  /**
   * Método para desactivar o activar una empresa
   */
  async deleteBussines(data: BusinessEntity): Promise<void> {
    const title = data.bActivo ? '¿Estás seguro de desactivar la empresa?' : '¿Estás seguro de activar la empresa?';
    const message = data.bActivo 
      ? 'Recuerda que una vez desactivada la empresa, no podrá ser visualizada como activa, pero podrás consultar su información.'
      : 'Recuerda que una vez activada la empresa, será visualizada como activa';
    const button = data.bActivo ? 'Desactivar' : "Activar";
    const config: DialogConfirmation = {
      title: title,
      message: message,
      actions: {
        confirm: { label: button },
        iconClose: false
      },
    };
    const dialogRef = await this._dialogConfirmationService.open(config);
    const isValid = await firstValueFrom(dialogRef.afterClosed());
    if (isValid) {
      this._spinner.show();
      const request = new BusinessEntity();
      request.nIdEmpresa = data.nIdEmpresa;
      request.nUsuarioModificacion = this._userService.userLogin().usuarioId;
      this._businessService
        .delete(request)
        .pipe(finalize(() => this._spinner.hide()))
        .subscribe({
          next: (response: ResponseModel<boolean>) => {
            if (response.isSuccess) {
              const messageToast = data.bActivo ? 'Empresa desactivada exitosamente' : 'Empresa activada exitosamente';
              this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
              this.searchBusiness(); 
            }
          },
        });
    }
  }
  /**
   * Método para redirigir a la página de inicio
   */
    returnInit(): void {
      this._router.navigate(['home']);
    }
	async importExcel(): Promise<void> {
		const file = await this._archivingProcessService.uploadFile('.xls,.xlsx');
        const formData: FormData = new FormData();
        formData.append('Archivo', file);
        formData.append('nUsuarioId', this._userService.userLogin().usuarioId.toString());
		this._spinner.show();
		this._archiveService.importExcelBussines(formData)
        .pipe(
            finalize(() => this._spinner.hide())
        )
        .subscribe({
            next: (response: ResponseModel<boolean>) => {
                if (response.isSuccess) {
                    this._ngxToastrService.showSuccess('Documento registrado exitosamente', '¡Éxito!');
					this.searchBusiness();
                }
            },
        })

	}
    exportExcel(): void {
      	const downloadExcel$ = this._archiveService.getReportExcelBussines();
		this.downloadFile(downloadExcel$, 'xlsx', 'application/vnd.ms-excel');
    }
    exportPdf(): void {
		const downloadPdf$ = this._archiveService.getReportPdfBussines();
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
                a.download = `reporte_empresas.${type}`;
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