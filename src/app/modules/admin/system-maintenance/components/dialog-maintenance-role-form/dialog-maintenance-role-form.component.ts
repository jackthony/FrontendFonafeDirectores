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
import { RoleEntity } from 'app/modules/admin/shared/domain/entities/role.entity';
import { RoleService } from 'app/modules/admin/shared/domain/services/role.service';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-maintenance-role-form',
  standalone: true,
  imports: [
	CommonModule,
	MatIconModule,
	FormInputModule,
	FoButtonDialogComponent,
	TranslateMessageForm,
	MatDialogModule
  ],
  templateUrl: './dialog-maintenance-role-form.component.html',
  styleUrl: './dialog-maintenance-role-form.component.scss'
})
export class DialogMaintenanceRoleFormComponent {
	// Inyección de dependencias para formularios, diálogos y servicios
    private _fb = inject(FormBuilder); // Inyecta el servicio FormBuilder para crear formularios reactivos
	private readonly dialogRef = inject(MatDialogRef<DialogMaintenanceRoleFormComponent>); // Inyecta MatDialogRef para cerrar el diálogo

    private _userService = inject(UserService); // Inyecta el servicio UserService para obtener información del usuario
	private _roleService = inject(RoleService); // Inyecta el servicio MinistryService para interactuar con los datos del rol

	// Datos que se pasan al diálogo, incluyendo la información del rol
	public data: { object: RoleEntity } = inject(MAT_DIALOG_DATA);

    // Señal reactiva que maneja los tipos de botones a mostrar
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);

	// El formulario reactivo que contiene los controles y validaciones
	form: FormGroup;

	// Señales reactivas que controlan si estamos editando el rol y el estado de carga
	isEdit = signal<boolean>(false);
	loadingService = signal<boolean>(false);

	// Método que se ejecuta cuando el componente es inicializado
	ngOnInit(): void {
		// Verifica si estamos editando un rol basado en los datos proporcionados
		this.isEdit.set(this.data?.object ? true : false);
		// Inicializa el formulario con los datos del rol
		this.initForm(this.data?.object);
	}

	// Método para inicializar el formulario con los datos proporcionados (o vacíos si no existe el objeto)
	initForm(object: RoleEntity): void {
        this.form = this._fb.group({
            nIdRol: [{ disabled: !object, value: object?.nIdRol }, Validators.required], // Campo ID del rol, requerido
            sNombreRol: [ object?  object.sNombreRol : '', [Validators.required, Validators.maxLength(100)] ], // Campo nombre del rol, requerido
            sDescripcion: [ object?  object.sDescripcion : '', [Validators.required, Validators.maxLength(255)] ], // descripcion nombre del rol, requerido
            bActivo: [ object? object.bActivo : true, Validators.required ], // Campo para saber si el rol está activo, requerido
            nIdUsuarioCreacion: [ { disabled: object, value: this._userService.userLogin().usuario }, Validators.required ], // Usuario que registra el rol
            nIdUsuarioModificacion: [ { disabled: !object, value: this._userService.userLogin().usuario },Validators.required ], // Usuario que modifica el rol
            bEliminado: [ object?  object.bEliminado : false, Validators.required ], // Campo eliminado del rol, requerido
        });
    }

	// Método para validar el formulario antes de enviarlo
	validRegisterForm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched(); // Marca todos los campos como tocados para mostrar los errores
            return;
        }
        this.loadingService.set(true); // Activa el estado de carga
        if (this.isEdit()) this.updateForm(); // Si estamos editando, actualiza el rol
        else this.registerForm(); // Si estamos creando, registra el rol
    }

	// Método para registrar un nuevo rol
    registerForm(): void {
        this._roleService
            .create(this.form.value) // Llama al servicio MinistryService para registrar el rol
            .pipe(finalize(() => this.loadingService.set(false))) // Finaliza la operación y desactiva el estado de carga
            .subscribe({
                next: (response: ResponseModel<number>) => {
                    if (response.isSuccess) this.dialogRef.close(true); // Cierra el diálogo si la operación es exitosa
                },
            });
    }

	// Método para actualizar un rol existente
    updateForm(): void {
        this._roleService
            .update(this.form.value) // Llama al servicio MinistryService para actualizar el rol
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
