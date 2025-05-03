import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Business } from '@models/business/business.interface';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { FORM_BUSINESS_IMPORTS } from 'app/shared/imports/business-management/form-register-business.imports';
import { ValidationFormService } from 'app/shared/services/validation-form.service';

@Component({
    selector: 'app-business-form',
    standalone: true,
    imports: [...FORM_BUSINESS_IMPORTS],
    templateUrl: './business-form.component.html',
    styleUrl: './business-form.component.scss',
})
export class BusinessFormComponent implements OnInit {
    private readonly _router = inject(Router);
    private _fb = inject(FormBuilder);

    private _userService = inject(UserService);
    private _validationFormService = inject(ValidationFormService);

    textReturn = signal<string>('Regresar al buscador');
    titleModule = signal<string>('Nombre de la empresa');
    titleFinancial = signal<string>('Infomación financiera');
    titleBold = signal<boolean>(true);
    business = signal<Business>(null);

    form: FormGroup;

    ngOnInit(): void {
        this.initForm(this.business());
		
    }

    initForm(object: Business): void {
        this.form = this._fb.group({
			nIdEmpresa: [object ? object.nIdEmpresa: 0, Validators.required],
            sNombreEmpresa: [object ? { disabled: object, value: object.sNombreEmpresa } : '', [Validators.required, Validators.maxLength(255)]],
            sRuc: [object ? { disabled: object, value: object.sRuc }  : '', [Validators.required, this._validationFormService.validarRuc, Validators.maxLength(11)]],
            sRazonSocial: [object ? { disabled: object, value: object.sRazonSocial } : '', [Validators.required, Validators.maxLength(255)]],
            nIdProponente: [object ? object.nIdProponente : null, [Validators.required, Validators.min(1)]],
            nIdRubroNegocio: [object ? object.nIdRubroNegocio : null, [Validators.required, Validators.min(1)]],
            sIdDepartamento: [object ? object.sIdDepartamento : null, [Validators.required]],
            sIdProvincia: [object ? object.sIdProvincia : null, [Validators.required]],
            sIdDistrito: [object ? object.sIdProvincia : null, [Validators.required]],
            sDireccion: [object ? object.sDireccion : '', [Validators.required, Validators.maxLength(255)]],
            sComentario: [object ? object.sComentario : '', [Validators.required, Validators.maxLength(1000)]],
            mIngresosUltimoAnio: [object ? object.mIngresosUltimoAnio : 0.00, [Validators.required, Validators.min(0)]],
            mUtilidadUltimoAnio: [object ? object.mUtilidadUltimoAnio : 0.00, [Validators.required, Validators.min(0)]],
            mConformacionCapitalSocial: [object ? object.mConformacionCapitalSocial : 0.00, [Validators.required, Validators.min(0)]],
            nNumeroMiembros: 0,
            bRegistradoMercadoValores: [object ? object.bRegistradoMercadoValores : false, [Validators.required]],
            bActivo: [object ? object.bActivo : true, [Validators.required]],
            sUsuarioRegistro: [ { disabled: object , value: this._userService.userLogin().id }, Validators.required ],
			sUsuarioModificacion: [ { disabled: !object , value: this._userService.userLogin().id }, Validators.required ],
        });
    }

    returnEnterprise(): void {
        this._router.navigate(['gestion-empresas']);
    }
}
