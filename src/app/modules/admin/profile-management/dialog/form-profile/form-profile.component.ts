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

	public data: { object: SegUser, lstStatus: Constant[], lstPosition: Constant[], lstProfile: Constant[] } = inject(MAT_DIALOG_DATA);

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
            sNombresApellidos: [ { disabled: object, value: object?  object.sNombresApellidos : '' }, [Validators.required, Validators.maxLength(255)] ],
            nIdCargo: [ object? object.nIdCargo : 0, [Validators.required, Validators.min(1)] ],
            nIdRol: [ object? object.nIdRol : 0, [Validators.required, Validators.min(1)] ],
            nEstado: [ object? object.nEstado : 0, [Validators.required, Validators.min(1)] ],
            sCorreoElectronico:  [ { disabled: object, value: object ? object.sCorreoElectronico : '' }, [Validators.required, Validators.maxLength(150), this._validationFormService.validationMail] ],
            sContrasena:  [ '' , [Validators.required, Validators.maxLength(32)] ],
            sUsuarioRegistro: [ { disabled: object, value: this._userService.userLogin().id }, Validators.required ],
            sUsuarioModificacion: [ { disabled: !object, value: this._userService.userLogin().id },Validators.required ],
        });
    }

	registerForm() {
		console.log('formmmmmm', this.form);
		
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.loadingService.set(true);
        if (this.isEdit()) this.updateBusiness();
        else this.registerBusiness();
    }

    registerBusiness(): void {
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


}
