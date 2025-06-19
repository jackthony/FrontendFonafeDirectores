import { Component, inject, signal } from '@angular/core';
import { ResponseModel } from '@models/IResponseModel';
import { Position } from '@models/system-maintenance/position.interface';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { finalize, firstValueFrom } from 'rxjs';
import { DialogPositionFormComponent } from './dialog/dialog-position-form/dialog-position-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { MatDialog } from '@angular/material/dialog';
import { PositionService } from '@services/position.service';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { CONFIG_DELETE_DIALOG_POSITION, MAINTENANCE_POSITION_HEADER_TABLE } from 'app/shared/configs/system-maintenance/maintenance-position.config';
import { MAINTENANCE_GENERAL_IMPORTS } from 'app/shared/imports/system-maintenance/maintenance-ministry.imports';

@Component({
  selector: 'app-maintenance-position',
  standalone: true,
  imports: [...MAINTENANCE_GENERAL_IMPORTS],
  templateUrl: './maintenance-position.component.html',
  styleUrl: './maintenance-position.component.scss'
})
export default class MaintenancePositionComponent {
    private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);
	private _dialogConfirmationService = inject(DialogConfirmationService);

	private _matDialog: MatDialog = inject(MatDialog);

	private _positionService = inject(PositionService);
	private _authorizationService = inject(AuthorizationService);

	private _ngxToastrService = inject(NgxToastrService);
	private _spinner = inject(NgxSpinnerService);
	
    titleModule = signal<string>('Mantenedor de cargos');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTable = signal<Position[]>([]);
	iconsTable = signal<IconOption<Position>[]>([]);
	nameBtnAdd = signal<string>('Agregar cargo');
	
	loadingTable = signal<boolean>(false);
	pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
	paramSearchTable = signal<string>('');
	placeHolderSearch = signal<string>('Busca por nombre');

	delaySearchTable = signal<number>(400);

	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_POSITION_HEADER_TABLE);
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
		this._positionService.getByPagination(request).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<Position>) => {
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


	defineIconsTable(): IconOption<Position>[]{
		const resolvedModule = this._route.snapshot.data['module'];
		const authorization = this._authorizationService.canPerform(resolvedModule, 'write');

        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconDelete = new IconOption("delete", "mat_outline", "Eliminar");

		iconEdit.actionIcono = (data: Position) => {
            this.openFormDialog(data);
        };

		iconDelete.actionIcono = (data: Position) => {
            this.deleteBussines(data);
        };

		iconEdit.isDisabled = (data: Position) => !authorization;
		iconDelete.isDisabled = (data: Position) => !authorization;

        return [iconEdit, iconDelete];
    }

	async deleteBussines(data: Position): Promise<void> {

		const dialogRef = await this._dialogConfirmationService.open(CONFIG_DELETE_DIALOG_POSITION);
        const isValid = await firstValueFrom(dialogRef.afterClosed());
		if(isValid) {
			this._spinner.show();
			const request = new RequestOption();
				request.resource = "Delete",
				request.pathVariables = [data.nIdCargo];
				this._positionService
					.delete(request)
					.pipe(finalize(() => this._spinner.hide()))
					.subscribe({
						next: (response: ResponseModel<Position>) => {
							if (response.isSuccess) {
								const messageToast = 'Cargo eliminado exitosamente';
								this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
								this.searchTable();
							}
						},
					});
		}
	}

	openFormDialog(element?: Position | null): void {
		const respDialogo = this._matDialog.open(DialogPositionFormComponent, {
			data: { object: element },
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchTable();
				if(element) this._ngxToastrService.showSuccess('Cargo actualizado exitosamente', '¡Éxito!');
			    else this._ngxToastrService.showSuccess('Cargo registrado exitosamente', '¡Éxito!');
				
		    }
		});
	}
}
