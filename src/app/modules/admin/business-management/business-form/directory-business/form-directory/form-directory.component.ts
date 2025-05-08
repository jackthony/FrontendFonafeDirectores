import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { FoButtonDialogComponent } from '@components/fo-button-dialog/fo-button-dialog.component';
import { FoTitleAreaComponent } from '@components/fo-title-area/fo-title-area.component';
import { Business } from '@models/business/business.interface';
import { Constant } from '@models/business/constant.interface';
import { Department } from '@models/business/departament.interface';
import { Director } from '@models/business/director.interface';
import { District } from '@models/business/district.interface';
import { Province } from '@models/business/province.interface';
import { ResponseModel } from '@models/IResponseModel';
import { DirectorService } from '@services/director.service';
import { DistrictService } from '@services/district.service';
import { ProvinceService } from '@services/province.service';
import { ButtonEnum } from 'app/core/enums/button.enum';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { UserService } from 'app/core/user/user.service';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { ValidationFormService } from 'app/shared/services/validation-form.service';
import { DateTime } from 'luxon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgxSpinnerService } from 'ngx-spinner';
import { distinctUntilChanged, finalize, forkJoin, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-form-directory',
  standalone: true,
  imports: [CommonModule, FormInputModule, MatDatepickerModule, FoTitleAreaComponent, MatButtonModule, MatIconModule, FoButtonDialogComponent, TranslateMessageForm, NgxMaskDirective],
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
	private _provinceService = inject(ProvinceService);
	private _districtService = inject(DistrictService);
	private _userService = inject(UserService);
	

    @Output() eventCancelDirectory: EventEmitter<void> = new EventEmitter<void>();
    @Output() eventRefreshDirectory: EventEmitter<void> = new EventEmitter<void>();

	private destroy$ = new Subject<void>();

	business = input.required<Business>();

  	titleDirectory = signal<string>('Datos directorio');
  	titlePersonal = signal<string>('Datos personales');
	buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);

	director = input.required<Director>();

	lstTypedocument = input.required<Constant[]>();
	lstGender = input.required<Constant[]>();
	lstCargoManager = input.required<Constant[]>();
	lstTypeDirector = input.required<Constant[]>();
	lstSpecialty = input.required<Constant[]>();

	lstDepartments = input.required<Department[]>();

	lstProvinces = signal<Province[]>([]);
	lstDistricts = signal<District[]>([]);

	form: FormGroup;
	maxDate: Date;

	ngOnInit(): void {
		this.maxDate = this.calculateMinDate().toJSDate();
		this.initFormDirector();
		this.valueChangesForm();
		this.loadProvincesDistricts();
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
			dFechaNacimiento: [ this.director() ? { disabled: true, value: this.director().dFechaNacimiento } : null, [Validators.required] ],
			nGenero: [ this.director() ? { disabled: true, value: this.director().nGenero } : 0, [Validators.required, Validators.min(1)] ],
			sDepartamento: [ this.director() ? this.director().sDepartamento : 0, [Validators.required, Validators.min(1)] ],
			sProvincia: [ this.director() ? this.director().sProvincia : 0, [Validators.required, Validators.min(1)] ],
			sDistrito: [ this.director() ? this.director().sDistrito : 0, [Validators.required, Validators.min(1)] ],
			sDireccion: [ this.director() ? this.director().sDireccion : '', [Validators.required, Validators.maxLength(255)] ],
			sTelefono: [ this.director() ? this.director().sTelefono : '', [Validators.required, this._validationFormService.validationPhone] ],
			sCorreo: [ this.director() ? this.director().sCorreo : '', [Validators.required, this._validationFormService.validationMail] ],
			nCargo: [ this.director() ? this.director().nCargo : 0, [Validators.required, Validators.min(1)] ],
			nTipoDirector: [ this.director() ? this.director().nTipoDirector : 0, [Validators.required, Validators.min(1)] ],
			sProfesion: [ this.director() ? this.director().sProfesion : '', [Validators.required, Validators.maxLength(150)] ],
			mDieta: [ this.director() ? this.director().mDieta : null, [Validators.required, Validators.min(0), Validators.max(999999999999.99)] ],
			nEspecialidad: [ this.director() ? this.director().nEspecialidad : 0, [Validators.required, Validators.min(1)] ],
			dFechaNombramiento: [ this.director() ? this.director().dFechaNombramiento : null, Validators.required ],
			dFechaDesignacion: [ this.director() ? this.director().dFechaDesignacion : null, Validators.required ],
			dFechaRenuncia: [ this.director() ? this.director().dFechaRenuncia : null, Validators.required ],
			sComentario: [ this.director() ? this.director().sComentario : '', Validators.maxLength(1000) ],
			sUsuarioRegistro: [ { disabled: this.director(), value: this._userService.userLogin().id }, Validators.required ],
            sUsuarioModificacion: [ { disabled: !this.director(), value: this._userService.userLogin().id }, Validators.required ],
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
                    deptId ? this._provinceService.getByPagination(new RequestOption({ pathVariables: [deptId] }))
                        .pipe( map((res: ResponseModel<Province>) =>res.lstItem) )
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
					provId ? this._districtService.getByPagination(new RequestOption({ pathVariables: [provId] }))
                        .pipe( map((res: ResponseModel<District>) => res.lstItem ) )
                        : of([])
                ),
                takeUntil(this.destroy$)
            )
            .subscribe((lstItem) => this.lstDistricts.set(lstItem));
    }

	

	loadProvincesDistricts(): void {
		if(this.director()){
			forkJoin({
				provinces: this._provinceService.getByPagination(new RequestOption({ pathVariables: [this.director().sDepartamento] })),
				districts: this._districtService.getByPagination(new RequestOption({ pathVariables: [this.director().sProvincia] }))
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
		console.log(this.form);

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
        const request = new RequestOption();
        request.request = this.form.value;
        this._directorService
            .create(request)
            .pipe(finalize(() => this._spinner.hide()))
            .subscribe({
                next: (response: ResponseModel<number>) => {
                    if (response.isSuccess) {
						//MENSAJE DE SATISFACCION
						this._ngxToastrService.showSuccess('Director registrado exitosamente', '¡Éxito!');
                        this.eventRefreshDirectory.emit();
                    }
                },
            });
    }

    updateDirector(): void {
        const request = new RequestOption();
        request.request = this.form.value;
        this._directorService
            .update(request)
			.pipe(finalize(() => this._spinner.hide()))
            .subscribe({
                next: (response: ResponseModel<boolean>) => {
                    if (response.isSuccess) {
						this._ngxToastrService.showSuccess('Director actualizado exitosamente', '¡Éxito!');
						//MENSAJE DE SATISFACCION
                        this.eventRefreshDirectory.emit();
                    }
                },
            });
    }

	private calculateMinDate(): DateTime {
		return DateTime.local().minus({ years: 18 });
	}

	ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
