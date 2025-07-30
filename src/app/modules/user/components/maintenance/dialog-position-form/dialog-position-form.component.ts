/*******************************************************************************************************
 * Nombre del archivo:  dialog-position-form.component.ts
 * Descripción:          Componente modal para registrar o editar cargos en el sistema.
 *                       Permite gestionar la entidad Position (Cargo) a través de un formulario reactivo.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Versión inicial del formulario con soporte para edición y creación.
 *******************************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResponseEntity } from '@models/response.entity';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { finalize } from 'rxjs';
import { PositionEntity } from '../../../domain/entities/maintenance/position.entity';
import { PositionService } from 'app/modules/user/domain/services/maintenance/position.service';
import { ValidationFormService } from 'app/shared/services/validation-form.service';
@Component({
  selector: 'app-dialog-position-form',
  standalone: false,
  templateUrl: './dialog-position-form.component.html',
  styleUrl: './dialog-position-form.component.scss'
})
export class DialogPositionFormComponent {
    private _fb = inject(FormBuilder); // FormBuilder para crear formularios reactivos
	private readonly dialogRef = inject(MatDialogRef<DialogPositionFormComponent>); // Referencia al diálogo para cerrarlo
    private _userService = inject(UserService); // Servicio de usuario para obtener información del usuario logueado
	private _sectorService = inject(PositionService); // Servicio de sector para manejar operaciones CRUD de la entidad Position
	private _validationFormService = inject(ValidationFormService); // Servicio utilitario que centraliza lógica de validación y mensajes de error en formularios reactivos.
    public data: { object: PositionEntity } = inject(MAT_DIALOG_DATA); // Datos inyectados en el diálogo, contiene el objeto PositionEntity si se está editando
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
	form: FormGroup;
	isEdit = signal<boolean>(false);
	loadingService = signal<boolean>(false);
    /**
     * Hook de ciclo de vida del componente.
     * - Establece el modo (edición o creación) según si existe un objeto Position recibido por el diálogo.
     * - Inicializa el formulario con los valores del objeto o valores por defecto.
     */
	ngOnInit(): void {
		this.isEdit.set(this.data?.object ? true : false);
		this.initForm(this.data?.object);
	}
    /**
     * Inicializa el formulario reactivo con los controles necesarios.
     * - Si se está editando, carga los valores del objeto PositionEntity.
     * - Si no, establece valores por defecto.
     * @param object Objeto PositionEntity con los datos a editar o null si es un nuevo registro.
     */
	initForm(object: PositionEntity): void {
        this.form = this._fb.group({
            nIdCargo: [{ disabled: !object, value: object?.nIdCargo }, Validators.required],
            sNombreCargo: [ object?  object.sNombreCargo : '', [Validators.required, this._validationFormService.spaceValidator,Validators.maxLength(255)] ],
            bActivo: [ object? object.bActivo : true, Validators.required ],
            nUsuarioRegistro: [ { disabled: object, value: this._userService.userLogin().usuarioId }, Validators.required ],
            nUsuarioModificacion: [ { disabled: !object, value: this._userService.userLogin().usuarioId },Validators.required ],
        });
    }
    /**
     * Valida el formulario y realiza la acción correspondiente (crear o actualizar).
     * - Si el formulario es inválido, marca todos los campos como tocados.
     * - Si es válido, llama al servicio correspondiente para crear o actualizar el registro.
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
     * Registra un nuevo cargo utilizando el servicio de sector.
     * - Envía los datos del formulario al servicio y cierra el diálogo si la operación es exitosa.
     */
    registerForm(): void {
        this._sectorService
            .create(this.form.value)
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseEntity<number>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }
    /**
     * Actualiza un cargo existente utilizando el servicio de sector.
     * - Envía los datos del formulario al servicio y cierra el diálogo si la operación es exitosa.
     */
    updateForm(): void {
        this._sectorService
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
     * - Permite solo letras y espacios, bloqueando cualquier otro carácter.
     * @param event Evento de teclado.
     */
	onKeyPress(event: KeyboardEvent) {
        const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
        if (!allowedRegex.test(event.key)) {
          event.preventDefault();
        }
    }
    /**
     * Maneja el evento de entrada en el campo de texto.
     * - Limpia cualquier carácter no permitido (no letras ni espacios) del valor del campo.
     * @param event Evento de entrada.
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