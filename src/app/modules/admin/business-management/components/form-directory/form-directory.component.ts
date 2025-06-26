import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { FoTitleAreaComponent } from 'app/modules/admin/shared/components/fo-title-area/fo-title-area.component';
import { ResponseModel } from '@models/IResponseModel';
import { FileComponentStateService } from '@services/file-component-state.service';
import { ButtonEnum } from 'app/core/enums/button.enum';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { UserService } from 'app/core/user/user.service';
import { PermissionButtonDirective } from 'app/shared/directives/permission-button.directive';
import { TypeDocument } from 'app/shared/enums/type-document.enum';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { ValidationFormService } from 'app/shared/services/validation-form.service';
import { DateUtilsService } from 'app/utils/date-utils.service';
import { DateTime } from 'luxon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, distinctUntilChanged, finalize, forkJoin, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { DirectorService } from '../../domain/services/director.service';
import { DirectorEntity } from '../../domain/entities/director.entity';
import { ConstantEntity } from '../../domain/entities/constant.entity';
import { DepartmentEntity } from '../../domain/entities/departament.entity';
import { ProvinceEntity } from '../../domain/entities/province.entity';
import { DistrictEntity } from '../../domain/entities/district.entity';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { FoButtonDialogComponent } from 'app/modules/admin/shared/components/fo-button-dialog/fo-button-dialog.component';
import { CompanyAllowanceService } from '../../domain/services/company-allowance.service';
import { UbigeoService } from '../../domain/services/ubigeo.service';
import { PositionEntity } from 'app/modules/admin/shared/domain/entities/position.entity';
import { TypeDirectorEntity } from 'app/modules/admin/shared/domain/entities/type-director.entity';
import { SpecialtyEntity } from 'app/modules/admin/shared/domain/entities/specialty.entity';
import { SectorEntity } from 'app/modules/admin/shared/domain/entities/sector.entity';
import { CompanyAllowanceEntity } from '../../domain/entities/companyAllowance.entity';

@Component({
  selector: 'app-form-directory',
  standalone: true,
  imports: [CommonModule, FormInputModule, MatDatepickerModule, FoTitleAreaComponent, MatButtonModule, MatIconModule, FoButtonDialogComponent, TranslateMessageForm, NgxMaskDirective, PermissionButtonDirective],
  templateUrl: './form-directory.component.html',
  styleUrl: './form-directory.component.scss',
  providers: [provideNgxMask()],
})
export class FormDirectoryComponent implements OnInit { 

	// Inyección de dependencias
	private _fb = inject(FormBuilder); // FormBuilder para crear formularios reactivos
	private _spinner = inject(NgxSpinnerService); // Para manejar el spinner de carga
	private _ngxToastrService = inject(NgxToastrService); // Para mostrar notificaciones
	private _directorService = inject(DirectorService); // Servicio para manejar directores
	private _validationFormService = inject(ValidationFormService); // Servicio para validaciones de formulario
	private _ubigeoService = inject(UbigeoService); // Servicio para manejar provincias
	private _userService = inject(UserService); // Servicio para obtener datos del usuario
	private _companyAllowance = inject(CompanyAllowanceService); // Servicio para manejar asignaciones de empresa
	private _fileComponentStateService = inject(FileComponentStateService); // Servicio para manejar el estado de los archivos
	private _dateUtilsService = inject(DateUtilsService); // Servicio para utilidades de fecha

    // Emite eventos para la cancelación o refresco del directorio
    @Output() eventCancelDirectory: EventEmitter<void> = new EventEmitter<void>(); 
    @Output() eventRefreshDirectory: EventEmitter<void> = new EventEmitter<void>();

	// Subject para manejar la destrucción del componente
	private destroy$ = new Subject<void>();

	// Propiedades reactivas del componente
	business = input.required<BusinessEntity>(); // Empresa asociada
    titleDirectory = signal<string>('Composición del Directorio'); // Título del directorio
    titlePersonal = signal<string>('Datos personales'); // Título de los datos personales
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum); // Enum para los botones

	director = input.required<DirectorEntity>(); // Director que se edita o registra

	// Listas para las opciones de formulario (tipo de documento, género, cargo, etc.)
	lstTypedocument = input.required<ConstantEntity[]>();
	lstGender = input.required<ConstantEntity[]>();
	lstCargoManager = input.required<PositionEntity[]>();
	lstTypeDirector = input.required<TypeDirectorEntity[]>();
	lstSpecialty = input.required<SpecialtyEntity[]>();
	lstSector = input.required<SectorEntity[]>();

	// Lista de departamentos
	lstDepartments = input.required<DepartmentEntity[]>();

	// Listas reactivas para provincias y distritos
	lstProvinces = signal<ProvinceEntity[]>([]);
	lstDistricts = signal<DistrictEntity[]>([]);

	// Formulario reactivo para el director
	form: FormGroup;
	maxDate: Date; // Fecha máxima (18 años para el director)
	minDate: Date;
	yearDirector = signal<string>('');

	typeDocument = signal<typeof TypeDocument>(TypeDocument); // Tipo de documento

	// Método que se ejecuta al inicializar el componente
	ngOnInit(): void {
		this.minDate = this.calculateMaxDate().toJSDate(); // Fecha mínima de 120 años
		this.maxDate = this.calculateMinDate().toJSDate(); // Fecha máxima de 18 años
		this.initFormDirector(); // Inicializa el formulario del director
		this.valueChangesForm(); // Configura los cambios reactivos en el formulario
		this.loadProvincesDistricts(); // Carga provincias y distritos
		this.initGenerateYearDirector(); //Generar años al director

		// Si ya hay un director, establece el estado de los archivos asociados
		if(this.director()) {
            const fileState = {
                title: 'Director',
                isDisabled: false,
                root: `Empresa\\${this.business().sRazonSocial}\\${this.director().sNumeroDocumento}`
            }
            this._fileComponentStateService.setFileComponentState(fileState); // Activa el estado del archivo
        } else {
            // Si no hay director, deshabilita los archivos
            const fileState = {
                title: 'Director',
                isDisabled: true,
                message: '* Debe registrar al director, para registrar archivos',
            }
            this._fileComponentStateService.setFileComponentState(fileState); // Establece el estado del archivo
        }
	}
    
    // Método que emite el evento para cancelar el directorio
    cancelDirectory(): void {
      this.eventCancelDirectory.emit(); // Emite el evento de cancelación
    }

    // Inicializa el formulario del director con sus validaciones y valores predeterminados
	initFormDirector(): void {
		this.form = this._fb.group({ // Inicializa el formulario con valores predeterminados
			nIdRegistro: [ this.director() ? this.director().nIdRegistro : { disabled: true, value: 0  } ],
			nIdEmpresa: [ this.business().nIdEmpresa , [Validators.required, Validators.min(1)] ],
			nTipoDocumento: [ this.director() ? { disabled: true, value: this.director().nTipoDocumento } : 0, [Validators.required, Validators.min(1)] ],
			sNumeroDocumento: [ this.director() ? { disabled: true, value: this.director().sNumeroDocumento } : '', [Validators.required, this._validationFormService.validationDocument] ],
			sNombres: [ this.director() ? { disabled: true, value: this.director().sNombres } : '', [Validators.required, Validators.maxLength(150)] ],
			sApellidos: [ this.director() ? { disabled: true, value: this.director().sApellidos } : '', [Validators.required, Validators.maxLength(150)] ],
			dFechaNacimiento: [ this.director() ? { disabled: true, value: this.director().dFechaNacimiento } : null, [Validators.required, Validators.maxLength(10)] ],
			nGenero: [ this.director() ? { disabled: true, value: this.director().nGenero } : 0, [Validators.required, Validators.min(1)] ],
			sDepartamento: [ this.director() ? this.director().sDepartamento : 0, [Validators.required, Validators.min(1)] ],
			sProvincia: [ this.director() ? this.director().sProvincia : 0, [Validators.required, Validators.min(1)] ],
			sDistrito: [ this.director() ? this.director().sDistrito : 0, [Validators.required, Validators.min(1)] ],
			sDireccion: [ this.director() ? this.director().sDireccion : '', [Validators.required, Validators.maxLength(255)] ],
			sTelefono: [ this.director() ? this.director().sTelefono : '', [Validators.required, this._validationFormService.validationPhone] ],
			sTelefonoSecundario: [ this.director() ? this.director().sTelefonoSecundario : '', [this._validationFormService.validationPhone] ],
			sTelefonoTerciario: [ this.director() ? this.director().sTelefonoTerciario : '', [this._validationFormService.validationPhone] ],
			sCorreo: [ this.director() ? this.director().sCorreo : '', [Validators.required, Validators.maxLength(250), this._validationFormService.validationMail] ],
			sCorreoSecundario: [ this.director() ? this.director().sCorreoSecundario : '', [ Validators.maxLength(250), this._validationFormService.validationMail] ],
			sCorreoTerciario: [ this.director() ? this.director().sCorreoTerciario : '', [ Validators.maxLength(250), this._validationFormService.validationMail] ],
			nCargo: [ this.director() ? this.director().nCargo : 0, [Validators.required, Validators.min(1)] ],
			nTipoDirector: [ this.director() ? this.director().nTipoDirector : 0, [Validators.required, Validators.min(1)] ],
			sProfesion: [ this.director() ? this.director().sProfesion : '', [Validators.required, Validators.maxLength(150)] ],
			nIdSector: [this.director() ? this.director().nIdSector : 0, [Validators.required, Validators.min(1)]], // Campo de proponente
			mDieta: [ this.director() ? this.director().mDieta : null, [Validators.required, Validators.min(0), Validators.max(999999999999.99)] ],
			nEspecialidad: [ this.director() ? this.director().nEspecialidad : 0, [Validators.required, Validators.min(1)] ],
			dFechaNombramiento: [ this.director() ? this._dateUtilsService.formatDateToString(this.director().dFechaNombramiento) : null, [Validators.required,  Validators.maxLength(10)] ],
			dFechaDesignacion: [ this.director() ? this._dateUtilsService.formatDateToString(this.director().dFechaDesignacion) : null, [Validators.required, Validators.maxLength(10)] ],
			dFechaRenuncia: [ { disabled: true, value: this.director() ? this.director().dFechaRenuncia : null } , Validators.required ],
			sComentario: [ this.director() ? this.director().sComentario : '', Validators.maxLength(1000) ],
			nUsuarioRegistro: [ { disabled: this.director(), value: this._userService.userLogin().usuarioId }, Validators.required ],
            nUsuarioModificacion: [ { disabled: !this.director(), value: this._userService.userLogin().usuarioId }, Validators.required ],
		})
	}

	// Detecta los cambios en los campos y actualiza las listas de provincias y distritos
	valueChangesForm(): void {
        this.form.get('sDepartamento')!.valueChanges
		.pipe(
                distinctUntilChanged(), // Solo realiza la acción si el valor cambia
                tap(() => {
                    this.form.patchValue({ sProvincia: 0, sDistrito: 0 }); // Restablece los valores de provincia y distrito
                    this.lstProvinces.set([]); // Limpia la lista de provincias
                    this.lstDistricts.set([]); // Limpia la lista de distritos
                }),
                switchMap((deptId) =>
                    deptId ? this._ubigeoService.getProvinces(deptId)
                        .pipe( 
							map((res: ResponseModel<ProvinceEntity>) =>res.lstItem), // Mapea las provincias
							catchError(() => {
								return of([]); // Devuelve una lista vacía en caso de error
							})
						)
						: of([]) // Si no hay departamento, devuelve una lista vacía
                ),
                takeUntil(this.destroy$) // Detiene la operación cuando el componente es destruido
            )
            .subscribe((lstItem) => this.lstProvinces.set(lstItem)); // Actualiza la lista de provincias

        // Similar al cambio de departamento, maneja el cambio de provincia para obtener los distritos
        this.form.get('sProvincia')!.valueChanges
		.pipe(
                distinctUntilChanged(),
                tap(() => {
                    this.form.patchValue({ sDistrito: 0 }); // Restablece el valor de distrito
                    this.lstDistricts.set([]); // Limpia la lista de distritos
                }),
                switchMap((provId) =>
					provId ? this._ubigeoService.getDistricts(provId)
                        .pipe( 
							map((res: ResponseModel<DistrictEntity>) => res.lstItem ), // Mapea los distritos
							catchError(() => {
								return of([]); // Devuelve una lista vacía en caso de error
							})
						)
                        : of([]) // Si no hay provincia, devuelve una lista vacía
                ),
                takeUntil(this.destroy$) // Detiene la operación cuando el componente es destruido
            )
            .subscribe((lstItem) => this.lstDistricts.set(lstItem)); // Actualiza la lista de distritos

		// Detecta el cambio de cargo para obtener la dieta correspondiente
		this.form.get('nCargo').valueChanges
		.pipe(
			distinctUntilChanged(),
			switchMap((value) => {
				return this._companyAllowance.getByRuc(this.business().sRuc, value).pipe(
					map( (res: ResponseModel<CompanyAllowanceEntity>) => res.item?.mDieta ?? 0), // Mapea la dieta
					catchError(() => {
						return of(0); // En caso de error, devuelve 0
					})
				)
			}),
			takeUntil(this.destroy$) // Detiene la operación cuando el componente es destruido
		).subscribe((item) => {
			this.form.get('mDieta').setValue(item); // Establece el valor de la dieta en el formulario
		})

		// Deshabilita el campo de número de documento si no hay un tipo de documento
		if(!(this.director()) && !(this.form.get('nTipoDocumento').value)) this.form.get('sNumeroDocumento').disable();

		// Habilita el campo de número de documento si hay un tipo de documento seleccionado
		this.form.get('nTipoDocumento').valueChanges
		.pipe(
			distinctUntilChanged(),
			takeUntil(this.destroy$)
		).subscribe((value) => {
			if(value) this.form.get('sNumeroDocumento').enable(); // Habilita el campo
			this.form.get('sNumeroDocumento').setValue(''); // Limpia el valor
			this.form.get('sNumeroDocumento').markAsUntouched(); // Marca el campo como no tocado
		})
		
		this.form.get('dFechaNacimiento').valueChanges
		.pipe(
			distinctUntilChanged(),
			takeUntil(this.destroy$)
		).subscribe((value) => {
			this.generateYearDirector(value);
		});

		if(this.director()) this.generateYearDirector(this.director().dFechaNacimiento);
    }
	
	generateYearDirector(value: string): void {
		const fechaNacimiento = this.form.get('dFechaNacimiento')?.valid;
		if (fechaNacimiento) {  // Comprobamos si el campo es 'VALID'
			console.log('validd');
			let edad: number = 0;
			if (value) {
				const fecha = DateTime.fromISO(value);  // Convierte el valor ISO de la fecha
				const hoy = DateTime.local();  // Obtiene la fecha actual
				edad = hoy.year - fecha.year;
				const year = `${edad} años`
				this.yearDirector.set(year);
			} else this.yearDirector.set('');
		} else {
			this.yearDirector.set('');
		}
	}

	initGenerateYearDirector(): void {
		const fechaNacimiento = DateTime.fromISO(this.director()?.dFechaNacimiento);  // Convierte el string ISO a DateTime de Luxon
      	const hoy = DateTime.local();  // Obtiene la fecha actual

      	// Calculamos la edad restando el año de nacimiento al año actual
      	let edad = hoy.year - fechaNacimiento.year;
		if(edad) {
			const year = `${edad} años`
		  this.yearDirector.set(year);
		}
		  
	}

    // Carga provincias y distritos si ya existe un director
	loadProvincesDistricts(): void {
		if(this.director()){
			forkJoin({ // Realiza múltiples peticiones de forma paralela
				provinces: this._ubigeoService.getProvinces(this.director().sDepartamento), // Obtiene las provincias del departamento
				districts: this._ubigeoService.getDistricts(this.director().sProvincia) // Obtiene los distritos de la provincia
			}).subscribe({
				next: (response) => {
					this.lstProvinces.set(response.provinces.lstItem), // Establece las provincias
					this.lstDistricts.set(response.districts.lstItem) // Establece los distritos
				},
				error: (() => this.eventRefreshDirectory.emit()) // Si hay error, emite el evento de refrescar directorio
			})
		}
	}

    // Registra o actualiza el director según el estado del formulario
	registerForm(): void {
		console.log('formmm', this.form); // Muestra el formulario en la consola para depuración
		
		// Verifica si el formulario es válido
		if (this.form.invalid) {
            this.form.markAllAsTouched(); // Marca todos los campos como tocados
            return;
        }
        this._spinner.show(); // Muestra el spinner de carga
        

		// Formatea el número de teléfono para eliminar espacios
		const phone = this.form.get('sTelefono');
		const formatPhone = phone.value.replace(/\s/g, '');
		phone.setValue(formatPhone); // Establece el valor formateado

		// Formatea la dieta eliminando espacios y convirtiéndola a número
		const diet = this.form.get('mDieta');
        if (typeof diet.value === 'string') {
            const dietFormat = diet.value.replace(/\s/g, '');
            diet.setValue(parseFloat(dietFormat)); // Establece la dieta formateada
        }

		// Si ya existe un director, actualiza los datos, sino, registra un nuevo director
		if (this.director()) this.updateDirector();
        else this.registerDirector();
	}

	// Registra un nuevo director
	registerDirector(): void {
		// Convierte los nombres y apellidos a mayúsculas antes de registrarlos
		const fields = ['sNombres', 'sApellidos'];
        fields.forEach(field => {
            const control = this.form.get(field);
            if (control && typeof control.value === 'string') {
                control.setValue(control.value.toUpperCase(), { emitEvent: false }); // Establece el valor en mayúsculas
            }
        });
        this._directorService
            .create(this.form.value) // Crea el director en el servicio
            .pipe(finalize(() => this._spinner.hide())) // Finaliza la carga con el spinner
            .subscribe({
                next: (response: ResponseModel<number>) => {
                    if (response.isSuccess) {
						// Muestra mensaje de éxito
						this._ngxToastrService.showSuccess('Director registrado exitosamente', '¡Éxito!');
                        this.eventRefreshDirectory.emit(); // Emite el evento de refresco del directorio
                    }
                },
            });
    }

    // Actualiza los datos del director
    updateDirector(): void {
        this._directorService
            .update(this.form.value) // Actualiza los datos del director
			.pipe(finalize(() => this._spinner.hide())) // Finaliza la carga con el spinner
            .subscribe({
                next: (response: ResponseModel<boolean>) => {
                    if (response.isSuccess) {
						// Muestra mensaje de éxito
						this._ngxToastrService.showSuccess('Director actualizado exitosamente', '¡Éxito!');
						this.eventRefreshDirectory.emit(); // Emite el evento de refresco del directorio
                    }
                },
            });
    }

	// Calcula la fecha mínima (18 años atrás)
	private calculateMinDate(): DateTime {
		return DateTime.local().minus({ years: 18 }); // Fecha mínima para persona de 18 años
	}
	
	private calculateMaxDate(): DateTime {
		return DateTime.local().minus({ years: 120 }); // Fecha máxima para persona de 120 años
	}

	// Filtra los caracteres permitidos para el nombre
	onKeyPress(event: KeyboardEvent) {
        const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/; // Solo permite letras y espacios
        if (!allowedRegex.test(event.key)) {
          event.preventDefault(); // Impide la tecla si no es válida
        }
    }
    
	// Filtra los caracteres permitidos en los campos de entrada
    onInput(event: Event, nameForm: string) {
        const input = event.target as HTMLInputElement;
        const validPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Solo permite letras y espacios
    
        if (!validPattern.test(input.value)) {
          const cleaned = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); // Limpia los caracteres no válidos
          input.value = cleaned;
          this.form.get(nameForm).setValue(cleaned, { emitEvent: false }); // Establece el valor limpio
        }
    }

	// Limpia las suscripciones al destruir el componente
	ngOnDestroy() {
        this.destroy$.next(); // Emite el valor para completar el flujo
        this.destroy$.complete(); // Completa el Subject
    }

	// Filtra las teclas permitidas para las fechas
	onKeyPressDate(event: KeyboardEvent) {
		const allowedRegex = /[0-9\/]/; // Permite solo números y barra (/)
		if (!allowedRegex.test(event.key)) {
		  event.preventDefault(); // Impide la tecla si no es válida
		}
	}

	// Filtra los caracteres permitidos en el campo de fecha
	onInputDate(event: Event, nameForm: string) {
		const input = event.target as HTMLInputElement;
		const validPattern = /^[0-9\/]*$/; // Permite solo números y barra (/)
		if (!validPattern.test(input.value)) {
		  const cleaned = input.value.replace(/[^0-9\/]/g, ''); // Limpia los caracteres no válidos
		  input.value = cleaned;
		  this.form.get(nameForm)?.setValue(cleaned, { emitEvent: false }); // Establece el valor limpio
		}
	}

	// Formatea una fecha a formato 'yyyy-MM-dd'
	formatDate(date: string): string {
		if(!date) return null; // Si la fecha es nula, devuelve null
		const dt = DateTime.fromISO(date); // Convierte la fecha en formato ISO
		const dateFormat = dt.toFormat('yyyy-MM-dd'); // Formatea la fecha
		return dateFormat; // Devuelve la fecha formateada
	}
}