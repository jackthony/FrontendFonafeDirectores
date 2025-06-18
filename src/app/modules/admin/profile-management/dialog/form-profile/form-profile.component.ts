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
	
	// Inyección del FormBuilder para crear formularios reactivos de manera más sencilla
	private _fb = inject(FormBuilder);

	// Inyección de los datos del diálogo que se pasan desde el componente que invoca este diálogo
	public data: { object: SegUser, lstStatus: Constant[], lstPosition: Constant[], lstProfile: Role[] } = inject(MAT_DIALOG_DATA);

	// Referencia al diálogo para cerrar el diálogo después de una acción
	private readonly dialogRef = inject(MatDialogRef<FormProfileComponent>);

	// Servicios inyectados para obtener y manejar la información del usuario
	private _userService = inject(UserService);
	private _segUserService = inject(SegUserService);
	private _validationFormService = inject(ValidationFormService);

	// Inicialización de señales y controles de formularios
    test = new FormControl('', Validators.required);
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);

	// Formulario reactivo que contendrá los controles y validaciones
	form: FormGroup;

	// Señales reactivas que controlan si estamos editando o no y el estado de carga
	isEdit = signal<boolean>(false);
	loadingService = signal<boolean>(false);
	typeInputPassword = signal<boolean>(false);

	// Método que se ejecuta cuando el componente es inicializado
	ngOnInit(): void {
		// Verifica si hay datos para decidir si estamos en modo edición
		this.isEdit.set(this.data.object ? true : false);
		// Inicializa el formulario con los datos del usuario
		this.initForm(this.data?.object);
	}

	// Método para inicializar el formulario con valores de datos o vacíos
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

	// Método que se ejecuta cuando el formulario se registra o actualiza
	registerForm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
            return;
        }
        this.loadingService.set(true); // Indica que se está procesando la acción
        if (this.isEdit()) this.updateBusiness(); // Si estamos editando, actualizamos los datos
        else this.registerBusiness(); // Si estamos creando, registramos los nuevos datos
    }

	// Método para registrar un nuevo usuario
    registerBusiness(): void {
        // Convierte los nombres de los campos a mayúsculas antes de enviar
        const fields = ['sNombres', 'sApellidoPaterno', 'sApellidoMaterno'];
        fields.forEach(field => {
            const control = this.form.get(field);
            if (control && typeof control.value === 'string') {
                control.setValue(control.value.toUpperCase(), { emitEvent: false });
            }
        });
        // Crea una solicitud con los valores del formulario
        const request = new RequestOption();
        request.request = this.form.value;
        this._segUserService
            .create(request) // Llama al servicio para crear el nuevo usuario
            .pipe(finalize(() => this.loadingService.set(false))) // Finaliza la operación de carga
            .subscribe({
                next: (response: ResponseModel<number>) => {
                    if (response.isSuccess) this.dialogRef.close(true); // Si la operación es exitosa, cierra el diálogo
                },
            });
    }

	// Método para actualizar la información de un usuario existente
    updateBusiness(): void {
        const request = new RequestOption();
        request.request = this.form.value;
        this._segUserService
            .update(request) // Llama al servicio para actualizar el usuario
            .pipe(finalize(() => this.loadingService.set(false))) // Finaliza la operación de carga
            .subscribe({
                next: (response: ResponseModel<boolean>) => {
                    if (response.isSuccess) this.dialogRef.close(true); // Si la operación es exitosa, cierra el diálogo
                },
            });
    }

	// Método para alternar la visibilidad de la contraseña
    viewPassword(): void {
		this.typeInputPassword.set(!this.typeInputPassword());
	}

	// Método que restringe la entrada a solo caracteres permitidos en los formularios
    onKeyPress(event: KeyboardEvent) {
        const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/; // Expresión regular que solo permite letras y espacios
        if (!allowedRegex.test(event.key)) {
          event.preventDefault(); // Previene la entrada si no es válida
        }
    }
    
	// Método que limpia los caracteres no permitidos cuando se ingresan en los formularios
    onInput(event: Event, nameForm: string) {
        const input = event.target as HTMLInputElement;
        const validPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Expresión regular que solo permite letras y espacios
    
        if (!validPattern.test(input.value)) {
          const cleaned = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); // Limpia los caracteres no permitidos
          input.value = cleaned;
          this.form.get(nameForm).setValue(cleaned, { emitEvent: false }); // Actualiza el valor del formulario
        }
    }
}
