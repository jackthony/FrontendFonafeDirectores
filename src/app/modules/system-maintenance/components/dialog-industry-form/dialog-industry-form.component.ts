/*******************************************************************************************************
 * Nombre del archivo:  dialog-industry-form.component.ts
 * Descripción:          Componente modal para registrar o actualizar información de rubros en el sistema.
 *                       Utiliza formularios reactivos, validación de entrada, y control de estado.
 *                       Se integra con servicios de dominio y aplica control de usuarios y accesos.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación inicial del formulario modal para gestión de rubros.
 *******************************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ResponseEntity } from '@models/response.entity';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { UserService } from 'app/modules/user/auth/domain/services/user.service';
import { IndustryEntity } from 'app/modules/system-maintenance/domain/entities/industry.entity';
import { IndustryService } from 'app/modules/system-maintenance/domain/services/industry.service';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-dialog-industry-form',
  standalone: false,
  templateUrl: './dialog-industry-form.component.html',
  styleUrl: './dialog-industry-form.component.scss'
})
export class DialogIndustryFormComponent {
    private _fb = inject(FormBuilder); // Inyecta el servicio FormBuilder para crear formularios reactivos
	private readonly dialogRef = inject(MatDialogRef<DialogIndustryFormComponent>); // Inyecta MatDialogRef para cerrar el diálogo
    private _userService = inject(UserService); // Inyecta el servicio UserService para obtener información del usuario
	private _industryService = inject(IndustryService); // Inyecta el servicio MinistryService para interactuar con los datos del ministerio
	public data: { object: IndustryEntity } = inject(MAT_DIALOG_DATA);
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
	form: FormGroup;
	isEdit = signal<boolean>(false);
	loadingService = signal<boolean>(false);
    /**
     * Hook de inicialización del componente.
     * - Establece el modo (edición o creación) según si existe un objeto Industry recibido por el diálogo.
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
     * @param object Objeto con los datos del rubro a editar.
     */
	initForm(object: IndustryEntity): void {
        this.form = this._fb.group({
            nIdRubro: [{ disabled: !object, value: object?.nIdRubro }, Validators.required],
            sNombreRubro: [ object?  object.sNombreRubro : '', [Validators.required, Validators.maxLength(255)] ],
            bActivo: [ object? object.bActivo : true, Validators.required ],
            nUsuarioRegistro: [ { disabled: object, value: this._userService.userLogin().usuarioId }, Validators.required ],
            nUsuarioModificacion: [ { disabled: !object, value: this._userService.userLogin().usuarioId },Validators.required ],
        });
    }
    /**
     * Valida el formulario y decide si registrar o actualizar según el modo.
     * - Marca todos los campos como tocados si hay errores.
     * - Si es edición, llama a `updateForm`, de lo contrario a `registerForm`.
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
     * Registra un nuevo rubro enviando los datos del formulario al servicio.
     * - Utiliza el servicio `IndustryService` para crear el rubro.
     * - Finaliza la carga y cierra el diálogo si la respuesta es exitosa.
     */
    registerForm(): void {
        this._industryService
            .create(this.form.value)
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseEntity<number>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }
    /**
     * Actualiza un rubro existente enviando los datos del formulario al servicio.
     * - Utiliza el servicio `IndustryService` para actualizar el rubro.
     * - Finaliza la carga y cierra el diálogo si la respuesta es exitosa.
     */
    updateForm(): void {
        this._industryService
            .update(this.form.value)
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseEntity<boolean>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }
    /**
     * Maneja el evento de tecla presionada para permitir solo caracteres válidos.
     * - Permite letras, acentos y espacios.
     * - Previene la entrada de caracteres no permitidos.
     *
     * @param event Evento de teclado.
     */
	onKeyPress(event: KeyboardEvent) {
        const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
        if (!allowedRegex.test(event.key)) {
        event.preventDefault();
        }
    }
    /**
     * Limpia en tiempo real los caracteres no válidos ingresados mediante autocompletado o pegado.
     * - Utiliza una expresión regular para permitir solo letras, acentos y espacios.
     * - Actualiza el valor del formulario sin emitir eventos adicionales.
     *
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