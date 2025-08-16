import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { provideNgxMask } from 'ngx-mask';
import { GenerateRequestPresenter } from './generate-request.presenter';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationFormService } from 'app/shared/services/validation-form.service';
import { UbigeoService } from 'app/modules/business/domain/services/business/ubigeo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { GeneralButtonEnum } from 'app/shared/enums/general-button.enum';
import { ConstantEntity } from 'app/modules/business/domain/entities/business/constant.entity';
import { DepartmentEntity } from 'app/modules/business/domain/entities/business/departament.entity';
import { ProvinceEntity } from 'app/modules/business/domain/entities/business/province.entity';
import { DistrictEntity } from 'app/modules/business/domain/entities/business/district.entity';
import { CreateRequestEntity } from 'app/modules/pre-evaluation/domain/entities/create-request.entity';
import { TypeDocumentEnum } from 'app/modules/business/enums/type-document.enum';
import { catchError, distinctUntilChanged, firstValueFrom, forkJoin, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CandidateEntity } from 'app/modules/pre-evaluation/domain/entities/candidate.entity';
import { ResponseEntity } from '@models/response.entity';
import { DateTime } from 'luxon';
import { StatusCandidateEnum } from 'app/shared/enums/status-candidate.enum';
import { CONFIG_INACTIVE_DIALOG_BUSINESS } from 'app/modules/business/config/business/business-management.config';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { CONFIG_GENERATE_REQUEST_DIALOG } from 'app/modules/pre-evaluation/config/generate-request.config';
import { ConstantService } from 'app/modules/business/domain/services/business/constant.service';
import { CONST_GENDER, CONST_TYPE_DOCUMENT } from 'app/modules/business/config/business/directory-business.config';

@Component({
  selector: 'app-generate-request',
  standalone: false,
  templateUrl: './generate-request.component.html',
  styleUrl: './generate-request.component.scss',
  providers: [GenerateRequestPresenter, provideNgxMask()],
})
export class GenerateRequestComponent {
    private readonly _router = inject(Router);
    private readonly _route = inject(ActivatedRoute);
    private readonly _dialogConfirmationService = inject(DialogConfirmationService);


    private readonly _presenter = inject(GenerateRequestPresenter);

    private _validationFormService = inject(ValidationFormService);
    private constantService = inject(ConstantService);
    private _ubigeoService = inject(UbigeoService);
    
    private _fb = inject(FormBuilder);
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
    iconBtnGenerate = input<string>('mat_outline:post_add');
    btnInverter = signal<number>(GeneralButtonEnum.INVERTER);
    btnSuccess = signal<number>(GeneralButtonEnum.GREY);
    statusCandidateEnum = signal<typeof StatusCandidateEnum>(StatusCandidateEnum);
    
    lstTypedocument = signal<ConstantEntity[]>([]);
    lstGender = signal<ConstantEntity[]>([]);
    lstDepartments = signal<DepartmentEntity[]>([]);
    lstProvinces = signal<ProvinceEntity[]>([]);
    lstDistricts = signal<DistrictEntity[]>([]);

    candidate = signal<CandidateEntity>(
		//BORRARRR
		{
			nUsuarioId: 1,
			sNombres: 'Juan',
			sApellidos: 'Pérez',
			sCorreoElectronico: 'juan.perez@example.com',
			bBlock: false,
			bHistorial: true

		} as any
	);
    typeDocument = signal<typeof TypeDocumentEnum>(TypeDocumentEnum); 

    private destroy$ = new Subject<void>();

    form: FormGroup;
    maxDate: Date;
    minDate: Date;

    ngOnInit(): void {
		this.loadAllData();
        this.form = this._presenter.initFormCandidate(this.candidate());
        this.minDate = this.calculateMaxDate().toJSDate(); // Fecha mínima de 120 años
		this.maxDate = this.calculateMinDate().toJSDate(); // Fecha máxima de 18 años
        this.valueChangesForm();
        this.loadProvincesDistricts(); // Carga provincias y distritos
    }

	loadAllData(): void {
		this.constantService.getAll(CONST_GENDER).subscribe({
			next: ((response: ResponseEntity<ConstantEntity>) => {
				if(response.isSuccess){
					this.lstGender.set(response.lstItem);
				} else this.lstGender.set([])
			}),
			error:(() => {
				this.lstGender.set([]);
			})
		});

		this.constantService.getAll(CONST_TYPE_DOCUMENT).subscribe({
			next: ((response: ResponseEntity<ConstantEntity>) => {
				if(response.isSuccess){
					this.lstTypedocument.set(response.lstItem);
				} else this.lstTypedocument.set([])
			}),
			error:(() => {
				this.lstTypedocument.set([]);
			})
		});

		this._ubigeoService.getDepartments().subscribe({
			next: ((response: ResponseEntity<DepartmentEntity>) => {
				if(response.isSuccess){
					this.lstDepartments.set(response.lstItem);
				} else this.lstTypedocument.set([])
			}),
			error:(() => {
				this.lstTypedocument.set([]);
			})
		});
	}

    valueChangesForm(): void {
        if(!(this.candidate()) && !(this.form.get('nTipoDocumento').value)) this.form.get('sNumeroDocumento').disable();
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
		});

        this.form.get('sDepartamentoId')!.valueChanges
		.pipe(
                distinctUntilChanged(),
                tap(() => {
                    this.form.patchValue({ sProvinciaId: 0, sDistritoId: 0 });
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

        this.form.get('sProvinciaId')!.valueChanges
		.pipe(
                distinctUntilChanged(),
                tap(() => {
                    this.form.patchValue({ sDistritoId: 0 });
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
    }

    // Carga provincias y distritos si ya existe un director
	loadProvincesDistricts(): void {
		if(this.candidate().sDepartamentoId && this.candidate().sProvinciaId){
			forkJoin({ 
				provinces: this._ubigeoService.getProvinces(this.candidate().sDepartamentoId), 
				districts: this._ubigeoService.getDistricts(this.candidate().sProvinciaId) 
			}).subscribe({
				next: (response) => {
					this.lstProvinces.set(response.provinces.lstItem), 
					this.lstDistricts.set(response.districts.lstItem) 
				},
				error: (() => {
                    this.lstProvinces.set([]), 
					this.lstDistricts.set([]) 
                })
			})
		}
	}

    returnInit(): void {
        this._router.navigate(['home']);
    }

    async generateCandidate(): Promise<void> {
		console.log('this.form', this.form.value);
		if(this.form.invalid){
			this.form.markAllAsTouched();
			return;
		}
		
		
		this.form.get('bCopiarSolicitud').setValue(false)
		//bajar
		if(this.candidate().bHistorial){
			const config = CONFIG_GENERATE_REQUEST_DIALOG;
			const dialogRef = await this._dialogConfirmationService.open(config);
			const isValid = await firstValueFrom(dialogRef.afterClosed());
			if(isValid) this.form.get('bCopiarSolicitud').setValue(true);
			if(isValid === undefined) return;

		} 

		//CONSUMIR SERVICIO.
		

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

    private calculateMinDate(): DateTime {
		return DateTime.local().minus({ years: 18 }); // Fecha mínima para persona de 18 años
	}
	
	private calculateMaxDate(): DateTime {
		return DateTime.local().minus({ years: 120 }); // Fecha máxima para persona de 120 años
	}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
