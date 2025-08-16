import { Component, inject, input, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GeneralButtonEnum } from 'app/shared/enums/general-button.enum';
import { VocationalTrainingComponent } from '../dialog/vocational-training/vocational-training.component';
import { MatDialog } from '@angular/material/dialog';
import { FormationCandidateEntity } from 'app/modules/pre-evaluation/domain/entities/formation-candidate.entity';
import { WorkExperienceEntity } from 'app/modules/pre-evaluation/domain/entities/work-experience.entity';
import { ProfessionalExperienceComponent } from '../dialog/professional-experience/professional-experience.component';
import { TrainingRequestEntity } from 'app/modules/pre-evaluation/domain/entities/training-request.entity';
import { TrainingRequestComponent } from '../dialog/training-request/training-request.component';

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

    loadDataFormDialog(element?: FormationCandidateEntity | null): void {
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

	loadDataFormTraining(element?: TrainingRequestEntity) {
		this.openFormDialogWorkTraining(element);
	}

	loadDataFormExperience(element?: WorkExperienceEntity) {
		this.openFormDialogWorkExperience(element);
	}

    openFormDialog(element: FormationCandidateEntity/*  | null, lstStatus: ConstantEntity[], lstPosition: PositionEntity[], lstProfile: RoleEntity[], lstTypePersonal: ConstantEntity[] */): void {
		const respDialogo = this._matDialog.open(VocationalTrainingComponent, {
			data: { object: element, /* lstStatus, lstPosition, lstProfile, lstTypePersonal */ },//FALTA CANDIDATO y grado
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

	openFormDialogWorkExperience(element: WorkExperienceEntity/*  | null, lstStatus: ConstantEntity[], lstPosition: PositionEntity[], lstProfile: RoleEntity[], lstTypePersonal: ConstantEntity[] */): void {
		const respDialogo = this._matDialog.open(ProfessionalExperienceComponent, {
			data: { object: element, /* lstStatus, lstPosition, lstProfile, lstTypePersonal */ },//FALTA CANDIDATO y grado
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

	openFormDialogWorkTraining(element: TrainingRequestEntity/*  | null, lstStatus: ConstantEntity[], lstPosition: PositionEntity[], lstProfile: RoleEntity[], lstTypePersonal: ConstantEntity[] */): void {
		const respDialogo = this._matDialog.open(TrainingRequestComponent, {
			data: { object: element, /* lstStatus, lstPosition, lstProfile, lstTypePersonal */ },//FALTA CANDIDATO y grado
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
