import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseModel } from '@models/IResponseModel';
import { MinistryService } from '@services/ministry.service';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, firstValueFrom } from 'rxjs';
import { DialogMinistryFormComponent } from './dialog/dialog-ministry-form/dialog-ministry-form.component';
import { Ministry } from '@models/system-maintenance/ministry.interface';
import { CONFIG_DELETE_DIALOG_MINISTRY, MAINTENANCE_MINISTRY_MANAGEMENT } from 'app/shared/configs/system-maintenance/maintenance-ministry.config';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { MAINTENANCE_GENERAL_IMPORTS } from 'app/shared/imports/system-maintenance/maintenance-ministry.imports';

@Component({
  selector: 'app-maintenance-ministry',
  standalone: true,
  imports: [...MAINTENANCE_GENERAL_IMPORTS],
  templateUrl: './maintenance-ministry.component.html',
  styleUrl: './maintenance-ministry.component.scss'
})
export default class MaintenanceMinistryComponent {
    private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);
	private _dialogConfirmationService = inject(DialogConfirmationService);

	private _matDialog: MatDialog = inject(MatDialog);

	private _ministryService = inject(MinistryService);
	private _authorizationService = inject(AuthorizationService);

	private _ngxToastrService = inject(NgxToastrService);
	private _spinner = inject(NgxSpinnerService);
	
    titleModule = signal<string>('Mantenedor de ministerios');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTable = signal<Ministry[]>([]);
	iconsTable = signal<IconOption<Ministry>[]>([]);
	nameBtnAdd = signal<string>('Agregar ministerio');
	
	loadingTable = signal<boolean>(false);
	pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
	paramSearchTable = signal<string>('');
	placeHolderSearch = signal<string>('Busca por nombre');

	delaySearchTable = signal<number>(400);

	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_MINISTRY_MANAGEMENT);
		this.iconsTable.set(this.defineIconsTable());
		this.searchTable();
	}

	returnInit(): void {
		this._router.navigate(['home']);
	}

	searchTable(): void {
		this.loadingTable.set(true);
		const request = new RequestOption();
		request.queryParams = [
			{ key: 'pageIndex' , value: this.pageIndexTable() },
			{ key: 'pageSize' , value: PAGINATOR_PAGE_SIZE }
		];
		if(this.paramSearchTable()) 
			request.queryParams.push({ key: 'name', value: this.paramSearchTable() }); //FALTA AQUI
		this._ministryService.getByPagination(request).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<Ministry>) => {
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

	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		this.searchTable();
	}

	searchByItem(event: string): void {
		this.paramSearchTable.set(event);
		this.pageIndexTable.set(1);
		this.searchTable();
	}


	defineIconsTable(): IconOption<Ministry>[]{
		const resolvedModule = this._route.snapshot.data['module'];
		const authorization = this._authorizationService.canPerform(resolvedModule, 'write');

        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconDelete = new IconOption("delete", "mat_outline", "Eliminar");

		iconEdit.actionIcono = (data: Ministry) => {
            this.openFormDialog(data);
        };

		iconDelete.actionIcono = (data: Ministry) => {
            this.deleteBussines(data);
        };

		iconEdit.isDisabled = (data: Ministry) => !authorization;
		iconDelete.isDisabled = (data: Ministry) => !authorization;

        return [iconEdit, iconDelete];
    }

	async deleteBussines(data: Ministry): Promise<void> {

		const dialogRef = await this._dialogConfirmationService.open(CONFIG_DELETE_DIALOG_MINISTRY);
        const isValid = await firstValueFrom(dialogRef.afterClosed());
		if(isValid) {
			this._spinner.show();
			const request = new RequestOption();
				request.resource = "Delete",
				request.pathVariables = [data.nIdMinisterio];
				this._ministryService
					.delete(request)
					.pipe(finalize(() => this._spinner.hide()))
					.subscribe({
						next: (response: ResponseModel<Ministry>) => {
							if (response.isSuccess) {
								const messageToast = 'Ministerio eliminado exitosamente';
								this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
								this.searchTable();
							}
						},
					});
		}
	}

	openFormDialog(element?: Ministry | null): void {
		const respDialogo = this._matDialog.open(DialogMinistryFormComponent, {
			data: { object: element },
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchTable();
				if(element) this._ngxToastrService.showSuccess('Ministerio actualizado exitosamente', '¡Éxito!');
			    else this._ngxToastrService.showSuccess('Ministerio registrado exitosamente', '¡Éxito!');
				
		    }
		});
	}
}
