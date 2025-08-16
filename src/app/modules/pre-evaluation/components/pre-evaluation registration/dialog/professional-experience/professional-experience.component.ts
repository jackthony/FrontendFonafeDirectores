import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CandidateEntity } from 'app/modules/pre-evaluation/domain/entities/candidate.entity';
import { FormationCandidateEntity } from 'app/modules/pre-evaluation/domain/entities/formation-candidate.entity';
import { WorkExperienceEntity } from 'app/modules/pre-evaluation/domain/entities/work-experience.entity';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { ValidationFormService } from 'app/shared/services/validation-form.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-professional-experience',
  standalone: false,
  templateUrl: './professional-experience.component.html',
  styleUrl: './professional-experience.component.scss'
})
export class ProfessionalExperienceComponent {
	private _fb = inject(FormBuilder);
	public data: { object: WorkExperienceEntity, candidate: CandidateEntity /* lstStatus: ConstantEntity[], lstPosition: PositionEntity[], lstProfile: RoleEntity[], lstTypePersonal: ConstantEntity[] */ } = inject(MAT_DIALOG_DATA);// Datos inyectados al componente de diálogo (usuario, estados, cargos y perfiles) desde el componente que lo abrió.
	private readonly dialogRef = inject(MatDialogRef<ProfessionalExperienceComponent>); // Referencia al diálogo actual, usada para cerrarlo y devolver resultados al componente padre.
	private _userService = inject(UserService); // Servicio personalizado para operaciones generales de usuario.
	private _validationFormService = inject(ValidationFormService); // Servicio utilitario que centraliza lógica de validación y mensajes de error en formularios reactivos.
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
	form: FormGroup;
	isEdit = signal<boolean>(false);
	loadingService = signal<boolean>(false);
    maxDateStart: Date;
	minDateStart: Date;
    maxDateEnd: Date;
	minDateEnd: Date;

	ngOnInit(): void {
		this.isEdit.set(this.data.object ? true : false);
		this.initForm(this.data?.object, this.data.candidate);
        this.minDateStart = this.calculateMaxDateStart().toJSDate(); // Fecha mínima de 120 años
		this.maxDateStart = this.calculateMinDateStart().toJSDate(); // Fecha máxima de 18 años
        this.minDateEnd = this.calculateMaxDateEnd().toJSDate(); // Fecha mínima de 120 años
		this.maxDateEnd = this.calculateMinDateEnd().toJSDate(); // Fecha máxima de 18 años
	}
	
    initForm(object: WorkExperienceEntity, candidate: CandidateEntity): void {
        this.form = this._fb.group({
            nExperienciaProfId: [object ? object.nExperienciaProfId : 0, Validators.required ],
			nCandidatoId: [object ? object.nCandidatoId : candidate?.nCandidatoId , Validators.required],
            sNombreEmpresa: [ object? object.sNombreEmpresa : '', [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(255)] ],
            sRucEmpresa: [ object? object.sRucEmpresa : '', [Validators.required, this._validationFormService.validarRuc, Validators.maxLength(11)] ],
            nCargoId: [ object? object.nCargoId : 0, [Validators.required, Validators.min(1)] ],
            sNombreCargo: [ object? object.sNombreCargo : '', [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(150)] ],
            nEstado: [ object? object.nEstado : 1, Validators.required ],
            bActivo: [ object? object.bActivo : true, Validators.required ],
			dFechaInicio: [ object? object.dFechaInicio: null, [Validators.required, Validators.maxLength(10)]],
			dFechaFin: [ object? object.dFechaFin: null, [Validators.required, Validators.maxLength(10)]],
            nUsuarioRegistroId: [ this._userService.userLogin()?.usuarioId , Validators.required ],
			nUsuarioModificacionId: [ this._userService.userLogin()?.usuarioId, Validators.required ],
        },
        {
            validators: this._validationFormService.rangeDateValidator('dFechaInicio', 'dFechaFin')
        });
    }

	registerForm() {
        console.log('this.form', this.form.value)
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        //this.loadingService.set(true);
        /* if (this.isEdit()) this.updateProfile(); 
        else this.registerProfile(); */
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

	private calculateMinDateStart(): DateTime {
		return DateTime.now();
	}
	
	private calculateMaxDateStart(): DateTime {
		return DateTime.local().minus({ years: 120 }); // Fecha máxima para persona de 120 años
	}

    private calculateMinDateEnd(): DateTime {
		return DateTime.now().set({ month: 12, day: 31 });
	}
	
	private calculateMaxDateEnd(): DateTime {
		return DateTime.local().minus({ years: 120 }); // Fecha máxima para persona de 120 años
	}
}
