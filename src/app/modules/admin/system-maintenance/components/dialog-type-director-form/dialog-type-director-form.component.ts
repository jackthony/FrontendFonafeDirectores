import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FoButtonDialogComponent } from '@components/fo-button-dialog/fo-button-dialog.component';
import { ResponseModel } from '@models/IResponseModel';
import { ButtonEnum } from 'app/core/enums/button.enum';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { UserService } from 'app/core/user/user.service';
import { TypeDirectorEntity } from 'app/modules/admin/shared/domain/entities/type-director.entity';
import { TypeDirectorService } from 'app/modules/admin/shared/domain/services/type-director.service';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-type-director-form',
  standalone: true,
  imports: [
	CommonModule,
	MatIconModule,
	FormInputModule,
	FoButtonDialogComponent,
	TranslateMessageForm,
	MatDialogModule
  ],
  templateUrl: './dialog-type-director-form.component.html',
  styleUrl: './dialog-type-director-form.component.scss'
})
export class DialogTypeDirectorFormComponent {
    // Inyección de dependencias para formularios, diálogos y servicios
    private _fb = inject(FormBuilder); // Inyecta el servicio FormBuilder para crear formularios reactivos
	private readonly dialogRef = inject(MatDialogRef<DialogTypeDirectorFormComponent>); // Inyecta MatDialogRef para cerrar el diálogo

    private _userService = inject(UserService); // Inyecta el servicio UserService para obtener información del usuario
	private _typeDirectorService = inject(TypeDirectorService); // Inyecta el servicio MinistryService para interactuar con los datos del ministerio

	// Datos que se pasan al diálogo, incluyendo la información del ministerio
	public data: { object: TypeDirectorEntity } = inject(MAT_DIALOG_DATA);

    // Señal reactiva que maneja los tipos de botones a mostrar
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);

	// El formulario reactivo que contiene los controles y validaciones
	form: FormGroup;

	// Señales reactivas que controlan si estamos editando el ministerio y el estado de carga
	isEdit = signal<boolean>(false);
	loadingService = signal<boolean>(false);

	// Método que se ejecuta cuando el componente es inicializado
	ngOnInit(): void {
		// Verifica si estamos editando un ministerio basado en los datos proporcionados
		this.isEdit.set(this.data?.object ? true : false);
		// Inicializa el formulario con los datos del ministerio
		this.initForm(this.data?.object);
	}

	// Método para inicializar el formulario con los datos proporcionados (o vacíos si no existe el objeto)
	initForm(object: TypeDirectorEntity): void {
        this.form = this._fb.group({
            nIdTipoDirector: [{ disabled: !object, value: object?.nIdTipoDirector }, Validators.required], // Campo ID del ministerio, requerido
            sNombreTipoDirector: [ object?  object.sNombreTipoDirector : '', [Validators.required, Validators.maxLength(255)] ], // Campo nombre del ministerio, requerido
            bActivo: [ object? object.bActivo : true, Validators.required ], // Campo para saber si el ministerio está activo, requerido
            nUsuarioRegistro: [ { disabled: object, value: this._userService.userLogin().usuario }, Validators.required ], // Usuario que registra el ministerio
            nUsuarioModificacion: [ { disabled: !object, value: this._userService.userLogin().usuario },Validators.required ], // Usuario que modifica el ministerio
        });
    }

	// Método para validar el formulario antes de enviarlo
	validRegisterForm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched(); // Marca todos los campos como tocados para mostrar los errores
            return;
        }
        this.loadingService.set(true); // Activa el estado de carga
        if (this.isEdit()) this.updateForm(); // Si estamos editando, actualiza el ministerio
        else this.registerForm(); // Si estamos creando, registra el ministerio
    }

	// Método para registrar un nuevo ministerio
    registerForm(): void {
        this._typeDirectorService
            .create(this.form.value) // Llama al servicio MinistryService para registrar el ministerio
            .pipe(finalize(() => this.loadingService.set(false))) // Finaliza la operación y desactiva el estado de carga
            .subscribe({
                next: (response: ResponseModel<number>) => {
                    if (response.isSuccess) this.dialogRef.close(true); // Cierra el diálogo si la operación es exitosa
                },
            });
    }

	// Método para actualizar un ministerio existente
    updateForm(): void {
        this._typeDirectorService
            .update(this.form.value) // Llama al servicio MinistryService para actualizar el ministerio
            .pipe(finalize(() => this.loadingService.set(false))) // Finaliza la operación y desactiva el estado de carga
            .subscribe({
                next: (response: ResponseModel<boolean>) => {
                    if (response.isSuccess) this.dialogRef.close(true); // Cierra el diálogo si la operación es exitosa
                },
            });
    }

	// Método que restringe la entrada de caracteres no permitidos en el formulario (solo letras y espacios)
	onKeyPress(event: KeyboardEvent) {
        const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/; // Expresión regular para permitir solo letras y espacios
        if (!allowedRegex.test(event.key)) {
          event.preventDefault(); // Previene la entrada si el carácter no es permitido
        }
    }

	// Método que limpia los caracteres no permitidos en el campo de texto del formulario
    onInput(event: Event, nameForm: string) {
        const input = event.target as HTMLInputElement;
        const validPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Expresión regular para permitir solo letras y espacios
    
        if (!validPattern.test(input.value)) {
          const cleaned = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); // Elimina los caracteres no permitidos
          input.value = cleaned;
          this.form.get(nameForm).setValue(cleaned, { emitEvent: false }); // Actualiza el valor del formulario sin emitir el evento
        }
    }
}
