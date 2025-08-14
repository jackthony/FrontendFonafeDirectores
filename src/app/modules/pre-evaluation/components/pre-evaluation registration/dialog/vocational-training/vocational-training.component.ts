import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateFormationRequest } from 'app/modules/pre-evaluation/domain/entities/create-formation.entity';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { ValidationFormService } from 'app/shared/services/validation-form.service';

@Component({
  selector: 'app-vocational-training',
  standalone: false,
  templateUrl: './vocational-training.component.html',
  styleUrl: './vocational-training.component.scss'
})
export class VocationalTrainingComponent {
	private _fb = inject(FormBuilder);
	public data: { object: CreateFormationRequest, /* lstStatus: ConstantEntity[], lstPosition: PositionEntity[], lstProfile: RoleEntity[], lstTypePersonal: ConstantEntity[] */ } = inject(MAT_DIALOG_DATA);// Datos inyectados al componente de diálogo (usuario, estados, cargos y perfiles) desde el componente que lo abrió.
	private readonly dialogRef = inject(MatDialogRef<VocationalTrainingComponent>); // Referencia al diálogo actual, usada para cerrarlo y devolver resultados al componente padre.
	private _userService = inject(UserService); // Servicio personalizado para operaciones generales de usuario.
	private _validationFormService = inject(ValidationFormService); // Servicio utilitario que centraliza lógica de validación y mensajes de error en formularios reactivos.
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
	form: FormGroup;
	isEdit = signal<boolean>(false);
	loadingService = signal<boolean>(false);
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
	initForm(object: CreateFormationRequest): void {
        this.form = this._fb.group({
			NCandidatoId: [{ disabled: !object, value: object?.NCandidatoId }, Validators.required],
            NGradoId: [ object? object.NGradoId : '', [Validators.required,this._validationFormService.spaceValidator, Validators.maxLength(100)] ],
            NProfesionId: [ object? object.NProfesionId : '', [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(100)] ],
            SUniversidad: [ object? object.SUniversidad : '', [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(100)] ],
            NPaisId: [ object? object.NPaisId : 0, [Validators.required, Validators.min(1)] ],
            NEstado: [ object? object.NEstado : 0, Validators.required ],
            BActivo: [ object? object.BActivo : true, Validators.required ],
			dFechaInicio: [ object? object.dFechaInicio: null, Validators.required],
			dFechaFin: [ object? object.dFechaFin: null, Validators.required],
            NUsuarioRegistroId: [ this._userService.userLogin()?.usuarioId , Validators.required ],
			NUsuarioModificacionId: [ this._userService.userLogin()?.usuarioId, Validators.required ],
			//NUsuarioModificacionId: [ { disabled: !object, value: this._userService.userLogin()?.usuarioId },Validators.required ],
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
        /* const fields = ['sNombres', 'sApellidoPaterno', 'sApellidoMaterno'];
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
            }); */
    }
    /**
     * Actualiza los datos de un usuario existente mediante el servicio.
     */
    updateProfile(): void {
        /* const areChanges = this.detectChanges();
        if(!areChanges) {
            this.dialogRef.close(false);
            return;
        } 
        this._segUserService
            .update(this.form.value) 
            .pipe(finalize(() => this.loadingService.set(false))) 
            .subscribe({
                next: (response: ResponseEntity<boolean>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            }); */
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

	onKeyPressDate(event: KeyboardEvent) {
		const allowedRegex = /[0-9\/]/;
		if (!allowedRegex.test(event.key)) {
		  event.preventDefault(); 
		}
	}

	onInputDate(event: Event, nameForm: string) {
		const input = event.target as HTMLInputElement;
		const validPattern = /^[0-9\/]*$/;
		if (!validPattern.test(input.value)) {
		  const cleaned = input.value.replace(/[^0-9\/]/g, '');
		  input.value = cleaned;
		  this.form.get(nameForm)?.setValue(cleaned, { emitEvent: false });
		}
	}
}
