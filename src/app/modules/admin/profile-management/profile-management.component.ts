import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmation } from '@components/fo-dialog-confirmation/models/dialog-confirmation.interface';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { COLUMNS_PROFILE_MANAGEMENT, CONFIG_DELETE_DIALOG_PROFILE, CONST_POSITION_USER, CONST_PROFILE_USER, CONST_STATUS_USER } from 'app/shared/configs/profile-management/profile-management.config';
import { PROFILE_MANAGEMENT_IMPORTS } from 'app/shared/imports/components/profile-management.imports';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { FormProfileComponent } from './dialog/form-profile/form-profile.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SegUser } from '@models/seg-users/seg-user.interface';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { finalize, forkJoin } from 'rxjs';
import { ConstantService } from '@services/constant.service';
import { Constant } from '@models/business/constant.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { SegUserService } from '@services/seg-user.service';
import { ResponseModel } from '@models/IResponseModel';
import { ChangePasswordAdmComponent } from './dialog/change-password-adm/change-password-adm.component';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { RoleService } from '@services/role.service';
import { Role } from '@models/business/role.interface';
import { FoTableComponent } from '@components/fo-table/fo-table.component';

@Component({
  selector: 'app-profile-management',
  standalone: true,
  imports: [...PROFILE_MANAGEMENT_IMPORTS],
  templateUrl: './profile-management.component.html',
  styleUrl: './profile-management.component.scss'
})
export default class ProfileManagementComponent {
	private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);

	private _matDialog: MatDialog = inject(MatDialog);

	private _segUserService = inject(SegUserService);
	private _authorizationService = inject(AuthorizationService);
	private _constantService = inject(ConstantService);
	private _roleService = inject(RoleService);

	private _ngxToastrService = inject(NgxToastrService);
	private _spinner = inject(NgxSpinnerService);
	
    titleModule = signal<string>('Gestión de perfiles');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTableActivities = signal<SegUser[]>([]);
	iconsTable = signal<IconOption<SegUser>[]>([]);
	
	loadingTable = signal<boolean>(false);
	pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
	userSearch = signal<string>('');
	placeHolderSearch = signal<string>('Busca por apellidos y/o nombres');

	delaySearchProfile = signal<number>(400);

	ngOnInit(): void {
		this.headerTable.set(COLUMNS_PROFILE_MANAGEMENT);
		this.iconsTable.set(this.defineIconsTable());
		this.searchUsers();
	}

	returnInit(): void {
		this._router.navigate(['home']);
	}

	searchUsers(): void {
		this.loadingTable.set(true);
		const request = new RequestOption();
		request.queryParams = [
			{ key: 'pageIndex' , value: this.pageIndexTable() },
			{ key: 'pageSize' , value: PAGINATOR_PAGE_SIZE }
		];
		if(this.userSearch()) 
			request.queryParams.push({ key: 'fullName', value: this.userSearch() });
		this._segUserService.getByPagination(request).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<SegUser>) => {
				if(response.isSuccess){
					const totalPages = Math.ceil(response.pagination.totalRows/PAGINATOR_PAGE_SIZE);
					this.totalPagesTable.set(totalPages > 0 ? totalPages : 1);
					this.dataTableActivities.set(response.lstItem);
				} else this.dataTableActivities.set([])
			}),
			error:(() => {
				this.totalPagesTable.set(1);
				this.dataTableActivities.set([]);
			})
		})
	}

	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		this.searchUsers();
	}

	searchByUser(event: string): void {
		this.userSearch.set(event);
		this.pageIndexTable.set(1);
		//this._foTableComponent.re
		this.searchUsers();
	}


	defineIconsTable(): IconOption<SegUser>[]{
		const resolvedModule = this._route.snapshot.data['module'];
		const authorization = this._authorizationService.canPerform(resolvedModule, 'write');

        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconRestore = new IconOption("restart_alt", "mat_outline", "Reestablecer contraseña");

		iconEdit.actionIcono = (data: SegUser) => {
            this.loadDataFormDialog(data);
        };

		iconRestore.actionIcono = (data: SegUser) => {
            this.restorePassword(data);
        };

		iconEdit.isDisabled = (data: SegUser) => !authorization;
		iconRestore.isDisabled = (data: SegUser) => !authorization;

        return [iconEdit, iconRestore];
    }

	restorePassword(element: SegUser) {
		const respDialogo = this._matDialog.open(ChangePasswordAdmComponent, {
			data: { object: element },
		    disableClose: true,
			width: "450px",
		    minWidth: "450px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchByUser(null);
			    this._ngxToastrService.showSuccess('Cambio de clave realizado exitosamente', '¡Éxito!');
		    }
		});
	}

	openFormDialog(element: SegUser | null, lstStatus: Constant[], lstPosition: Constant[], lstProfile: Role[]): void {
		const respDialogo = this._matDialog.open(FormProfileComponent, {
			data: { object: element, lstStatus, lstPosition, lstProfile},
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				this.searchUsers();
				if(element) this._ngxToastrService.showSuccess('Usuario actualizado exitosamente', '¡Éxito!');
			    else this._ngxToastrService.showSuccess('Usuario registrado exitosamente', '¡Éxito!');
				
		    }
		});
	}

	loadDataFormDialog(element?: SegUser | null): void {
		this._spinner.show();
		const reqProfile = new RequestOption();
		reqProfile.queryParams = [
			{ key: 'pageIndex', value: 0 },
			{ key: 'pageSize', value: 0 },
		]
		forkJoin({
			status: this._constantService.getAll(CONST_STATUS_USER),
			position: this._constantService.getAll(CONST_POSITION_USER),
			//profile: this._constantService.getAll(CONST_PROFILE_USER),
			profile: this._roleService.getByPagination(reqProfile)
		})
		.pipe(
			finalize(() => this._spinner.hide())
		)
		.subscribe(response => {
			this.openFormDialog(element, response.status.lstItem, response.position.lstItem, response.profile.lstItem);
		})
	}

}
