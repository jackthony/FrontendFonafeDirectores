/*************************************************************************************
 * Nombre del archivo:  forgot-password.component.ts
 * Descripción:         Componente para recuperación de contraseña; envía enlace de
 *                      restablecimiento al email proporcionado.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Mejora en el manejo de errores y mensaje internacionalizable.
 *************************************************************************************/
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from '../../domain/services/auth.service';
import { environment } from 'environments/environment';
import { NgxCaptchaModule, ReCaptcha2Component } from 'ngx-captcha';
import { finalize } from 'rxjs';
@Component({
    selector: 'auth-forgot-password',
    templateUrl: './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    styleUrls: ['./forgot-password.scss'],
    standalone: true,
    imports: [
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        RouterLink,
        NgxCaptchaModule
    ],
})
export class AuthForgotPasswordComponent implements OnInit {
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;
    @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;
    keyCaptcha = `${environment.siteKeyCaptcha}`;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    forgotPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder
    ) {}
    /**
     * Inicializa el formulario con validación de email.
     */
    ngOnInit(): void {
        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            captchaResponse: ['', Validators.required],
        });
    }
    /**
     * Envío del enlace de recuperación si el email es válido.
     */
    sendResetLink(): void {
        if (this.forgotPasswordForm.invalid) {
            return;
        }
        console.log(this.forgotPasswordForm.value);
        this.forgotPasswordForm.disable();
        this.showAlert = false;
        this._authService
            .forgotPassword(this.forgotPasswordForm.value)
            .pipe(
                finalize(() => {
                    this.forgotPasswordForm.enable();
                    //this.forgotPasswordNgForm.resetForm();
                    if (this.captchaElem) {
                        this.captchaElem.resetCaptcha();
                    }
                    this.forgotPasswordForm.get('captchaResponse').markAsUntouched();
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {
                    this.forgotPasswordForm.get('email').setValue('');
                    this.forgotPasswordForm.get('email').markAsUntouched();
                    this.alert = {
                        type: 'success',
                        message:
                            "¡Se ha enviado el restablecimiento de contraseña! Recibirás un correo electrónico si estás registrado en nuestro sistema.",
                    };
                },
                (response) => {
                    this.alert = {
                        type: 'error',
                        message:
                            '¡No se encontró tu correo electrónico! ¿Seguro que ya eres miembro?',
                    };
                }
            );
    }
}