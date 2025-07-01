/*******************************************************************************************************
 * Nombre del archivo : business-form.component.ts
 * Descripción         : Componente de formulario para registrar y actualizar la información de una empresa,
 *                       incluyendo datos generales, ubicación geográfica y estado financiero.
 * Autor               : Daniel Alva
 * Fecha de creación   : 23/06/2025
 *******************************************************************************************************/
import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import {
    catchError,
    distinctUntilChanged,
    EMPTY,
    finalize,
    map,
    of,
    pipe,
    Subject,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';
import { ResponseModel } from '@models/IResponseModel';
import { UserService } from 'app/core/user/user.service';
import { FORM_BUSINESS_IMPORTS } from 'app/shared/imports/business-management/form-register-business.imports';
import { ValidationFormService } from 'app/shared/services/validation-form.service';
import { provideNgxMask } from 'ngx-mask';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { FileComponentStateService } from '@services/file-component-state.service';
import { BusinessService } from '../../domain/services/business.service';
import { BusinessResolveDataEntity } from '../../domain/entities/business-resolve-data.entity';
import { DepartmentEntity } from '../../domain/entities/departament.entity';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { ProvinceEntity } from '../../domain/entities/province.entity';
import { DistrictEntity } from '../../domain/entities/district.entity';
import { UbigeoService } from '../../domain/services/ubigeo.service';
import { IndustryEntity } from 'app/modules/admin/shared/domain/entities/industry.entity';
import { SectorEntity } from 'app/modules/admin/shared/domain/entities/sector.entity';
import { MinistryEntity } from '../../domain/entities/ministry.entity';
import { DirectoryBusinessComponent } from '../directory-business/directory-business.component';
@Component({
    selector: 'app-business-form',
    standalone: true,
    imports: [...FORM_BUSINESS_IMPORTS],
    templateUrl: './business-form.component.html',
    styleUrl: './business-form.component.scss',
    providers: [provideNgxMask()],
})
export class BusinessFormComponent implements OnInit, OnDestroy {
    @ViewChild(DirectoryBusinessComponent) directoryBusinessComponent: DirectoryBusinessComponent;
    private readonly _router = inject(Router); // Inyecta el servicio Router para navegación
    private readonly _activatedRoute = inject(ActivatedRoute); // Inyecta el servicio ActivatedRoute para acceder a los parámetros de ruta
    private _fb = inject(FormBuilder); // Inyecta el servicio FormBuilder para crear formularios reactivos
    private _fileComponentStateService = inject(FileComponentStateService); // Inyecta el servicio FileComponentStateService para manejar el estado de archivos
    private _spinner = inject(NgxSpinnerService); // Inyecta el servicio NgxSpinnerService para mostrar un spinner de carga
    private _validationFormService = inject(ValidationFormService); // Inyecta el servicio de validación de formularios
    private _ngxToastrService = inject(NgxToastrService); // Inyecta el servicio NgxToastrService para mostrar notificaciones
    private _businessService = inject(BusinessService); // Inyecta el servicio BusinessService para manejar las empresas
    private _ubigeoService = inject(UbigeoService); 
    private _userService = inject(UserService); // Inyecta el servicio UserService para acceder a la información del usuario
    private destroy$ = new Subject<void>(); // Subject para manejar la destrucción del componente
    textReturn = signal<string>('Regresar al buscador');
    titleModule = signal<string>('Nombre de la empresa'); 
    titleFinancial = signal<string>('Información financiera');
    titleBold = signal<boolean>(true); 
    business = signal<BusinessEntity>(null); 
    ministries = signal<MinistryEntity[]>([]); 
    lstIndustry = signal<IndustryEntity[]>([]); 
    //lstSector = signal<SectorEntity[]>([]);
    departments = signal<DepartmentEntity[]>([]);
    provinces = signal<ProvinceEntity[]>([]);
    districts = signal<DistrictEntity[]>([]);
    totalMembers = signal<number>(0);
    form: FormGroup;
    /**
     * Método de inicialización del componente
     */
    ngOnInit(): void {
        const resolved = this._activatedRoute.snapshot.data['data'];
        if (resolved instanceof UrlTree) {
            this._router.navigateByUrl(resolved);
            return;
        }

        const data = resolved as BusinessResolveDataEntity;
        this.business.set(data?.item);
        this.ministries.set(data?.ministries.lstItem);
        //this.companySection.set(data?.constants.lstItem);
        //this.lstSector.set(data?.sector.lstItem);
        this.lstIndustry.set(data?.industry.lstItem);
        this.departments.set(data?.departments.lstItem); 
        this.provinces.set(data?.provinces?.lstItem ?? []); 
        this.districts.set(data?.districts?.lstItem ?? []);
        this.initForm(this.business()); 
        this.valueChangesForm();
        if (this.business()) {
            const fileState = {
                title: 'Empresa',
                isDisabled: false,
                root: `Empresa\\${this.business().sRazonSocial}`,
            };
            this._fileComponentStateService.setFileComponentState(fileState);
            this.totalMembers.set(this.business().nNumeroMiembros);
        } else {
            const fileState = {
                title: 'Empresa',
                isDisabled: true,
                message: '* Debe registrar la empresa, para registrar archivos',
            };
            this._fileComponentStateService.setFileComponentState(fileState);
        }
    }
    /**
     * Método para inicializar el formulario reactivo
     */
    initForm(object: BusinessEntity): void {
        this.form = this._fb.group({
            nIdEmpresa: [object ? object.nIdEmpresa : 0, Validators.required],
            sRuc: [object ? { disabled: object, value: object.sRuc } : '', [Validators.required, this._validationFormService.validarRuc, Validators.maxLength(11)]],
            sRazonSocial: [object ? { disabled: object, value: object.sRazonSocial } : '', [Validators.required, Validators.maxLength(255)]],
            nIdSector: [object ? object.nIdSector : 0, [Validators.required, Validators.min(1)]],
            sIdDepartamento: [object ? object.sIdDepartamento : 0, [Validators.required, Validators.min(1)]],
            sIdProvincia: [object ? object.sIdProvincia : 0, [Validators.required, Validators.min(1)]],
            sIdDistrito: [object ? object.sIdDistrito : 0, [Validators.required, Validators.min(1)]],
            nIdRubroNegocio: [ object ? object.nIdRubroNegocio : 0, [Validators.required, Validators.min(1)] ],
            sDireccion: [object ? object.sDireccion : '', [Validators.required, Validators.maxLength(255)]],
            sComentario: [object ? object.sComentario : '', Validators.maxLength(1000)],
            mIngresosUltimoAnio: [object ? object.mIngresosUltimoAnio : null, [Validators.required, Validators.min(0), Validators.max(9999999999999999.99)]], 
            mUtilidadUltimoAnio: [object ? object.mUtilidadUltimoAnio : null, [Validators.required, Validators.min(0), Validators.max(9999999999999999.99)]],
            mConformacionCapitalSocial: [object ? object.mConformacionCapitalSocial : null, [Validators.required, Validators.min(0), Validators.max(9999999999999999.99)]],
            nNumeroMiembros: [object ? object.nNumeroMiembros : 1, [Validators.required, Validators.min(1), Validators.max(100)]], 
            bRegistradoMercadoValores: [object ? object.bRegistradoMercadoValores : false, [Validators.required]],
            bActivo: [object ? object.bActivo : true, [Validators.required]],
            nUsuarioRegistro: [{ disabled: object, value: this._userService.userLogin().usuarioId }, Validators.required],
            nUsuarioModificacion: [{ disabled: !object, value: this._userService.userLogin().usuarioId }, Validators.required],
        });
    }
    /**
     * Método para manejar los cambios en el formulario
     */
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
                        ? this._ubigeoService
                                .getProvinces(deptId)
                                .pipe(
                                    map(
                                        (res: ResponseModel<ProvinceEntity>) =>
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
                        ? this._ubigeoService
                                .getDistricts(provId)
                                .pipe(
                                    map(
                                        (res: ResponseModel<DistrictEntity>) =>
                                            res.lstItem
                                    )
                                )
                        : of([]) 
                ),
                takeUntil(this.destroy$) 
            )
            .subscribe((lstItem) => this.districts.set(lstItem)); 
    }
    /**
     * Método para regresar a la vista de gestión de empresas
     */
    returnEnterprise(): void {
        this._router.navigate(['gestion-empresas']); 
    }
    /**
     * Método para manejar la destrucción del componente
     */
    ngOnDestroy() {
        this.destroy$.next(); 
        this.destroy$.complete();
    }
    /**
     * Método para registrar o actualizar la empresa
     */
    registerForm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched(); 
            return;
        }
        this._spinner.show(); 
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
    /**
     * Método para registrar una nueva empresa
     */
    registerBusiness(): void {
        this._spinner.show();
        this._businessService
            .create(this.form.value)
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
    /**
     * Método para actualizar una empresa existente
     */
    updateBusiness(): void {
        this._spinner.show();
        this._businessService
            .update(this.form.value)
            .pipe(
                switchMap((response: ResponseModel<boolean>) => {
                    if (response.isSuccess) {
                        if(this.directoryBusinessComponent) this.directoryBusinessComponent.searchDirectors(true);
                        return this._businessService.getById(this.business().nIdEmpresa);
                    }
                }),
                catchError(() => {
                    return EMPTY;
                }),
                finalize(() => this._spinner.hide())
            )
            .subscribe({
                next: (response: ResponseModel<BusinessEntity>) => {
                    this._ngxToastrService.showSuccess('Los campos del formulario se guardaron exitosamente', '¡Éxito!');
                    this.business.set(response.item);
                    this.initForm(this.business());
                },
            });
    }
    /**
     * Método para establecer el número total de miembros
     */
    setTotalMembers(event: number) {
        this.totalMembers.set(event);
    }

    blockNegativeSign(event: KeyboardEvent): void {
        // Bloquear el guion (-) en la entrada
        if (event.key === '-' || event.key === 'e') {
          event.preventDefault();  // Prevenir la entrada del guion o la letra 'e' (que aparece para exponentes en números)
        }
      }

      validateNumber(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const value = parseInt(inputElement.value, 10);
    
        // Verifica si el valor está fuera del rango permitido y lo corrige
        if (value < 1) {
          inputElement.value = '1';
        } else if (value > 100) {
          inputElement.value = '100';
        }
      }
}