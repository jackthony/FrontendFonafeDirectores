import {
    Component,
    EventEmitter,
    inject,
    input,
    OnInit,
    Output,
    signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DirectorEntity } from 'app/modules/business/domain/entities/business/director.entity';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { GeneralButtonEnum } from 'app/shared/enums/general-button.enum';
import { HomePreEvaluationPresenter } from './home-pre-evaluation.presenter';
import { ConstantEntity } from 'app/modules/business/domain/entities/business/constant.entity';
import { CreateRequestEntity } from 'app/modules/pre-evaluation/domain/entities/create-request.entity';
import { catchError, distinctUntilChanged, forkJoin, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { TypeDocumentEnum } from 'app/modules/business/enums/type-document.enum';
import { ValidationFormService } from 'app/shared/services/validation-form.service';
import { provideNgxMask } from 'ngx-mask';
import { DateTime } from 'luxon';
import { DepartmentEntity } from 'app/modules/business/domain/entities/business/departament.entity';
import { ProvinceEntity } from 'app/modules/business/domain/entities/business/province.entity';
import { DistrictEntity } from 'app/modules/business/domain/entities/business/district.entity';
import { ResponseEntity } from '@models/response.entity';
import { UbigeoService } from 'app/modules/business/domain/services/business/ubigeo.service';

@Component({
    selector: 'app-home-pre-evaluation',
    standalone: false,
    templateUrl: './home-pre-evaluation.component.html',
    styleUrl: './home-pre-evaluation.component.scss',
    providers: [HomePreEvaluationPresenter, provideNgxMask()],
})
export class HomePreEvaluationComponent implements OnInit {
    private readonly _router = inject(Router);

    private readonly _presenter = inject(HomePreEvaluationPresenter);

    private _validationFormService = inject(ValidationFormService);
    private _ubigeoService = inject(UbigeoService);
    
    private _fb = inject(FormBuilder);
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
    iconBtnSearch = input<string>('mat_outline:add_circle_outline');
    iconBtnCancel = input<string>('mat_outline:cancel');
    iconBtnChecked = input<string>('mat_outline:check_circle');
    director = input.required<DirectorEntity>();
    btnInverter = signal<number>(GeneralButtonEnum.INVERTER);
    btnSuccess = signal<number>(GeneralButtonEnum.GREY);
    
    lstTypedocument = signal<ConstantEntity[]>([]);
    lstGender = signal<ConstantEntity[]>([]);
    lstDepartments = signal<DepartmentEntity[]>([]);
    lstProvinces = signal<ProvinceEntity[]>([]);
    lstDistricts = signal<DistrictEntity[]>([]);

    candidate = signal<CreateRequestEntity>(null);
    typeDocument = signal<typeof TypeDocumentEnum>(TypeDocumentEnum); // Tipo de documento
    
    
    @Output() eventNewElement: EventEmitter<void> = new EventEmitter<void>();
    @Output() eventSearch: EventEmitter<string> = new EventEmitter<string>();

    private destroy$ = new Subject<void>();

    form: FormGroup;
    maxDate: Date;
    minDate: Date;

    get groupCrearCandidatoRequest(): FormGroup {
        return this.form.get('crearCandidatoRequest') as FormGroup;
    }

    ngOnInit(): void {
        this.form = this._presenter.initFormCandidate(this.candidate());
        this.minDate = this.calculateMaxDate().toJSDate(); // Fecha mínima de 120 años
		this.maxDate = this.calculateMinDate().toJSDate(); // Fecha máxima de 18 años
        this.valueChangesForm();
        this.loadProvincesDistricts(); // Carga provincias y distritos
    }

    valueChangesForm(): void {
        if(!(this.candidate()) && !(this.groupCrearCandidatoRequest.get('nTipoDocumento').value)) this.groupCrearCandidatoRequest.get('sNumeroDocumento').disable();
		this.groupCrearCandidatoRequest.get('nTipoDocumento').valueChanges
		.pipe(
			distinctUntilChanged(),
			takeUntil(this.destroy$)
		).subscribe((value) => {
			if(value === TypeDocumentEnum.dni) this.groupCrearCandidatoRequest.get('sNumeroDocumento').setValidators([Validators.required, this._validationFormService.dniValidator]);
			if(value === TypeDocumentEnum.ce) this.groupCrearCandidatoRequest.get('sNumeroDocumento').setValidators([Validators.required, this._validationFormService.ceValidator]);
			if(value) {
				this.groupCrearCandidatoRequest.get('sNumeroDocumento').enable();
			}
			this.groupCrearCandidatoRequest.get('sNumeroDocumento').setValue('');
			this.groupCrearCandidatoRequest.get('sNumeroDocumento').markAsUntouched();
			this.groupCrearCandidatoRequest.get('sNumeroDocumento').updateValueAndValidity();
		});

        this.groupCrearCandidatoRequest.get('sDepartamentoId')!.valueChanges
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

        this.groupCrearCandidatoRequest.get('sProvinciaId')!.valueChanges
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
		if(this.candidate()){
			forkJoin({ 
				provinces: this._ubigeoService.getProvinces(this.director().sDepartamento), 
				districts: this._ubigeoService.getDistricts(this.director().sProvincia) 
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

    searchuser(): void {
        this._router.navigate(['solicitudes/home-pre-evaluation']);
    }

    cancelDirectory(): void {}

    registerForm(): void {}
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
            this.groupCrearCandidatoRequest.get(nameForm)?.setValue(cleaned, { emitEvent: false });
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
			this.groupCrearCandidatoRequest.get(nameForm).setValue(cleaned, { emitEvent: false });
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
