/*******************************************************************************************************
 * Nombre del archivo:  dialog-maintenance-role-form.component.ts
 * Descripción:          Componente modal para registrar o actualizar roles del sistema. Implementa
 *                       formularios reactivos, validación de entradas, manejo de estado y señales.
 *                       Integra servicios para persistencia de datos y utiliza componentes reutilizables.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Primer release funcional para mantenimiento de roles.
 *******************************************************************************************************/
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ResponseEntity } from '@models/response.entity';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { RoleEntity } from 'app/modules/user/domain/entities/maintenance/role.entity';
import { finalize } from 'rxjs';
import { RoleService } from 'app/modules/user/domain/services/maintenance/role.service';
@Component({
  selector: 'app-dialog-maintenance-role-form',
  standalone: false,
  templateUrl: './dialog-maintenance-role-form.component.html',
  styleUrl: './dialog-maintenance-role-form.component.scss'
})
export class DialogMaintenanceRoleFormComponent {
    private _fb = inject(FormBuilder); // Inyecta el servicio FormBuilder para crear formularios reactivos
	private readonly dialogRef = inject(MatDialogRef<DialogMaintenanceRoleFormComponent>); // Inyecta MatDialogRef para cerrar el diálogo
    private _userService = inject(UserService); // Inyecta el servicio UserService para obtener información del usuario
	private _roleService = inject(RoleService); // Inyecta el servicio MinistryService para interactuar con los datos del rol
	public data: { object: RoleEntity } = inject(MAT_DIALOG_DATA);
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
	form: FormGroup;
	isEdit = signal<boolean>(false);
	loadingService = signal<boolean>(false);
    /**
     * Hook de inicialización del componente.
     * - Establece el modo (edición o creación) según si existe un objeto Role recibido por el diálogo.
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
     * @param object Objeto con los datos del rol a editar.
     */
	initForm(object: RoleEntity): void {
        this.form = this._fb.group({
            nRolId: [{ disabled: !object, value: object?.nRolId }, Validators.required],
            sNombreRol: [ object?  object.sNombreRol : '', [Validators.required, Validators.maxLength(100)] ],
            bActivo: [ object? object.bActivo : true, Validators.required ],
            nIdUsuarioCreacion: [ { disabled: object, value: this._userService.userLogin().usuarioId }, Validators.required ],
            nIdUsuarioModificacion: [ { disabled: !object, value: this._userService.userLogin().usuarioId },Validators.required ],
        });
    }
    /**
     * Verifica si el formulario está en modo edición.
     * @returns true si se está editando un rol existente, false si es un nuevo registro.
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
     * Registra un nuevo rol o actualiza uno existente según el estado del formulario.
     * - Si el formulario es inválido, marca todos los campos como tocados.
     * - Si es válido, llama al servicio correspondiente para crear o actualizar el registro.
     */
    registerForm(): void {
        this._roleService
            .create(this.form.value)
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseEntity<number>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }
    /**
     * Actualiza un rol existente utilizando el servicio de rol.
     * - Envía los datos del formulario al servicio y cierra el diálogo si la operación es exitosa.
     */
    updateForm(): void {
        this._roleService
            .update(this.form.value) 
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseEntity<boolean>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }
    /**
     * Maneja el evento de tecla presionada para restringir la entrada a caracteres permitidos.
     * - Permite letras del alfabeto español, espacios y caracteres acentuados.
     * @param event Evento de teclado.
     */
	onKeyPress(event: KeyboardEvent) {
        const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
        if (!allowedRegex.test(event.key)) {
        event.preventDefault();
        }
    }
    /**
     * Maneja el evento de entrada de texto para limpiar caracteres no permitidos.
     * - Permite solo letras del alfabeto español y espacios, eliminando otros caracteres.
     * @param event Evento de entrada de texto.
     * @param nameForm Nombre del campo del formulario a actualizar.
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