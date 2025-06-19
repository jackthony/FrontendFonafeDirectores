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
    pipe,
    Subject,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';

import { Business } from '@models/business/business.interface';
import { Constant } from '@models/business/constant.interface';
import { Department } from '@models/business/departament.interface';
import { District } from '@models/business/district.interface';
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
import { ArchivingProcessService } from '@services/archiving-process.service';
import { FileComponentStateService } from '@services/file-component-state.service';
import { Ministry } from '@models/system-maintenance/ministry.interface';

@Component({
    selector: 'app-business-form',
    standalone: true,
    imports: [...FORM_BUSINESS_IMPORTS],
    templateUrl: './business-form.component.html',
    styleUrl: './business-form.component.scss',
    providers: [provideNgxMask()],
})
export class BusinessFormComponent implements OnInit, OnDestroy {
    private readonly _router = inject(Router); // Inyecta el servicio Router para navegación
    private readonly _activatedRoute = inject(ActivatedRoute); // Inyecta el servicio ActivatedRoute para acceder a los parámetros de ruta
    private _fb = inject(FormBuilder); // Inyecta el servicio FormBuilder para crear formularios reactivos
    private _fileComponentStateService = inject(FileComponentStateService); // Inyecta el servicio FileComponentStateService para manejar el estado de archivos

    private _spinner = inject(NgxSpinnerService); // Inyecta el servicio NgxSpinnerService para mostrar un spinner de carga

    private _validationFormService = inject(ValidationFormService); // Inyecta el servicio de validación de formularios
    private _ngxToastrService = inject(NgxToastrService); // Inyecta el servicio NgxToastrService para mostrar notificaciones

    private _businessService = inject(BusinessService); // Inyecta el servicio BusinessService para manejar las empresas
    private _provinceService = inject(ProvinceService); // Inyecta el servicio ProvinceService para manejar las provincias
    private _districtService = inject(DistrictService); // Inyecta el servicio DistrictService para manejar los distritos
    private _userService = inject(UserService); // Inyecta el servicio UserService para acceder a la información del usuario

    private destroy$ = new Subject<void>(); // Subject para manejar la destrucción del componente

    // Variables reactivas para manejar el estado de la UI
    textReturn = signal<string>('Regresar al buscador'); // Texto para el botón de retorno
    titleModule = signal<string>('Nombre de la empresa'); // Título de la sección de la empresa
    titleFinancial = signal<string>('Información financiera'); // Título de la sección de la información financiera
    titleBold = signal<boolean>(true); // Variable para manejar el estilo de texto en negrita
    business = signal<Business>(null); // Datos de la empresa

    ministries = signal<Ministry[]>([]); // Lista de ministerios
    companySection = signal<Constant[]>([]); // Lista de secciones de la empresa
    departments = signal<Department[]>([]); // Lista de departamentos
    provinces = signal<Province[]>([]); // Lista de provincias
    districts = signal<District[]>([]); // Lista de distritos

    totalMembers = signal<number>(0); // Número total de miembros

    form: FormGroup; // Formulario reactivo para la empresa

    /**
     * Método de inicialización del componente
     */
    ngOnInit(): void {
        const resolved = this._activatedRoute.snapshot.data['data']; // Obtiene los datos resueltos desde la ruta activa
        if (resolved instanceof UrlTree) {
            this._router.navigateByUrl(resolved); // Redirige si los datos son una URL
            return;
        }

        const data = resolved as BusinessResolveData; // Asigna los datos resueltos a la variable `data`
        this.business.set(data.item); // Establece los datos de la empresa
        this.ministries.set(data.ministries.lstItem); // Establece la lista de ministerios
        this.companySection.set(data.constants.lstItem); // Establece las constantes de la empresa
        this.departments.set(data.departments.lstItem); // Establece la lista de departamentos
        this.provinces.set(data?.provinces?.lstItem ?? []); // Establece la lista de provincias, si existe
        this.districts.set(data?.districts?.lstItem ?? []); // Establece la lista de distritos, si existe

        this.initForm(this.business()); // Inicializa el formulario con los datos de la empresa
        this.valueChangesForm(); // Activa la reactividad en el formulario

        // Configura el estado del componente de archivos
        if (this.business()) {
            const fileState = {
                title: 'Empresa',
                isDisabled: false,
                root: `Empresa\\${this.business().sRazonSocial}`,
            };
            this._fileComponentStateService.setFileComponentState(fileState); // Establece el estado del componente de archivos
            this.totalMembers.set(this.business().nNumeroMiembros); // Establece el total de miembros de la empresa
        } else {
            const fileState = {
                title: 'Empresa',
                isDisabled: true,
                message: '* Debe registrar la empresa, para registrar archivos',
            };
            this._fileComponentStateService.setFileComponentState(fileState); // Establece el estado del componente de archivos
        }
    }

    /**
     * Método para inicializar el formulario reactivo
     */
    initForm(object: Business): void {
        this.form = this._fb.group({
            nIdEmpresa: [object ? object.nIdEmpresa : 0, Validators.required], // Campo de ID de la empresa
            sRuc: [object ? { disabled: object, value: object.sRuc } : '', [Validators.required, this._validationFormService.validarRuc, Validators.maxLength(11)]], // Campo de RUC
            sRazonSocial: [object ? { disabled: object, value: object.sRazonSocial } : '', [Validators.required, Validators.maxLength(255)]], // Campo de razón social
            nIdProponente: [object ? { disabled: object, value: object.nIdProponente } : 0, [Validators.required, Validators.min(1)]], // Campo de proponente
            sIdDepartamento: [object ? object.sIdDepartamento : 0, [Validators.required, Validators.min(1)]], // Campo de departamento
            sIdProvincia: [object ? object.sIdProvincia : 0, [Validators.required, Validators.min(1)]], // Campo de provincia
            sIdDistrito: [object ? object.sIdDistrito : 0, [Validators.required, Validators.min(1)]], // Campo de distrito
            nIdRubroNegocio: [ object ? object.nIdRubroNegocio : 0, [Validators.required, Validators.min(1)] ], //Campo del rubro
            /* nIDSector: [ object ? object.nIDSector : 0, [Validators.required, Validators.min(1)] ], */ //Campo del sector
            sDireccion: [object ? object.sDireccion : '', [Validators.required, Validators.maxLength(255)]], // Campo de dirección
            sComentario: [object ? object.sComentario : '', Validators.maxLength(1000)], // Campo de comentario
            mIngresosUltimoAnio: [object ? object.mIngresosUltimoAnio : null, [Validators.required, Validators.min(0), Validators.max(9999999999999999.99)]], // Campo de ingresos del último año
            mUtilidadUltimoAnio: [object ? object.mUtilidadUltimoAnio : null, [Validators.required, Validators.min(0), Validators.max(9999999999999999.99)]], // Campo de utilidad del último año
            mConformacionCapitalSocial: [object ? object.mConformacionCapitalSocial : null, [Validators.required, Validators.min(0), Validators.max(9999999999999999.99)]], // Campo de capital social
            nNumeroMiembros: [object ? object.nNumeroMiembros : 1, [Validators.required, Validators.min(1), Validators.max(100)]], // Campo de número de miembros
            bRegistradoMercadoValores: [object ? object.bRegistradoMercadoValores : false, [Validators.required]], // Campo de registro en mercado de valores
            bActivo: [object ? object.bActivo : true, [Validators.required]], // Campo de estado de la empresa
            nUsuarioRegistro: [{ disabled: object, value: this._userService.userLogin().usuario }, Validators.required], // Campo del usuario que registró la empresa
            nUsuarioModificacion: [{ disabled: !object, value: this._userService.userLogin().usuario }, Validators.required], // Campo del usuario que modificó la empresa
        });
    }

    /**
     * Método para manejar los cambios en el formulario
     */
    valueChangesForm(): void {
        this.form
            .get('sIdDepartamento')!
            .valueChanges.pipe(
                distinctUntilChanged(), // Evita emitir valores duplicados
                tap(() => {
                    this.form.patchValue({ sIdProvincia: 0, sIdDistrito: 0 }); // Resetea los campos de provincia y distrito
                    this.provinces.set([]); // Limpia las provincias
                    this.districts.set([]); // Limpia los distritos
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
                        : of([]) // Si no hay departamento, retorna un array vacío
                ),
                takeUntil(this.destroy$) // Maneja la destrucción del componente
            )
            .subscribe((lstItem) => this.provinces.set(lstItem)); // Actualiza las provincias

        this.form
            .get('sIdProvincia')!
            .valueChanges.pipe(
                distinctUntilChanged(), // Evita emitir valores duplicados
                tap(() => {
                    this.form.patchValue({ sIdDistrito: 0 }); // Resetea el campo de distrito
                    this.districts.set([]); // Limpia los distritos
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
                        : of([]) // Si no hay provincia, retorna un array vacío
                ),
                takeUntil(this.destroy$) // Maneja la destrucción del componente
            )
            .subscribe((lstItem) => this.districts.set(lstItem)); // Actualiza los distritos
    }

    /**
     * Método para regresar a la vista de gestión de empresas
     */
    returnEnterprise(): void {
        this._router.navigate(['gestion-empresas']); // Redirige a la vista de gestión de empresas
    }

    /**
     * Método para manejar la destrucción del componente
     */
    ngOnDestroy() {
        this.destroy$.next(); // Señaliza la destrucción del componente
        this.destroy$.complete(); // Completa el Subject
    }

    /**
     * Método para registrar o actualizar la empresa
     */
    registerForm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched(); // Marca todos los campos como tocados si el formulario es inválido
            return;
        }
        this._spinner.show(); // Muestra el spinner de carga

        // Formatea los valores monetarios
        const income = this.form.get('mIngresosUltimoAnio');
        const profits = this.form.get('mUtilidadUltimoAnio');
        const capital = this.form.get('mConformacionCapitalSocial');

        if (typeof income.value === 'string') {
            const incomeFormat = income.value.replace(/\s/g, '');
            income.setValue(parseFloat(incomeFormat)); // Convierte a número el valor de ingresos
        }

        if (typeof profits.value === 'string') {
            const profitsFormat = profits.value.replace(/\s/g, '');
            profits.setValue(parseFloat(profitsFormat)); // Convierte a número el valor de utilidad
        }

        if (typeof capital.value === 'string') {
            const capitalFormat = capital.value.replace(/\s/g, '');
            capital.setValue(parseFloat(capitalFormat)); // Convierte a número el valor de capital social
        }

        if (this.business()) this.updateBusiness(); // Si ya hay una empresa, actualiza
        else this.registerBusiness(); // Si no, registra una nueva empresa
    }

    /**
     * Método para registrar una nueva empresa
     */
    registerBusiness(): void {
        const request = new RequestOption();
        request.request = this.form.value; // Obtiene los valores del formulario
        this._businessService
            .create(request) // Realiza la solicitud de creación
            .pipe(finalize(() => this._spinner.hide())) // Desactiva el spinner después de la solicitud
            .subscribe({
                next: (response: ResponseModel<number>) => {
                    if (response.isSuccess) {
                        this._ngxToastrService.showSuccess('Empresa registrada exitosamente', '¡Éxito!'); // Muestra la notificación de éxito
                        this._router.navigate([response.item], {
                            relativeTo: this._activatedRoute, // Redirige a la página de la empresa recién creada
                        });
                    }
                },
            });
    }

    /**
     * Método para actualizar una empresa existente
     */
    updateBusiness(): void {
        const request = new RequestOption();
        request.request = this.form.value; // Obtiene los valores del formulario
        this._businessService
            .update(request) // Realiza la solicitud de actualización
            .pipe(
                switchMap((response: ResponseModel<boolean>) => {
                    if (response.isSuccess) {
                        const reqBusiness = new RequestOption();
                        reqBusiness.resource = 'GetById';
                        reqBusiness.pathVariables = [
                            this.business().nIdEmpresa, // Obtiene el ID de la empresa actual
                        ];
                        return this._businessService.get(reqBusiness); // Solicita los datos actualizados de la empresa
                    }
                }),
                catchError(() => {
                    this._router.navigate(['/gestion-empresas']); // Redirige si ocurre un error
                    return EMPTY;
                }),
                finalize(() => this._spinner.hide()) // Desactiva el spinner después de la solicitud
            )
            .subscribe({
                next: (response: ResponseModel<Business>) => {
                    this._ngxToastrService.showSuccess('Empresa actualizada exitosamente', '¡Éxito!'); // Muestra la notificación de éxito
                    this.business.set(response.item); // Actualiza los datos de la empresa
                    this.initForm(this.business()); // Inicializa el formulario con los datos actualizados
                },
            });
    }

    /**
     * Método para establecer el número total de miembros
     */
    setTotalMembers(event: number) {
        this.totalMembers.set(event); // Establece el número total de miembros
    }
}