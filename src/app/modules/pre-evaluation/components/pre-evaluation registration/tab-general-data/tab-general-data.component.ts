import { Component, inject, input, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CreateFormationRequest } from 'app/modules/pre-evaluation/domain/entities/create-formation.entity';
import { GeneralButtonEnum } from 'app/shared/enums/general-button.enum';
import { VocationalTrainingComponent } from '../dialog/vocational-training/vocational-training.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-tab-general-data',
    standalone: false,
    templateUrl: './tab-general-data.component.html',
    styleUrl: './tab-general-data.component.scss',
})
export class TabGeneralDataComponent {
    private _matDialog = inject(MatDialog);

    maxDate: Date;
    form: FormGroup;
    minDate: Date;
    textBtnSearch = input<string>('Agregar usuario');
    iconBtnSearch = input<string>('mat_outline:add_circle_outline');
	btnInverter = signal<number>(GeneralButtonEnum.INVERTER);
    searchuser(): void {}

    onKeyPressDate(event: KeyboardEvent) {
        const allowedRegex = /[0-9\/]/;
        if (!allowedRegex.test(event.key)) {
            event.preventDefault();
        }
    }
    onInputDate(event: Event, nameForm: string) {
        const input = event.target as HTMLInputElement;
        const validPattern = /^[0-9\/]*$/;
        if (!validPattern.test(input.value)) {
            const cleaned = input.value.replace(/[^0-9\/]/g, '');
            input.value = cleaned;
            this.form.get(nameForm)?.setValue(cleaned, { emitEvent: false });
        }
    }

    loadDataFormDialog(element?: CreateFormationRequest | null): void {
        this.openFormDialog(element);
		/* this._spinner.show();
		forkJoin({
			status: this._constantService.getAll(CONST_STATUS_USER),
			position: this._positionService.getAll(),
			profile: this._roleService.getAll(),
			typePersonal: this._constantService.getAll(CONST_TYPE_PERSONAL)
		})
		.pipe(
			finalize(() => this._spinner.hide()) 
		)
		.subscribe(response => {
			this.openFormDialog(element, response.status.lstItem, response.position.lstItem, response.profile.lstItem, response.typePersonal.lstItem);
		}) */
	}

    openFormDialog(element: CreateFormationRequest/*  | null, lstStatus: ConstantEntity[], lstPosition: PositionEntity[], lstProfile: RoleEntity[], lstTypePersonal: ConstantEntity[] */): void {
		const respDialogo = this._matDialog.open(VocationalTrainingComponent, {
			data: { object: element, /* lstStatus, lstPosition, lstProfile, lstTypePersonal */ },
		    disableClose: true,
			width: "700px",
		    minWidth: "350px",
			panelClass: 'mat-dialog-not-padding',
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
				/* this.searchUsers();
				if(element) {
					this._ngxToastrService.showSuccess('Usuario actualizado exitosamente', '¡Éxito!'); 
				} else {
					this._ngxToastrService.showSuccess('Usuario registrado exitosamente', '¡Éxito!'); 
				} */
		    }
		});
	}


}
