import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ResponseModel } from '@models/IResponseModel';
import { ButtonEnum } from 'app/core/enums/button.enum';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { UserService } from 'app/core/user/user.service';
import { MinistryEntity } from 'app/modules/admin/business-management/domain/entities/ministry.entity';
import { FoButtonDialogComponent } from 'app/modules/admin/shared/components/fo-button-dialog/fo-button-dialog.component';
import { MinistryService } from 'app/modules/admin/shared/domain/services/ministry.service';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-ministry-form',
  standalone: true,
  imports: [
	CommonModule,
	MatIconModule,
	FormInputModule,
	FoButtonDialogComponent,
	TranslateMessageForm,
	MatDialogModule],
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
                next: (response: ResponseModel<number>) => {
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
                next: (response: ResponseModel<boolean>) => {
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