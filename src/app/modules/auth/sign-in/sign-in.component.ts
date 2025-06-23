/*************************************************************************************
   * Nombre del archivo:  sign-in.component.ts
   * Descripción:         Componente para el inicio de sesión de usuarios, gestionando  
   *                      el formulario, validaciones, reCAPTCHA y la comunicación   
   *                      con el servicio de autenticación.                            
   * Autor:               Daniel Alva                                                
   * Fecha de creación:   01/06/2025                                                  
   * Última modificación: 23/06/2025 por Daniel Alva                                   
   * Cambios recientes:   Creación inicial del componente con integración de reCAPTCHA.
   **************************************************************************************/
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { environment } from 'environments/environment';
import { NgxCaptchaModule } from 'ngx-captcha';
@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        NgxCaptchaModule
    ],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    keyCaptcha = `${environment.siteKeyCaptcha}`;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _ngxToastrService: NgxToastrService
    ) {}
    /**
     * On init
     */
    ngOnInit(): void {
        this.signInForm = this._formBuilder.group({
            email: [
                'rodrigo@fonafe.pe',
                [Validators.required, Validators.email],
            ],
            password: ['123456', Validators.required],
            recaptcha: ['', Validators.required],
            rememberMe: [''],
        });
    }
    /**
     * Sign in
     */
    signIn(): void {
        if (this.signInForm.invalid) {
            return;
        }
        this.signInForm.disable();
        this.showAlert = false;
        this._authService.signIn(this.signInForm.value).subscribe(
            (res) => {
                const redirectURL =
                    this._activatedRoute.snapshot.queryParamMap.get(
                        'redirectURL'
                    ) || '/signed-in-redirect';
                this._router.navigateByUrl(redirectURL);
            },
            (response) => {
                this.signInForm.enable();
                this._ngxToastrService.showError('Credenciales inválidas.');
                this.alert = {
                    type: 'error',
                    message: 'Wrong email or password',
                };
                this.showAlert = true;
            }
        );
    }
}