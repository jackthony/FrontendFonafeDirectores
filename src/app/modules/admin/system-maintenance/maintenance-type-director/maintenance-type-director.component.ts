import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseModel } from '@models/IResponseModel';
import { TypeDirector } from '@models/system-maintenance/type-director.interface';
import { SectorService } from '@services/sector.service';
import { TypeDirectorService } from '@services/type-director.service';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { CONFIG_DELETE_DIALOG_TYPE_DIRECTOR, MAINTENANCE_TYPE_DIRECTOR_HEADER_TABLE } from 'app/shared/configs/system-maintenance/maintenance-type-director.config';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, firstValueFrom } from 'rxjs';
import { DialogTypeDirectorFormComponent } from './dialog/dialog-type-director-form/dialog-type-director-form.component';
import { MAINTENANCE_GENERAL_IMPORTS } from 'app/shared/imports/system-maintenance/maintenance-ministry.imports';

@Component({
  selector: 'app-maintenance-type-director',
  standalone: true,
  imports: [...MAINTENANCE_GENERAL_IMPORTS],
  templateUrl: './maintenance-type-director.component.html',
  styleUrl: './maintenance-type-director.component.scss'
})
export default class MaintenanceTypeDirectorComponent {
    private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);
	private _dialogConfirmationService = inject(DialogConfirmationService);

	private _matDialog: MatDialog = inject(MatDialog);

	private _sectorService = inject(TypeDirectorService);
	private _authorizationService = inject(AuthorizationService);

	private _ngxToastrService = inject(NgxToastrService);
	private _spinner = inject(NgxSpinnerService);
	
    titleModule = signal<string>('Mantenedor Tipo de director');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTable = signal<TypeDirector[]>([]);
	iconsTable = signal<IconOption<TypeDirector>[]>([]);
	nameBtnAdd = signal<string>('Agregar tipo');
	
	loadingTable = signal<boolean>(false);
	pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
	paramSearchTable = signal<string>('');
	placeHolderSearch = signal<string>('Busca por nombre');

	delaySearchTable = signal<number>(400);

	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_TYPE_DIRECTOR_HEADER_TABLE);
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
			request.queryParams.push({ key: 'name', value: this.paramSearchTable() });
		this._sectorService.getByPagination(request).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<TypeDirector>) => {
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


	defineIconsTable(): IconOption<TypeDirector>[]{
		const resolvedModule = this._route.snapshot.data['module'];
		const authorization = this._authorizationService.canPerform(resolvedModule, 'write');

        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconDelete = new IconOption("delete", "mat_outline", "Eliminar");

		iconEdit.actionIcono = (data: TypeDirector) => {
            this.openFormDialog(data);
        };

		iconDelete.actionIcono = (data: TypeDirector) => {
            this.deleteBussines(data);
        };

		iconEdit.isDisabled = (data: TypeDirector) => !authorization;
		iconDelete.isDisabled = (data: TypeDirector) => !authorization;

        return [iconEdit, iconDelete];
    }

	async deleteBussines(data: TypeDirector): Promise<void> {

		const dialogRef = await this._dialogConfirmationService.open(CONFIG_DELETE_DIALOG_TYPE_DIRECTOR);
        const isValid = await firstValueFrom(dialogRef.afterClosed());
		if(isValid) {
			this._spinner.show();
			const request = new RequestOption();
				request.resource = "Delete",
				request.pathVariables = [data.nIdTipoDirector];
				this._sectorService
					.delete(request)
					.pipe(finalize(() => this._spinner.hide()))
					.subscribe({
						next: (response: ResponseModel<TypeDirector>) => {
							if (response.isSuccess) {
								const messageToast = 'Tipo de director eliminado exitosamente';
								this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
								this.searchTable();
							}
						},
					});
		}
	}

	openFormDialog(element?: TypeDirector | null): void {
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
}
