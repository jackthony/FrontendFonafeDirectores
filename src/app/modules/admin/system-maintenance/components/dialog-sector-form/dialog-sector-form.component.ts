/*******************************************************************************************************
 * Nombre del archivo:  dialog-sector-form.component.ts
 * Descripción:          Componente de formulario modal para registrar o editar sectores.
 *                       Utilizado dentro del mantenedor de sectores del sistema.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Adaptación completa a señales reactivas, validación y control de estados.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ButtonEnum } from 'app/core/enums/button.enum';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { UserService } from 'app/core/user/user.service';
import { FoButtonDialogComponent } from 'app/modules/admin/shared/components/fo-button-dialog/fo-button-dialog.component';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { SectorEntity } from 'app/modules/admin/shared/domain/entities/sector.entity';
import { SectorService } from 'app/modules/admin/shared/domain/services/sector.service';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-dialog-sector-form',
  standalone: true,
  imports: [CommonModule,
	MatIconModule,
	FormInputModule,
	FoButtonDialogComponent,
	TranslateMessageForm,
	MatDialogModule],
  templateUrl: './dialog-sector-form.component.html',
  styleUrl: './dialog-sector-form.component.scss'
})
export class DialogSectorFormComponent {
    private _fb = inject(FormBuilder); // Inyecta FormBuilder para crear formularios reactivos
	private readonly dialogRef = inject(MatDialogRef<DialogSectorFormComponent>); // Referencia al diálogo para poder cerrarlo
    private _userService = inject(UserService); // Servicio para obtener información del usuario actual
	private _sectorService = inject(SectorService); // Servicio para interactuar con los datos del sector
	public data: { object: SectorEntity } = inject(MAT_DIALOG_DATA);
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
	form: FormGroup;
	isEdit = signal<boolean>(false);
	loadingService = signal<boolean>(false);
    /**
     * Hook de inicialización del componente.
     * - Verifica si se está editando un registro según los datos recibidos.
     * - Inicializa el formulario con datos del sector (si existen).
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
     * @param object Objeto con los datos del sector a editar.
     */
	initForm(object: SectorEntity): void {
        this.form = this._fb.group({
            nIdSector: [{ disabled: !object, value: object?.nIdSector }, Validators.required],
            sNombreSector: [ object?  object.sNombreSector : '', [Validators.required, Validators.maxLength(255)] ],
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
     * Registra un nuevo sector o actualiza uno existente.
     * - Si es una edición, llama a `updateForm()`.
     * - Si es un registro nuevo, llama a `registerForm()`.
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
     * Actualiza un sector existente.
     * - Utiliza el servicio SectorService para enviar los datos al backend.
     * - Finaliza la operación y cierra el diálogo si la actualización es exitosa.
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
     * - Permite solo letras y espacios, incluyendo caracteres acentuados.
     * @param event Evento de teclado.
     */
	onKeyPress(event: KeyboardEvent) {
        const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
        if (!allowedRegex.test(event.key)) {
          event.preventDefault();
        }
    }
    /**
     * Limpia los caracteres no permitidos en el campo de entrada.
     * - Permite solo letras y espacios, incluyendo caracteres acentuados.
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