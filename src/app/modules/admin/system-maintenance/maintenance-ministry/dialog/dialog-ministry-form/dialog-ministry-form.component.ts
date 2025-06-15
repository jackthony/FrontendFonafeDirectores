import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FoButtonDialogComponent } from '@components/fo-button-dialog/fo-button-dialog.component';
import { ResponseModel } from '@models/IResponseModel';
import { Ministry } from '@models/system-maintenance/ministry.interface';
import { MinistryService } from '@services/ministry.service';
import { ButtonEnum } from 'app/core/enums/button.enum';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { UserService } from 'app/core/user/user.service';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-ministry-form',
  standalone: true,
  imports: [
	CommonModule,
	MatIconModule,
	FormInputModule,
	FoButtonDialogComponent,
	TranslateMessageForm,
	MatDialogModule],
  templateUrl: './dialog-ministry-form.component.html',
  styleUrl: './dialog-ministry-form.component.scss'
})
export class DialogMinistryFormComponent {
    private _fb = inject(FormBuilder);
	private readonly dialogRef = inject(MatDialogRef<DialogMinistryFormComponent>);
	
	private _userService = inject(UserService);
	private _ministryService = inject(MinistryService);

	public data: { object: Ministry } = inject(MAT_DIALOG_DATA);

    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);

	form: FormGroup;

	isEdit = signal<boolean>(false);
	loadingService = signal<boolean>(false);

	ngOnInit(): void {
		this.isEdit.set(this.data?.object ? true : false);
		this.initForm(this.data?.object);
	}

	initForm(object: Ministry): void {
        this.form = this._fb.group({
            nIdMinisterio: [{ disabled: !object, value: object?.nIdMinisterio }, Validators.required],
            sNombreMinisterio: [ object?  object.sNombreMinisterio : '', [Validators.required, Validators.maxLength(255)] ],
            bActivo: [ object? object.bActivo : true, Validators.required ],
            nUsuarioRegistro: [ { disabled: object, value: this._userService.userLogin().usuario }, Validators.required ],
            nUsuarioModificacion: [ { disabled: !object, value: this._userService.userLogin().usuario },Validators.required ],
        });
    }

	validRegisterForm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.loadingService.set(true);
        if (this.isEdit()) this.updateForm();
        else this.registerForm();
    }

    registerForm(): void {
        const request = new RequestOption();
        request.request = this.form.value;
        this._ministryService
            .create(request)
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseModel<Ministry>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }

    updateForm(): void {
        const request = new RequestOption();
        request.request = this.form.value;
        this._ministryService
            .update(request)
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseModel<Ministry>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
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
