import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmation } from '@components/fo-dialog-confirmation/models/dialog-confirmation.interface';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { COLUMNS_PROFILE_MANAGEMENT, CONFIG_DELETE_DIALOG_PROFILE, CONST_POSITION_USER, CONST_PROFILE_USER, CONST_STATUS_USER } from 'app/shared/configs/profile-management/profile-management.config';
import { PROFILE_MANAGEMENT_IMPORTS } from 'app/shared/imports/components/profile-management.imports';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { FormProfileComponent } from './dialog/form-profile/form-profile.component';
import { Router } from '@angular/router';
import { SegUser } from '@models/seg-users/seg-user.interface';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { finalize, forkJoin } from 'rxjs';
import { ConstantService } from '@services/constant.service';
import { Constant } from '@models/business/constant.interface';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile-management',
  standalone: true,
  imports: [...PROFILE_MANAGEMENT_IMPORTS],
  templateUrl: './profile-management.component.html',
  styleUrl: './profile-management.component.scss'
})
export default class ProfileManagementComponent {
	private readonly _router = inject(Router);

	private _matDialog: MatDialog = inject(MatDialog);
	private _ngxToastrService = inject(NgxToastrService);
	private _spinner = inject(NgxSpinnerService);

	private _constantService = inject(ConstantService);
	
    titleModule = signal<string>('Gestión de perfiles');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTableActivities = signal<SegUser[]>([]);
	iconsTable = signal<IconOption<SegUser>[]>([]);

	

	ngOnInit(): void {
		this.headerTable.set(COLUMNS_PROFILE_MANAGEMENT);
		this.dataTableActivities.set([]);
		this.iconsTable.set(this.defineIconsTable())
	}

	returnInit(): void {
		this._router.navigate(['home']);
	}


	defineIconsTable(): IconOption<any>[]{
        const iconEdit = new IconOption("create", "mat_outline", "Editar");

		iconEdit.actionIcono = (data: SegUser) => {
            this.loadDataFormDialog(data);
        };

        return [iconEdit];
    }

	openFormDialog(element: SegUser | null, lstStatus: Constant[], lstPosition: Constant[], lstProfile: Constant[]): void {
		const respDialogo = this._matDialog.open(FormProfileComponent, {
			data: { object: element, lstStatus, lstPosition, lstProfile},
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				if(element) this._ngxToastrService.showSuccess('Usuario actualizado exitosamente', '¡Éxito!');
			    else this._ngxToastrService.showSuccess('Usuario registrado exitosamente', '¡Éxito!');
		    }
		});
	}

	loadDataFormDialog(element?: SegUser | null): void {
		this._spinner.show();
		forkJoin({
			status: this._constantService.getAll(CONST_STATUS_USER),
			position: this._constantService.getAll(CONST_POSITION_USER),
			profile: this._constantService.getAll(CONST_PROFILE_USER),
		})
		.pipe(
			finalize(() => this._spinner.hide())
		)
		.subscribe(response => {
			this.openFormDialog(element, response.status.lstItem, response.position.lstItem, response.profile.lstItem);
		})
	}

}
