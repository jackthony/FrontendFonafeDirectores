import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ResponseEntity } from '@models/response.entity';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { UserService } from 'app/modules/user/auth/domain/services/user.service';
import { ModuleActionEntity } from 'app/modules/system-maintenance/domain/entities/module-action.entity';
import { ModuleEntity } from 'app/modules/system-maintenance/domain/entities/module.entity';
import { RoleEntity } from 'app/modules/system-maintenance/domain/entities/role.entity';
import { RoleService } from 'app/modules/system-maintenance/domain/services/role.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-maintenance-role-modules',
  standalone: false,
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
                next: (response: ResponseEntity<boolean>) => {
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
