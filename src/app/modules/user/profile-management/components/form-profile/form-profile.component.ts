/*******************************************************************************************************
 * Nombre del componente: FormProfileComponent
 * Descripción:           Componente de formulario para la creación y edición de usuarios dentro del
 *                        módulo de gestión de perfiles. Contiene validaciones reactivas, control de
 *                        campos dinámicos, y lógica diferenciada para registros nuevos o edición.
 * Autor:                 Daniel Alva
 * Fecha de creación:     10/06/2025
 * Última modificación:   23/06/2025 por Daniel Alva
 * Cambios recientes:     - Soporte para modo edición y modo registro.
 *                        - Validación y saneamiento de entradas de texto.
 *                        - Integración con servicios para guardar datos de usuario.
 *******************************************************************************************************/
import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { UserService } from 'app/modules/user/auth/domain/services/user.service';
import { ValidationFormService } from 'app/shared/services/validation-form.service';
import { finalize } from 'rxjs';
import { SegUserService } from '../../domain/services/seg-user.service';
import { SegUserEntity } from '../../domain/entities/seg-user.entity';
import { ConstantEntity } from 'app/modules/system-maintenance/domain/entities/constant.entity';
import { RoleEntity } from 'app/modules/system-maintenance/domain/entities/role.entity';
import { PositionEntity } from 'app/modules/system-maintenance/domain/entities/position.entity';
import { ResponseEntity } from '@models/response.entity';
@Component({
    selector: 'app-form-profile',
    standalone: false,
    templateUrl: './form-profile.component.html',
    styleUrl: './form-profile.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class FormProfileComponent implements OnInit {
	private _fb = inject(FormBuilder);
	public data: { object: SegUserEntity, lstStatus: ConstantEntity[], lstPosition: PositionEntity[], lstProfile: RoleEntity[], lstTypePersonal: ConstantEntity[] } = inject(MAT_DIALOG_DATA);// Datos inyectados al componente de diálogo (usuario, estados, cargos y perfiles) desde el componente que lo abrió.
	private readonly dialogRef = inject(MatDialogRef<FormProfileComponent>); // Referencia al diálogo actual, usada para cerrarlo y devolver resultados al componente padre.
	private _userService = inject(UserService); // Servicio personalizado para operaciones generales de usuario.
	private _segUserService = inject(SegUserService); // Servicio específico para la gestión de seguridad de usuarios.
	private _validationFormService = inject(ValidationFormService); // Servicio utilitario que centraliza lógica de validación y mensajes de error en formularios reactivos.
    test = new FormControl('', Validators.required);
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
	form: FormGroup;
	isEdit = signal<boolean>(false);
	loadingService = signal<boolean>(false);
	typeInputPassword = signal<boolean>(false);
    /**
     * Método del ciclo de vida que se ejecuta al iniciar el componente.
     * Define si el formulario será de edición o registro, y lo inicializa.
     */
	ngOnInit(): void {
		this.isEdit.set(this.data.object ? true : false);
		this.initForm(this.data?.object);
	}
    /**
     * Inicializa el formulario reactivo con validaciones. Deshabilita campos si se trata de una edición.
     * @param object Objeto del usuario a editar, si existe.
     */
	initForm(object: SegUserEntity): void {
        this.form = this._fb.group({
            nIdUsuario: [{ disabled: !object, value: object?.nIdUsuario }, Validators.required],
            sApellidoPaterno: [ { disabled: object, value: object?  object.sApellidoPaterno : '' }, [Validators.required, Validators.maxLength(50)] ],
            sApellidoMaterno: [ { disabled: object, value: object?  object.sApellidoMaterno : '' }, [Validators.required, Validators.maxLength(50)] ],
            sNombres: [ { disabled: object, value: object?  object.sNombres : '' }, [Validators.required, Validators.maxLength(150)] ],
            nIdCargo: [ object? object.nIdCargo : 0, [Validators.required, Validators.min(1)] ],
            nIdRol: [ object? object.nIdRol : 0, [Validators.required, Validators.min(1)] ],
            nTipoPersonal: [ object? object.nTipoPersonal : 0, [Validators.required, Validators.min(1)] ],
            nEstado: [ object? object.nEstado : 0, [Validators.required, Validators.min(1)] ],
            sCorreoElectronico:  [ { disabled: object, value: object ? object.sCorreoElectronico : '' }, [Validators.required, Validators.maxLength(150), this._validationFormService.validationMail] ],
            sContrasena:  [ { disabled: object, value: object ? '******' : '' } , [Validators.required, Validators.maxLength(32)] ],
            nUsuarioRegistro: [ { disabled: object, value: this._userService.userLogin()?.usuarioId }, Validators.required ],
            nUsuarioModificacion: [ { disabled: !object, value: this._userService.userLogin()?.usuarioId },Validators.required ],
        });
    }
    /**
     * Ejecuta la validación completa del formulario.
     * Si es válido, determina si se ejecutará una operación de creación o actualización.
     */
	registerForm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.loadingService.set(true);
        if (this.isEdit()) this.updateProfile(); 
        else this.registerProfile();
    }
    /**
     * Registra un nuevo perfil de usuario. Convierte campos clave a mayúsculas antes del envío.
     */
    registerProfile(): void {
        const fields = ['sNombres', 'sApellidoPaterno', 'sApellidoMaterno'];
        fields.forEach(field => {
            const control = this.form.get(field);
            if (control && typeof control.value === 'string') {
                control.setValue(control.value.toUpperCase(), { emitEvent: false });
            }
        });
        this._segUserService
            .create(this.form.value) 
            .pipe(finalize(() => this.loadingService.set(false))) 
            .subscribe({
                next: (response: ResponseEntity<number>) => {
                    if (response.isSuccess) this.dialogRef.close(true); 
                },
            });
    }
    /**
     * Actualiza los datos de un usuario existente mediante el servicio.
     */
    updateProfile(): void {
        this._segUserService
            .update(this.form.value) 
            .pipe(finalize(() => this.loadingService.set(false))) 
            .subscribe({
                next: (response: ResponseEntity<boolean>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }
    /**
     * Cambia el estado de visualización del input de contraseña (mostrar u ocultar).
     */
    viewPassword(): void {
		this.typeInputPassword.set(!this.typeInputPassword());
	}
    /**
     * Valida en tiempo real las teclas presionadas para evitar caracteres no permitidos (solo letras y espacios).
     * @param event Evento del teclado.
     */
    onKeyPress(event: KeyboardEvent) {
        const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/; 
        if (!allowedRegex.test(event.key)) {
        event.preventDefault(); 
        }
    }
    /**
     * Limpia caracteres no válidos en el input y actualiza el valor del formulario sin emitir eventos.
     * @param event Evento del input.
     * @param nameForm Nombre del control dentro del formulario.
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