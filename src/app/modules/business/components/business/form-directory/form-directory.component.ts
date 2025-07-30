/*******************************************************************************************************
 * Nombre del archivo : form-directory.component.ts
 * Descripción         : Componente de formulario para el registro y edición de directores en una empresa.
 *                       Incluye validaciones, carga dinámica de ubicaciones, y gestión de dietas según cargo.
 * Autor               : Daniel Alva
 * Fecha de creación   : 23/06/2025
 *******************************************************************************************************/
import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileComponentStateService } from '@services/file-component-state.service';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { ValidationFormService } from 'app/shared/services/validation-form.service';
import { DateUtilsService } from 'app/utils/date-utils.service';
import { DateTime } from 'luxon';
import { provideNgxMask } from 'ngx-mask';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, distinctUntilChanged, finalize, forkJoin, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { TypeDirectorEntity } from 'app/modules/business/domain/entities/maintenance/type-director.entity';
import { SpecialtyEntity } from 'app/modules/business/domain/entities/maintenance/specialty.entity';
import { SectorEntity } from 'app/modules/business/domain/entities/maintenance/sector.entity';
import { ResponseEntity } from '@models/response.entity';
import { TypeDocumentEnum } from 'app/modules/business/enums/type-document.enum';
import { PositionEntity } from 'app/modules/user/domain/entities/maintenance/position.entity';
import { DirectorService } from 'app/modules/business/domain/services/business/director.service';
import { UbigeoService } from 'app/modules/business/domain/services/business/ubigeo.service';
import { CompanyAllowanceService } from 'app/modules/business/domain/services/business/company-allowance.service';
import { BusinessEntity } from 'app/modules/business/domain/entities/business/business.entity';
import { DirectorEntity } from 'app/modules/business/domain/entities/business/director.entity';
import { ConstantEntity } from 'app/modules/business/domain/entities/business/constant.entity';
import { DepartmentEntity } from 'app/modules/business/domain/entities/business/departament.entity';
import { ProvinceEntity } from 'app/modules/business/domain/entities/business/province.entity';
import { DistrictEntity } from 'app/modules/business/domain/entities/business/district.entity';
import { CompanyAllowanceEntity } from 'app/modules/business/domain/entities/business/companyAllowance.entity';

@Component({
  selector: 'app-form-directory',
  standalone: false,
  templateUrl: './form-directory.component.html',
  styleUrl: './form-directory.component.scss',
  providers: [provideNgxMask()],
})
export class FormDirectoryComponent implements OnInit { 
	private _fb = inject(FormBuilder);
	private _spinner = inject(NgxSpinnerService);
	private _ngxToastrService = inject(NgxToastrService);
	private _directorService = inject(DirectorService);
	private _validationFormService = inject(ValidationFormService);
	private _ubigeoService = inject(UbigeoService);
	private _userService = inject(UserService);
	private _companyAllowance = inject(CompanyAllowanceService);
	private _fileComponentStateService = inject(FileComponentStateService);
	private _dateUtilsService = inject(DateUtilsService)
    @Output() eventCancelDirectory: EventEmitter<void> = new EventEmitter<void>(); 
    @Output() eventRefreshDirectory: EventEmitter<void> = new EventEmitter<void>();
	private destroy$ = new Subject<void>();
	business = input.required<BusinessEntity>();
    titleDirectory = signal<string>('Composición del Director');
    titlePersonal = signal<string>('Datos personales');
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
	director = input.required<DirectorEntity>();
	lstTypedocument = input.required<ConstantEntity[]>();
	lstGender = input.required<ConstantEntity[]>();
	lstCargoManager = input.required<PositionEntity[]>();
	lstTypeDirector = input.required<TypeDirectorEntity[]>();
	lstSpecialty = input.required<SpecialtyEntity[]>();
	lstSector = input.required<SectorEntity[]>();

	// Lista de departamentos
	lstDepartments = input.required<DepartmentEntity[]>();
	lstProvinces = signal<ProvinceEntity[]>([]);
	lstDistricts = signal<DistrictEntity[]>([]);
	yearDirector = signal<string>('');
	typeDocument = signal<typeof TypeDocumentEnum>(TypeDocumentEnum); // Tipo de documento
	modifiedFields = signal<string[]>([]);
    areChanges = signal<boolean>(false);

	maxDate: Date;
	form: FormGroup;
	minDate: Date;

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
            this._fileComponentStateService.setFileComponentState(fileState);
        } else {
            const fileState = {
                title: 'Director',
                isDisabled: true,
                message: '* Debe registrar al director, para registrar archivos',
            }
            this._fileComponentStateService.setFileComponentState(fileState);
        }
	}
    cancelDirectory(): void {
      this.eventCancelDirectory.emit();
    }
	initFormDirector(): void {
		this.form = this._fb.group({
			nIdRegistro: [ this.director() ? this.director().nIdRegistro : { disabled: true, value: 0  } ],
			nIdEmpresa: [ this.business().nIdEmpresa , [Validators.required, Validators.min(1)] ],
			nTipoDocumento: [ this.director() ? { disabled: true, value: this.director().nTipoDocumento } : 0, [Validators.required, Validators.min(1)] ],
			sNumeroDocumento: [ this.director() ? { disabled: true, value: this.director().sNumeroDocumento } : '', [Validators.required, this._validationFormService.dniValidator] ],
			sNombres: [ this.director() ? { disabled: true, value: this.director().sNombres } : '', [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(150)] ],
			sApellidos: [ this.director() ? { disabled: true, value: this.director().sApellidos } : '', [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(150)] ],
			dFechaNacimiento: [ this.director() ? { disabled: true, value: this.director().dFechaNacimiento } : null, [Validators.required, Validators.maxLength(10)] ],
			nGenero: [ this.director() ? { disabled: true, value: this.director().nGenero } : 0, [Validators.required, Validators.min(1)] ],
			sDepartamento: [ this.director() ? this.director().sDepartamento : 0, [Validators.required, Validators.min(1)] ],
			sProvincia: [ this.director() ? this.director().sProvincia : 0, [Validators.required, Validators.min(1)] ],
			sDistrito: [ this.director() ? this.director().sDistrito : 0, [Validators.required, Validators.min(1)] ],
			sDireccion: [ this.director() ? this.director().sDireccion : '', [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(255)] ],
			sTelefono: [ this.director() ? this.director().sTelefono : '', [Validators.required, this._validationFormService.validationPhone] ],
			sTelefonoSecundario: [ this.director() ? this.director().sTelefonoSecundario : '', [this._validationFormService.validationPhone] ],
			sTelefonoTerciario: [ this.director() ? this.director().sTelefonoTerciario : '', [this._validationFormService.validationPhone] ],
			sCorreo: [ this.director() ? this.director().sCorreo : '', [Validators.required, Validators.maxLength(250), this._validationFormService.validationMail] ],
			sCorreoSecundario: [ this.director() ? this.director().sCorreoSecundario : '', [ Validators.maxLength(250), this._validationFormService.validationMail] ],
			sCorreoTerciario: [ this.director() ? this.director().sCorreoTerciario : '', [ Validators.maxLength(250), this._validationFormService.validationMail] ],
			nCargo: [ this.director() ? this.director().nCargo : 0, [Validators.required, Validators.min(1)] ],
			nTipoDirector: [ this.director() ? this.director().nTipoDirector : 0, [Validators.required, Validators.min(1)] ],
			sProfesion: [ this.director() ? this.director().sProfesion : '', [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(150)] ],
			nIdSector: [this.director() ? this.director().nIdSector : 0, [Validators.required, Validators.min(1)]], // Campo de proponente
			mDieta: [ this.director() ? this.director().mDieta : null, [Validators.required, Validators.min(0), Validators.max(999999999999.99)] ],
			nEspecialidad: [ this.director() ? this.director().nEspecialidad : 0, [Validators.required, Validators.min(1)] ],
			dFechaNombramiento: [ this.director() ? this._dateUtilsService.formatDateToString(this.director().dFechaNombramiento) : null, [Validators.required,  Validators.maxLength(10)] ],
			dFechaDesignacion: [ this.director() ? this._dateUtilsService.formatDateToString(this.director().dFechaDesignacion) : null, [Validators.required, Validators.maxLength(10)] ],
			dFechaRenuncia: [ this.director() ? this.director().dFechaRenuncia : null],
			sComentario: [ this.director() ? this.director().sComentario : '', [Validators.maxLength(1000), this._validationFormService.spaceValidator] ],
			nUsuarioRegistro: [ { disabled: this.director(), value: this._userService.userLogin().usuarioId }, Validators.required ],
            nUsuarioModificacion: [ { disabled: !this.director(), value: this._userService.userLogin().usuarioId }, Validators.required ],
		})
	}

	controlsMapped: { [key: string]: string } = {
        sDepartamento: 'Departamento',
        sProvincia: 'Provincia',
        sDistrito: 'Distrito',
        sDireccion: 'Dirección',
        sTelefono: 'Telefono principal',
        sTelefonoSecundario: 'Telefono opcional 1',
        sTelefonoTerciario: 'Telefono opcional 2',
        sCorreo: 'Correo principal',
        sCorreoSecundario: 'Correo opcional 1',
        sCorreoTerciario: 'Correo opcional 2',
        nCargo: 'Cargo',
        nTipoDirector: 'Tipo de director',
        sProfesion: 'Profesión',
        nIdSector: 'Sector',
        mDieta: 'Dieta',
        nEspecialidad: 'Especialidad',
        dFechaNombramiento: 'Fecha de nombramiento',
        dFechaDesignacion: 'Fecha de designación',
        dFechaRenuncia: 'Fecha de renuncia',
        sComentario: 'Comentario'
    };

	valueChangesForm(): void {
        this.form.get('sDepartamento')!.valueChanges
		.pipe(
                distinctUntilChanged(),
                tap(() => {
                    this.form.patchValue({ sProvincia: 0, sDistrito: 0 });
                    this.lstProvinces.set([]); 
                    this.lstDistricts.set([]); 
                }),
                switchMap((deptId) =>
                    deptId ? this._ubigeoService.getProvinces(deptId)
                        .pipe( 
							map((res: ResponseEntity<ProvinceEntity>) =>res.lstItem), 
							catchError(() => {
								return of([]); 
							})
						)
						: of([]) 
                ),
                takeUntil(this.destroy$) 
            )
            .subscribe((lstItem) => this.lstProvinces.set(lstItem));
        this.form.get('sProvincia')!.valueChanges
		.pipe(
                distinctUntilChanged(),
                tap(() => {
                    this.form.patchValue({ sDistrito: 0 });
                    this.lstDistricts.set([]);
                }),
                switchMap((provId) =>
					provId ? this._ubigeoService.getDistricts(provId)
                        .pipe( 
							map((res: ResponseEntity<DistrictEntity>) => res.lstItem ),
							catchError(() => {
								return of([]);
							})
						)
                        : of([]) 
                ),
                takeUntil(this.destroy$) 
            )
            .subscribe((lstItem) => this.lstDistricts.set(lstItem));
		this.form.get('nCargo').valueChanges
		.pipe(
			distinctUntilChanged(),
			switchMap((value) => {
				return this._companyAllowance.getByRuc(this.business().sRuc, value).pipe(
					map( (res: ResponseEntity<CompanyAllowanceEntity>) => res.item?.mDieta ?? 0), // Mapea la dieta
					catchError(() => {
						return of(0);
					})
				)
			}),
			takeUntil(this.destroy$) 
		).subscribe((item) => {
			this.form.get('mDieta').setValue(item);
		})
		if(!(this.director()) && !(this.form.get('nTipoDocumento').value)) this.form.get('sNumeroDocumento').disable();
		this.form.get('nTipoDocumento').valueChanges
		.pipe(
			distinctUntilChanged(),
			takeUntil(this.destroy$)
		).subscribe((value) => {
			if(value === TypeDocumentEnum.dni) this.form.get('sNumeroDocumento').setValidators([Validators.required, this._validationFormService.dniValidator]);
			if(value === TypeDocumentEnum.ce) this.form.get('sNumeroDocumento').setValidators([Validators.required, this._validationFormService.ceValidator]);
			if(value) {
				this.form.get('sNumeroDocumento').enable();
			}
			this.form.get('sNumeroDocumento').setValue('');
			this.form.get('sNumeroDocumento').markAsUntouched();
			this.form.get('sNumeroDocumento').updateValueAndValidity();
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
		if (fechaNacimiento) {  
			let edad: number = 0;
			if (value) {
				const fecha = DateTime.fromISO(value);  // Convierte el valor ISO de la fecha
				const hoy = DateTime.local();  // Obtiene la fecha actual
				edad = hoy.year - fecha.year;
				if (hoy.month < fecha.month || (hoy.month === fecha.month && hoy.day < fecha.day)) {
					edad--;
				}
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
		  if (hoy.month < fechaNacimiento.month || (hoy.month === fechaNacimiento.month && hoy.day < fechaNacimiento.day)) {
			edad--;
		}
		if(edad) {
			const year = `${edad} años`
		  this.yearDirector.set(year);
		}
		  
	}

    // Carga provincias y distritos si ya existe un director
	loadProvincesDistricts(): void {
		if(this.director()){
			forkJoin({ 
				provinces: this._ubigeoService.getProvinces(this.director().sDepartamento), 
				districts: this._ubigeoService.getDistricts(this.director().sProvincia) 
			}).subscribe({
				next: (response) => {
					this.lstProvinces.set(response.provinces.lstItem), 
					this.lstDistricts.set(response.districts.lstItem) 
				},
				error: (() => this.eventRefreshDirectory.emit())
			})
		}
	}
	registerForm(): void {
		console.log('formmm', this.form);
		if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this._spinner.show();
		const phone = this.form.get('sTelefono');
		const formatPhone = phone.value.replace(/\s/g, '');
		phone.setValue(formatPhone);
		const diet = this.form.get('mDieta');
        if (typeof diet.value === 'string') {
            const dietFormat = diet.value.replace(/\s/g, '');
            diet.setValue(parseFloat(dietFormat));
        }
		if (this.director()) this.updateDirector();
        else this.registerDirector();
	}

	registerDirector(): void {
		const fields = ['sNombres', 'sApellidos'];
        fields.forEach(field => {
            const control = this.form.get(field);
            if (control && typeof control.value === 'string') {
                control.setValue(control.value.toUpperCase(), { emitEvent: false });
            }
        });
        this._directorService
            .create(this.form.value)
            .pipe(finalize(() => this._spinner.hide()))
            .subscribe({
                next: (response: ResponseEntity<number>) => {
                    if (response.isSuccess) {
						this._ngxToastrService.showSuccess('Director registrado exitosamente', '¡Éxito!');
                        this.eventRefreshDirectory.emit();
                    }
                },
            });
    }
    updateDirector(): void {
		this.detectChanges();
        this._directorService
            .update(this.form.value)
			.pipe(finalize(() => this._spinner.hide()))
            .subscribe({
                next: (response: ResponseEntity<boolean>) => {
                    if (response.isSuccess) {
						const fields = this.modifiedFields().length > 0 ? `Los campos (${this.modifiedFields().join(', ')})` : 'Todos los campos';
						this._ngxToastrService.showSuccess(`${fields} del director, se actualizaron exitosamente`, '¡Éxito!');
						this.eventRefreshDirectory.emit();
                    }
                },
            });
    }

	private calculateMinDate(): DateTime {
		return DateTime.local().minus({ years: 18 }); // Fecha mínima para persona de 18 años
	}
	
	private calculateMaxDate(): DateTime {
		return DateTime.local().minus({ years: 120 }); // Fecha máxima para persona de 120 años
	}

	onKeyPress(event: KeyboardEvent) {
        const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/; 
        if (!allowedRegex.test(event.key)) {
          event.preventDefault();
        }
    }
    onInput(event: Event, nameForm: string) {
        const input = event.target as HTMLInputElement;
        const validPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
        if (!validPattern.test(input.value)) {
			const cleaned = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
			input.value = cleaned;
			this.form.get(nameForm).setValue(cleaned, { emitEvent: false });
        }
    }
	ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
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
	formatDate(date: string): string {
		if(!date) return null;
		const dt = DateTime.fromISO(date);
		const dateFormat = dt.toFormat('yyyy-MM-dd');
		return dateFormat;
	}

	/**
     * Método para detectar cambios realizados en el formulario
     */
    detectChanges() {
        this.modifiedFields.set([]);  // Resetear los cambios previos
        this.areChanges.set(false); // Suponemos que no hay cambios al principio
    
        // Recorremos los controles del formulario directamente
        for (const controlName in this.form.controls) {
            if (this.form.controls.hasOwnProperty(controlName)) {
                const control = this.form.controls[controlName];
            // Verificamos si el campo ha sido modificado
            if (control.dirty) {
                const name = this.controlsMapped[controlName];
                this.modifiedFields.update(prev => [...prev, name]); // Agregar a la lista de campos modificados
                this.areChanges.set(true); // Si se encuentra algún campo modificado, ponemos esta variable en false
            }
          }
        }
    }
}