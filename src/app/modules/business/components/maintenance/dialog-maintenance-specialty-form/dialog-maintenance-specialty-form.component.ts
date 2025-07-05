/*******************************************************************************************************
 * Nombre del archivo:  dialog-maintenance-specialty-form.component.ts
 * Descripción:          Componente modal que permite registrar o actualizar una especialidad.
 *                       Utiliza formularios reactivos, validaciones de entrada y control de estado
 *                       mediante señales (`signal`). Aplicación de limpieza de datos y prevención
 *                       de entrada inválida.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Primer release funcional del componente modal para Especialidades.
 *******************************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResponseEntity } from '@models/response.entity';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { SpecialtyEntity } from 'app/modules/business/domain/entities/maintenance/specialty.entity';
import { SpecialtyService } from 'app/modules/business/domain/services/maintenance/specialty.service';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-dialog-maintenance-specialty-form',
  standalone: false,
  templateUrl: './dialog-maintenance-specialty-form.component.html',
  styleUrl: './dialog-maintenance-specialty-form.component.scss'
})
export class DialogMaintenanceSpecialtyFormComponent {
    private _fb = inject(FormBuilder); // Inyecta el servicio FormBuilder para crear formularios reactivos
	private readonly dialogRef = inject(MatDialogRef<DialogMaintenanceSpecialtyFormComponent>); // Inyecta MatDialogRef para cerrar el diálogo
    private _userService = inject(UserService); // Inyecta el servicio UserService para obtener información del usuario
	private _specialtyService = inject(SpecialtyService); // Inyecta el servicio MinistryService para interactuar con los datos del ministerio
	public data: { object: SpecialtyEntity } = inject(MAT_DIALOG_DATA);
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
	form: FormGroup;
	isEdit = signal<boolean>(false);
	loadingService = signal<boolean>(false);
    /**
     * Hook de inicialización del componente.
     * - Establece el modo (edición o creación) según si existe un objeto Specialty recibido por el diálogo.
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
     * @param object Objeto con los datos de la especialidad a editar.
     */
	initForm(object: SpecialtyEntity): void {
        this.form = this._fb.group({
            nIdEspecialidad: [{ disabled: !object, value: object?.nIdEspecialidad }, Validators.required],
            sNombreEspecialidad: [ object?  object.sNombreEspecialidad : '', [Validators.required, Validators.maxLength(255)] ],
            bActivo: [ object? object.bActivo : true, Validators.required ], 
            nUsuarioRegistro: [ { disabled: object, value: this._userService.userLogin().usuarioId }, Validators.required ],
            nUsuarioModificacion: [ { disabled: !object, value: this._userService.userLogin().usuarioId },Validators.required ],
        });
    }
    /**
     * Verifica si el formulario está en modo edición.
     * @returns true si se está editando, false si se está creando.
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
     * Registra una nueva especialidad o actualiza una existente según el estado del formulario.
     * - Si el formulario es inválido, marca todos los campos como tocados.
     * - Si es válido, llama al servicio correspondiente para crear o actualizar el registro.
     */
    registerForm(): void {
        this._specialtyService
            .create(this.form.value)
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseEntity<number>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }
    /**
     * Actualiza una especialidad existente utilizando el servicio de especialidades.
     * - Envía los datos del formulario al servicio y cierra el diálogo si la operación es exitosa.
     */
    updateForm(): void {
        this._specialtyService
            .update(this.form.value)
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseEntity<boolean>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }
    /**
     * Previene la entrada de caracteres no permitidos en el campo de texto.
     * - Permite solo letras (incluidas acentuadas) y espacios.
     * @param event Evento de teclado que se dispara al presionar una tecla.
     */
	onKeyPress(event: KeyboardEvent) {
        const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/; 
        if (!allowedRegex.test(event.key)) {
          event.preventDefault();
        }
    }
    /**
     * Limpia los caracteres no permitidos en el campo de entrada.
     * - Utiliza una expresión regular para permitir solo letras (incluidas acentuadas) y espacios.
     * - Actualiza el valor del formulario sin emitir un evento adicional.
     * @param event Evento de entrada que se dispara al cambiar el valor del campo.
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