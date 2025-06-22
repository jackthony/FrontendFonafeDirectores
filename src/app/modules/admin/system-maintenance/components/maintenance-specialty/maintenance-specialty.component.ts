import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseModel } from '@models/IResponseModel';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { CONFIG_DELETE_DIALOG_TYPE_SPECIALTY, MAINTENANCE_SPECIALTY_HEADER_TABLE } from 'app/shared/configs/system-maintenance/maintenance-specialty.config';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, firstValueFrom } from 'rxjs';
import { DialogMaintenanceSpecialtyFormComponent } from '../dialog-maintenance-specialty-form/dialog-maintenance-specialty-form.component';
import { MAINTENANCE_GENERAL_IMPORTS } from 'app/shared/imports/system-maintenance/maintenance-ministry.imports';
import { SpecialtyService } from 'app/modules/admin/shared/domain/services/specialty.service';
import { SpecialtyEntity } from 'app/modules/admin/shared/domain/entities/specialty.entity';

@Component({
  selector: 'app-maintenance-specialty',
  standalone: true,
  imports: [...MAINTENANCE_GENERAL_IMPORTS],
  templateUrl: './maintenance-specialty.component.html',
  styleUrl: './maintenance-specialty.component.scss'
})
export default class MaintenanceSpecialtyComponent {
    private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);
	private _dialogConfirmationService = inject(DialogConfirmationService);

	private _matDialog: MatDialog = inject(MatDialog);

	private _specialtyService = inject(SpecialtyService);
	private _authorizationService = inject(AuthorizationService);

	private _ngxToastrService = inject(NgxToastrService);
	private _spinner = inject(NgxSpinnerService);
	
    titleModule = signal<string>('Mantenedor de especialidad');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTable = signal<SpecialtyEntity[]>([]);
	iconsTable = signal<IconOption<SpecialtyEntity>[]>([]);
	nameBtnAdd = signal<string>('Agregar especialidad');
	
	loadingTable = signal<boolean>(false);
	pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
	paramSearchTable = signal<string>('');
	placeHolderSearch = signal<string>('Busca por nombre');

	delaySearchTable = signal<number>(400);

	ngOnInit(): void {
		this.headerTable.set(MAINTENANCE_SPECIALTY_HEADER_TABLE);
		this.iconsTable.set(this.defineIconsTable());
		this.searchTable();
	}

	returnInit(): void {
		this._router.navigate(['home']);
	}

	searchTable(): void {
		this.loadingTable.set(true);
		this._specialtyService.getByPagination(this.paramSearchTable(), this.pageIndexTable(), PAGINATOR_PAGE_SIZE).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<SpecialtyEntity>) => {
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


	defineIconsTable(): IconOption<SpecialtyEntity>[]{
		const resolvedModule = this._route.snapshot.data['module'];
		const authorization = this._authorizationService.canPerform(resolvedModule, 'write');

        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconDelete = new IconOption("delete", "mat_outline", "Eliminar");

		iconEdit.actionIcono = (data: SpecialtyEntity) => {
            this.openFormDialog(data);
        };

		iconDelete.actionIcono = (data: SpecialtyEntity) => {
            this.deleteBussines(data);
        };

		iconEdit.isDisabled = (data: SpecialtyEntity) => !authorization;
		iconDelete.isDisabled = (data: SpecialtyEntity) => !authorization;

        return [iconEdit, iconDelete];
    }

	async deleteBussines(data: SpecialtyEntity): Promise<void> {
		const dialogRef = await this._dialogConfirmationService.open(CONFIG_DELETE_DIALOG_TYPE_SPECIALTY);
        const isValid = await firstValueFrom(dialogRef.afterClosed());
		if(isValid) {
			this._spinner.show();
			this._specialtyService
				.delete(data.nIdEspecialidad)
				.pipe(finalize(() => this._spinner.hide()))
				.subscribe({
					next: (response: ResponseModel<boolean>) => {
						if (response.isSuccess) {
							const messageToast = 'Especialidad eliminado exitosamente';
							this._ngxToastrService.showSuccess(messageToast, '¡Éxito!');
							this.searchTable();
						}
					},
				});
		}
	}

	openFormDialog(element?: SpecialtyEntity | null): void {
		const respDialogo = this._matDialog.open(DialogMaintenanceSpecialtyFormComponent, {
			data: { object: element },
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchTable();
				if(element) this._ngxToastrService.showSuccess('Especialidad actualizado exitosamente', '¡Éxito!');
			    else this._ngxToastrService.showSuccess('Especialidad registrado exitosamente', '¡Éxito!');
				
		    }
		});
	}
}
