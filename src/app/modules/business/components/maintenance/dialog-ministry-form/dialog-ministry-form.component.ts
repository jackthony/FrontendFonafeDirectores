/*******************************************************************************************************
 * Nombre del archivo:  dialog-ministry-form.component.ts
 * Descripción:          Componente encargado de gestionar el formulario de creación y edición de ministerios.
 *                       Este componente maneja tanto la lógica para crear un nuevo ministerio como para editar 
 *                       uno existente. Permite al usuario ingresar o modificar los datos del ministerio, validarlos, 
 *                       y enviarlos al servidor para su almacenamiento. El componente también incluye validaciones 
 *                       para los campos del formulario y gestiona la interacción con el usuario a través de eventos 
 *                       como presionar teclas y cambios en el contenido del campo de entrada.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del componente para manejo de ministerios.
 *******************************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { MinistryService } from 'app/modules/business/domain/services/maintenance/ministry.service';
import { finalize } from 'rxjs';
import { ResponseEntity } from '@models/response.entity';
import { MinistryEntity } from 'app/modules/business/domain/entities/maintenance/ministry.entity';
@Component({
  selector: 'app-dialog-ministry-form',
  standalone: false,
  templateUrl: './dialog-ministry-form.component.html',
  styleUrl: './dialog-ministry-form.component.scss'
})
export class DialogMinistryFormComponent {
    private _fb = inject(FormBuilder); // Inyecta el servicio FormBuilder para crear formularios reactivos
	private readonly dialogRef = inject(MatDialogRef<DialogMinistryFormComponent>); // Inyecta MatDialogRef para cerrar el diálogo
    private _userService = inject(UserService); // Inyecta el servicio UserService para obtener información del usuario
	private _ministryService = inject(MinistryService); // Inyecta el servicio MinistryService para interactuar con los datos del ministerio
	public data: { object: MinistryEntity } = inject(MAT_DIALOG_DATA);
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
	form: FormGroup;
	isEdit = signal<boolean>(false);
	loadingService = signal<boolean>(false);
    /**
     * Hook de inicialización del componente.
     * - Establece el modo (edición o creación) según si existe un objeto Ministry recibido por el diálogo.
     * - Inicializa el formulario con los valores del objeto o valores por defecto.
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
     * @param object Objeto con los datos del ministerio a editar.
     */
	initForm(object: MinistryEntity): void {
        this.form = this._fb.group({
            nIdMinisterio: [{ disabled: !object, value: object?.nIdMinisterio }, Validators.required],
            sNombreMinisterio: [ object?  object.sNombreMinisterio : '', [Validators.required, Validators.maxLength(255)] ],
            bActivo: [ object? object.bActivo : true, Validators.required ],
            nUsuarioRegistro: [ { disabled: object, value: this._userService.userLogin().usuarioId }, Validators.required ],
            nUsuarioModificacion: [ { disabled: !object, value: this._userService.userLogin().usuarioId },Validators.required ],
        });
    }
    /**
     * Verifica si el formulario está en modo edición.
     * @returns true si se está editando un registro, false si es un nuevo registro.
     */
	validRegisterForm() {
        if(this.loadingService()) return;
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.loadingService.set(true);
        if (this.isEdit()) this.updateForm();
        else this.registerForm();
    }
    /**
     * Registra un nuevo ministerio o actualiza uno existente.
     * - Si el formulario es inválido, marca todos los campos como tocados.
     * - Si es una edición, llama a `updateForm()`.
     * - Si es un registro nuevo, llama a `registerForm()`.
     */
    registerForm(): void {
        this._ministryService
            .create(this.form.value)
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseEntity<number>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }
    /**
     * Actualiza un ministerio existente.
     * - Envía los datos del formulario al servicio y cierra el diálogo si la operación es exitosa.
     */
    updateForm(): void {
        this._ministryService
            .update(this.form.value)
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseEntity<boolean>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }
    /**
     * Maneja el evento de tecla presionada en el campo de entrada.
     * - Permite solo letras, espacios y guiones.
     * @param event Evento de teclado.
     */
	onKeyPress(event: KeyboardEvent) {
        const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]$/;
        if (!allowedRegex.test(event.key)) {
          event.preventDefault();
        }
      }
    /**
     * Limpia en tiempo real los caracteres no válidos ingresados mediante autocompletado o pegado.
     * 
     * @param event Evento de input.
     * @param nameForm Nombre del control del formulario a actualizar.
     */
    onInput(event: Event, nameForm: string) {
        const input = event.target as HTMLInputElement;
        const validPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]*$/;
        if (!validPattern.test(input.value)) {
          const cleaned = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]/g, '');
          input.value = cleaned;
          this.form.get(nameForm).setValue(cleaned, { emitEvent: false });
        }
    }
}