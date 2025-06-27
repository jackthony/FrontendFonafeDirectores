import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ResponseModel } from '@models/IResponseModel';
import { ButtonEnum } from 'app/core/enums/button.enum';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { UserService } from 'app/core/user/user.service';
import { FoButtonDialogComponent } from 'app/modules/admin/shared/components/fo-button-dialog/fo-button-dialog.component';
import { ModuleActionEntity } from 'app/modules/admin/shared/domain/entities/module-action.entity';
import { ModuleEntity } from 'app/modules/admin/shared/domain/entities/module.entity';
import { RoleEntity } from 'app/modules/admin/shared/domain/entities/role.entity';
import { RoleService } from 'app/modules/admin/shared/domain/services/role.service';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-maintenance-role-modules',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormInputModule,
    FoButtonDialogComponent,
	ReactiveFormsModule,
	MatCheckboxModule,
    MatDialogModule
	],
  templateUrl: './dialog-maintenance-role-modules.component.html',
  styleUrl: './dialog-maintenance-role-modules.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DialogMaintenanceRoleModulesComponent implements OnInit {
	
    private _fb = inject(FormBuilder); //Construir formulario
    private _roleService = inject(RoleService); //Construir formulario
	private readonly dialogRef = inject(MatDialogRef<DialogMaintenanceRoleModulesComponent>); // Inyecta MatDialogRef para cerrar el diálogo
	private _userService = inject(UserService); // Inyecta el servicio UserService para obtener información del usuario
    form: FormGroup;
	loadingService = signal<boolean>(false);
	public data: { object: RoleEntity, modules: ModuleEntity[] } = inject(MAT_DIALOG_DATA);
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);


	get formArrayModules(): FormArray {
		return this.form.get('lstModulos') as FormArray;
	  }

	ngOnInit(): void {
		this.initForm();
	}

	validRegisterForm() {
        if(this.loadingService()) return;
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
		this.registerForm();
    }

	registerForm(): void {
		this.loadingService.set(true);
        this._roleService
            .insertPermissionRole(this.form.value)
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseModel<boolean>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }

	initForm(): void {
		this.form = this._fb.group({
			nRolId: this.data.object.nRolId,
			nUsuarioModificacionId: this._userService.userLogin().usuarioId,
			lstModulos: this._fb.array(this.loadModulesArray(this.data.modules))
		});
	}

	loadModulesArray(element: ModuleEntity[]): FormGroup[] {
        return element.map((module: ModuleEntity) => this.formGroupModule(module));
    }

    formGroupModule(element: ModuleEntity): FormGroup {
        return this._fb.group({
            nModuloId: [element.nModuloId],
            sNombre: [ { disabled: true, value: element.sNombre } ],
			bPermitir: [ element.bModuloPermitido ],
			lstAcciones: this._fb.array(this.loadActionsArray(element.acciones))
        });
    }

	loadActionsArray(element: ModuleActionEntity[]): FormGroup[] {
        return element.map((action: ModuleActionEntity) => this.formGroupActions(action));
    }

    formGroupActions(element: ModuleActionEntity): FormGroup {
        return this._fb.group({
            nAccionId: [element.nAccionId],
            sNombre: [{ disabled: true, value: element.sNombre }],
            bPermitir: [element.permitido]
        });
    }

	getFormArrayActions(moduleIndex: number): FormArray {
		return (this.formArrayModules.at(moduleIndex).get('lstAcciones') as FormArray);
	}

	onModuleChange(index: number): void {
		const moduleControl = this.formArrayModules.at(index);
		if (!moduleControl.get('bPermitir').value) {
		  const actionsArray = this.getFormArrayActions(index);
		  actionsArray.controls.forEach((action) => action.get('bPermitir').setValue(false));
		} else {
		  const actionsArray = this.getFormArrayActions(index);
		  actionsArray.controls.forEach((action) => action.get('bPermitir').setValue(true));
		}
	  }
	
	  // Maneja el cambio en el estado de una acción
	  onActionChange(moduleIndex: number): void {
		const actionsArray = this.getFormArrayActions(moduleIndex);
		const moduleControl = this.formArrayModules.at(moduleIndex);
		const anyActionSelected = actionsArray.controls.some((action) => action.get('bPermitir').value);
		if (!anyActionSelected) moduleControl.get('bPermitir').setValue(false);
		else {
		  moduleControl.get('bPermitir').setValue(true);
		}
	  }
}
