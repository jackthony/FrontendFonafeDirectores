/*******************************************************************************************************
 * Nombre del archivo:  dialog-type-director-form.component.ts
 * Descripción:         Componente de formulario en modal para el registro y edición de tipos de director.
 *                      Utilizado dentro del mantenedor de Tipo Director.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Migración a standalone component, adaptación a signals y validaciones reactivas.
 *******************************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResponseEntity } from '@models/response.entity';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { TypeDirectorEntity } from 'app/modules/business/domain/entities/maintenance/type-director.entity';
import { TypeDirectorService } from 'app/modules/business/domain/services/maintenance/type-director.service';
import { finalize } from 'rxjs';
import { ValidationFormService } from 'app/shared/services/validation-form.service';
@Component({
  selector: 'app-dialog-type-director-form',
  standalone: false,
  templateUrl: './dialog-type-director-form.component.html',
  styleUrl: './dialog-type-director-form.component.scss'
})
export class DialogTypeDirectorFormComponent {
    private _fb = inject(FormBuilder);// Inyecta FormBuilder para crear formularios reactivos
	private readonly dialogRef = inject(MatDialogRef<DialogTypeDirectorFormComponent>); // Inyecta MatDialogRef para cerrar el diálogo
    private _userService = inject(UserService); // Inyecta el servicio UserService para obtener información del usuario
	private _typeDirectorService = inject(TypeDirectorService); // Inyecta el servicio MinistryService para interactuar con los datos del ministerio
	private _validationFormService = inject(ValidationFormService); // Servicio utilitario que centraliza lógica de validación y mensajes de error en formularios reactivos.
    public data: { object: TypeDirectorEntity } = inject(MAT_DIALOG_DATA); // Inyecta los datos del diálogo, que contienen el objeto TypeDirectorEntity si se está editando
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum); // Enum para los botones del diálogo
	form: FormGroup; // Formulario reactivo para manejar los datos del ministerio
	isEdit = signal<boolean>(false);
	loadingService = signal<boolean>(false);
    /**
     * Hook de inicialización del componente.
     * - Verifica si se está editando un registro según los datos recibidos.
     * - Inicializa el formulario con datos del tipo de director (si existen).
     */
	ngOnInit(): void {
		this.isEdit.set(this.data?.object ? true : false);
		this.initForm(this.data?.object);
	}
    /**
     * Inicializa los controles del formulario.
     * - Si `object` existe, se trata de una edición y se cargan los valores.
     * - Si no, se inicializa en modo creación con valores por defecto.
     *
     * @param object Objeto con los datos del tipo de director a editar.
     */
	initForm(object: TypeDirectorEntity): void {
        this.form = this._fb.group({
            nIdTipoDirector: [{ disabled: !object, value: object?.nIdTipoDirector }, Validators.required], 
            sNombreTipoDirector: [ object?  object.sNombreTipoDirector : '', [Validators.required, this._validationFormService.spaceValidator,Validators.maxLength(255)] ], 
            bActivo: [ object? object.bActivo : true, Validators.required ],
            nUsuarioRegistro: [ { disabled: object, value: this._userService.userLogin().usuarioId }, Validators.required ],
            nUsuarioModificacion: [ { disabled: !object, value: this._userService.userLogin().usuarioId },Validators.required ], 
        });
    }
    /**
     * Valida el formulario y ejecuta la acción correspondiente.
     * - Si el formulario es inválido, marca todos los campos como tocados.
     * - Si es una edición, llama a `updateForm()`.
     * - Si es un registro nuevo, llama a `registerForm()`.
     */
	validRegisterForm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.loadingService.set(true);
        if (this.isEdit()) this.updateForm(); 
        else this.registerForm(); 
    }
    /**
     * Registra un nuevo tipo de director.
     * - Utiliza el servicio TypeDirectorService para enviar los datos al backend.
     * - Finaliza la operación y cierra el diálogo si el registro es exitoso.
     */
    registerForm(): void {
        this._typeDirectorService
            .create(this.form.value)
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseEntity<number>) => {
                    if (response.isSuccess) this.dialogRef.close(true); 
                },
            });
    }
    /**
     * Actualiza el formulario con los datos del tipo de director.
     * - Utiliza el servicio TypeDirectorService para enviar los datos al backend.
     * - Finaliza la operación y cierra el diálogo si la actualización es exitosa.
     */
    updateForm(): void {
        this._typeDirectorService
            .update(this.form.value) 
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseEntity<boolean>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }
    /**
     * Cierra el diálogo sin realizar ninguna acción.
     */
	onKeyPress(event: KeyboardEvent) {
        const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
        if (!allowedRegex.test(event.key)) {
          event.preventDefault();
        }
    }
    /**
     * Limpia los caracteres no permitidos en el campo de entrada.
     * - Permite solo letras y espacios.
     * - Actualiza el valor del formulario sin emitir eventos adicionales.
     *
     * @param event Evento de entrada del campo.
     * @param nameForm Nombre del campo del formulario a limpiar.
     */
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