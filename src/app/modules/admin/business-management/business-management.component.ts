import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Business } from '@models/business/business.interface';
import { ResponseModel } from '@models/IResponseModel';
import { BusinessService } from '@services/business.service';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { COLUMNS_BUSINESS_MANAGEMENT, CONFIG_DELETE_DIALOG_BUSINESS } from 'app/shared/configs/business-management/business-management.config';
import { BUSINESS_MANAGEMENT_IMPORTS } from 'app/shared/imports/business-management/business-management.imports';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { finalize, firstValueFrom } from 'rxjs';
import { DialogConfirmation } from '@components/fo-dialog-confirmation/models/dialog-confirmation.interface';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-business-management',
  standalone: true,
  imports: [...BUSINESS_MANAGEMENT_IMPORTS],
  templateUrl: './business-management.component.html',
  styleUrl: './business-management.component.scss'
})
export class BusinessManagementComponent {
	private readonly _router = inject(Router);

	private _businessService = inject(BusinessService);
	private _dialogConfirmationService = inject(DialogConfirmationService);
	private _ngxToastrService = inject(NgxToastrService);
	private _spinner = inject(NgxSpinnerService);

	placeHolderSearch = signal<string>('Busca por múltiples campos');
	addEnterprise = signal<string>('Agregar empresa');
	
    titleModule = signal<string>('Gestión de empresas');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTableBusiness = signal<Business[]>([]);
	iconsTable = signal<IconOption<Business>[]>([]);
	loadingTable = signal<boolean>(false);

	businessSearch = signal<string>('');
	pageIndexTable = signal<number>(1);

	totalPagesTable = signal<number>(1);

	delaySearchBusiness = signal<number>(400);
	
	ngOnInit(): void {
		this.headerTable.set(COLUMNS_BUSINESS_MANAGEMENT);
		this.iconsTable.set(this.defineIconsTable());
		this.searchBusiness();
	}

	searchBusiness(): void {
		this.loadingTable.set(true);
		const request = new RequestOption();
		request.queryParams = [
			{ key: 'pageIndex' , value: this.pageIndexTable() },
			{ key: 'pageSize' , value: PAGINATOR_PAGE_SIZE }
		];
		if(this.businessSearch()) 
			request.queryParams.push({ key: 'nameEnterprise', value: this.businessSearch() });
		this._businessService.getByPagination(request).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<Business>) => {
				if(response.isSuccess){
					const totalPages = Math.ceil(response.pagination.totalRows/PAGINATOR_PAGE_SIZE);
					this.totalPagesTable.set(totalPages > 0 ? totalPages : 1);
					this.dataTableBusiness.set(response.lstItem);
				} else this.dataTableBusiness.set([])
			}),
			error:(() => {
				this.totalPagesTable.set(1);
				this.dataTableBusiness.set([]);
			})
		})
	}

	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		this.searchBusiness();
	}

	searchByEnterprise(event: string): void {
		this.businessSearch.set(event);
		this.pageIndexTable.set(1);
		this.searchBusiness();
	}



	addCompany(): void {
		this._router.navigate(['gestion-empresas', 'registro']);
	}


	defineIconsTable(): IconOption<Business>[]{
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconInactive = new IconOption("remove_circle_outline", "mat_outline", "Desactivar");
        const iconActive = new IconOption("restart_alt", "mat_outline", "Activar");

		iconEdit.actionIcono = (data: Business) => {
            this.editBussines(data);
        };

		iconInactive.actionIcono = (data: Business) => {
            this.deleteBussines(data);
        };

		iconActive.actionIcono = (data: Business) => {
            this.deleteBussines(data);
        };

		iconInactive.isHidden = (data: Business) => !data.bActivo;
		iconActive.isHidden = (data: Business) => data.bActivo;


        return [iconEdit, iconInactive, iconActive];
    }

	editBussines(data: Business): void {
		this._router.navigate([`/gestion-empresas/registro/${data.nIdEmpresa}`]);
	}

	async deleteBussines(data: Business): Promise<void> {
		const title = data.bActivo ? '¿Estás seguro de desactivar la empresa?' : '¿Estás seguro de activar la empresa?';
		const message = data.bActivo ? 'Recuerda que una vez desactivada la empresa, no podrá ser visualizada como activa, pero podrás consultar su información.' : 'Recuerda que una vez activada la empresa, sera visualizada como activa';
		const button = data.bActivo ? 'Desactivar' : "Activar";
		const config: DialogConfirmation = {
			title: title,
			message: message,
			actions: {
				confirm: {
					label: button,
				},
				iconClose: false
			},
		};

		const dialogRef = await this._dialogConfirmationService.open(config);
        const isValid = await firstValueFrom(dialogRef.afterClosed());
		if(isValid) {
			this._spinner.show();
			const request = new RequestOption();
				request.resource = "Delete",
				request.pathVariables = [data.nIdEmpresa];
				this._businessService
					.delete(request)
					.pipe(finalize(() => this._spinner.hide()))
					.subscribe({
						next: (response: ResponseModel<number>) => {
							if (response.isSuccess) {
								const messageToast = data.bActivo ? 'Empresa desactivada exitosamente' : 'Empresa activada exitosamente';
								this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
								this.searchBusiness();
							}
						},
					});
		}
		
	}



	returnInit(): void {
		this._router.navigate(['home']);
	}
}
