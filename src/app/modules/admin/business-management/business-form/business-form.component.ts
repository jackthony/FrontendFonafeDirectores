import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import {
    catchError,
    distinctUntilChanged,
    EMPTY,
    finalize,
    map,
    of,
    Subject,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';

import { Business } from '@models/business/business.interface';
import { Constant } from '@models/business/constant.interface';
import { Department } from '@models/business/departament.interface';
import { District } from '@models/business/district.interface';
import { Ministry } from '@models/business/ministry.interface';
import { Province } from '@models/business/province.interface';
import { ResponseModel } from '@models/IResponseModel';
import { DistrictService } from '@services/district.service';
import { ProvinceService } from '@services/province.service';
import { UserService } from 'app/core/user/user.service';
import { FORM_BUSINESS_IMPORTS } from 'app/shared/imports/business-management/form-register-business.imports';
import { BusinessResolveData } from 'app/shared/interfaces/business-resolve-data.interface';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { ValidationFormService } from 'app/shared/services/validation-form.service';

import { BusinessService } from '@services/business.service';
import { provideNgxMask } from 'ngx-mask';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';

@Component({
    selector: 'app-business-form',
    standalone: true,
    imports: [...FORM_BUSINESS_IMPORTS],
    templateUrl: './business-form.component.html',
    styleUrl: './business-form.component.scss',
    providers: [provideNgxMask()],
})
export class BusinessFormComponent implements OnInit, OnDestroy {
    private readonly _router = inject(Router);
    private readonly _activatedRoute = inject(ActivatedRoute);
    private _fb = inject(FormBuilder);

    private _spinner = inject(NgxSpinnerService);

    private _validationFormService = inject(ValidationFormService);
    private _ngxToastrService = inject(NgxToastrService);

    private _businessService = inject(BusinessService);
    private _provinceService = inject(ProvinceService);
    private _districtService = inject(DistrictService);
    private _userService = inject(UserService);

    private destroy$ = new Subject<void>();

    textReturn = signal<string>('Regresar al buscador');
    titleModule = signal<string>('Nombre de la empresa');
    titleFinancial = signal<string>('Infomación financiera');
    titleBold = signal<boolean>(true);
    business = signal<Business>(null);

    ministries = signal<Ministry[]>([]);
    companySection = signal<Constant[]>([]);
    departments = signal<Department[]>([]);
    provinces = signal<Province[]>([]);
    districts = signal<District[]>([]);

    totalMembers = signal<number>(0);

    form: FormGroup;

    ngOnInit(): void {
        const resolved = this._activatedRoute.snapshot.data['data'];
        if (resolved instanceof UrlTree) {
            this._router.navigateByUrl(resolved);
            return;
        }

        const data = resolved as BusinessResolveData;
        this.business.set(data.item);
        this.ministries.set(data.ministries.lstItem);
        this.companySection.set(data.constants.lstItem);
        this.departments.set(data.departments.lstItem);
        this.provinces.set(data?.provinces?.lstItem ?? []);
        this.districts.set(data?.districts?.lstItem ?? []);

        this.initForm(this.business());
        this.valueChangesForm();
        if(this.business()) this.totalMembers.set(this.business().nNumeroMiembros);
    }

    initForm(object: Business): void {
        this.form = this._fb.group({
            nIdEmpresa: [object ? object.nIdEmpresa : 0, Validators.required],
            sRuc: [ object ? { disabled: object, value: object.sRuc } : '', [Validators.required, this._validationFormService.validarRuc, Validators.maxLength(11)] ],
            sRazonSocial: [ object ? { disabled: object, value: object.sRazonSocial } : '', [Validators.required, Validators.maxLength(255)] ],
            nIdProponente: [ object ? { disabled: object, value: object.nIdProponente } : 0, [Validators.required, Validators.min(1)] ],
            nIdRubroNegocio: [ object ? { disabled: object, value: object.nIdRubroNegocio } : 0, [Validators.required, Validators.min(1)] ],
            sIdDepartamento: [ object ? object.sIdDepartamento : 0, [Validators.required, Validators.min(1)] ],
            sIdProvincia: [ object ? object.sIdProvincia : 0, [Validators.required, Validators.min(1)] ],
            sIdDistrito: [ object ? object.sIdDistrito : 0, [Validators.required, Validators.min(1)] ],
            sDireccion: [ object ? object.sDireccion : '', [Validators.required, Validators.maxLength(255)] ],
            sComentario: [ object ? object.sComentario : '', Validators.maxLength(1000) ],
            mIngresosUltimoAnio: [ object ? object.mIngresosUltimoAnio : null, [Validators.required, Validators.min(0), Validators.max(9999999999999999.99)] ],
            mUtilidadUltimoAnio: [ object ? object.mUtilidadUltimoAnio : null, [Validators.required, Validators.min(0), Validators.max(9999999999999999.99)] ],
            mConformacionCapitalSocial: [ object ? object.mConformacionCapitalSocial : null, [ Validators.required, Validators.min(0), Validators.max(9999999999999999.99)] ],
            //nNumeroMiembros: { disabled: true, value: object ? object.nNumeroMiembros : 0 },
            bRegistradoMercadoValores: [ object ? object.bRegistradoMercadoValores : false, [Validators.required]],
            bActivo: [object ? object.bActivo : true, [Validators.required]],
            nUsuarioRegistro: [ { disabled: object, value: this._userService.userLogin().usuario }, Validators.required ],
            nUsuarioModificacion: [ { disabled: !object, value: this._userService.userLogin().usuario },Validators.required ],
        });
    }

    valueChangesForm(): void {
        this.form
            .get('sIdDepartamento')!
            .valueChanges.pipe(
                distinctUntilChanged(),
                tap(() => {
                    this.form.patchValue({ sIdProvincia: 0, sIdDistrito: 0 });
                    this.provinces.set([]);
                    this.districts.set([]);
                }),
                switchMap((deptId) =>
                    deptId
                        ? this._provinceService
                              .getByPagination(
                                  new RequestOption({ pathVariables: [deptId] })
                              )
                              .pipe(
                                  map(
                                      (res: ResponseModel<Province>) =>
                                          res.lstItem
                                  )
                              )
                        : of([])
                ),
                takeUntil(this.destroy$)
            )
            .subscribe((lstItem) => this.provinces.set(lstItem));

        this.form
            .get('sIdProvincia')!
            .valueChanges.pipe(
                distinctUntilChanged(),
                tap(() => {
                    this.form.patchValue({ sIdDistrito: 0 });
                    this.districts.set([]);
                }),
                switchMap((provId) =>
                    provId
                        ? this._districtService
                              .getByPagination(
                                  new RequestOption({ pathVariables: [provId] })
                              )
                              .pipe(
                                  map(
                                      (res: ResponseModel<District>) =>
                                          res.lstItem
                                  )
                              )
                        : of([])
                ),
                takeUntil(this.destroy$)
            )
            .subscribe((lstItem) => this.districts.set(lstItem));
    }

    returnEnterprise(): void {
        this._router.navigate(['gestion-empresas']);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    registerForm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this._spinner.show();
        console.log(this.form);

        const income = this.form.get('mIngresosUltimoAnio');
        const profits = this.form.get('mUtilidadUltimoAnio');
        const capital = this.form.get('mConformacionCapitalSocial');

        if (typeof income.value === 'string') {
            const incomeFormat = income.value.replace(/\s/g, '');
            income.setValue(parseFloat(incomeFormat));
        }

        if (typeof profits.value === 'string') {
            const profitsFormat = profits.value.replace(/\s/g, '');
            profits.setValue(parseFloat(profitsFormat));
        }

        if (typeof capital.value === 'string') {
            const capitalFormat = capital.value.replace(/\s/g, '');
            capital.setValue(parseFloat(capitalFormat));
        }

        if (this.business()) this.updateBusiness();
        else this.registerBusiness();
    }

    registerBusiness(): void {
        const request = new RequestOption();
        request.request = this.form.value;
        this._businessService
            .create(request)
            .pipe(finalize(() => this._spinner.hide()))
            .subscribe({
                next: (response: ResponseModel<number>) => {
                    if (response.isSuccess) {
                        this._ngxToastrService.showSuccess('Empresa registrada exitosamente', '¡Éxito!');
                        this._router.navigate([response.item], {
                            relativeTo: this._activatedRoute,
                        });
                    }
                },
            });
    }

    updateBusiness(): void {
        const request = new RequestOption();
        request.request = this.form.value;
        this._businessService
            .update(request)
            .pipe(
                switchMap((response: ResponseModel<boolean>) => {
                    if (response.isSuccess) {
                        const reqBusiness = new RequestOption();
                        reqBusiness.resource = 'GetById';
                        reqBusiness.pathVariables = [
                            this.business().nIdEmpresa,
                        ];
                        return this._businessService.get(reqBusiness);
                    }
                }),
                catchError(() => {
                    this._router.navigate(['/gestion-empresas']);
                    return EMPTY;
                }),
                finalize(() => this._spinner.hide())
            )
            .subscribe({
                next: (response: ResponseModel<Business>) => {
                    this._ngxToastrService.showSuccess('Empresa actualizada exitosamente', '¡Éxito!');
                    this.business.set(response.item);
                    this.initForm(this.business());
                },
            });
    }

    setTotalMembers(event: number) {
        this.totalMembers.set(event);
    }
}
