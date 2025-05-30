import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FoButtonDialogComponent } from '@components/fo-button-dialog/fo-button-dialog.component';
import { Constant } from '@models/business/constant.interface';
import { Role } from '@models/business/role.interface';
import { ResponseModel } from '@models/IResponseModel';
import { SegUser } from '@models/seg-users/seg-user.interface';
import { SegUserService } from '@services/seg-user.service';
import { ButtonEnum } from 'app/core/enums/button.enum';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { UserService } from 'app/core/user/user.service';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { ValidationFormService } from 'app/shared/services/validation-form.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-form-profile',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormInputModule,
        MatDatepickerModule,
        FoButtonDialogComponent,
		TranslateMessageForm,
		ReactiveFormsModule,
		MatSelectModule,
		MatDialogModule,
		MatTooltipModule,
		MatButtonModule
    ],
    templateUrl: './form-profile.component.html',
    styleUrl: './form-profile.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class FormProfileComponent implements OnInit {
	
	private _fb = inject(FormBuilder);
	private readonly dialogRef = inject(MatDialogRef<FormProfileComponent>);
	
	private _userService = inject(UserService);
	private _segUserService = inject(SegUserService);
	private _validationFormService = inject(ValidationFormService);

	public data: { object: SegUser, lstStatus: Constant[], lstPosition: Constant[], lstProfile: Role[] } = inject(MAT_DIALOG_DATA);

    test = new FormControl('', Validators.required);
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);

	form: FormGroup;

	isEdit = signal<boolean>(false);
	loadingService = signal<boolean>(false);
	typeInputPassword = signal<boolean>(false);

	ngOnInit(): void {
		this.isEdit.set(this.data.object ? true : false);
		this.initForm(this.data?.object);
	}

	initForm(object: SegUser): void {
        this.form = this._fb.group({
            nIdUsuario: [{ disabled: !object, value: object?.nIdUsuario }, Validators.required],
            sApellidoPaterno: [ { disabled: object, value: object?  object.sApellidoPaterno : '' }, [Validators.required, Validators.maxLength(50)] ],
            sApellidoMaterno: [ { disabled: object, value: object?  object.sApellidoMaterno : '' }, [Validators.required, Validators.maxLength(50)] ],
            sNombres: [ { disabled: object, value: object?  object.sNombres : '' }, [Validators.required, Validators.maxLength(150)] ],
            nIdCargo: [ object? object.nIdCargo : 0, [Validators.required, Validators.min(1)] ],
            nIdRol: [ object? object.nIdRol : 0, [Validators.required, Validators.min(1)] ],
            nEstado: [ object? object.nEstado : 0, [Validators.required, Validators.min(1)] ],
            sCorreoElectronico:  [ { disabled: object, value: object ? object.sCorreoElectronico : '' }, [Validators.required, Validators.maxLength(150), this._validationFormService.validationMail] ],
            sContrasena:  [ { disabled: object, value: object ? '******' : '' } , [Validators.required, Validators.maxLength(32)] ],
            nUsuarioRegistro: [ { disabled: object, value: this._userService.userLogin().usuario }, Validators.required ],
            nUsuarioModificacion: [ { disabled: !object, value: this._userService.userLogin().usuario },Validators.required ],
        });
    }

	registerForm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.loadingService.set(true);
        if (this.isEdit()) this.updateBusiness();
        else this.registerBusiness();
    }

    registerBusiness(): void {
        const fields = ['sNombres', 'sApellidoPaterno', 'sApellidoMaterno'];
        fields.forEach(field => {
            const control = this.form.get(field);
            if (control && typeof control.value === 'string') {
                control.setValue(control.value.toUpperCase(), { emitEvent: false });
            }
        });
        const request = new RequestOption();
        request.request = this.form.value;
        this._segUserService
            .create(request)
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseModel<number>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }

    updateBusiness(): void {
        const request = new RequestOption();
        request.request = this.form.value;
        this._segUserService
            .update(request)
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseModel<boolean>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }

	viewPassword(): void {
		this.typeInputPassword.set(!this.typeInputPassword());
	}

    onKeyPress(event: KeyboardEvent) {
        const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
        if (!allowedRegex.test(event.key)) {
          event.preventDefault();
        }
    }
    
    onInput(event: Event, nameForm: string) {
        const input = event.target as HTMLInputElement;
        const validPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    
        if (!validPattern.test(input.value)) {
          const cleaned = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
          input.value = cleaned;
          this.form.get(nameForm).setValue(cleaned, { emitEvent: false });
        }
    }


}
