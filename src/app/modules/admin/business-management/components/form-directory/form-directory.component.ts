/*******************************************************************************************************
 * Nombre del archivo : form-directory.component.ts
 * Descripción         : Componente de formulario para el registro y edición de directores en una empresa.
 *                       Incluye validaciones, carga dinámica de ubicaciones, y gestión de dietas según cargo.
 * Autor               : Daniel Alva
 * Fecha de creación   : 23/06/2025
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { FoTitleAreaComponent } from 'app/modules/admin/shared/components/fo-title-area/fo-title-area.component';
import { CompanyAllowance } from '@models/business/companyAllowance.interface';
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
@Component({
  selector: 'app-form-directory',
  standalone: true,
  imports: [CommonModule, FormInputModule, MatDatepickerModule, FoTitleAreaComponent, MatButtonModule, MatIconModule, FoButtonDialogComponent, TranslateMessageForm, NgxMaskDirective, PermissionButtonDirective],
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
    titleDirectory = signal<string>('Composición del Directorio');
    titlePersonal = signal<string>('Datos personales');
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
	director = input.required<DirectorEntity>();
	lstTypedocument = input.required<ConstantEntity[]>();
	lstGender = input.required<ConstantEntity[]>();
	lstCargoManager = input.required<ConstantEntity[]>();
	lstTypeDirector = input.required<ConstantEntity[]>();
	lstSpecialty = input.required<ConstantEntity[]>();
	lstDepartments = input.required<DepartmentEntity[]>();
	lstProvinces = signal<ProvinceEntity[]>([]);
	lstDistricts = signal<DistrictEntity[]>([]);
	form: FormGroup;
	maxDate: Date;
	typeDocument = signal<typeof TypeDocument>(TypeDocument);
	ngOnInit(): void {
		this.maxDate = this.calculateMinDate().toJSDate(); 
		this.initFormDirector();
		this.valueChangesForm();
		this.loadProvincesDistricts();
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
							map((res: ResponseModel<ProvinceEntity>) =>res.lstItem), 
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
							map((res: ResponseModel<DistrictEntity>) => res.lstItem ),
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
					map( (res: ResponseModel<CompanyAllowance>) => res.item?.mDieta ?? 0),
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
			if(value) this.form.get('sNumeroDocumento').enable();
			this.form.get('sNumeroDocumento').setValue('');
			this.form.get('sNumeroDocumento').markAsUntouched();
		})
    }
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
                next: (response: ResponseModel<number>) => {
                    if (response.isSuccess) {
						this._ngxToastrService.showSuccess('Director registrado exitosamente', '¡Éxito!');
                        this.eventRefreshDirectory.emit();
                    }
                },
            });
    }
    updateDirector(): void {
        this._directorService
            .update(this.form.value)
			.pipe(finalize(() => this._spinner.hide()))
            .subscribe({
                next: (response: ResponseModel<boolean>) => {
                    if (response.isSuccess) {
						this._ngxToastrService.showSuccess('Director actualizado exitosamente', '¡Éxito!');
						this.eventRefreshDirectory.emit();
                    }
                },
            });
    }

	private calculateMinDate(): DateTime {
		return DateTime.local().minus({ years: 18 });
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
}